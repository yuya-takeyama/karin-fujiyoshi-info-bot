import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import * as striptags from 'striptags';
import { Feed } from 'feed';

const baseUrl = 'http://www.keyakizaka46.com';
const path = (path: string) => baseUrl + path;

const ensureError = (err: any): Error => {
  if (err instanceof Error) {
    return err;
  } else if (err && typeof err.message === 'string') {
    return new Error(err.message);
  } else {
    return new Error(err);
  }
};

interface BlogArticle {
  title: string;
  url: string;
  date: Date;
}

const fetchBlogArticles = async () => {
  const res = await fetch(path('/s/k46o/diary/member/list?ima=0000&ct=47'));
  const html = await res.text();
  const dom = new JSDOM(html);
  const elems = Array.from(
    dom.window.document.querySelectorAll('.box-content .box-main article'),
  );
  const articles: BlogArticle[] = [];
  for (const elem of elems) {
    const titleElem = elem.querySelector('.box-ttl h3 a');
    const dateElem = elem.querySelector('.box-bottom ul li');
    if (titleElem && dateElem) {
      const date = new Date(striptags(dateElem.innerHTML).trim());
      const url = titleElem.getAttribute('href');
      if (typeof url === 'string') {
        articles.push({
          title: striptags(titleElem.innerHTML).trim(),
          url: path(url),
          date: date,
        });
      }
    }
  }
  return articles;
};

const fetchBlogFeed = async () => {
  const articles = await fetchBlogArticles();
  const feed = new Feed({
    title: '欅坂46 藤吉 夏鈴 公式ブログ',
    description: '「坂道シリーズ」第2弾　欅坂46',
    feed: path('/'),
    id: path('/'),
    link: path('/'),
    feedLinks: {},
    copyright: 'Seed & Flower LLC',
  });

  for (const article of articles) {
    feed.addItem({
      title: article.title,
      link: article.url,
      date: article.date,
    });
  }

  return feed;
};

export const rssBlog: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    const feed = await fetchBlogFeed();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/atom+xml',
      },
      body: feed.atom1(),
    };
  } catch (err) {
    const error = ensureError(err);
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

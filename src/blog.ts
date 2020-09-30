import { JSDOM } from 'jsdom';
import * as striptags from 'striptags';
import { Feed } from 'feed';
import { parseFromTimeZone } from 'date-fns-timezone';
import { path } from './util';
import fetch from 'node-fetch';

type BlogArticle = {
  title: string;
  url: string;
  date: Date;
};

export const fetchBlogPage = async (): Promise<string> => {
  const res = await fetch(path('/s/k46o/diary/member/list?ima=0000&ct=47'));
  return res.text();
};

export const blogHtmlToFeed = (html: string): Feed => {
  const articles = blogHtmlToArticles(html);
  return articlesToFeed(articles);
};

const articlesToFeed = (articles: BlogArticle[]): Feed => {
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

const blogHtmlToArticles = (html: string) => {
  const dom = new JSDOM(html);
  const elems = dom.window.document.querySelectorAll(
    '.box-content .box-main article',
  );
  const articles: BlogArticle[] = [];
  for (const elem of elems) {
    const titleElem = elem.querySelector('.box-ttl h3 a');
    const dateElem = elem.querySelector('.box-bottom ul li');
    if (titleElem && dateElem) {
      const date = parseFromTimeZone(striptags(dateElem.innerHTML).trim(), {
        timeZone: 'Asia/Tokyo',
      });
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
import { JSDOM } from 'jsdom';
import * as striptags from 'striptags';
import { Feed } from 'feed';
import { parseFromTimeZone } from 'date-fns-timezone';
import { path } from './util';
import fetch from 'node-fetch';

type NewsItem = {
  title: string;
  url: string;
  date: Date;
};

export const fetchNewsPage = async (): Promise<string> => {
  const page = await fetch(
    path('/s/k46o/news/list?ima=0000&list%5B%5D=47&reverse=ON'),
  );
  return page.text();
};

export const newsHtmlToFeed = (html: string) => {
  const newsItems = htmlToNewsItems(html);

  return newsItemsToFeed(newsItems);
};

const newsItemsToFeed = (newsItems: NewsItem[]): Feed => {
  const feed = new Feed({
    title: '欅坂46公式サイト 藤吉夏鈴ニュース',
    description: '「坂道シリーズ」第2弾　欅坂46',
    feed: path('/'),
    id: path('/'),
    link: path('/'),
    feedLinks: {},
    copyright: 'Seed & Flower LLC',
  });
  for (const newsItem of newsItems) {
    feed.addItem({
      title: newsItem.title,
      link: newsItem.url,
      date: newsItem.date,
    });
  }
  return feed;
};

const htmlToNewsItems = (html: string): NewsItem[] => {
  const dom = new JSDOM(html);
  const elems = dom.window.document.querySelectorAll('.box-news ul li');

  const newsItems: NewsItem[] = [];
  for (const elem of elems) {
    const dateElem = elem.querySelector('.date');
    const linkElem = elem.querySelector('.text a');

    if (linkElem && dateElem) {
      const date = parseFromTimeZone(striptags(dateElem.innerHTML), {
        timeZone: 'Asia/Tokyo',
      });
      const link = linkElem.getAttribute('href');
      const title = striptags(linkElem.innerHTML);

      if (link && date) {
        const url = path(link);
        newsItems.push({
          title,
          url,
          date,
        });
      }
    }
  }

  return newsItems;
};
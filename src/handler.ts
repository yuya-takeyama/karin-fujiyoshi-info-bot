import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { blogHtmlToFeed, fetchBlogPage } from './blog';
import { fetchNewsPage, newsHtmlToFeed } from './news';
import { ensureError, errorToResponse, feedToResponse } from './util';

export const rssBlog: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    const html = await fetchBlogPage();
    const feed = blogHtmlToFeed(html);

    return feedToResponse(feed);
  } catch (err) {
    const error = ensureError(err);
    console.error(error);

    return errorToResponse(error);
  }
};

export const rssNews: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    const html = await fetchNewsPage();
    const feed = newsHtmlToFeed(html);

    return feedToResponse(feed);
  } catch (err) {
    const error = ensureError(err);
    console.error(error);

    return errorToResponse(error);
  }
};

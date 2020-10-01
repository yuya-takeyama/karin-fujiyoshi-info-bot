import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { blogHtmlToAtom, fetchBlogPage } from './blog';
import { fetchNewsPage, newsHtmlToAtom } from './news';
import { ensureError, errorToResponse, atomSuccessResponse } from './util';

export const rssBlog: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    const html = await fetchBlogPage();
    const feed = blogHtmlToAtom(html);

    return atomSuccessResponse(feed);
  } catch (err) {
    const error = ensureError(err);
    console.error(error);

    return errorToResponse(error);
  }
};

export const rssNews: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    const html = await fetchNewsPage();
    const feed = newsHtmlToAtom(html);

    return atomSuccessResponse(feed);
  } catch (err) {
    const error = ensureError(err);
    console.error(error);

    return errorToResponse(error);
  }
};

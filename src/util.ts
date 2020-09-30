import { APIGatewayProxyResult } from 'aws-lambda';
import { Feed } from 'feed';

const baseUrl = 'http://www.keyakizaka46.com';
export const path = (path: string) => baseUrl + path;

export const ensureError = (err: any): Error => {
  if (err instanceof Error) {
    return err;
  } else if (err && typeof err.message === 'string') {
    return new Error(err.message);
  } else {
    return new Error(err);
  }
};

export const feedToResponse = (feed: Feed): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/atom+xml',
    },
    body: feed.atom1(),
  };
};

export const errorToResponse = (error: Error): APIGatewayProxyResult => {
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: error.message,
    }),
  };
};

import { join } from 'path';
import { readFile as origReadFile } from 'fs';
import { promisify } from 'util';
import { newsHtmlToFeed } from './news';

const readFile = promisify(origReadFile);

const newsFixturesDir = join(__dirname, 'fixtures', 'news');

describe('#newsHtmlToFeed', () => {
  it('returns a Feed', async () => {
    const html = (
      await readFile(join(newsFixturesDir, 'news.html'))
    ).toString();
    expect(newsHtmlToFeed(html)).toMatchSnapshot();
  });
});

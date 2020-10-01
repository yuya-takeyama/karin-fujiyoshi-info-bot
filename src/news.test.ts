import { join } from 'path';
import { readFile as origReadFile } from 'fs';
import { promisify } from 'util';
import { newsHtmlToAtom } from './news';

const readFile = promisify(origReadFile);

const newsFixturesDir = join(__dirname, 'fixtures', 'news');

describe('#newsHtmlToAtom', () => {
  it('returns an atom Feed', async () => {
    const html = (
      await readFile(join(newsFixturesDir, 'news.html'))
    ).toString();
    expect(
      newsHtmlToAtom(html, { updated: new Date(2020, 1, 1, 9, 0, 0) }),
    ).toMatchSnapshot();
  });
});

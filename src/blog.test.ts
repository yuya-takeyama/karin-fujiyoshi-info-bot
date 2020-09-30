import { join } from 'path';
import { readFile as origReadFile } from 'fs';
import { promisify } from 'util';
import { blogHtmlToFeed } from './blog';

const readFile = promisify(origReadFile);

const blogFixturesDir = join(__dirname, 'fixtures', 'blog');

describe('#blogHtmlToFeed', () => {
  it('returns a Feed', async () => {
    const html = (
      await readFile(join(blogFixturesDir, 'blog.html'))
    ).toString();
    expect(blogHtmlToFeed(html)).toMatchSnapshot();
  });
});

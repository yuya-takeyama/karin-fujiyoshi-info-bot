import { join } from 'path';
import { readFile as origReadFile } from 'fs';
import { promisify } from 'util';
import { blogHtmlToAtom } from './blog';

const readFile = promisify(origReadFile);

const blogFixturesDir = join(__dirname, 'fixtures', 'blog');

describe('#blogHtmlToAtom', () => {
  it('returns an atom Feed', async () => {
    const html = (
      await readFile(join(blogFixturesDir, 'blog.html'))
    ).toString();
    expect(blogHtmlToAtom(html)).toMatchSnapshot();
  });
});

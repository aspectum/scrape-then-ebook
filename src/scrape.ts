import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { downloadImage } from './get-images';
import { cli, fetchAndParseHTML, scrapeParseAndSave } from './utils';

const MAIN_URL = cli.input[0];
const BASE_URL = new URL(MAIN_URL).origin;

const buildUrl = (path: string) => BASE_URL + path;

const rootdir = path.join(process.cwd(), 'output');
if (fs.existsSync(rootdir)) {
  fs.rmSync(rootdir, { recursive: true, force: true });
}
fs.mkdirSync(rootdir, { recursive: true });

const chaptersdir = path.join(rootdir, 'chapters');
fs.mkdirSync(chaptersdir, { recursive: true });

console.log(`Scraping ${MAIN_URL}`);

const doc = await fetchAndParseHTML(MAIN_URL);

const chapters = [...doc.querySelectorAll<HTMLDivElement>('.chapter-row')];

console.log(`${chapters.length} chapters`);

chapters.forEach(async (chapter, chapIndex) => {
  const link = chapter.querySelector('a')!.href;
  console.log(`Processing chapter ${chapIndex + 1}`);
  scrapeParseAndSave(buildUrl(link), path.join(chaptersdir, `${chapIndex + 1}.html`));
});

// get metadata

console.log(`Getting metadata`);

const title = doc.querySelector('h1[property=name]')?.textContent ?? 'No Title';
const author =
  doc.querySelector('h4[property=author] span[property=name] a')?.textContent ?? 'No Author';

const metadata = `<dc:title>${title}</dc:title>
<dc:language>en-US</dc:language>
<dc:creator>${author}</dc:creator>
<dc:publisher>RoyalRoad</dc:publisher>`;

fs.writeFileSync(path.join(rootdir, 'metadata.xml'), metadata);

// get cover

console.log(`Getting cover`);

const coverUrl = doc
  .querySelector<HTMLImageElement>('.cover-art-container img')
  ?.src?.replace('covers-full', 'covers-large');
console.log(coverUrl);
if (coverUrl) {
  downloadImage(coverUrl, path.join(rootdir, 'cover.jpg'));
}

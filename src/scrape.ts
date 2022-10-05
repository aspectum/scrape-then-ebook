import fs from 'fs';
import path from 'path';
import { fetchAndParseHTML, scrapeParseAndSave } from './utils';

const MAIN_URL = process.env.MAIN_URL as string;
const BASE_URL = process.env.BASE_URL as string;
const buildUrl = (path: string) => BASE_URL + path;

const rootdir = path.join(process.cwd(), 'output', 'chapters');
if (fs.existsSync(rootdir)) {
  fs.rmSync(rootdir, { recursive: true, force: true });
}
fs.mkdirSync(rootdir, { recursive: true });

const doc = await fetchAndParseHTML(MAIN_URL);

const chapters = doc.querySelectorAll<HTMLDivElement>('.chapter-row');

console.log(`${chapters.length} chapters`);

chapters.forEach(async (chapter, chapIndex) => {
  const link = chapter.querySelector('a')!.href;
  console.log(`Processing chapter ${chapIndex + 1}`);
  scrapeParseAndSave(buildUrl(link), path.join(rootdir, `${chapIndex + 1}.md`));
});

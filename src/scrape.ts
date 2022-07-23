import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';

const MAIN_URL = process.env.MAIN_URL as string;
const BASE_URL = process.env.BASE_URL as string;
const buildUrl = (path: string) => BASE_URL + path;

const turndownService = new TurndownService();

const rootdir = path.join(process.cwd(), 'output', 'chapters');
if (fs.existsSync(rootdir)) {
  fs.rmSync(rootdir, { recursive: true, force: true });
}
fs.mkdirSync(rootdir, { recursive: true });

const res = await axios.get(MAIN_URL);
const { document } = parseHTML(res.data);

const chapters = document.querySelectorAll<HTMLDivElement>('.chapter-row');

console.log(`${chapters.length} chapters`);

chapters.forEach(async (chapter, chapIndex) => {
  // if (chapIndex !== 0) return;
  const link = chapter.querySelector('a')!.href;
  const res = await axios.get(buildUrl(link));
  const { document } = parseHTML(res.data);

  console.log(`Processing chapter ${chapIndex + 1}`);

  const article = new Readability(document).parse();

  let md = `# ${article?.title}\n\n`;

  // @ts-ignore
  md = md + turndownService.turndown(article?.content);

  fs.writeFileSync(path.join(rootdir, `${chapIndex + 1}.md`), md);
});

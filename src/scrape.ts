import path from 'path';
import { cli, createDirectories, fetchAndParseHTML, scrapeParseAndSave } from './lib';
import { getCover } from './lib/get-cover';
import { getMetadata } from './lib/get-metadata';

const MAIN_URL = cli.input[0];
const BASE_URL = new URL(MAIN_URL).origin;

const buildUrl = (path: string) => BASE_URL + path;

const STARTING_CHAPTER = cli.flags.start || 1;
const ENDING_CHAPTER = cli.flags.end || 1;

const { rootdir, chaptersdir } = createDirectories();

console.log(`Scraping ${MAIN_URL}`);

const doc = await fetchAndParseHTML(MAIN_URL);

const chapters = [...doc.querySelectorAll<HTMLDivElement>('.chapter-row')];

console.log(`${chapters.length} chapters`);

if (cli.flags.list) {
  chapters.slice(STARTING_CHAPTER - 1, ENDING_CHAPTER).forEach((chapter, chapIndex) => {
    console.log(`[${chapIndex + 1}] ${chapter.querySelector('a')!.textContent!.trim()}`);
  });
  process.exit();
}

chapters.slice(STARTING_CHAPTER - 1, ENDING_CHAPTER).forEach(async (chapter, chapIndex) => {
  const link = chapter.querySelector('a')!.href;
  console.log(`Processing chapter ${chapIndex + 1}`);
  scrapeParseAndSave(buildUrl(link), path.join(chaptersdir, `${chapIndex + 1}.html`));
});

getMetadata(doc, rootdir);

getCover(doc, rootdir);

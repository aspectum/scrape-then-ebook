import { cli, createDirectories, fetchAndParseHTML } from './lib';
import { getCover } from './lib/get-cover';
import { getMetadata } from './lib/get-metadata';
import { fixChapterNumbers, listChapters, scrapeChapters } from './lib/processors';

const MAIN_URL = cli.input[0];
const BASE_URL = new URL(MAIN_URL).origin;

const buildUrl = (path: string) => BASE_URL + path;

const STARTING_CHAPTER = cli.flags.start ? cli.flags.start - 1 : 0;
const ENDING_CHAPTER = cli.flags.end;

const { rootdir, chaptersdir } = createDirectories();

console.log(`Scraping ${MAIN_URL}`);

const doc = await fetchAndParseHTML(MAIN_URL);

const chapters = [...doc.querySelectorAll<HTMLDivElement>('.chapter-row')];

const selectedChapters = chapters.slice(STARTING_CHAPTER, ENDING_CHAPTER);

console.log(`${selectedChapters.length} chapters`);

const processor = fixChapterNumbers(STARTING_CHAPTER)(
  cli.flags.list ? listChapters : scrapeChapters(buildUrl, chaptersdir)
);

selectedChapters.forEach(processor);

getMetadata(doc, rootdir);

getCover(doc, rootdir);

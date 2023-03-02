import path from 'path';
import { scrapeParseAndSave } from './scrape-parse-save';

type Processor = (chapter: HTMLDivElement, chapIndex: number) => void;

/** only list chapter titles and numbers */
export const listChapters: Processor = (chapter: HTMLDivElement, chapIndex: number) => {
  console.log(`[${chapIndex + 1}] ${chapter.querySelector('a')!.textContent!.trim()}`);
};

/** calls scrape function for chapters */
export const scrapeChapters =
  (buildUrl: (url: string) => string, chaptersdir: string) =>
  async (chapter: HTMLDivElement, chapIndex: number) => {
    const link = chapter.querySelector('a')!.href;
    console.log(`Processing chapter ${chapIndex + 1}`);
    scrapeParseAndSave(buildUrl(link), path.join(chaptersdir, `${chapIndex + 1}.html`));
  };

/** Re calculate chapter numbers */
export const fixChapterNumbers =
  (startingChapter: number) =>
  (processor: Processor) =>
  (chapter: HTMLDivElement, chapIndex: number) => {
    processor(chapter, chapIndex + startingChapter);
  };

import fs from 'fs';
import { fetchAndParseHTML, readability } from './index';

export const scrapeParseAndSave = async (url: string, filePath: string) => {
  const doc = await fetchAndParseHTML(url);

  const article = readability(doc);

  let html = `<h2>${article.title}</h2>\n\n`;
  html = html + article.content;

  fs.writeFileSync(filePath, html);
};

// for running this file from command line
if (process.argv[2] && process.argv[3]) {
  scrapeParseAndSave(process.argv[2], process.argv[3]);
}

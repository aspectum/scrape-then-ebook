import fs from 'fs';
import { fetchAndParseHTML, readability } from './index';

export const scrapeParseAndSave = async (url: string, filePath: string) => {
  const doc = await fetchAndParseHTML(url);

  const article = readability(doc);

  let html = `<h1>${article.title}</h1>\n\n`;
  html = html + article.content;

  fs.writeFileSync(filePath, html);
};

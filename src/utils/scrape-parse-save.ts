import fs from 'fs';
import TurndownService from 'turndown';
import turndownPluginGfm from '@joplin/turndown-plugin-gfm';
import { cleanMD, fetchAndParseHTML, readability } from './index';

const gfm = turndownPluginGfm.gfm;
const turndownService = new TurndownService();
turndownService.use(gfm);

export const scrapeParseAndSave = async (url: string, filePath: string) => {
  const doc = await fetchAndParseHTML(url);

  const article = readability(doc);

  let md = `# ${article.title}\n\n`;

  md = md + turndownService.turndown(article.content);

  md = cleanMD(md);

  fs.writeFileSync(filePath, md);
};

// for running this file from command line
if (process.argv[2] && process.argv[3]) {
  scrapeParseAndSave(process.argv[2], process.argv[3]);
}

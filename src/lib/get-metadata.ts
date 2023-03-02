import fs from 'fs';
import path from 'path';
import { dedent } from 'ts-dedent';

export const getMetadata = (doc: Document, rootdir: string) => {
  console.log(`Getting metadata`);

  const title = doc.querySelector('h1[property=name]')?.textContent ?? 'No Title';
  const author =
    doc.querySelector('h4[property=author] span[property=name] a')?.textContent ?? 'No Author';

  const metadata = dedent`<dc:title>${title}</dc:title>
                          <dc:language>en-US</dc:language>
                          <dc:creator>${author}</dc:creator>
                          <dc:publisher>RoyalRoad</dc:publisher>`;

  fs.writeFileSync(path.join(rootdir, 'metadata.xml'), metadata);
};

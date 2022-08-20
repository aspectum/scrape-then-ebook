import fs from 'fs';
import path from 'path';

const rootdir = path.join(process.cwd(), 'output');

let md = '';

// handle dirty directory (non-md files and subfolders)
const dirContents = fs.readdirSync(path.join(rootdir, 'chapters'), { withFileTypes: true });
const chaps = dirContents
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name)
  .filter((fileName) => fileName.match(/.md$/))
  .sort((a, b) => +a.replace('.md', '') - +b.replace('.md', ''));

// defining function to preserve async order
chaps.forEach((chap) => {
  // reading chapter file
  let cMd = fs.readFileSync(path.join(rootdir, 'chapters', chap)).toString();
  // cMd = cMd.replaceAll('#', '##'); // changing h1 to h2

  // adding page break at the end of the chapter
  md = md + cMd + '\n' + '<div style="page-break-after: always;"></div>\n\n';
});

// write merged file
if (fs.existsSync(path.join(rootdir, 'merged.md'))) {
  fs.rmSync(path.join(rootdir, 'merged.md'), { recursive: true, force: true });
}
fs.writeFileSync(path.join(rootdir, 'merged.md'), md);

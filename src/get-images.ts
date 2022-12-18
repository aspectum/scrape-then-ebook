import axios from 'axios';
import fs from 'fs';
// import path from 'path';

/**
 * Helper function to download image from `url` to `filePath`
 */
export const downloadImage = async (url: string, filePath: string) => {
  let writer = fs.createWriteStream(filePath);

  let result = await axios({
    url: url,
    method: 'GET',
    responseType: 'stream',
  });

  result.data.pipe(writer);
};

// define paths
// const rootdir = path.join(process.cwd(), 'output');
// const imgsdir = path.join(rootdir, 'images');
// const mergedPath = path.join(rootdir, 'merged.md');

// // create images folder
// if (fs.existsSync(imgsdir)) {
//   fs.rmSync(imgsdir, { recursive: true, force: true });
// }
// fs.mkdirSync(imgsdir, { recursive: true });

// // reading merged file
// let md = fs.readFileSync(mergedPath).toString();

// // match markdown links (![](link))
// const matches = [...md.matchAll(/!\[\]\((\S*?)\)/g)];

// // filter out duplicates
// let uniques: string[] = [];
// const uniqueMatches = matches.filter((m) => {
//   if (uniques.includes(m[1])) {
//     return false;
//   }
//   uniques.push(m[1]);
//   return true;
// });

// // download images and replace references
// let replaced: string[] = [];
// uniqueMatches.forEach((m) => {
//   const url = m[1];
//   if (!replaced.includes(url)) {
//     const filePath = path.join(imgsdir, url.match(/[^/]*?$/)![0]);
//     const relativeFilePath = path.relative(rootdir, filePath);
//     downloadImage(url, filePath);
//     md = md.replaceAll(url, relativeFilePath);
//     replaced.push(url);
//   }
// });

// // write file
// if (fs.existsSync(path.join(rootdir, 'merged.md'))) {
//   fs.rmSync(path.join(rootdir, 'merged.md'), { recursive: true, force: true });
// }
// fs.writeFileSync(path.join(rootdir, 'merged.md'), md);

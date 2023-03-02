import path from 'path';
import { downloadImage } from './download-image';

export const getCover = (doc: Document, rootdir: string) => {
  const coverUrl = doc
    .querySelector<HTMLImageElement>('.cover-art-container img')
    ?.src?.replace('covers-full', 'covers-large');

  if (coverUrl) {
    console.log(`Getting cover ${coverUrl}`);

    downloadImage(coverUrl, path.join(rootdir, 'cover.jpg'));
  }
};

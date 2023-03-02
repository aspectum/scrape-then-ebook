import axios from 'axios';
import fs from 'fs';

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

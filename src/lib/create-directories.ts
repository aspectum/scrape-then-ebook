import path from 'path';
import fs from 'fs';

export const createDirectories = () => {
  const rootdir = path.join(process.cwd(), 'output');
  if (fs.existsSync(rootdir)) {
    fs.rmSync(rootdir, { recursive: true, force: true });
  }
  fs.mkdirSync(rootdir, { recursive: true });

  const chaptersdir = path.join(rootdir, 'chapters');
  fs.mkdirSync(chaptersdir, { recursive: true });

  return { rootdir, chaptersdir };
};

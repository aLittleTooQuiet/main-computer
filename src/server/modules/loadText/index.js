import { readFile } from 'fs/promises';
import path from 'path';

const filePath = './data';

export default async (filename) => {
  try {
    return await readFile(path.resolve(filePath, filename), 'utf-8');
  } catch (err) {
    console.log(err.message);
  }
}

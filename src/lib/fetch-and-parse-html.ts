import axios from 'axios';
import { parseHTML } from 'linkedom';

/**
 * Fetches a page with _axios_ and return a document built with _linkedom_
 */
export const fetchAndParseHTML = async (url: string) => {
  const res = await axios.get(url);
  const { document } = parseHTML(res.data);

  return document;
};

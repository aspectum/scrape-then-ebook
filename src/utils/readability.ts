import { Readability } from '@mozilla/readability';

/**
 * Parses a document with _@mozilla/readability_
 */
export const readability = (doc: Document) => {
  const article = new Readability(doc).parse();
  if (!article) throw new Error(`Could not parse document ${doc.location.href}`);
  return article;
};

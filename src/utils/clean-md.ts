const emRegExp = /_([^_]+)__([^_]+)_/g;
const strongRegExp = /\*\*([^\*\*]+)\*\*\*\*([^\*\*]+)\*\*/g;

/**
 * Cleans up adjacent <em> or <strong> tags after Turndown. \
 * For instance, `<em>A few words</em><em>.</em> Then more.`
 * gets transformed into `_A few words__._ Then more.`,. \
 * This function does a regex search and replace and fixes
 * those issues
 */
export const cleanAdjacentTags = (text: string, type: '__' | '**') => {
  const re = type === '__' ? emRegExp : strongRegExp;

  let cleanedText = text;

  let isClean = false;
  // loop until it's clean for sure
  while (!isClean) {
    isClean = true;
    cleanedText = cleanedText.replaceAll(re, (_, $1: string, $2: string) => {
      isClean = false;
      return `_${$1}${$2}_`;
    });
  }

  return cleanedText;
};

/**
 * Cleans markdown string
 */
export const cleanMD = (text: string) => {
  let cleanedText = text;
  cleanedText = cleanAdjacentTags(text, '__');
  cleanedText = cleanAdjacentTags(text, '**');

  return cleanedText;
};

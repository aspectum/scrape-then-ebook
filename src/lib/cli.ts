import meow from 'meow';

export const cli = meow(
  `
	Usage
	  $ yarn scrape <url>

	Options
	  --list, -L   Only list the available chapters
	  --start, -S  Number of starting chapter
	  --end, -E    Number of ending chapter

	Examples
	  $ foo unicorns --rainbow
	  🌈 unicorns 🌈
`,
  {
    importMeta: import.meta,
    flags: {
      list: {
        type: 'boolean',
        alias: 'L',
      },
      start: {
        type: 'number',
        alias: 'S',
      },
      end: {
        type: 'number',
        alias: 'E',
      },
    },
  }
);

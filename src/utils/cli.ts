import meow from 'meow';

export const cli = meow(
  `
	Usage
	  $ yarn scrape <url>

	Options
	  --list, -L  Only list the available chapters

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
    },
  }
);

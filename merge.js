import fs from 'fs';

// wrapping function to get around annoying ESlint
(async () => {
    const rootdir = process.cwd() + '/volumes';

    // "range"
    const volumes = String([...Array(12).keys()]).split(',');

    var md = '';

    var refCounter = 0; // displace footnotes

    const re = /\[\^\d\]/g; // match footnotes
    const quotesRe = /“[^“”]*”/g; // match text between quotes (smart quotes)
    const quotesRe2 = /"[^"]*"/g; // match text between quotes (dumb quotes)

    volumes.forEach(async (vol) => {
        // volume title
        let title = (await fs.readFileSync(`${rootdir}/${vol}/title.txt`)).toString();

        // getting markdown filenames in volume directory
        // and ordering them
        let chaps = fs.readdirSync(rootdir + '/' + vol);
        chaps = chaps.filter((c) => c.search('.md') >= 0);
        chaps = chaps.sort((a, b) => +a.replace('.md', '') - +b.replace('.md', ''));

        // Adding volume title and cover (and page breaks)
        md = md + `# ${title}\n\n`;
        md = md + '<div style="page-break-after: always;"></div>\n\n';
        md = md + `![](./volumes/${vol}/cover.jpg)\n`;
        md = md + '<div style="page-break-after: always;"></div>\n\n';

        // defining function to preserve async order
        const one = async () => {
            chaps.forEach(async (chap) => {
                // reading chapter file
                var cMd = fs.readFileSync(`${rootdir}/${vol}/${chap}`).toString();
                cMd = cMd.replaceAll('#', '##'); // changing h1 to h2
                cMd = cMd.replaceAll('./images', `./volumes/${vol}/images`); // correcting image paths

                // displacing footnotes
                let refs = [...new Set(cMd.match(re))];
                if (refs) {
                    refs.reverse().forEach((r) => {
                        let replacement = `[^${
                            +r.replace('[^', '').replace(']', '') + refCounter
                        }]`;
                        cMd = cMd.replaceAll(r, replacement);
                    });
                    refCounter = refCounter + refs.length;
                }

                // making dialogue italic bold
                let talks = cMd.match(quotesRe);
                if (talks) {
                    talks.forEach((t) => {
                        cMd = cMd.replace(t, `_**${t}**_`);
                    });
                }
                let talks2 = cMd.match(quotesRe2);
                if (talks2) {
                    talks2.forEach((t) => {
                        let z = [...t];
                        z.pop();
                        z.shift();
                        cMd = cMd.replace(t, `_**“${z.join('')}”**_`);
                    });
                }

                // adding page break at the end of the chapter
                md = md + cMd + '\n' + '<div style="page-break-after: always;"></div>\n\n';
            });
        };

        // awaiting execution
        await one();
    });

    // dumb waiting for async function to run before writing to file
    setTimeout(() => {
        fs.writeFileSync('merged.md', md);
    }, 1000);
})();

import axios from 'axios';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const main = async () => {
    console.log(process.env.URL);

    const rootdir = path.join(process.cwd(), 'volumes');

    let res = await axios.get(process.env.URL);
    let dom = new JSDOM(res.data);
    let document = dom.window.document;

    let volumes = dom.window.document.querySelectorAll('table.wikitable');

    console.log(volumes.length);

    volumes.forEach((volume, volIndex) => {
        let links = volume.querySelectorAll('li a');

        var volTitle = volume.querySelector('h3').textContent;
        volTitle = volTitle.slice(0, volTitle.search('(Full Text)') - 2);
        console.log(volTitle);

        let volPath = path.join(rootdir, volIndex.toString());
        if (!fs.existsSync(volPath)) {
            fs.mkdirSync(volPath);
        }

        links.forEach(async (link, chapIndex) => {
            if (link.textContent === 'Novel Illustrations') {
                return;
            }

            let chapTitle = link.textContent;
            console.log(chapTitle);
            // let chapPath = path.join(volPath), chapIndex

            let res = await axios.get(process.env.URL);
            let dom = new JSDOM(res.data);
            let document = dom.window.document;

            let nodes = document.querySelector('.mw-parser-output').childNodes;

            var md = `#${chapTitle}\n`;

            nodes.forEach((node) => {
                if (node.nodeName === 'DIV') {
                    return;
                }

                if (node.nodeName === 'P') {
                    if (node.querySelector('a')) {
                        // footnote
                    }
                    md = md + node.firstChild.textContent;
                }
            });

            fs.writeFileSync(path.join(volPath, `${chapIndex}.md`), md);
        });
    });
};

main();

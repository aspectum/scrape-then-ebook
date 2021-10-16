import axios from 'axios';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const downloadImage = async (link, file) => {
    let res = await axios.get(link);
    let dom = new JSDOM(res.data);
    let document = dom.window.document;

    let url = process.env.BASE_URL + document.querySelector('.fullImageLink a').href;

    let writer = fs.createWriteStream(file);

    let result = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream',
    });

    result.data.pipe(writer);
};

(async () => {
    console.log(process.env.URL);

    const rootdir = path.join(process.cwd(), 'volumes');
    if (!fs.existsSync(rootdir)) {
        fs.mkdirSync(rootdir);
    }

    let res = await axios.get(process.env.URL);
    let dom = new JSDOM(res.data);
    let document = dom.window.document;

    let volumes = dom.window.document.querySelectorAll('table.wikitable');

    console.log(volumes.length);

    volumes.forEach((volume, volIndex) => {
        let links = volume.querySelectorAll('li a');
        console.log(links.length);

        var volTitle = volume.querySelector('h3').textContent;
        volTitle = volTitle.slice(0, volTitle.search('(Full Text)') - 2);
        // console.log(volTitle);

        let volPath = path.join(rootdir, volIndex.toString());
        if (!fs.existsSync(volPath)) {
            fs.mkdirSync(volPath);
        }
        const imgdir = path.join(volPath, 'images');
        if (!fs.existsSync(imgdir)) {
            fs.mkdirSync(imgdir);
        }

        let coverLink = process.env.BASE_URL + volume.querySelector('a.image').href;

        downloadImage(coverLink, path.join(volPath, 'cover.jpg'));

        fs.writeFileSync(path.join(volPath, 'title.txt'), volTitle);

        links.forEach(async (link, chapIndex) => {
            if (link.textContent === 'Novel Illustrations') {
                return;
            }

            let chapTitle = link.textContent;
            // console.log(chapTitle);

            let res = await axios.get(process.env.BASE_URL + link.href);
            let dom = new JSDOM(res.data);
            let document = dom.window.document;

            let nodes = document.querySelector('.mw-parser-output').childNodes;

            var md = `# ${chapTitle}\n`;

            nodes.forEach(async (node) => {
                if (node.nodeName === 'DIV') {
                    if (node.className === 'mw-references-wrap') {
                        node.querySelectorAll('li span.reference-text').forEach((ref, refIndex) => {
                            md = md + `[^${refIndex + 1}]: ${ref.textContent}\n`;
                        });
                    } else if (node.className.search('thumb') >= 0) {
                        let imgLink = process.env.BASE_URL + node.querySelector('a.image').href;
                        let imgName = imgLink.split('File:')[1];
                        let imgFile = path.join(imgdir, imgName);
                        md = md + `![](./images/${imgName})\n`;

                        downloadImage(imgLink, imgFile);
                    } else {
                        return;
                    }
                }

                if (node.nodeName === 'P') {
                    node.childNodes.forEach((childNode) => {
                        if (childNode.nodeName === '#text') {
                            md = md + childNode.textContent;
                        } else if (childNode.nodeName === 'I') {
                            md = md + `*${childNode.textContent}*`;
                        } else if (childNode.nodeName === 'B') {
                            md = md + `**${childNode.textContent}**`;
                        } else if (childNode.nodeName === 'BR') {
                            md = md + '<br>';
                        } else if (childNode.nodeName === 'SUP') {
                            md = md + `${childNode.textContent.replace('[', '[^')}`;
                        } else {
                            console.log(childNode.nodeName);
                            console.log(node.innerHTML);
                        }
                    });
                }
                md = md + '\n';
            });

            fs.writeFileSync(path.join(volPath, `${chapIndex}.md`), md);
        });
        // console.log(`DONE ${volTitle}`);
    });
    // console.log('DONE');
})();

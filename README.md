# scrape-then-ebook
Scrapes a website then generates an ebook

Files:
* script.js: file to scrape site and save as markdown files. This is specific to one website, must adapt to others.
* merge.js: merge and format all markdown files into one to prepare for pandoc
* title.txt: ebook metadata
* book.css: styling for ebook
* make-ebook.sh: pandoc command to generate ebook from merged markdown file
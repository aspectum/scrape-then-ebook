pandoc -f html -t epub --epub-metadata output/metadata.xml --toc --epub-cover-image=output/cover.jpg --resource-path=output --css=src/book.css -o output/wcss.epub output/clean.html
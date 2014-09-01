GUIDANCE_DIR = src/pandoc/CG15

MARKDOWN = $(shell find $(GUIDANCE_DIR) -type f -name '*.md')

BUILD = build/

MERGED = $(BUILD)/merged.md


PANDOC_PDF_OPTS := --toc --chapters --base-header-level=1 --number-sections --template=virsto_doc.tex --variable mainfont="Liberation Serif" --variable sansfont="Liberation Sans" --variable monofont="Liberation Mono" --variable fontsize=12pt --variable documentclass=book 
PANDOC_EBOOK_OPTS := --toc --epub-stylesheet=epub.css --epub-cover-image=cover.jpg --base-header-level=1


clean:
	rm -rf build/*

concat: clean
	$(MARKDOWN)
		cat $^ >$(MERGED)

html: concat
	    pandoc -c --normalize --smart -f markdown -t html --bibliography=$(GUIDANCE_DIR)/Citations.tex --standalone --include-in-header=style.css $(MERGED) -o build/$(@F) $<

all: html

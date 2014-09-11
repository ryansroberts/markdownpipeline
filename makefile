GUIDANCE = CG87

GUIDANCE_DIR = src/pandoc/$(GUIDANCE)/

BUILD = build/

INTRODUCTION_CH = $(GUIDANCE_DIR)chapters/introduction

RECOMMENDATIONS_CH = $(GUIDANCE_DIR)chapters/recommendations 

MARKDOWN = $(INTRODUCTION_CH)/Introduction.md

RECS = $(sort $(dir $(wildcard $(GUIDANCE_DIR)chapters/recommendations/*/)))

MARKDOWN += $(foreach rec,$(RECS),					\
		$(rec)Set.md			  										\
		$(rec)Discussion.md  										\
		$(rec)Recommendation.md                 \
		$(sort $(wildcard $(rec)*ES*.md)))

TEMPLATES = templates/

clean:

PANDOC_OPT = -r simple_tables+table_captions+yaml_metadata_block -s -S --normalize --smart -f markdown --standalone --toc --csl=templates/bmj.csl

html: clean 
	    pandoc $(PANDOC_OPT) --bibliography=$(GUIDANCE_DIR)Citations.bibtex -template=templates/html.template -t html5 $(MARKDOWN) -o $(GUIDANCE).html 

pdf: clean
			pandoc $(PANDOC_OPT) --bibliography=$(GUIDANCE_DIR)Citations.bibtex --latex-engine=pdflatex $(MARKDOWN)  -o $(GUIDANCE).pdf

json: clean
			pandoc $(PANDOC_OPT) --bibliography=$(GUIDANCE_DIR)Citations.bibtex $(MARKDOWN) -t json -o $(BUILD)$(GUIDANCE).json

docs: clean
			mddia README.md | pandoc $(PANDOC_OPT) --bibliography=README.bib --latex-engine=pdflatex  -o README.pdf

all: html pdf json docs

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

PANDOC_OPT = -r simple_tables+table_captions+yaml_metadata_block+tex_math_dollars+tex_math_single_backslash -s -S --normalize --smart -f markdown --standalone --toc --csl=templates/bmj.csl

html: clean 
	    pandoc $(PANDOC_OPT) --bibliography=$(GUIDANCE_DIR)Citations.bibtex -template=templates/html.template -t html5 $(MARKDOWN) -o $(GUIDANCE).html 

pdf: clean
			pandoc $(PANDOC_OPT) --bibliography=$(GUIDANCE_DIR)Citations.bibtex --template=templates/latex.template --latex-engine=pdflatex $(MARKDOWN)  -o $(GUIDANCE).pdf

json: clean
			pandoc $(PANDOC_OPT) --bibliography=$(GUIDANCE_DIR)Citations.bibtex $(MARKDOWN) -t json -o $(BUILD)$(GUIDANCE).json


readme: 
			mddia README.md | pandoc $(PANDOC_OPT) --template=templates/latex.template --bibliography=README.bib --latex-engine=pdflatex  -o README.pdf

arch: 
			mddia Architecture.md | pandoc $(PANDOC_OPT) --template=templates/latex.template --bibliography=README.bib --latex-engine=pdflatex  -o Architecture.pdf

docs: readme arch

all: html pdf json docs

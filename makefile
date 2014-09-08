
GUIDANCE_DIR = src/pandoc/CG15


BUILD = build/

INTRODUCTION_CH = $(GUIDANCE_DIR)/chapters/introduction

RECOMMENDATIONS_CH = $(GUIDANCE_DIR)/chapters/recommendations 

MARKDOWN = $(INTRODUCTION_CH)/Introduction.md

RECS = $(sort $(dir $(wildcard src/pandoc/CG15/chapters/recommendations/*/)))

MARKDOWN += $(foreach rec,$(RECS),					\
		$(rec)Set.md			  										\
		$(rec)Discussion.md  										\
		$(rec)Recommendation.md                 \
		$(sort $(wildcard $(rec)*ES*.md)))

TEMPLATES = templates/

clean:
	rm -rf build/*

PANDOC_OPT = -r simple_tables+table_captions+yaml_metadata_block -s -S --normalize --smart -f markdown --standalone --toc --bibliography=$(GUIDANCE_DIR)/Citations.bibtex

html: clean 
	    pandoc $(PANDOC_OPT) -template=templates/html.template -t html5 $(MARKDOWN) -o $(BUILD)cg15.html 

pdf: clean
			pandoc $(PANDOC_OPT) --latex-engine=pdflatex $(MARKDOWN)  -o $(BUILD)cg15.pdf

json: clean
			pandoc $(PANDOC_OPT) $(MARKDOWN) -t json -o $(BUILD)cg15.json

all: html pdf json

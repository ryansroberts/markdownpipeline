# Semantic document editing and provenence

## Engineering versus office model of document production

It is possible to separate approaches to collaboratively constructing documents into two camps [@Plaintext_Please] - the office model and the engineering model. The office model is familiar to most people; a set of tools centered around a word processor and a number of large files are the center of their work. Changes to this work are tracked inside these large files and in various ad-hoc ways. Concurrent editing is difficult unless authors are in the same room and merging changes between different groups working concurrently is usually a manual process. The final output is usually the word processor file without change tracking data, possibly transliterated to formats more suitable for print or web.

In the engineering model, a larger number of plaintext files and a version control system become the center of the project along with a larger suite of more specific tools than a word processor. Changes to these files are tracked externally, in the version control system. Plain text formats are used because of the relative ease of determining the differences between two versions of the same text. Verification, translation and compilation of plaintext is usually performed by different tools than those used for editing it.

## Plaintext



## Version control systems

Version control systems (VCS) capable of accurately and efficiently working with files containing plain text data have a long history in computing [@History_VCS]. They are used day to day by millions of people to collaboratively develop complex projects. The complexity of some projects that rely on VCS is remarkable - the Linux operating system has nearly half a million recorded changes, 4000 current contributors and contains 15 million lines of text distributed between 40,000 files [@Linux_Project]. This text is regularly verified, translated and compiled into an operating system that is used everywhere from mobile phones to the mars rover.

## Provenance

Provenance is information about entities, activities, and people involved in producing a piece of data or thing, which can be used to form assessments about its quality, reliability or trustworthiness [@McGuinness:13:PTP]. Provenance is particularly important to the semantic web community as they need to track the complicated web of trust between linked data sources. To meet these needs, the W3C published the PROV standard. 

The PROV data model supports the following:

@ The core concepts of identifying an object, attributing the object to person or entity, and representing processing steps
@ Accessing provenance-related information expressed in other standards
@ Accessing provenance
@ The provenance of provenance
@ Reproducibility
@ Versioning
@ Representing procedures
@ Representing derivation

## Provenance extraction from version control

The Git2Prov project [@denies_iswc_2013] demonstrates a model for extracting PROV from a git repository. 

## Semantics from plaintext




~~~~~ {.ditaa .no-separation}

+------------+  +--------------+
| Plaintext  |  | Git Metadata |
+-----+------+  +-------+------+
      |                 |
      |                 |
      +-------+---------+
      |       |
      |       |
      |    +--*-------------+
      |    |  RDF Extractor |
      |    +----------------+
      |         |         |
      |    +----*---+  +--*-----+
      |    | Prov   |  | State  |         +----
      |    |  {s}   |  |  {s}   |         |
      |    | Graph  |  | Graph  |         |
      |    +---+----+  +----+---+         |
      |        |            |             |
      |        |            |             |
      |    +---*------------*---+         |
      +----* Compiler           |---------+
           +--------------------+








~~~~~

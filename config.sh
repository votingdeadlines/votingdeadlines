#!/bin/bash

# This file contains variables (URLs, paths) that are used in various places.
# Paths are relative to project root, and generally are made absolute later.

# This URL is where vote.org lists standard deadline info.
VOTE_ORG_GENERAL_URL="https://www.vote.org/voter-registration-deadlines/"
# Where we save it locally for further processing (about 190 KB).
VOTE_ORG_GENERAL_RAW_HTML_PATH="data-sources/vote.org/general-info.raw.html"
# The main HTML element that contains the data table we care about.
VOTE_ORG_GENERAL_TABLE_SELECTOR="table.states-chart"
# The HTML extracted from the file using the above selector (about 40 KB).
VOTE_ORG_GENERAL_TRIMMED_HTML_PATH="data-sources/vote.org/general-info.trimmed.html"
# A pretty-printed version of the trimmed HTML.
VOTE_ORG_GENERAL_FORMATTED_HTML_PATH="data-sources/vote.org/general-info.formatted.html"
# The raw text data extracted from the HTML.
VOTE_ORG_GENERAL_RAW_JSON_PATH="data-sources/vote.org/general-info.raw.json"
# The raw JSON data after a first pass of cleanup and structuring.
VOTE_ORG_GENERAL_CLEANED_JSON_PATH="data-sources/vote.org/general-info.cleaned.json"
# The cleaned JSON data, with the language parse into more structured rules.
VOTE_ORG_GENERAL_PARSED_JSON_PATH="data-sources/vote.org/general-info.parsed.json"

# This URL is where vote.org lists COVID-related deadline changes.
VOTE_ORG_COVID_URL="https://www.vote.org/covid-19/"
VOTE_ORG_COVID_RAW_HTML_PATH="data-sources/vote.org/covid-info.raw.html"

# This URL is where Marie Claire lists voting deadlines.
MARIE_CLAIRE_URL="https://www.marieclaire.com/politics/a26251797/2020-election-voter-registration-deadlines/"

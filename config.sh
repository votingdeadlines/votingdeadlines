#!/bin/bash

# This file contains variables (URLs, etc.) that are used in various places.

# This URL is where vote.org lists standard deadline info.
VOTE_ORG_GENERAL_URL="https://www.vote.org/voter-registration-deadlines/"
# This is where we save it locally for further processing (about 190 KB)
VOTE_ORG_GENERAL_RAW_HTML_PATH="data-sources/vote.org/general-info.raw.html"
# This is the main HTML element that contains the data table we care about.
VOTE_ORG_GENERAL_TABLE_SELECTOR="table.states-chart"
# This is the HTML extracted from the file using the above selector.
VOTE_ORG_GENERAL_TRIMMED_HTML_PATH="data-sources/vote.org/general-info.trimmed.html"

# This URL is where vote.org lists COVID-related deadline changes.
VOTE_ORG_COVID_URL="https://www.vote.org/covid-19/"
VOTE_ORG_COVID_RAW_HTML_PATH="data-sources/vote.org/covid-info.raw.html"

# This URL is where Marie Claire lists voting deadlines.
MARIE_CLAIRE_URL="https://www.marieclaire.com/politics/a26251797/2020-election-voter-registration-deadlines/"

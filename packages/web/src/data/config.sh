#!/bin/bash

# This file contains variables (URLs, paths) that are used in various places.
# Paths are relative to project root, and generally are made absolute later.

# The merged data from the various data sources below.
MERGED_DATA_JSON_PATH="data/votingDeadlines.json"
SVELTE_DATAFILE_PATH="web/svelte/src/datafile.ts"

#----------#
# Vote.gov #
#----------#

# This URL is where vote.gov's source code can be found.
VOTE_GOV_GIT_URL="https://github.com/usagov/vote-gov.git"
# Where we save it locally for further processing.
VOTE_GOV_SOURCE_PATH="data-sources/vote.gov/src"
# The path _relative to the git repo_ to the file with the data we want.
VOTE_GOV_SOURCE_JSON_PATH="config/gulp/state-data.json"
# The copy destination of the above data file, meant for further processing.
VOTE_GOV_RAW_JSON_PATH="data-sources/vote.gov/state-data.raw.json"
# The source JSON data after a first pass of cleanup and structuring.
VOTE_GOV_CLEANED_JSON_PATH="data-sources/vote.gov/state-data.cleaned.json"
# The cleaned JSON data, with the language parsed into quantified deadlines.
VOTE_GOV_PARSED_JSON_PATH="data-sources/vote.gov/state-data.parsed.json"

#-----------------#
# VoteAmerica.com #
#-----------------#

# This URL is where voteamerica.com lists standard registration deadline info.
VOTEAMERICA_REG_URL="https://www.voteamerica.com/voter-registration-deadlines/"
# This URL is where voteamerica.com lists registration status links.
VOTEAMERICA_REG_STATUS_URL="https://www.voteamerica.com/am-i-registered-to-vote/"
# Where we save those links locally for further processing.
VOTEAMERICA_REG_RAW_HTML_PATH="data-sources/voteamerica.com/registration.raw.html"
VOTEAMERICA_REG_STATUS_RAW_HTML_PATH="data-sources/voteamerica.com/registration-status.raw.html"
# The main HTML elements that contain the data table we care about.
VOTEAMERICA_REG_TABLE_SELECTOR="table"
VOTEAMERICA_REG_STATUS_TABLE_SELECTOR="section.hero"
# The HTML extracted from the file using the above selector.
VOTEAMERICA_REG_TRIMMED_HTML_PATH="data-sources/voteamerica.com/registration.trimmed.html"
VOTEAMERICA_REG_STATUS_TRIMMED_HTML_PATH="data-sources/voteamerica.com/registration-status.trimmed.html"
# A pretty-printed version of the trimmed HTML.
VOTEAMERICA_REG_FORMATTED_HTML_PATH="data-sources/voteamerica.com/registration.formatted.html"
VOTEAMERICA_REG_STATUS_FORMATTED_HTML_PATH="data-sources/voteamerica.com/registration-status.formatted.html"
# # The raw text data extracted from the HTML.
VOTEAMERICA_REG_RAW_JSON_PATH="data-sources/voteamerica.com/registration.raw.json"
VOTEAMERICA_REG_STATUS_RAW_JSON_PATH="data-sources/voteamerica.com/registration-status.raw.json"
# # The raw JSON data after a first pass of cleanup and structuring.
VOTEAMERICA_REG_CLEANED_JSON_PATH="data-sources/voteamerica.com/registration.cleaned.json"
# The cleaned JSON data, with the language parsed into quantified deadlines.
VOTEAMERICA_REG_PARSED_JSON_PATH="data-sources/voteamerica.com/registration.parsed.json"

#----------#
# Vote.org #
#----------#

# This data is a bit messy, so we may abandon the work below, or just use it
# to partially sanity check other datasets.

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
# The cleaned JSON data, with the language parsed into more structured rules.
VOTE_ORG_GENERAL_PARSED_JSON_PATH="data-sources/vote.org/general-info.parsed.json"

# This URL is where vote.org lists COVID-related deadline changes.
VOTE_ORG_COVID_URL="https://www.vote.org/covid-19/"
VOTE_ORG_COVID_RAW_HTML_PATH="data-sources/vote.org/covid-info.raw.html"

#--------------#
# Marie Claire #
#--------------#

# This URL is where Marie Claire lists voting deadlines. Given it only lists
# a single date for many states, we may not want to use it as a primary source.
# MARIE_CLAIRE_URL="https://www.marieclaire.com/politics/a26251797/2020-election-voter-registration-deadlines/"

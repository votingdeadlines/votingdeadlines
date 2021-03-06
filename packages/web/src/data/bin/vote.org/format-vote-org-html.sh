#!/bin/sh

# Reminder: prefix $1/ to paths, or refactor to not need this.

if [ -z $1 ]; then
  echo "No CWD passed. See Makefile."
  exit 1
fi

source $1/config.sh

if [ -z $VOTE_ORG_GENERAL_TRIMMED_HTML_PATH ]; then
  echo "No VOTE_ORG_GENERAL_TRIMMED_HTML_PATH passed."
  exit 1
fi

if [ -z $VOTE_ORG_GENERAL_FORMATTED_HTML_PATH ]; then
  echo "No VOTE_ORG_GENERAL_FORMATTED_HTML_PATH passed."
  exit 1
fi



# Make a copy, given that prettier prefers to format in place
cp $1/$VOTE_ORG_GENERAL_TRIMMED_HTML_PATH $1/$VOTE_ORG_GENERAL_FORMATTED_HTML_PATH
# Format it
yarn prettier $1/$VOTE_ORG_GENERAL_FORMATTED_HTML_PATH --write

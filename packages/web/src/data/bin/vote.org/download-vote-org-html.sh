#!/bin/sh

# Reminder: prefix $1/ to paths, or refactor to not need this.

if [ -z $1 ]; then
  echo "No CWD passed. See Makefile."
  exit 1
fi

source $1/config.sh

if [ -z $VOTE_ORG_GENERAL_URL ]; then
  echo "No VOTE_ORG_GENERAL_URL passed."
  exit 1
fi

if [ -z $VOTE_ORG_GENERAL_RAW_HTML_PATH ]; then
  echo "No VOTE_ORG_GENERAL_RAW_HTML_PATH passed."
  exit 1
fi



curl $VOTE_ORG_GENERAL_URL -o $1/$VOTE_ORG_GENERAL_RAW_HTML_PATH
# curl $VOTE_ORG_COVID_URL -o $1/$VOTE_ORG_COVID_RAW_HTML_PATH

#!/bin/sh

# Reminder: prefix $1/ to paths, or refactor to not need this.

if [ -z $1 ]; then
  echo "No CWD passed. See Makefile."
  exit 1
fi

source $1/config.sh

if [ -z $VOTE_GOV_SOURCE_PATH ]; then
  echo "No VOTE_GOV_SOURCE_PATH passed."
  exit 1
fi



# Copy the file we care about
cp $1/$VOTE_GOV_SOURCE_PATH/$VOTE_GOV_SOURCE_JSON_PATH $1/$VOTE_GOV_RAW_JSON_PATH

# Delete the full source
yarn trash $1/$VOTE_GOV_SOURCE_PATH

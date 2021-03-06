#!/bin/sh

# Reminder: prefix $1/ to paths, or refactor to not need this.

if [ -z $1 ]; then
  echo "No CWD passed. See Makefile."
  exit 1
fi

source $1/config.sh

if [ -z $VOTEAMERICA_REG_URL ]; then
  echo "No VOTEAMERICA_REG_URL passed."
  exit 1
fi

if [ -z $VOTEAMERICA_REG_RAW_HTML_PATH ]; then
  echo "No VOTEAMERICA_REG_RAW_HTML_PATH passed."
  exit 1
fi



curl $VOTEAMERICA_REG_URL -o $1/$VOTEAMERICA_REG_RAW_HTML_PATH
# curl $VOTEAMERICA_REG_STATUS_URL -o $1/$VOTEAMERICA_REG_STATUS_RAW_HTML_PATH

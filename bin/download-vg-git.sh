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



# Download full source code from GitHub
yarn trash $1/$VOTE_GOV_SOURCE_PATH
git clone $VOTE_GOV_GIT_URL $1/$VOTE_GOV_SOURCE_PATH --depth 1

# Delete .git
yarn trash $1/$VOTE_GOV_SOURCE_PATH/.git

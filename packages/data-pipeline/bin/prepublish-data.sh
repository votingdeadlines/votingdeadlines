#!/bin/sh

# Reminder: prefix $1/ to paths, or refactor to not need this.

if [ -z $1 ]; then
  echo "No CWD passed. See Makefile."
  exit 1
fi

source $1/config.sh

if [ -z $MERGED_DATA_JSON_PATH ]; then
  echo "No MERGED_DATA_JSON_PATH passed."
  exit 1
fi

if [ -z $SVELTE_DATAFILE_PATH ]; then
  echo "No SVELTE_DATAFILE_PATH passed."
  exit 1
fi



# What we want to do is just copy the data to the webapp, e.g.:
# cp $MERGED_DATA_JSON_PATH $SVELTE_DATAFILE_PATH
# But the Svelte TypeScript setup seems to have issues importing JSON, so we
# convert it to a .ts file and prepend "export default " to it:

# cat <(echo "export default ") $1/$MERGED_DATA_JSON_PATH > $1/$SVELTE_DATAFILE_PATH
(printf "export default "; cat $1/$MERGED_DATA_JSON_PATH) > $1/$SVELTE_DATAFILE_PATH
yarn prettier $1/$SVELTE_DATAFILE_PATH --write

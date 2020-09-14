source $1/config.sh

# Make a copy, given that prettier prefers to format in place
cp $1/$VOTE_ORG_GENERAL_TRIMMED_HTML_PATH $1/$VOTE_ORG_GENERAL_FORMATTED_HTML_PATH
# Format it
yarn prettier $1/$VOTE_ORG_GENERAL_FORMATTED_HTML_PATH --write

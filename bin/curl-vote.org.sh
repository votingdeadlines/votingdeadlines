# This file downloads the Vote.org voting deadline info and saves it to the
# data-sources/ folder. It is called via `make curl` (see Makefile).

source $1/config.sh 

curl $VOTE_ORG_GENERAL_URL -o $1/$VOTE_ORG_GENERAL_RAW_HTML_PATH
curl $VOTE_ORG_COVID_URL -o $1/$VOTE_ORG_COVID_RAW_HTML_PATH
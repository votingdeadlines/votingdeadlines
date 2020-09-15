default: help

CWD := $(shell pwd)

chmod:
	chmod +x config.sh
	chmod +x bin/*

#-----------------#
# Data processing #
#-----------------#

process: download trim format extract clean parse

download: download-vg download-va ## 1. Download data
download-vg: ## 1a. Download Vote.gov data
	bin/download-vg-git.sh $(CWD)
download-va: ## 1b. Download VoteAmerica.com HTML
	bin/download-voteamerica-html.sh $(CWD)
# download-vo: ## 1. Download HTML
# 	bin/download-vote-org-html.sh $(CWD)

trim: trim-vg trim-va ## 2. Trim downloaded data
trim-vg: ## 2a. Trim Vote.gov source files
	bin/trim-vg-files.sh $(CWD)
trim-va: ## 2b. Trim VoteAmerica.com HTML file
	yarn data:trim:va
# trim-vo: ## 2. Trim Vote.org HTML
# 	yarn data:trim:vo

format: format-va ## 3. Format trimmed HTML for easier reading
format-va: # 3a. Format trimmed VoteAmerica.com HTML
	bin/format-voteamerica-html.sh $(CWD)
# format-vo: ## 3. Format HTML
# 	bin/format-vote-org-html.sh $(CWD)

extract: extract-va ## 4. Extract JSON data from formatted HTML
extract-va: # 4. Extract JSON data from VoteAmerica.com HTML
	yarn data:extract:va
# extract-vo: ## 4. Extract JSON data
# 	yarn data:extract:vo

clean: clean-vg clean-va ## 5. Clean extracted JSON data
clean-vg: ## 5a. Clean extracted Vote.gov JSON data
	yarn data:clean:vg
clean-va: ## 5a. Clean extracted VoteAmerica.com JSON data
	yarn data:clean:va
# clean-vo: ## 5. Clean JSON data
# 	yarn data:clean:vo

parse: parse-vg parse-va ## 6. Parse cleaned data
parse-vg: ## 6a. Parse cleaned Vote.gov data
	yarn data:parse:vg
parse-va: ## 6b. Parse cleaned VoteAmerica.com data
	yarn data:parse:va
# parse-vo: ## 6c. Parse cleaned VoteAmerica.com data
# 	yarn data:parse:vo

diff:
	diff -y data-sources/vote.gov/state-data.parsed.json \
		data-sources/voteamerica.com/registration.parsed.json

# normalize:

#-------#
# Tests #
#-------#

test:
	yarn test

#------#
# Help #
#------#

# Via https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## List available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk \
	'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'

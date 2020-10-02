default: help

CWD := $(shell pwd)
DATA_PIPELINE_DIR := $(shell pwd)/packages/data-pipeline

chmod:
	chmod +x packages/data-pipeline/config.sh
	chmod +x packages/data-pipeline/bin/*.sh

#---------#
# Console #
#---------#

c: console

console:
	cd packages/data-pipeline && yarn console

#------#
# Data #
#------#

process:    download    trim    format    extract    clean    parse    merge ## Run data pipelines
process-vg: download-vg trim-vg                      clean-vg parse-vg ## Run Vote.gov data pipeline
process-va: download-va trim-va format-va extract-va clean-va parse-va ## Run VoteAmerica.com data pipeline

download: download-vg download-va ## 1. Download data
download-vg: ## 1a. Download Vote.gov data
	packages/data-pipeline/bin/vote.gov/download-vg-git.sh $(DATA_PIPELINE_DIR)
download-va: ## 1b. Download VoteAmerica.com HTML
	packages/data-pipeline/bin/voteamerica.com/download-voteamerica-html.sh $(DATA_PIPELINE_DIR)
# download-vo: ## 1. Download HTML
# 	packages/data-pipeline/bin/download-vote-org-html.sh $(DATA_PIPELINE_DIR)

trim: trim-vg trim-va ## 2. Trim downloaded data
trim-vg: ## 2a. Trim Vote.gov source files
	packages/data-pipeline/bin/vote.gov/trim-vg-files.sh $(DATA_PIPELINE_DIR)
trim-va: ## 2b. Trim VoteAmerica.com HTML file
	cd packages/data-pipeline && yarn data:trim:va
# trim-vo: ## 2. Trim Vote.org HTML
# 	cd packages/data-pipeline && yarn data:trim:vo

format: format-va ## 3. Format trimmed HTML for easier reading
format-va: # 3a. Format trimmed VoteAmerica.com HTML
	packages/data-pipeline/bin/voteamerica.com/format-voteamerica-html.sh $(DATA_PIPELINE_DIR)
# format-vo: ## 3. Format HTML
# 	packages/data-pipeline/bin/format-vote-org-html.sh $(DATA_PIPELINE_DIR)

extract: extract-va ## 4. Extract JSON data from formatted HTML
extract-va: # 4. Extract JSON data from VoteAmerica.com HTML
	cd packages/data-pipeline && yarn data:extract:va
# extract-vo: ## 4. Extract JSON data
# 	cd packages/data-pipeline && yarn data:extract:vo

clean: clean-vg clean-va ## 5. Clean extracted JSON data
clean-vg: ## 5a. Clean extracted Vote.gov JSON data
	cd packages/data-pipeline && yarn data:clean:vg
clean-va: ## 5a. Clean extracted VoteAmerica.com JSON data
	cd packages/data-pipeline && yarn data:clean:va
# clean-vo: ## 5. Clean JSON data
# 	cd packages/data-pipeline && yarn data:clean:vo

parse: parse-vg parse-va ## 6. Parse cleaned data
parse-vg: ## 6a. Parse cleaned Vote.gov data
	cd packages/data-pipeline && yarn data:parse:vg
parse-va: ## 6b. Parse cleaned VoteAmerica.com data
	cd packages/data-pipeline && yarn data:parse:va
# parse-vo: ## 6c. Parse cleaned VoteAmerica.com data
# 	cd packages/data-pipeline && yarn data:parse:vo

diff:
	diff -y data-sources/vote.gov/state-data.parsed.json \
		data-sources/voteamerica.com/registration.parsed.json

merge:
	cd packages/data-pipeline && yarn data:merge

prepublish:
	packages/data-pipeline/bin/prepublish-data.sh $(DATA_PIPELINE_DIR)

#--------#
# Deploy #
#--------#

# deploy-staging:
# deploy-production:

#---------#
# Metrics #
#---------#

metrics: print-metrics

print-metrics:
	yarn metrics

update-metrics:
	yarn metrics:update

#-------#
# Tests #
#-------#

test:
	yarn test

#-------------#
# Screenshots #
#-------------#

ss: screenshot

screenshot:
	cd e2e && yarn screenshot

#------#
# Help #
#------#

# Via https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## List available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk \
	'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'

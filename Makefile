default: help

CWD := $(shell pwd)
DATA_PIPELINE_DIR := $(shell pwd)/packages/web/src/data
VERSION := $(shell cat version)
PKG_JSON_VERSION := $(shell cat packages/web/package.json | grep '"version":')

#-------#
# Setup #
#-------#

chmod: ## Setup for running `make data`
	chmod +x packages/web/src/data/config.sh
	chmod +x packages/web/src/data/bin/*.sh

deps:
	cd packages/e2e && yarn && cd ../web && yarn && cd src/data && yarn

#---------#
# Console #
#---------#

# c: console

# console:
# 	cd packages/web/src/data && yarn console

#------#
# Data #
#------#

data:    download    trim    format    extract    clean    parse    merge ## Run data pipelines
data-vg: download-vg trim-vg                      clean-vg parse-vg ## Run Vote.gov data pipeline
data-va: download-va trim-va format-va extract-va clean-va parse-va ## Run VoteAmerica.com data pipeline

download: download-vg download-va ## 1. Download data
download-vg: ## 1a. Download Vote.gov data
	packages/web/src/data/bin/vote.gov/download-vg-git.sh $(DATA_PIPELINE_DIR)
download-va: ## 1b. Download VoteAmerica.com HTML
	packages/web/src/data/bin/voteamerica.com/download-voteamerica-html.sh $(DATA_PIPELINE_DIR)

trim: trim-vg trim-va ## 2. Trim downloaded data
trim-vg: ## 2a. Trim Vote.gov source files
	packages/web/src/data/bin/vote.gov/trim-vg-files.sh $(DATA_PIPELINE_DIR)
trim-va: ## 2b. Trim VoteAmerica.com HTML file
	cd packages/web/src/data && yarn data:trim:va

format: format-va ## 3. Format trimmed HTML for easier reading
format-va: # 3a. Format trimmed VoteAmerica.com HTML
	packages/web/src/data/bin/voteamerica.com/format-voteamerica-html.sh $(DATA_PIPELINE_DIR)

extract: extract-va ## 4. Extract JSON data from formatted HTML
extract-va: # 4. Extract JSON data from VoteAmerica.com HTML
	cd packages/web/src/data && yarn data:extract:va

clean: clean-vg clean-va ## 5. Clean extracted JSON data
clean-vg: ## 5a. Clean extracted Vote.gov JSON data
	cd packages/web/src/data && yarn data:clean:vg
clean-va: ## 5a. Clean extracted VoteAmerica.com JSON data
	cd packages/web/src/data && yarn data:clean:va

parse: parse-vg parse-va ## 6. Parse cleaned data
parse-vg: ## 6a. Parse cleaned Vote.gov data
	cd packages/web/src/data && yarn data:parse:vg
parse-va: ## 6b. Parse cleaned VoteAmerica.com data
	cd packages/web/src/data && yarn data:parse:va

merge:
	cd packages/web/src/data && yarn data:merge

#-----#
# Dev #
#-----#

dev: dev-web

dev-web:
	cd packages/web && \
		docker-compose -f \votingdeadlines-web-dev.docker-compose.yaml up --build

#---------#
# Metrics #
#---------#

metrics: update-metrics print-metrics

print-metrics:
	cd packages/web && yarn metrics

update-metrics:
	cd packages/web && yarn metrics:update

#-------------#
# Screenshots #
#-------------#

ss: screenshot ## -> screenshot

screenshot: ## Take a screenshot of the webapp (requires dev app to be running)
	cd packages/e2e && yarn screenshot

#-------#
# Tests #
#-------#

test: test-unit ## -> test-unit

test-ci: data test-unit test-integration ## Check the data, and run unit and integration tests.

test-unit: ## Run unit tests
	cd packages/web/src/data && yarn test

test-int: test-integration ## -> test-integration

test-integration: ## Run integration tests
	cd packages/web && yarn test:int

upss: update-snapshots ## -> update-snapshots

update-snapshots: ## Update jest snapshots
	cd packages/web/src/data && yarn test:upss

#---------#
# Release #
#---------#

release: ## Build the website and copy to packages/web/dist/
	test '$(PKG_JSON_VERSION)' = '  "version": "$(VERSION)",' || exit 1
	@echo Building v$(VERSION)...
	cd packages/web && yarn export && cp -R __sapper__/export dist/v$(VERSION)

#------#
# Help #
#------#

# Via https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## List available commands
	@echo "VotingDeadlines.ts $(VERSION)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk \
	'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'

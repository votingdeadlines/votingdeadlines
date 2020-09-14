default: help

CWD := $(shell pwd)

chmod:
	chmod +x config.sh
	chmod +x bin/*

#-----------------#
# Data processing #
#-----------------#

download: download-html ## 1. Download HTML
download-html:
	bin/download-vote-org-html.sh $(CWD)

trim: trim-html ## 2. Trim HTML
trim-html:
	yarn data:trim:vo

format: format-html ## 3. Format HTML
format-html:
	bin/format-vote-org-html.sh $(CWD)

extract: extract-json ## 4. Extract JSON data
extract-json:
	yarn data:extract:vo

clean: clean-json ## 5. Clean JSON data
clean-json:
	yarn data:clean:vo

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
	'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

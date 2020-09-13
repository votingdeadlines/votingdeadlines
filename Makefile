default: test

CWD := $(shell pwd)

chmod:
	chmod +x config.sh
	chmod +x bin/*

curl:
	bin/curl-vote.org.sh $(CWD)

test:
	npm run test

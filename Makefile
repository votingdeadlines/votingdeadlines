CWD := $(shell pwd)

chmod:
	chmod +x config.sh
	chmod +x bin/*

curl:
	bin/curl-vote.org.sh $(CWD)
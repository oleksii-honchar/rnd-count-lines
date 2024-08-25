SHELL=/bin/bash
RED=\033[0;31m
GREEN=\033[0;32m
BG_GREY=\033[48;5;237m
YELLOW=\033[38;5;202m
BOLD_ON=\033[1m
BOLD_OFF=\033[21m
NC=\033[0m # No Color

.PHONY: help

help:
	@echo Automation commands:
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

check-node-env:
ifndef NODE_ENV
	@printf "${YELLOW}NODE_ENV not provided. Using ${BOLD_ON}'NODE_ENV=development'${BOLD_OFF} as default${NC}\n"
  export NODE_ENV = development
endif


install-tools:
	@corepack enable pnpm && corepack install -g pnpm
	@pnpm i -g npm-check-updates

# use full path as a parameter
# make count-lines path=~/path/to/dir
count-lines:
	node --experimental-strip-types ./src/count-lines.ts $(path)
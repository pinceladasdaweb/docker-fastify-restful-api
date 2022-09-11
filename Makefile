DOCKER := @docker
COMPOSE := @docker-compose
NODE := 16.17.0-alpine

help: ## Show this help message.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Perform the initial project setup.
	cp .env.example .env
	@make install-deps
	npm run husky

install-deps: ## Install project dependencies using docker.
	${DOCKER} run --rm -it -v ${PWD}:/usr/src/app -w /usr/src/app node:${NODE} npm i

up: ## Run containers on this project
	${COMPOSE} up -d

down: ## Terminate containers running on this project.
	${COMPOSE} down

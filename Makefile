dev:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
	up

prod:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
	up

prune:
	docker system prune --all --volumes
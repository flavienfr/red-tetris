# Launch
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

# Test
test_front:
	docker exec -it frontend_dev npm test

test_coverage_front:
	docker exec -it frontend_dev npm test -- --coverage

test_back:
	docker exec -it backend_dev npm test

test_coverage_back:
	docker exec -it backend_dev npm test -- --coverage

# Sh
front_sh:
	docker exec -it frontend_dev sh

back_sh:
	docker exec -it backend_dev sh

# Prune
prune:
	docker system prune --all --volumes
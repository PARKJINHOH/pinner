.PHONY: local-up local-down local-logs local-restart-be local-build \
        dev-up dev-down dev-logs dev-build \
        prod-up prod-down prod-logs \
        local-db-reset

# ================================================================
# 로컬 개발 환경 (docker-compose.local.yml)
# ================================================================

local-up:
	docker compose -f docker-compose.local.yml --env-file .env.local up -d

local-build:
	docker compose -f docker-compose.local.yml --env-file .env.local up -d --build

local-down:
	docker compose -f docker-compose.local.yml down

local-logs:
	docker compose -f docker-compose.local.yml logs -f

local-restart-be:
	docker compose -f docker-compose.local.yml restart backend

local-ps:
	docker compose -f docker-compose.local.yml ps

# ================================================================
# 개발 서버 환경 (docker-compose.dev.yml)
# ================================================================

dev-up:
	docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build

dev-down:
	docker compose -f docker-compose.dev.yml down

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

dev-build:
	docker compose -f docker-compose.dev.yml --env-file .env.dev build --no-cache

dev-ps:
	docker compose -f docker-compose.dev.yml ps

# ================================================================
# 운영 서버 환경 (docker-compose.prod.yml)
# ================================================================

prod-up:
	docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

prod-ps:
	docker compose -f docker-compose.prod.yml ps

# ================================================================
# DB 초기화 (주의: 데이터 삭제됨)
# ================================================================

local-db-reset:
	docker compose -f docker-compose.local.yml down -v
	rm -rf ./volumes/mariadb/local
	$(MAKE) local-up

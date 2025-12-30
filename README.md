# Development vs Production (Docker)

## Development:

### docker compose up

- nodemon
- live reload
- local code sync

## Production:

### docker compose -f docker-compose.prod.yml up -d

### stop containers:

- docker compose down

## Production Mode

### Build & run containers

- docker compose -f docker-compose.prod.yml up -d

### docker compose -f docker-compose.prod.yml up -d

- docker compose -f docker-compose.prod.yml down

### docker compose -f docker-compose.prod.yml down

- docker compose build

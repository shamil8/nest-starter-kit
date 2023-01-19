# NestJS Starter Kit

The repository provides examples of the main toolkit used to write a basic service on the NestJS framework.

### Required

1. NodeJS v16
2. Postgres 15.1
3. RabbitMQ 3.11.3
4. Redis 7

### Service start:

1. Create .env file from env.local
2. Install node-modules
```
yarn install
```
3. Start tests
```
yarn test
```
4. Start server
```
yarn start
```

5. Checkout swagger (Default: http://localhost:3000/api/docs)

### Docker build for developers
```
cd docker

docker-compose up

`or`

docker build -t app-backend:latest -f docker/Dockerfile .

docker run --name app-backend -d -p 5001:5000 app-backend:latest --env-file=.env
```

### Files naming

```
{name}.{resource_type}.ts
{name}.{resource_type}.spec.ts - For unit tests.
```

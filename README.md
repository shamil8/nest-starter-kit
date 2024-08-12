# NestJS Starter Kit

This repository provides examples of the main toolkit used to build a basic service using the NestJS framework.

## Requirements

- **NodeJS**: v20+
- **PostgreSQL**: 16.0+
- **RabbitMQ**: 3.13+
- **Redis**: 7.2+

## Getting Started

### 1. Environment Setup

- Create a `.env` file by copying `env.local`:
  ```bash
  cp .env.local .env
  ```
### 2. Install Dependencies
- Install the required Node modules:
  ```bash
  yarn install
  ```

### 3. Run Tests
- Start the test suite:
  ```bash
  yarn test
  ```

### 4. Start the Server
- Launch the development server:
  ```bash
  yarn start:dev
  ```

- Access Swagger API documentation at http://localhost:5000/api/docs (default).

## Docker Setup for Developers

### Option 1: Using Docker Compose
- Navigate to the docker directory and start the services:
```bash
cd docker

docker-compose -f docker-compose.local.yml up -d
```

- Access RabbitMQ Management at http://localhost:15673.
  - **Username**: `app`
  - **Password**: `rabbitmq`

- Access Adminer at http://localhost:8082.
  - **System**: PostgreSQL
  - **Server**: `app-db`
  - **Username**: `app`
  - **Password**: `root`
  - **Database**: `app_db`

### Option 2: Building and Running Docker Image
- Build the Docker image:
```bash
docker build -t app-backend:latest -f docker/Dockerfile .
```

- Run the Docker container:
```bash
docker run --name app-backend -d -p 5001:5000 app-backend:latest --env-file=.env
```

## File Naming Conventions

- Source files: `{name}.{resource_type}.ts`
- Unit tests: `{name}.{resource_type}.spec.ts`


## Project Structure
<p align="center">
  <img src="https://github.com/shamil8/nest-starter-kit/blob/main/docs/project_structure.png" width="320" alt="Img Project structure" />
</p>

## Directory Overview

- **`.devops`**: Contains DevOps scripts for deployment and automation.
- **`.devtools`**: Developer scripts for automating common tasks.
- **`Makefile`**: Bash scripts for automation tasks.
- **`libs`**: Business logic libraries.
- **`crypton-libs`**: Project-wide entities, interfaces, and symbols.
- **`contracts`**: Contracts for microservice interaction.
- **`src`**: Core application code and configuration.
  - **`config`**: Validation for `.env` files.
  - **`console`**: Application-level console commands.
  - **`constants`**: Application-level constants.
  - **`enums`**: Application-level enumerations.
  - **`filters`**: Error filters and handlers.
  - **`i18n`**: Language files (JSON).
  - **`migration`**: Raw database migrations.
  - **`jobs`**: Kafka and RabbitMQ message handlers.

## Module Structure

Each module follows this structure:

- **`<name>.module.ts`**: Module definition.
- **`config`**: Module configuration services (e.g., `wallet.index.ts`).
- **`console`**: Console command services (e.g., `wallet-pull.console.ts`).
- **`constants`**: Module-specific constants.
- **`controllers`**: HTTP controllers (e.g., `wallet.controller.ts`).
- **`dto`**:
  - **`command`**: Data-modifying commands (e.g., `balance-up.command.ts`).
  - **`query`**: Data-querying commands (e.g., `balance-up.query.ts`).
  - **`resource`**: Data resources (e.g., `balance.resource.ts`).
- **`enums`**: Module-specific enumerations.
- **`events`**: Event DTOs.
- **`listeners`**: Event handlers.
- **`i18n`**: Module-specific language files.
- **`jobs`**: RabbitMQ and Kafka queue handlers.
- **`entities`**: Models and entities (e.g., `wallet.entity.ts`).
- **`repositories`**: Data repositories (e.g., `wallet.repository.ts`).
- **`services`**: Module services (e.g., `wallet.service.ts`).


## API Response Structure

### Success Response
```
{
  "ok": true,
  "result": {result - string, number, boolean or ResourceDTO}
}
```

- Success response example:
```json
{
  "ok": true,
  "result": {
    "id": "CU7ZA69G68T8",
    "firstName": "Shamil",
    "lastName": "Kurbonov",
    "email": "qurbonovshamil@gmail.com"
  }
}
```

### Error Response:
```
{
  "ok": false,
  "statusCode": {HttpStatus},
  "timestamp": {Timestamp},
  "message": {ExceptionMessage},
  "localCode": {ExceptionLocalCode},
  "args": {object}
}
```

- Error response example:
```json
{
  "ok": false,
  "statusCode": 429,
  "timestamp": "2024-05-24T11:36:58.434Z",
  "message": "Too Many Requests",
  "localCode": 10001
}
```

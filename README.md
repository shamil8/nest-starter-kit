# NestJS Starter Kit

The repository provides examples of the main toolkit used to write a basic service on the NestJS framework.

### Required

1. NodeJS v20
2. Postgres 15.3
3. RabbitMQ 3.11.3
4. Redis 7.2

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

### Project structure
<p align="center">
  <img src="https://github.com/shamil8/nest-starter-kit/blob/main/docs/project_structure.png" width="320" alt="Image Project structure" />
</p>

### .devops
Contains DevOps scripts helping with deployment or automating its activities.

### .devtools
Developer scripts automating their activities.

### Makefile
Contains bash scripts for automation.

### libs
Business libraries.

### crypton-libs
Library containing project-wide entities, objects, interfaces, symbols.

### contracts
Contains contracts for microservices interaction.

### src
config - Contains validation for .env.

console - Application-level console commands.

constants - Application-level constants.

enums - Application-level enumerations.

filters - Error filters / error handling and error response formation.

i18n - Language JSON files.

migration - Contains raw migrations.

jobs - Kafka message handlers, RabbitMQ message handlers.


```
modules
<name>.module.ts

<module name>
config - Service for retrieving module configuration.

Example: wallet.index.ts

console - Console command services for the module.

Example: wallet-pull.console.ts

constants - Module constants.

controllers
Example: wallet.controller.ts

dto
command - Data-changing commands, Example: balance-up.command.ts

query - Data querying, Example: balance-up.query.ts

resource - Data serving, Example: balance.resource.ts

enums - Module enumerations, for example, route.ts, event-id.ts

events
Event DTOs

listeners - Event handlers

i18n - Language JSON files for this module

jobs - Rabbit, Kafka queue handlers

entities - Models/entities, Example: wallet.entity.ts

repositories - Repositories, Example: wallet.repository.ts

services - Module services, Example: wallet.service
```


### Server responses

Success:
```
{
  "ok": true,
  "result": {result}
}
```

```
{
  "ok": true,
  "result": {
    "id": "9eccf36c-976b-4876-830d-72976cb449a1",
    "firstname": "firstname",
    "lastname": "lastname",
    "email": "d29f9cbd-1da1-4a88-8f1c-5d38016cfed0@email.com"
  }
}
```

Error:
```
{
  "ok": false,
  "statusCode": {Status code},
  "timestamp": {Timestamp},
  "message": {Error message}
}
```

```
{
  "ok": false,
  "statusCode": 403,
  "timestamp": "2022-05-24T11:36:58.434Z",
  "message": "Wrong password"
}
```

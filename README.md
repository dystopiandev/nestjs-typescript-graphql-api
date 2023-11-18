# NestJS (TypeScript) GraphQL API Boilerplate

[![CI](https://github.com/dystopiandev/nestjs-typescript-graphql-api/actions/workflows/ci.yml/badge.svg)](https://github.com/dystopiandev/nestjs-typescript-graphql-api/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/dystopiandev/nestjs-typescript-graphql-api/graph/badge.svg?token=BueJy47J2M)](https://codecov.io/gh/dystopiandev/nestjs-typescript-graphql-api)

A containerized boilerplate for a TypeScript-first NestJS backend with code-first GraphQL, JWT (Passport) authentication, MongoDB (MikroORM), and concise (Unit & E2E) tests.

- [NestJS (TypeScript) GraphQL API Boilerplate](#nestjs-typescript-graphql-api-boilerplate)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Running the app](#running-the-app)
  - [Test](#test)
    - [Running unit tests](#running-unit-tests)
    - [Running End-to-End (E2E) tests](#running-end-to-end-e2e-tests)


## Features

- Code-first GraphQL, with Apollo Sandbox integration (GraphQL IDE)
- Persistence: MikroORM (MongoDB driver)
- Testing (Vitest): AAA, GraphQL E2E, Codecov
- JWT Authentication (Nest/Passport)
- Architecture: Domain-driven file structure
- Configuration: Environment variables (dotenv)
- Strong typing (TypeScript) and validation (class-validator)
- Containerization: Docker
- Continuous Integration: GitHub Actions

## Requirements

- Node.js (tested with v18 and newer)
- MongoDB (tested with Community Server v7)

## Setup

1. Clone the repository.

2. Provide environment variables in `.env.development`:

    ```bash
    # copy the example/defaults
    cp .env.example .env.development
    ```

    You can change the values in the `.env.development` file to match your environment. The default MONGO_URI targets a typical locally running MongoDB server instance (`127.0.0.1:27017`).

3. Install the project dependencies:

    ```bash
    npm install
    ```

## Running the app
Development mode (with hot-reload):

```bash
npm run start:dev
```

...or without hot-reload:

```bash
npm run start
```

Production mode:

```bash
npm run start:prod
```

After running the app, you can access the GraphQL sandbox at http://localhost:8008/graphql

## Test

### Running unit tests

```bash
npm run test
npm run test:watch    # watch mode
npm run test:cov      # coverage
npm run test:debug    # debug
```

Coverage report for unit tests are exported to `./coverage/unit/`.

### Running End-to-End (E2E) tests

An in-memory MongoDB server is used for the E2E tests, so you don't need to have a MongoDB server running.

```bash
npm run test:e2e
npm run test:e2e:cov  # coverage
```

Coverage report for E2E tests are exported to `./coverage/e2e/`.

# Docker Fastify RESTful API

Node.js RESTful API boilerplate using Traefik, Docker, Docker Compose, Fastify, JWT and Mongodb.

## Requirements
1. Node.js >= 20
2. Docker
3. Docker compose

## Project structure

```
src/
├── index.js        # entry point: boot + graceful shutdown
├── app.js          # builds the Fastify instance (plugins, error handling)
├── routes.js       # mounts the modules under /api/v1
├── plugins/        # cross-cutting infrastructure (db, auth, sentry)
├── modules/        # one folder per business domain
│   ├── movies/     # movies.routes / .controller / .schemas / .model
│   └── users/      # users.routes / .controller / .schemas / .model
└── shared/         # generic building blocks (enums, errors, utils, validators)
```

The dependency rule: `modules/` may import from `shared/`, never the other way around, and modules do not import from each other.

## Getting started

Install packages using docker:

```sh
docker run --rm -it \
-v ${PWD}:/usr/src/app \
-w /usr/src/app \
node:22-alpine npm i
```

Windows users should switch the PWD variable to your current directory. Alternatively, you can run npm install as follows:

```sh
docker-compose run --rm api npm install
```

Or if you have node installed in your system, install using npm:

```sh
npm install
```

## Configuration

1. Rename the .env.example file to .env and fill variables. The SENTRY_DSN variable is not obligatory.

2. Edit your hosts file with:
  >127.0.0.1 fastify.localhost

## Run

In the root of project, run:

```sh
docker-compose up
```

## API Request

| Endpoint                           | HTTP Method             | Description             |
| ---------------------------------- | :---------------------: | :---------------------: |
| `/health`                          | `GET`                   | `Healthcheck`           |
| `/docs`                            | `GET`                   | `Swagger UI`            |
| `/api/v1`                          | `GET`                   | `Welcome message`       |
| `/api/v1/users/register`           | `POST`                  | `Adds a new user`       |
| `/api/v1/users/auth`               | `POST`                  | `Authenticate user`     |
| `/api/v1/movies`                   | `GET`                   | `List all movies`       |
| `/api/v1/movies/:id`               | `GET`                   | `Get movie`             |
| `/api/v1/movies`                   | `POST`                  | `Adds a new movie`      |
| `/api/v1/movies/:id`               | `PATCH`                 | `Update a movie`        |
| `/api/v1/movies/:id`               | `DELETE`                | `Delete a movie`        |

All `/api/v1/movies` routes require a `Authorization: Bearer <token>` header (get a token from `/api/v1/users/auth`). Invalid ids return `400`, duplicated emails return `409`, and login/register are rate limited (5 requests per minute).

## Tests

The test suite uses the built-in `node:test` runner against an in-memory MongoDB (no Docker needed):

```sh
npm test
```


## Test API locally using curl

- #### Healthcheck

`Request`
```bash
curl -i --request GET 'http://fastify.localhost/api/v1'
```

`Response`
```bash
{
  "message": "Fastify API is on fire"
}
```

## Insominia Collection

I exported Insomnia [`collection/data`](insomnia_2021-02-07.json) for so you can test all the endpoints.

## Traefik dashboard

To access Traefik dashboard, simple access in your browser:

```sh
http://localhost:8080
```

Happy coding!

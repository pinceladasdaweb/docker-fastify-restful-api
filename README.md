# Docker Fastify RESTful API

Node.js RESTful API boilerplate using Traefik, Docker, Docker Compose, Fastify, JWT and Mongodb.

## Requirements
1. Node.js >= 14
2. Docker
3. Docker compose

## Getting started

Install packages using docker:

```sh
docker run --rm -it \
-v ${PWD}:/usr/src/app \
-w /usr/src/app \
node:15-alpine npm i
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

1. Rename the .env.example file to .env and fill variables. The Postgres variables are required for Sonarqube. The SENTRY_DSN variable is not obligatory.

2. Edit your hosts file with:
  >127.0.0.1 fastify.localhost
  >
  >127.0.0.1 sonarqube.localhost

## Run

In the root of project, run:

```sh
docker-compose up
```

## API Request

| Endpoint                           | HTTP Method             | Description             |
| ---------------------------------- | :---------------------: | :---------------------: |
| `/api/v1`                          | `GET`                   | `Healthcheck`           |
| `/api/v1/users/register`           | `POST`                  | `Adds a new user`       |
| `/api/v1/users/auth`               | `POST`                  | `Authenticate user`     |
| `/api/v1/movies`                   | `GET`                   | `List all movies`       |
| `/api/v1/movies/:id`               | `GET`                   | `Get movie`             |
| `/api/v1/movies`                   | `POST`                  | `Adds a new movie`      |
| `/api/v1/movies/:id`               | `PATCH`                 | `Update a movie`        |
| `/api/v1/movies/:id`               | `DELETE`                | `Delete a movie`        |


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

## Sonarqube dashboard

To access Sonarqube dashboard, simple access in your browser:

```sh
http://sonarqube.localhost
```

![](/sonarqube.png)

[Follow the guide](SONARQUBE.md) to learn more about the settings and how to run Sonar code analysis.

## Traefik dashboard

To access Traefik dashboard, simple access in your browser:

```sh
http://localhost:8080
```

![](/traefik.png)

Happy coding!

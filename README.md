[![Lifecycle:Maturing](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)]()
# B.C. Community Investment Opportunity Tool

  The [Community Investment Opportunity Tool&#128279;](https://communityinformationtool.gov.bc.ca/investmentopportunities/home) is a place where Economic Development Officers (EDO) can go to post possible investment opportunities for their respective communities. This tool includes a user authenticated portion where EDO's can go to see their currently posted investment opportunities as well as post new ones. It also includes a public facing view where possible investors can go to see all the currently available opportunities in the province or narrow down the opportunities on a set of filterable criteria.

## Installation

Clone the project.

```
git clone https://github.com/bcgov/CIOT
```

Install [Docker](https://docs.docker.com/engine/install/ubuntu/) and [Docker Compose](https://docs.docker.com/compose/install/).

Copy a local config templates:

```
cp .\ciot-api\.env.template .\ciot-api.env
```

To run the entire project in Docker use:

```
docker-compose up -d --build
```

If you wish to run the cit-web outside of docker for hot reloading you can run:

```
docker-compose up db -d --build
docker-compose up cit-api -d --build
```

To run the Community investment tool see [README](/cit3.0-web/README.md).

Once the app is running you can access the Community Investment Tool Front end at `http://localhost:3000`, the Django app api at `http://localhost:8000/api` and the swagger documentation at `http://localhost:8000/swagger/`. To access the database use the proper user and port 5432.

You can create a new terminal, and run commands to interact with the application. `docker-compose ps` to show services, and `docker-compose exec cit-api bash` to open a shell in inside the django service.

## Docker containers

CIT consists of 5 main docker containers when running locally, these are defined in `docker-compose.yml` and respective Dockerfiles.

- `cit-web` - Builds and hosts `./cit3.0-web` on port 80, utilizing npm and nginx.
- `cit-api` - Builds and hosts `./cit-api` on port 8000, utilizing python 3.6, in addition to providing swagger on `*:8000/swagger/`
- `db` - Stands up a Postgres database for cit-api to use on port 5432
- `kcpostgres` - Stands up a Postgres database for keycloak to use
- `keycloak` - Provides a local instance of keycloak on port 8080

## Importing Data

See [DATA.md](DATA.md)

## Development

### VSCode (Front end Development)

If the editor of choice is Visual Studio Code during development, one can have automatic linting enabled

In Files -> Settings -> Workspace -> Open Settings access the settings.json and add:

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"]
 }
```

To run the linting manually run the following commands from the cit-web folder.

To display linting errors.

```
yarn lint
```

To auto fix linting errors.

```
yarn lint:fix
```

### Django Testing

To run the Django unit tests for the api use the following command from within the cit-api directory:

```
python3 runtests.py
```

or to run them in the cit-api docker container:

```
docker exec -it cit_cit-api_1 bash
python3 runtests.py
```

to target and run only specific tests you can use:

```
python manage.py test /path/to/your/test --settings=admin.test_settings
```

All tests are found under the tests directory in the cit-api and should be added to models views or serializers based on what they are testing.

## Deployment

Create a Pull request on <https://github.com/bcgov/CIT>, once its approved and merged by a repo admin, it will automatically be deployed to test.

A manual Github action will be triggered by a repo administrator to deploy to prod, after a request to deploy is made.

## How to Contribute

If you would like to contribute please follow the [contributing](CONTRIBUTING.md) readme.

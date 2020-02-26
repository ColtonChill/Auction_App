# Thomas Edison Auction

## Tool Stack
* Docker
* Node
* Postgres

## Setup Instructions

1. Install Docker and Docker-Compose
2. Run the following commands:
```
git clone https://github.com/usu-cs-3450/Repo-2.8
cd project
docker-compose up --build
```
3. The server is running on port 80.

## Configuration Management Policies

## Naming Conventions
Follow the [Google JavaScript Style](https://github.com/google/eslint-config-google) guide and follow eslint's suggestions.

## Version Control Procedures
* Every person works on a separate branch for each feature.
* Every person merges master into their development branch frequently.
* The `master` branch is always to be working.
* Every person should merge their changes into master through a pull request,
    then wait for another person to merge their changes in.

## Unit Testing
1. Run the following commands:
```
cd project
docker-compose run api npm run test
```

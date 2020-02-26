# Thomas Edison Auction
This project is a potential product meant to help facilitate and improve the Thomas Edison Middle School Fundraiser Auction. In particular, this application is designed to digitize and expand the Silent auction position of the Fundraiser. It is our goal to provide a streamlined system that will encourage more use and charity by participants, thereby benefiting Thomas Edison and its students. In an effort to provide a holistic framework, Live Auction support is provided, however, the majority of the functionality is found for Silent Auction items to minimize obtrusion into an existing system.
For specific explanation of features/functionality, please refer to the documentation. Instructions for installation, general use, testing, etc, are found below.

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

<<<<<<< HEAD
## Naming Conventions
Follow the [Google JavaScript Style](https://github.com/google/eslint-config-google) guide and follow eslint's suggestions.

A source file consists of, in order:

1. License or copyright information, if present 
2. Package statement
3. Import statements
4. Exactly one top-level class

Exactly one blank line separates each section that is present.

Lower Camel case will be used for naming variables, methods and parameters. Constants should have all characters capitalized.

When a class has multiple constructors, or multiple methods with the same name, these appear sequentially, with no other code in between.

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

## System Test    
0. Ensure all Unit & Integration Tests have been passed.
1. Use the Admin account operation to verify persistence with add, remove, and edit options.
2. Test the Auction timer by using the client to attempt to bid on items before and after the timer has resolved.
3. Use multiple instances of a client to simultaneously bid on an item to insure proper error handling.
4. Test the client on various platforms (Android/Apple, Chrome/Safari, etc)
5. Utilize the built in Spring System Testing to verify abstracted dependancies (DataBase interactions, API calls, Volume testing, etc).


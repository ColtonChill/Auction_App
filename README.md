# Thomas Edison Auction
This project is a potential product meant to help facilitate and improve the Thomas Edison Middle School Fundraiser Auction. In particular, this application is designed to digitize and expand the Silent auction position of the Fundraiser. It is our goal to provide a streamlined system that will encourage more use and charity by participants, thereby benefiting Thomas Edison and its students. In an effort to provide a holistic framework, Live Auction support is provided, however, the majority of the functionality is found for Silent Auction items to minimize obtrusion into an existing system.
For specific explanation of features/functionality, please refer to the documentation. Instructions for installation, general use, testing, etc, are found below.

## Tool Stack
* Docker
* Java/Kotlin
* Gradle
* Hibernate
* Spring

## Setup Instructions

1. Install Docker
2. Run the following commands:
```
git clone https://github.com/usu-cs-3450/Repo-2.8
docker build ./ -t thomasedisonauction
docker start thomasedisonauction
```

## Configuration Management Policies

## Naming Conventions and Organization
Follow the Google Java Style guide and the Kotlin style guide.

A source file consists of, in order:

License or copyright information, if present
Package statement
Import statements
Exactly one top-level class
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
1. Install gradle on your system.
2. Run the following commands:
```
gradle test
```

## System Test
0. Insure all Unit & Integrations Tests have been passed.
1. JUnit Stuff
2. Utilize built in Spring System Testing (Dabase interactions, API calls, Volume testing, etc).
3. More Techo jargon laden double speak.

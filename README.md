# Thomas Edison Auction

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

## Naming Conventions
Follow the Google Java Style guide and the Kotlin style guide.

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

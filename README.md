# Web and Cloud Computing 2020


## Overview

The project triest to emulate a car-sharing application that is scoped within a corporation. This is done in order to minimize the parking space required and reduce the car emissions. The core features of the application are: registering of employees into the system (by admin), small chat functionality and the actual driving from the start point to the end point. The application is meant to be run in a distributed manner on multiple machines, but can also be run locally, on a single machine.

The development of this applicatin was meant to be cross-platform. Therefore, every script was designed to be used both in Windows and Unix systems.

### Organisation

The project is part of the Masters course "Web and Cloud Computing" (2020) from RUG.

#### Topic: Corporate Carpooling as a Service

### Students - Group 06

Stefan Evanghelides (s2895323)

Alexandros Charisis (s3992853)

Etherlbert Uzodinma (s3886026)


## TL;DR

1. `build.sh`
2. `init.sh`
3. `migrate-schema-cassandra.sh` done only once for schema migration for the current locations of the users.
  - `migrate-schema-cassandra.sh -a` to also populate it with historical data (in normal mode, i.e. non-Swarm).
  - `migrate-schema-cassandra.sh -a -o` to also populate it with historical data in when running in Overlay network (Swarm mode).
4. `migrate-schema-mongodb.sh` done only once for schema migration and initial data population of the employees information.
5. `run.sh` deploy the services and run the application

There are also 2 helper scripts, useful for debugging/further development of the application:
- `clean.sh` -> removes the project's running containers and volumes
- `stackLogs.sh <STACK-NAME>` -> provides real-time logs of a specified stack name. This works similar to `docker service logs <SERVICE-NAME>`, but for a complete collection of services inside a stack.


## Project structure

The application consists of serveral services containerised using Docker. The orchestration tool used for distribution is Docker Swarm. The services can be deployed either using `docker service create` or using `docker stack`.

### Prerequisites:

- Docker, Docker-compose, Docker swarm
- Initialised swarm, with the relevant machines already participating to the swarm. It is also possible to have just 1 machine (the Leader node). 
- Optional: Node js, npm, Express js (for back-end), Vue js (for front-end) -> not mandatory, they are fully containerised

### Packages
- _compose_files_ -> Contains the `yaml` stack files used to run the services in Swarm mode (with or without Docker Stack).
- _conf_ -> Contains configuration files and schemas for different services, such as MongoDB and Cassandra
- _server_ -> Contains the server's source code, environment variables

### Services

The current services used:
- server -> customised service which runs the back-end of the application. The server acts as a middle-man between the UI and the database. It sends and receives RESTful requests, as well as WebSocket messages.
- ui -> customised service which runs the front-end of the applicatin. The UI consists of a single page applicatin (SPA), which contains multiple components that are dynamically updated based on the current functionality.
- mongodb -> there are several MongoDB services, including a seed node (Primary), secondary nodes and an arbiter. These nodes are run in a replicated manner.
- cassandra -> there are serveral Cassandra services, each having its own attached volume.
  - cqlsh -> Cassandra helper script, using to perform schema migration.

### Scripts

There are several scripts used in the development and deployment of the application.

- `build.sh` -> build the docker images for the server and UI
- `clean.sh` -> removes the project's running containers and volumes
- `init.sh` -> creates the bridge and overlay networks, creates the volumes, adds data to volumes, creates the `.env` files for the UI and the server.
- `migrate-schema-cassandra.sh [-a] [-o]` done only once for schema migration for the current locations of the users. Runs the CQLSH service, which runs the CQLSH command inside the cassandra-seed node, migrating the schema added to the relevant volume
  - `migrate-schema-cassandra.sh -a` to also populate it with historical data (in normal mode, i.e. non-Swarm).
  - `migrate-schema-cassandra.sh -a -o` to also populate it with historical data in when running in Overlay network (Swarm mode).
- `migrate-schema-mongodb.sh` done only once for schema migration and initial data population of the employees information. This loads the files containing the current data added to the relevant volume.
- `run.sh` deploys the stacks with the services for the ui, server, mongodb and cassandra
- `stackLogs.sh <STACK-NAME>` -> provides real-time logs of a specified stack name. This works similar to `docker service logs <SERVICE-NAME>`, but for a complete collection of services inside a stack.

### Deployment and Fault tolerance

The application can be run locally by starting the services using `docker-compose up` command from the main docker-compose file, or using the `run.sh` script, which runs a series of `docker stack deploy` commands to run the services in a replicated, distributed manner, based on the number of nodes connected to the swarm.






## Features - technicals details





## Technology and tools selection

Docker containers are used to containerize the application and allow it to run in a distributed environment.

The UI was developed in Vue.js. Vue is a modern, component-based Javascript framwork used to build rich and highly responsive web applications. This was selected over Angular due to it being more lightweight, thus the learning curve is much smaller.

The back-end was developed in Express.js. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era. This is used to store employee's information, whether he/she is also a drivers, as well as login information.

Cassandra is a highly-scalable timeseries DB. This is used to store the real-time locations of the employees/drivers on their route from the start-point to the end-point.


## Lunching the application

Both the _server_ and the _ui_ require `.env` files. Make sure they exist in their respective folders. Default env files are provided, named `default.env`. These can be copied/renamed into the required `.env` files.
_NOTE:_ These files are created automatically after running the `init.sh` script.

Open any browser and type in `localhost:8080` to navigate to the application's page.

### Enpoints

- localhost:8080 -> Main application page
- localhost:5050 -> Server's page



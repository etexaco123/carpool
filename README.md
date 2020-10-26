# Web and Cloud Computing 2020


## Overview

The project triest to emulate a car-sharing application that is scoped within a corporation. This is done in order to minimize the parking space required and reduce the car emissions. The core features of the application are: registering of employees into the system (by admin), small chat functionality and the actual driving from the start point to the end point. The application is meant to be run in a distributed manner on multiple machines, but can also be run locally, on a single machine.

The development of this application was meant to be cross-platform. Therefore, every script was designed to be used both in Windows and Unix systems.

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

- Docker, Docker-compose, Docker swarm.
- Initialised swarm, with the relevant machines already participating to the swarm. It is also possible to have just 1 machine (the Leader node).
- Optional: Node js, npm, Express js (for back-end), Vue js (for front-end) -> not mandatory, they are fully containerised.

### Packages
- _compose_files_ -> Contains the `yaml` stack files used to run the services in Swarm mode (with or without Docker Stack).
- _conf_ -> Contains configuration files and schemas for different services, such as MongoDB and Cassandra.
- _server_ -> Contains the server's source code, environment variables and Dockerfile.
- _ui_ -> Contains the UI's source code, environment variables and Dockerfile.
- _utils_ -> Contains utility scripts used for creating volumes and adding data to volumes.
- "docker-compose.yaml" -> Main docker compose file, which contains the services connected via a bridge network to run the application locally.
- (many scripts) -> Described in the "Scripts" sub-section.

### Services

The current services used:
- server -> customised service which runs the back-end of the application. The server acts as a middle-man between the UI and the database. It sends and receives RESTful requests, as well as WebSocket messages.
- ui -> customised service which runs the front-end of the application. The UI consists of a single page application (SPA), which contains multiple components that are dynamically updated based on the current functionality.
- mongodb -> there are several MongoDB services, including a seed node (Primary), secondary nodes and an arbiter. These nodes run in a replicated manner.
- cassandra -> there are serveral Cassandra services, each having its own attached volume.
  - cqlsh -> Cassandra helper script, using to perform schema migration.

### Scripts

There are several scripts used in the development and deployment of the application.

- `build.sh` -> build the docker images for the server and UI.
- `clean.sh` -> removes the project's running containers and volumes.
- `init.sh` -> creates the bridge and overlay networks, creates the volumes, adds data to volumes, creates the `.env` files for the UI and the server.
- `migrate-schema-cassandra.sh [-a] [-o]` done only once for schema migration for the current locations of the users. Runs the CQLSH service, which runs the CQLSH command inside the cassandra-seed node, migrating the schema added to the relevant volume.
  - `migrate-schema-cassandra.sh -a` to also populate it with historical data (in normal mode, i.e. non-Swarm).
  - `migrate-schema-cassandra.sh -a -o` to also populate it with historical data in when running in Overlay network (Swarm mode).
- `migrate-schema-mongodb.sh` done only once for schema migration and initial data population of the employees information. This loads the files containing the current data added to the relevant volume.
- `run.sh` deploys the stacks with the services for the ui, server, mongodb and cassandra.
- `stackLogs.sh <STACK-NAME>` -> provides real-time logs of a specified stack name. This works similar to `docker service logs <SERVICE-NAME>`, but for a complete collection of services inside a stack.

### Deployment, Fault tolerance, Load balancing

The application can be run locally by starting the services using `docker-compose up` command from the main docker-compose file, or using the `run.sh` script, which runs a series of `docker stack deploy` commands to run the services in a replicated, distributed manner, based on the number of nodes connected to the swarm.

The 4 stacks are as follows:
1. cassandras -> contains 3 services, which emulates 3 cassandra containers being run as a cluster. Each service is run using "replication=1". The reason for this choice, as opposed to having just 1 service replicated 3 times is that each cassandra node requires a separate volume. It is therefore easier to manage volumes if there is a pre-defined number of volumes, which are attached 1:1 to a respective container (or service running just 1 container). Of course, if one container goes down, the service can restart it immediately. If a service goes down, the other 2 services can pick up the workload. The services use the base `cassandra:latest` containers.
2. mongos -> contains 4 services, similar to the cassandras. The services are used for running 1 primary node, 2 secondary nodes and 1 arbiter. The 4 services are also run with "replication=1". The only service(s) that can be run with a higher replication factor are the secondary nodes. However, there is an issue with that. The container images used are `docker.io/bitnami/mongodb:4.4-debian-10`, so from Bitnami's wrapper containers. Currently, they do not provide support for higher replication numbers in the replica set configuration. They are still prefered over the base `mongodb:latest`, because they provide an automatic replica set configuration during the initialisation of the containers.
3. servers -> contains 1 service which runs the server with "replication=3". The service exposes the main port (5050), therefore acting like load-balancer. Each interaction between the UI and the server will balance the workload in a round-robin fashion (default).
4. uis -> contains 1 service, which runs the UI with "replication=3". This is the same as the servers.


## Features - technical details

This section describes the application's features. Each sub-section provides relevant technical details, such as asynchronicity, routes used etc.

### Database schemas

The application uses 2 DB's: MongoDB and Cassandra. MongoDB contains 3 schemas, whereas Cassandra contains 1 schema. The primary key used in all databases is the "employee_id".

_NOTE:_ MongoDB does not have the notion of "schema". It uses Collections of documents, which can contain different fields. For simplicity, these collections will also be called "schemas", since the data stored in them is homogeneous.

The 4 schemas are therefore:
- Users -> This MongoDB schema holds the login information, including employee_id, the password and the role of the user (which can be either Normal or Admin). The Admin users enjoy extra functionalities.
- Employees -> This MongoDB schema holds the employees general information, including the employee_id, first_name, last_name, address, job_title, email, age, is_driver. The last field ("is_driver") is a boolean which shows whether the employee is also a driver or not.
- Drivers -> This MongoDB schema holds the driver's details. Drivers are also employees, which can act as the drivers in our system. The entries in this database should match the entries from Employees, whose "is_driver" field was set to `true`. This schema contains the employee_id, first_name, last_name, car_make and car_image_id. The last 2 fields are for the identification of the car: the make of the model and a reference to an image (blob). Future potential implementation may also include other details such as VIN, plate number etc.
- Locations -> This Cassandra schema holds the locations of the employees being driven to work at different timestamps. It contains the following fields: employee_id, current_time, nr_passangers, start_loc_x, start_loc_y, end_loc_x, end_loc_y, curr_loc_x, curr_loc_y. The row key is the employee_id and the column key is the timestamp. Therefore, the primary key is the following `((employee_id), current_time)`. This ensures grouping based on the driver and for each driver, the location is stored based on the timestamp.

More details about the schemas can be found in the "conf/mongodb/mock-data/" for Mongodb and, respectively, "conf/cassandra/schema/" for Cassandra.

### Functionalities and components

The application's core functionalities are (thes are also the tabs shown in the UI:
1. Home (route "/") -> This is the initial component, or what we would like to call it "the landing page". It provides a welcoming message, which is then personalized once the user logs in.
2. Test (route "/test") -> This is dummy component used to test the connection between the UI and the Server, as well as the connection UI - Server - DB. This component sends GET requests to the server, fetching data either directly from the server, or from either database.
3. Login (route "/login") -> This component performs a POST request to the server to log in the user. The loggin in mechanism involves comparing the authentication details (combination of employee_id and password) against the records in the database. If the authentication succeeds, the employee information and, if exist, also the driver information are fetched from the database and sent to the client, which will be used in the other components (e.g. Home, ManageEmployees, Chat etc). If the user has the role "Admin", then an extra functionality is available called "ManageEmployees". After logging in, the user is then redirected to the Home component.
4. ManageEmployees (for Admins only, route "/manageEmployees") -> This component contains forms for the Users, Employees and Drivers. Once they are completed and submitted, a HTTP POST request is sent to the server to save data to the Mongodb, into the relevant schema.
5. Chat (route "/chat") -> This component connects to the server via WebSockets, thus allowing multiple employees to communicate in a group chat. The employee first needs to connect to the server (the address and name are automatically filled in as default placeholders), then can type messages to the group. The full workflow is described in the next sub-section.
6. Search (route "/search") -> This component determines the optimum route between the start point and the end point.
7. Logout (route "/logout") -> Logs out the user. This is done by sending a GET request to the server. The user is then redirected to the Home component.


### Examples of REST workflow

Two examples can be shown to illustrate the RESTful calls.

_Note:_ `Axios` was used for REST calls. By default, all calls are asynchronous and were implemented using promises (and at times `async/await` syntax). 

- First, the Test component performs a HTTP GET request to the server at various endpoints of the servre, to fetch information. It is therefore possible to retrieve the current users from the database (from server's endpoints "/users", "/employees" or "/drivers") or their location (from server's endpoint "/locations") or simply the current server's time (from server's "/test" enpoint).
- Secondly, adding a user/employee/driver into the database by an Admin user. After the forms are filled in, a POST request is sent to the server with the payload from the inputted fields. There are 3 main forms that can be completed, corresponding with the 3 main MongoDB schemas: users, employees or drivers. Based on their type, the POST request is sent to the relevant server's enpoint (described above), which is then saved into the database.


### Examples of WebSockets workflow

The prime example of the WebSockets implementation is in the Chat functionality. The workflow is as follows:
- the user connects to the server by specifying the address and the name (both fields are automatically filled in as default placeholders, but the user has the possibility to change them. The server receives the incoming connection and, if it is a new one, attaches it to the current list of connections.
- the user then types in a message which is being sent to the server.
- once the server receives a message from a user, the server broadcasts the message to all connected users.
- the broadcasted message appears on the Message Window of each user in real-time, thus emulating a group communication.


## Technology and tools selection

Docker containers are used to containerize the application and allow it to run in a distributed environment.

The UI was developed in Vue.js. Vue is a modern, component-based Javascript framework used to build rich and highly responsive web applications. This was selected over Angular due to it being more lightweight, thus the learning curve is much smaller.

The back-end was developed in Express.js. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era. This is used to store employee's information, whether he/she is also a driver, as well as login information.

Cassandra is a highly-scalable timeseries DB. This is used to store the real-time locations of the employees/drivers on their route from the start-point to the end-point.


## Launching the application

Both the _server_ and the _ui_ require `.env` files. Make sure they exist in their respective folders. Default env files are provided, named `default.env`. These can be copied/renamed into the required `.env` files.
_NOTE:_ These files are created automatically after running the `init.sh` script.

Open any browser and type in `localhost:8080` to navigate to the application's page.

### Enpoints

- localhost:8080 -> Main application page
  - "/" -> route to the Home component
  - "/test" -> route to the Test component
  - "/login" -> route to the Login component
  - "/manageEmployees" -> route to the ManageEmployees component
  - "/chat" -> route to the Chat component
  - "/search" -> route to the Search component
  - "/logout" -> route to the Logout component
- localhost:5050 -> Server's page



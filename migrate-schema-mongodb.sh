#!/bin/bash

# Exec into the mongo-seed container to populate it with mock data
# The solution was adapted to fit both simple docker-compose and Docker Stack with Swarm

# Users
docker exec -it $(docker ps -qf name=mongodb-seed) mongo -u root -p rootpass mock-data/Users.js
# Employees
docker exec -it $(docker ps -qf name=mongodb-seed) mongo -u root -p rootpass mock-data/Employees.js
# Drivers
docker exec -it $(docker ps -qf name=mongodb-seed) mongo -u root -p rootpass mock-data/Drivers.js

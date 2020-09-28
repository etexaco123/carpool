#!/bin/bash

# Create the volumes used in docker-compose
docker volume create mongo-schema
docker volume create mongodb-seed-data
docker volume create mongo-historical-data
docker volume create cassandra-schema
docker volume create cassandra-data-seed
docker volume create cassandra-data-1
docker volume create cassandra-data-2
docker volume create cassandra-historical-data
docker volume create kafka-offset
docker volume create redis-data
docker volume create redis-conf

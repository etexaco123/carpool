#!/bin/bash

# Deploy the stack services: first the DB's
docker stack deploy -c ./compose_files/mongo-compose.yaml mongos
docker stack deploy -c ./compose_files/cassandra-compose.yaml cassandras

# Wait a couple of seconds, then deploy the servers and the UI
echo Waiting 10 seconds ...
sleep 10

docker stack deploy -c ./compose_files/server-compose.yaml servers
docker stack deploy -c ./compose_files/ui-compose.yaml uis


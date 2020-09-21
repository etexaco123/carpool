@echo off

:: Create the volumes used in docker-compose
docker volume create cassandra-schema
docker volume create cassandra-data-seed
docker volume create cassandra-data-1
docker volume create cassandra-data-2
docker volume create historical-data
docker volume create kafka-offset
docker volume create redis-data
docker volume create redis-conf
docker volume create mongodb-seed-data

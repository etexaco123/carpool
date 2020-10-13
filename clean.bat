@echo off

:: Kill running containers
docker container kill server mongodb-1 mongodb-2 mongodb-seed ui kafka zookeeper cassandra-1 cassandra-2 cassandra-seed

:: Remove the images
docker rmi -f server bitnami/mongodb mongo ui kafka zookeer cassandra

:: Clean the system and volume
docker system prune -f
docker volume prune -f
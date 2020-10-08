@echo off

# Kill running containers
docker container kill server mongo-seed ui kafka zookeeper cassandra-1 cassandra-2 cassandra-seed

# Clean the system and volume
docker system prune -f
docker volume prune -f
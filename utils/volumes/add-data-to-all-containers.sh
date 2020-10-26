#!/bin/bash

# This computes the relative path of the current folder
# It is needed to access the other script.
MY_DIR=$(dirname $(readlink -f $0))

# Copy the cassandra-migration schema
$MY_DIR/add-data-to-1-container.sh -v cassandra-schema -s $MY_DIR/../../conf/cassandra/schema/.

# Copy the redis configuration file.
$MY_DIR/add-data-to-1-container.sh -v redis-conf -s $MY_DIR/../../conf/redis/.

# Copy the Mongodb schema file.
$MY_DIR/add-data-to-1-container.sh -v mongodb-schema -s $MY_DIR/../../conf/mongodb/schema/.

# Copy the Mongodb mock data files.
$MY_DIR/add-data-to-1-container.sh -v mongodb-mock-data -s $MY_DIR/../../conf/mongodb/mock-data/.

# Copy the Nginx conf.
$MY_DIR/add-data-to-1-container.sh -v nginx-conf -s $MY_DIR/../../conf/nginx/.

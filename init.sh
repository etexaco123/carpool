#!/bin/bash

# This computes the relative path of the current folder
# It is needed to access the other script.
MY_DIR=$(dirname $(readlink -f $0))

# Create the network
docker network create wacc-network
docker network create --driver overlay --attachable wacc-network-overlay

# Create the volumes
$MY_DIR/utils/volumes/create-volumes.sh

# Migrate the data
$MY_DIR/utils/volumes/add-data-to-all-containers.sh

:: Create the .env files
cp $MY_DIR/server/default.env $MY_DIR/server/.env
cp $MY_DIR/ui/default.env $MY_DIR/ui/.env

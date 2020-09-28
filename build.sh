#!/bin/bash

# This computes the relative path of the current folder
# It is needed to access the other script.
MY_DIR=$(dirname $(readlink -f $0))

# Create the docker images
cd $MY_DIR/server
docker build -t server .

cd $MY_DIR/ui
docker build -t ui .



#!/bin/bash

# This computes the relative path of the current folder
# It is needed to access the other script.
MY_DIR=$(dirname $(readlink -f $0))

# Create the volumes
$MY_DIR/utils/volumes/create-volumes.sh

# Migrate the data
$MY_DIR/utils/volumes/add-data-to-all-containers.sh

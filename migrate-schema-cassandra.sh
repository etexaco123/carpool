#!/bin/bash

# This computes the relative path of the current folder
# It is needed to access the other script.
MY_DIR=$(dirname $(readlink -f $0))

# Check if the migration flag ( -a ) is present.
populate='false'
while getopts "a" flag
do
   case "$flag" in
      a ) populate='true' ;;
   esac
done

docker-compose -f $MY_DIR/docker-compose.yaml run cqlsh -f /schema/wacc.cql

# Populate the table with existing dummy data.
if [ "$populate" = true ]
then
    docker-compose -f $MY_DIR/docker-compose.yaml run cqlsh -f schema/mock-data.cql
fi

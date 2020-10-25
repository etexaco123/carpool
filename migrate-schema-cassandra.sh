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
      o ) overlay='true' ;;
   esac
done

COMPOSEFILE=docker-compose.yaml
if [ "$overlay" = true ]
then
  COMPOSEFILE=compose_files/cqsh-compose.yaml
fi

docker-compose -f $MY_DIR/$COMPOSEFILE run cqlsh -f /schema/wacc.cql

# Populate the table with existing dummy data.
if [ "$populate" = true ]
then
    docker-compose -f $MY_DIR/$COMPOSEFILE.yaml run cqlsh -f schema/mock-data.cql
fi

@echo off

:Getops
 if /I "%1" == "-h" goto Help
 if /I "%1" == "-a" set populate=true
 
goto Continue
 
:Help
 echo:
 echo: Usage: migrate-schema.bat [-a]
 echo:   -a optional flag: if set true, the DB's will also be populated with dummy data.
 echo:
 exit 1

::::::::::::::::::::::::::::::::::::::::::::::::::::::;

:Continue

:: Access the helper cqlsh container to migrate the cassandra schema
docker-compose -f docker-compose.yaml run cqlsh -f /schema/wacc.cql

:: Populate DB's
if  %populate% == true (
  docker-compose -f docker-compose.yaml run cqlsh -f schema/mock-data.cql
)
@echo off

:Getops
 if /I "%1" == "-h" goto Help
 if /I "%1" == "-a" set populate=true
 if /I "%2" == "-o" set overlay=true
 
goto Continue
 
:Help
 echo:
 echo: Usage: migrate-schema.bat [-a]
 echo:   -a optional flag: if set true, the DB's will also be populated with dummy data.
 echo:   -o optional flag: if set true, the command will be used from the overlay network.
 echo:
 exit 1

::::::::::::::::::::::::::::::::::::::::::::::::::::::;

:Continue

set COMPOSEFILE=docker-compose.yaml
if %overlay% == true (
  set COMPOSEFILE=compose_files\cqlsh-compose.yaml
)

:: Access the helper cqlsh container to migrate the cassandra schema
docker-compose -f %COMPOSEFILE% run cqlsh -f /schema/wacc.cql

:: Populate DB's
if  %populate% == true (
  docker-compose -f %COMPOSEFILE% run cqlsh -f schema/mock-data.cql
)
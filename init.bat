@echo off

:: Create the network
docker network create wacc-network
docker network create --driver overlay --attachable wacc-network-overlay

:: Create the volumes
call .\utils\volumes\create-volumes.bat

:: Migrate the data
call .\utils\volumes\add-data-to-all-containers.bat


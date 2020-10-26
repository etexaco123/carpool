@echo off

:: Create the network
docker network create wacc-network
docker network create --driver overlay --attachable wacc-network-overlay

:: Create the volumes
call .\utils\volumes\create-volumes.bat

:: Migrate the data
call .\utils\volumes\add-data-to-all-containers.bat

:: Create the .env files
cp .\server\default.env .\server\.env
cp .\ui\default.env .\ui\.env

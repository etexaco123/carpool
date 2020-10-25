@echo off

:: Create the docker images of the server and the UI
docker build -t server:latest server
docker build -t ui:latest ui


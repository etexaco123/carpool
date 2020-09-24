@echo off

:: Build the server
cd server
docker build -t server .

cd ..
cd ui
docker build -t ui .



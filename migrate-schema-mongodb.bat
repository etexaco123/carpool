@echo off

:: Exec into the mongo-seed container to populate it with mock data
:: The solution was adapted to fit both simple docker-compose and Docker Stack with Swarm
for /F "tokens=*" %%i in ('docker ps -qf name^=mongodb-seed') do set mongo-container-id=%%i

:: Users
docker exec -it %mongo-container-id% mongo -u root -p rootpass mock-data/Users.js
:: Employees
docker exec -it %mongo-container-id% mongo -u root -p rootpass mock-data/Employees.js
:: Drivers
docker exec -it %mongo-container-id% mongo -u root -p rootpass mock-data/Drivers.js
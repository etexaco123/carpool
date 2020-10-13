@echo off

:: Exec into the mongo-seed container to populate it with mock data
:: Users
docker exec -it mongodb-seed mongo -u root -p rootpass mock-data/Users.js
:: Employees
docker exec -it mongodb-seed mongo -u root -p rootpass mock-data/Employees.js
:: Drivers
docker exec -it mongodb-seed mongo -u root -p rootpass mock-data/Drivers.js

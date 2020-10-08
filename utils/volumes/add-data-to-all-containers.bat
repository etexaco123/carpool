@echo off

:: Copy the cassandra-migration schema
call .\utils\volumes\add-data-to-1-container.bat -v cassandra-schema -s .\conf\cassandra\schema\.

:: Copy the redis configuration file.
call .\utils\volumes\add-data-to-1-container.bat -v redis-conf -s .\conf\redis\.

:: Copy the Mongodb schema file.
call .\utils\volumes\add-data-to-1-container.bat -v mongo-schema -s .\conf\mongodb\schema\.

:: Copy the Mongodb mock data files.
call .\utils\volumes\add-data-to-1-container.bat -v mongo-mock-data -s .\conf\mongodb\mock-data\.

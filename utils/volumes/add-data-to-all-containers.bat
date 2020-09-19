:: Copy the cassandra-migration schema
.\utils\volumes\add-data-to-1-container.bat -v cassandra-schema -s .\conf\cassandra\schema\.

:: Copy the redis configuration file.
.\utils\volumes\add-data-to-1-container.bat -v redis-conf -s .\conf\redis\.

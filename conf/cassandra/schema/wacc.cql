DROP KEYSPACE IF EXISTS wacc;

CREATE KEYSPACE wacc WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'}  AND durable_writes = true;


CREATE TABLE wacc.employees (
    employee_id text,
    name text,
    address text,
    birthday timestamp,
    job text,
    battery_level double,
    time_left double,
    PRIMARY KEY ((employee_id), name)
);

CREATE TABLE wacc.drivers (
    employee_id text,
    car_make text,
    address text
    
    PRIMARY KEY (employee_id)
);

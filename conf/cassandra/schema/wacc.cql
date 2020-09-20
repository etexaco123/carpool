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
    driver_id text,
    employee_id text,
    car_make text,
    address text,
    max_passengers decimal,

    PRIMARY KEY (driver_id)
);

CREATE TABLE wacc.locations (
    driver_id text,
    current_time timestamp,
    nr_passengers decimal,
    max_passengers decimal,
    X_location double,
    Y_location double,

    PRIMARY KEY ((driver_id), current_time)
);
    
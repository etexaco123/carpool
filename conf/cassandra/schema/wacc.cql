DROP KEYSPACE IF EXISTS wacc;

CREATE KEYSPACE wacc WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'}  AND durable_writes = true;

CREATE TABLE wacc.locations (
    employee_id text,
    current_time timestamp,
    nr_passengers decimal,
    max_passengers decimal,
    start_loc_x double,
    start_loc_y double,
    end_loc_x double,
    end_loc_y double,
    curr_loc_x double,
    curr_loc_y double,

    PRIMARY KEY ((employee_id), current_time)
);
    
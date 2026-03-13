#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE fitness_users;
    CREATE DATABASE fitness_workouts;
    GRANT ALL PRIVILEGES ON DATABASE fitness_users TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE fitness_workouts TO $POSTGRES_USER;
EOSQL

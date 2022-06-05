#!/bin/bash


psql -d postgres -f ./postgres-setup.sql --echo-all -p 5432

# export NODE_ENV='test'
# npm install
exit 0

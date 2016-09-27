#!/bin/bash


psql -d postgres -f ./postgres-setup.sql --echo-all

export NODE_ENV = 'test'

npm install
npm test

exit 0

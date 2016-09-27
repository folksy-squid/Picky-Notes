#!/bin/bash

psql -d postgres -f ./postgres-setup.sql --echo-all

npm install
npm test

exit 0

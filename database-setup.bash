#!/bin/bash

psql -d postgres -f ./postgres-setup.sql --echo-all

exit 0

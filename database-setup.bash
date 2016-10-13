#!/bin/bash


psql -d postgres -f ./postgres-setup.sql --echo-all

export NODE_ENV='test'
npm install
npm uninstall lame
npm install node-gyp
npm install lame
exit 0

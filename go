#!/bin/bash

setup() {
  echo "Setting up app"
  npm install

  if [ ! -d ./data ]; then
    echo "Setting up path for mongo"
    mkdir data && mkdir data/db
    node_modules/babel/bin/babel-node.js setup.js
  fi

  echo "Setup Done!"
}

client() {
  echo "Starting client"
  webpack
  webpack-dev-server --port 8081
}

server() {
  key="$1"
  if [ $key == '-d' ] || [ $key == '--debug' ]
  then
    echo "Starting server - debug mode"
    node_modules/iron-node/bin/run.js debug.js
  else
    echo "Starting server"
    npm run watch
  fi
}

mongo() {
  echo "Starting mongo"
  mongod --dbpath ./data/db/
}

seed() {
  echo "Seeding database"
  node_modules/babel/bin/babel-node.js server/seed.js
}

if [ "$(type -t "$1")" == "function" ]; then
  "$@"
else
  echo "Command does not exist"
fi

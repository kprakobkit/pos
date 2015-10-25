#!/bin/bash

setup() {
  echo "Setting up app"
  npm install
}

client() {
  echo "Starting client"
  webpack
  webpack-dev-server --port 8081
}

server() {
  echo "Starting server"
  npm run watch
}

if [ "$(type -t "$1")" == "function" ]; then
  "$@"
else
  echo "Command does not exist"
fi

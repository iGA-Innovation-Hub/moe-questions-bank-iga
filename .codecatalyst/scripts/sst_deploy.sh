#!/usr/bin/env bash
echo "Deploying project"

source ~/.bashrc
nohup dockerd &
docker version
npm install
npm install supports-color
npx sst deploy --stage bank
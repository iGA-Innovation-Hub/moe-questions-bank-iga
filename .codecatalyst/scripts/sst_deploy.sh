#!/usr/bin/env bash
echo "Deploying project"

source ~/.bashrc
nohup dockerd &
docker version
npm install
npm audit fix
npm install supports-color@8.1.1
cd packages/frontend
npm install aws-amplify
cd ..
cd ..
npx sst deploy --stage bank

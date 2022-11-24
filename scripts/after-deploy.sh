#!/bin/bash
REPOSITORY=/home/ubuntu/build-push

cd $REPOSITORY

cd dist

sudo /usr/bin/pm2 del pushScheduler

sudo /usr/bin/pm2 start pushScheduler.js

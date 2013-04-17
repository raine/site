#!/bin/bash
set -x verbose #echo on

rsync \
  --delete-excluded \
  --exclude '.git*' \
  --exclude 'deploy.sh' \
  -va $(pwd) ~/Dropbox/Public

open ~/Dropbox/Public/$(basename `pwd`)

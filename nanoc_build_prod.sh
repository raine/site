#!/bin/bash
export NANOC_ENV=production
nanoc prune --yes && nanoc compile

#!/bin/bash
set -euo pipefail

repo=$1
ref=$2
targetdir=$3

repotmpdir=tmp-githubrepo

mkdir $repotmpdir

cd $repotmpdir

curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
   "https://api.github.com/repos/$repo/zipball/$ref" > repo.zip

unzip repo.zip
rm repo.zip
mv * ../"$targetdir"
cd ..
rmdir $repotmpdir

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
   "https://api.github.com/repos/$repo/tarball/$ref" > repo.tar

tar -xf repo.tar
rm repo.tar
mv * ../"$targetdir"
cd ..
rmdir $repotmpdir

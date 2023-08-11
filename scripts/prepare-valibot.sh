#!/bin/bash
set -euo pipefail
repo=$1
ref=$2

tmpdirname=tmp-valibotdir
./scripts/download-github-repo.sh "$repo" "$ref" "$tmpdirname"
cd "$tmpdirname"
pnpm i
cd library
pnpm build

cd ../../
mv "$tmpdirname"/library/ "libs/valibot@$ref"
rm -rf "$tmpdirname"

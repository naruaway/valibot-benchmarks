#!/bin/bash
set -euo pipefail
repo=$1
ref=$2

tmpdirname=tmp-valibotdir
./scripts/download-github-repo.sh "$repo" "$ref" "$tmpdirname"
cd "$tmpdirname"
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm i
cd library
pnpm build

cd ../../
mv "$tmpdirname"/library/ "libs/valibot@$ref"
rm -rf "$tmpdirname"

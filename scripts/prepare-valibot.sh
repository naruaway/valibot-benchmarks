#!/bin/bash
set -euo pipefail

variantname=myver
tmpdirname=.valibottmprepodir
./scripts/download-github-repo.sh naruaway/valibot main $tmpdirname
cd $tmpdirname 
pnpm i
cd library
pnpm build
mv $tmpdirname/library/ "libs/valibot@$variantname"
rmdir $tmpdirname

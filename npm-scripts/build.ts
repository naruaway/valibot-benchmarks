import { $ } from 'zx'
import { buildForConfig } from '../src/build'
import { loadConfig } from '../src/load_config'

const config = loadConfig()
await $`rm -rf ./dist`
await $`mkdir dist`

await buildForConfig(config)

await $`cp src/main.html dist/index.html`


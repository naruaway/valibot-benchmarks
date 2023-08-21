import { $ } from 'zx'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as v from 'valibot'

const dir = './results-tmp'

fs.mkdirSync(dir, { recursive: true })
const valibotCommit = v.parse(v.string([v.minLength(10)]), process.env['VALIBOT_COMMIT'])

console.log('valibotcommit', valibotCommit)

fs.writeFileSync(path.join(dir, 'myoutput.json'), JSON.stringify({ output: 'hello', valibotCommit }))
//./scripts/prepare-valibot.sh fabian-hiller/valibot d93d461238570a8ddca5f4833bfb202378eecc29
//./scripts/prepare-valibot.sh fabian-hiller/valibot f7dd99388d80c0913bd4bc59698e5c28314c5230
//./scripts/prepare-valibot.sh fabian-hiller/valibot db2714403351b469eed8c8622613af5067db9514


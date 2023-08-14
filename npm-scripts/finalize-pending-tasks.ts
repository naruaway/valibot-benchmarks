import { getPendingValibotCommit } from "../src/util";
import * as path from 'node:path'
import * as fs from 'node:fs'

const valibotCommit = getPendingValibotCommit()
if (!valibotCommit) {
  console.log('there was no pending tasks')
} else {
  fs.unlinkSync(path.join('pending_tasks', `valibot-commit-${valibotCommit}.json`))
}

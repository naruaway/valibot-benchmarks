import * as path from 'node:path'
import * as v from 'valibot'

import * as fs from "node:fs";

const PENDING_TASKS_DIR = './pending_tasks/valibot/commits'
const VALIBOT_COMMIT_OUT_DIR = 'results/valibot/commits'

const TaskInput = v.object({
  type: v.literal('valibot-commit'),
  repo: v.string(),
  commit: v.string(),
})

// TODO: input should be also directory? And the whole input should be copied to output
// rename:
// pending_task -> tasks/input
// pending_task -> tasks/output

type TaskInput = v.Output<typeof TaskInput>

export const getTaskInput = (): TaskInput | undefined => {
  const pendingTaskFiles = fs.readdirSync(PENDING_TASKS_DIR).filter(n => n.endsWith('.json')).sort()
  const pendingTaskFileName = pendingTaskFiles[0]
  if (!pendingTaskFileName) return undefined

  const valibotCommit = pendingTaskFileName.replace(/\.json$/, '')
  const pendingTaskFilePath = path.join(PENDING_TASKS_DIR, pendingTaskFileName)

  const value = v.parse(TaskInput, JSON.parse(fs.readFileSync(pendingTaskFilePath, 'utf-8')))
  if (value.commit !== valibotCommit) {
    throw new Error('commit hash mismatch')
  }
  console.log(`processing ${PENDING_TASKS_DIR}/${pendingTaskFileName}: ${JSON.stringify(value)}`)
  return value
}

export const storeNewTaskInput = (input: TaskInput) => {
  fs.mkdirSync(PENDING_TASKS_DIR, { recursive: true })
  const pendingTaskFilePath = path.join(PENDING_TASKS_DIR, `${input.commit}.json`)

  fs.writeFileSync(
    pendingTaskFilePath,
    JSON.stringify(input),
  );
}

export const isValibotCommitTaskAlreadyRecognized = ({ valibotCommit }: { valibotCommit: string }) => {
  return (
    !fs.existsSync(
      path.join(PENDING_TASKS_DIR, `${valibotCommit}.json`),
    ) && !fs.existsSync(path.join(VALIBOT_COMMIT_OUT_DIR, valibotCommit))
  );
}

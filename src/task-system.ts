import * as path from 'node:path'
import * as v from 'valibot'

import * as fs from "node:fs";

const PENDING_TASKS_DIR = './pending_tasks/valibot/commits'
const VALIBOT_COMMIT_OUT_DIR = 'results/valibot/commits'
const VALIBOT_COMMITS = 'results/valibot-commits.json'

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

export interface NewBenchmarkResult {
  name: string
  scriptSize: Record<string, { raw: number, gzip: number }>
  fixedBenchmarks: Record<string, number>
  runtime: Record<string, {
    schema: Record<string, { data: Record<string, { opsPerSecond: number }> }>
  }>
}

const readBenchmarkResultData = (filePath: string, name: string): NewBenchmarkResult => {
  //    scriptSizes: {
  //   deep: {
  //     'valibot@6adc7d03b91523329c91bf8e71baf72481d009e6': { raw: 2099, gzip: 917 }
  //   },
  //   many_features: {
  //     'valibot@6adc7d03b91523329c91bf8e71baf72481d009e6': { raw: 3470, gzip: 1210 }
  //   },
  //   optional_nullable: {
  //     'valibot@6adc7d03b91523329c91bf8e71baf72481d009e6': { raw: 2955, gzip: 1129 }
  //   },
  //   wide: {
  //     'valibot@6adc7d03b91523329c91bf8e71baf72481d009e6': { raw: 1720, gzip: 814 }
  //   }
  // },

  const data = JSON.parse(
    fs.readFileSync(
      filePath,
      "utf-8",
    ),
  );


  return {
    name,
    meta: data.meta,
    fixedBenchmarks: data.fixedBenchmarks,
    scriptSize: Object.fromEntries(Object.entries(data.scriptSizes).map(([k, v]) => [k, Object.entries(v)[0][1]])),
    runtime: Object.fromEntries(
      Object.entries(data.benchmarkResult).map(([name, { results }]) => [
        name,
        {
          schema:
            Object.fromEntries(
              results.map((r) => [
                r.schemaName,
                { data: Object.fromEntries(r.results.map((a) => [a.dataName, a.results[0]])) }
              ]),
            ),
        }
      ]),
    )
  };

}



export const cleanUpTaskInput = (taskInput: TaskInput) => {
  fs.unlinkSync(path.join(PENDING_TASKS_DIR, taskInput.commit + '.json'))
}

export const storeValibotCommits = (mainCommits: { commit: string }[]) => {
  fs.writeFileSync(VALIBOT_COMMITS, JSON.stringify({ mainCommits }))
}

export const getValibotCommitInfo = (commit: string) => {
  const filePath = path.join(VALIBOT_COMMIT_OUT_DIR, commit, 'linux/result.json')
  if (fs.existsSync(filePath)) {
    return readBenchmarkResultData(filePath, `valibot@${commit}`)
  } else {
    return undefined
  }
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
    fs.existsSync(
      path.join(PENDING_TASKS_DIR, `${valibotCommit}.json`),
    ) || fs.existsSync(path.join(VALIBOT_COMMIT_OUT_DIR, valibotCommit))
  );
}

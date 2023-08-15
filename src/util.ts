import * as os from "node:os";
import { $ } from "zx";

import * as fs from "node:fs";

export const getPendingValibotCommit = (): string | undefined => {
  const pendingTasksDir = './pending_tasks'
  const pendingTaskFiles = fs.readdirSync(pendingTasksDir).filter(n => n.endsWith('.json')).sort()
  if (pendingTaskFiles.length === 0) return undefined

  const pendingTaskFileName = pendingTaskFiles[0]!
  const m = pendingTaskFileName.match(/^valibot-commit-([a-z0-9]+)\.json$/)
  if (!m) throw new Error('invalid filename for pendingTaskFileName: ' + pendingTaskFileName)
  console.log(`processing ${pendingTasksDir}/${pendingTaskFileName}`)
  return m[1]
}
export const detectOsType = (): "linux" | "macos" | "windows" => {
  const osType = os.type();
  if (osType.startsWith("Darwin")) return "macos";
  if (osType.startsWith("Linux")) return "linux";
  if (osType.startsWith("Windows")) return "windows";
  throw new Error(`FIXME: Unknown OS: ${osType}`);
};

export const getMetaData = async () => {
  return {
    os: detectOsType(),
    arch: os.arch(),
    bun: {
      version: (await $`bun --version`).stdout.trim(),
    },
    nodejs: {
      version: (await $`node --version`).stdout.trim(),
    },
    npm: {
      version: (await $`npm --version`).stdout.trim(),
    },
  };
};

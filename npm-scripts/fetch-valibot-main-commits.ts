import * as fs from "node:fs";
import * as path from "node:path";
import { $ } from "zx";

function isValibotCommitNotRecognized(valibotCommit: string): boolean {
  return (
    !fs.existsSync(
      path.join("pending_tasks", `valibot-commit-${valibotCommit}.json`),
    ) && !fs.existsSync(path.join("results/valibot/commits", valibotCommit))
  );
}

/**
 * New enough commit. This is just a random choice
 */
const startCommit = "57dc8532094617a0576982a8d1f63121eaf5f417";

const tmpValibotGitDir = "tmpValibotGitDir";

await $`git -c core.hooksPath=/dev/null clone https://github.com/fabian-hiller/valibot.git ${tmpValibotGitDir}`;

const valibotMainCommits = (
  await $`git -c core.hooksPath=/dev/null -C ${tmpValibotGitDir} log --first-parent --pretty=%H ${startCommit}..main`.quiet()
).stdout
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

fs.rmSync(tmpValibotGitDir, { recursive: true });

const newCommits = valibotMainCommits.filter(isValibotCommitNotRecognized);
for (const newValibotCommit of newCommits) {
  fs.writeFileSync(
    path.join("pending_tasks", `valibot-commit-${newValibotCommit}.json`),
    JSON.stringify({}),
  );
}

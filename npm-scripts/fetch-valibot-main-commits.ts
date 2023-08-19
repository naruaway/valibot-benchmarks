import * as fs from "node:fs";
import { $ } from "zx";
import { isValibotCommitTaskAlreadyRecognized, storeNewTaskInput, storeValibotCommits } from "../src/task-system";

const REPO = 'fabian-hiller/valibot'
/**
 * This is just a random "new enough" commit
 */
const startCommit = "57dc8532094617a0576982a8d1f63121eaf5f417";

const tmpValibotGitDir = "tmpValibotGitDir";

await $`git -c core.hooksPath=/dev/null clone https://github.com/${REPO}.git ${tmpValibotGitDir}`;

const valibotMainCommits = (
  await $`git -c core.hooksPath=/dev/null -C ${tmpValibotGitDir} log --first-parent --pretty=%H ${startCommit}..main`.quiet()
).stdout
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

fs.rmSync(tmpValibotGitDir, { recursive: true });

const newCommits = valibotMainCommits.filter(commit => !isValibotCommitTaskAlreadyRecognized({ valibotCommit: commit }));

storeValibotCommits(valibotMainCommits.map(commit => ({ commit })))

for (const newValibotCommit of newCommits) {
  storeNewTaskInput({
    type: 'valibot-commit',
    repo: REPO,
    commit: newValibotCommit,
  })
}

import { $ } from "zx";
import { match } from "ts-pattern";
import { buildForConfig } from "../src/build";
import type { BenchmarkConfig } from "../src/types";
import { runBenchmarks, } from "../src/runner";
import * as fs from "node:fs";
import * as path from "node:path";
import { detectOsType, getMetaData } from "../src/util";
import { getTaskInput } from "../src/task-system";
import { TEST_DATA } from "../src/test_data";

const valibotCommit = getTaskInput();

if (!valibotCommit) {
  console.log("no pending tasks");
} else {
  const metaData = await getMetaData();

  type Lib =
    | {
      type: "valibot";
      repo?: {
        path: string;
        commit: string;
      };
    }
    | {
      type: "zod";
    };

  const config: { libs: Lib[] } = {
    libs: [
      {
        type: "valibot",
        repo: {
          path: valibotCommit.repo,
          commit: valibotCommit.commit,
        },
      },
    ],
  };

  for (const lib of config.libs) {
    await match(lib)
      .with({ type: "valibot" }, async (l) => {
        if (l.repo) {
          await $`./scripts/prepare-valibot.sh ${l.repo.path} ${l.repo.commit}`;
        }
      })
      .with({ type: "zod" }, async () => { })
      .exhaustive();
  }

  const libs = config.libs.map((lib) =>
    match(lib)
      .with({ type: "valibot" }, (l) =>
        l.repo ? `${l.type}@${l.repo.commit}` : l.type,
      )
      .with({ type: "zod" }, (l) => l.type)
      .exhaustive(),
  );

  const benchmarkConfig: BenchmarkConfig = {
    libs,

    durationMs: 1000,
    iterationsCount: 100,

    runners: ["nodejs", "bun"],
  };

  await buildForConfig(benchmarkConfig);

  const benchmarkResult = await runBenchmarks(benchmarkConfig);

  const resultsDir = path.join(
    "./results-tmp/valibot/commits",
    valibotCommit.commit,
    detectOsType(),
  );

  fs.mkdirSync(resultsDir, { recursive: true });

  fs.writeFileSync(
    path.join(resultsDir, "result.json"),
    JSON.stringify(benchmarkResult),
  );
}

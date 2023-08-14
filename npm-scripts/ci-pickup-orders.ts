import { $ } from "zx";
import { match } from "ts-pattern";
import { assertNonNull, buildForConfig } from "../src/build";
import type { BenchmarkConfig } from "../src/types";
import { runBenchmarks, runFixedBenchmarks } from "../src/runner";
import * as fs from "node:fs";
import * as path from "node:path";
import { detectOsType, getMetaData } from "../src/util";

const metaData = await getMetaData();
const valibotCommit = "ea4e6f39dce43cfc49eb542b1b200fb5a904b1ae";
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
    // {
    //   type: "valibot",
    // },
    {
      type: "valibot",
      repo: {
        path: "fabian-hiller/valibot",
        commit: valibotCommit,
      },
    },
    // { type: "zod" },
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

  durationMs: 100,
  iterationsCount: 2,

  runners: ["nodejs", "bun"],
};

await buildForConfig(benchmarkConfig);

const fixedBenchmarks = runFixedBenchmarks(["nodejs", "bun"], 2);
const benchmarkResult = await runBenchmarks(benchmarkConfig);
console.dir({ fixedBenchmarks, benchmarkResult }, { depth: null });

const resultsDir = path.join(
  "./results-tmp/valibot/commits",
  valibotCommit,
  detectOsType(),
);
fs.mkdirSync(resultsDir, { recursive: true });
fs.writeFileSync(
  path.join(resultsDir, "result.json"),
  JSON.stringify({
    fixedBenchmarks,
    benchmarkResult,
    meta: metaData,
  }),
);

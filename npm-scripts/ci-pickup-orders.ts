import { $ } from "zx";
import { match } from "ts-pattern";
import { assertNonNull, buildForConfig } from "../src/build";
import type { BenchmarkConfig } from "../src/types";
import { runBenchmarks } from "../src/runner";

type Lib =
  | {
    type: "valibot";
    repo: string;
    commit: string;
  }
  | {
    type: "zod";
  };
const config = {
  libs: [
    {
      type: "valibot",
      repo: "fabian-hiller/valibot",
      commit: "27278fe99be29dfa96fe950b126ad7fca54218d5",
    },
    {
      type: "valibot",
      repo: "fabian-hiller/valibot",
      commit: "dbb3df06866387b1ca85df64a3bcab9151c6a31f",
    },
    { type: "zod" },
  ],
} satisfies {
  libs: Lib[];
};

for (const lib of config.libs) {
  await match(lib)
    .with({ type: "valibot" }, async (l) => {
      await $`./scripts/prepare-valibot.sh ${l.repo} ${l.commit}`;
    })
    .with({ type: "zod" }, async () => { })
    .exhaustive();
}

const libs = config.libs.map((lib) =>
  match(lib)
    .with({ type: "valibot" }, (l) => `${l.type}@${l.commit}`)
    .with({ type: "zod" }, (l) => l.type)
    .exhaustive(),
);

const benchmarkConfig: BenchmarkConfig = {
  libs,
  baseline: assertNonNull(libs[0]),
  target: assertNonNull(libs[1]),

  durationMs: 100,
  iterationsCount: 100,

  runners: ["nodejs", "bun"],
}

await buildForConfig(benchmarkConfig);

await runBenchmarks(benchmarkConfig)

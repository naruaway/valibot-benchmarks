import { $ } from 'zx'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as v from 'valibot'
import { match } from 'ts-pattern'
import type { BenchmarkConfig } from '../src/types'
import { buildForConfig } from '../src/build'
import { runBenchmarks } from '../src/runner'

const dir = './results-tmp'

fs.mkdirSync(dir, { recursive: true })

//./scripts/prepare-valibot.sh fabian-hiller/valibot d93d461238570a8ddca5f4833bfb202378eecc29
//./scripts/prepare-valibot.sh fabian-hiller/valibot f7dd99388d80c0913bd4bc59698e5c28314c5230
//./scripts/prepare-valibot.sh fabian-hiller/valibot db2714403351b469eed8c8622613af5067db9514
const valibotCommit = '336bfd24d636e1ce31a28b8cccf79d9d'

console.log('valibotcommit', valibotCommit)

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
        path: 'fabian-hiller/valibot',
        commit: valibotCommit,
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

  durationMs: 200,
  iterationsCount: 100,

  runners: ["nodejs", "bun"],
};

await buildForConfig(benchmarkConfig);

const benchmarkResult = await runBenchmarks(benchmarkConfig);


fs.writeFileSync(
  path.join(dir, "result.json"),
  JSON.stringify({ benchmarkResult, valibotCommit }),
);

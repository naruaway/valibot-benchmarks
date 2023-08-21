import { spawnSync } from "node:child_process";
import {
  TEST_DATA,
  getBenchmarkJsFilePath,
  type Data,
  type Schema,
} from "./test_data";
import type { BenchmarkConfig, BenchmarkResults, RunnerType } from "./types";
import arrayShuffle from "array-shuffle";
import deepmerge from "deepmerge";
import { $ } from "zx";
import * as fs from "node:fs";

const runCmd = (cmd: string, args: string[]) => {
  const ret = spawnSync(cmd, args, {
    encoding: "utf-8",
    env: { ...process.env, NODE_ENV: "production" },
  });
  if (ret.status !== 0) {
    console.error(ret);
    throw new Error("Runner failure");
  }
  return JSON.parse(ret.stdout.trim());
};

const assertNonNull = <T>(x: T | null | undefined): T => {
  if (x == undefined) throw new Error("assertNonNull failed");
  return x;
};

interface Runner {
  run: (benchmarkJsFilePath: string) => { opsPerSecond: number };
}
const runners: Record<RunnerType, Runner> = {
  nodejs: {
    run: (benchmarkJsFilePath: string) => {
      return runCmd("node", [benchmarkJsFilePath]);
    },
  },
  bun: {
    run: (benchmarkJsFilePath: string) => {
      return runCmd("bun", [benchmarkJsFilePath]);
    },
  },
  quickjs: {
    run: (benchmarkJsFilePath: string) => {
      return runCmd("qjs", [benchmarkJsFilePath]);
    },
  },
  deno: {
    run: (benchmarkJsFilePath: string) => {
      return runCmd("deno", ["run", benchmarkJsFilePath]);
    },
  },
};
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const mean = (xs: number[]) => sum(xs) / xs.length;
const stddev = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
};
interface BenchmarkStat {
  mean: number;
  stddev: number;
}
const getStats = (xs: number[]): BenchmarkStat => {
  const m = mean(xs);
  const dev = stddev(xs);

  return {
    mean: m,
    stddev: dev,
  };
};

const percentage = (ratio: number): string => `${Math.round(ratio * 100)}%`;

const formatStat = (stat: BenchmarkStat) => {
  return `${Math.round(stat.mean)} ops/s, +- ${percentage(
    stat.stddev / stat.mean,
  )} stddev`;
};

const runBenchmarkWithRunner = (
  config: BenchmarkConfig,
  testDataName: string,
  schemaList: Schema[],
  data: Data,
  runner: Runner,
) => {
  const opsPerSecondListMap: Record<string, number[]> = Object.fromEntries(
    schemaList.map((s) => [s.name, []]),
  );

  for (let i = 0; i < config.iterationsCount; ++i) {
    for (const schema of schemaList) {
      const fp = getBenchmarkJsFilePath(testDataName, { data, schema });
      const result = runner.run(fp);
      assertNonNull(opsPerSecondListMap[schema.name]).push(result.opsPerSecond);
    }
  }
  return Object.fromEntries(
    schemaList.map((s) => [s.name, getStats(opsPerSecondListMap[s.name]!)]),
  );
};

const relativeMetrics = ({
  baseline,
  target,
}: {
  baseline: number;
  target: number;
}): { isFaster: boolean; message: string } => {
  if (target >= baseline) {
    return {
      isFaster: true,
      message: `${percentage((target - baseline) / baseline)} faster`,
    };
  } else {
    return {
      isFaster: false,
      message: `${percentage((baseline - target) / baseline)} slower`,
    };
  }
};

const createMapWithDefaultEmptyArray = <T>() => {
  const map = new Map<string, T[]>();
  return {
    getOrDefault(key: string): T[] {
      let arr = map.get(key);
      if (arr) {
        return arr;
      } else {
        arr = [];
        map.set(key, arr);
        return arr;
      }
    },
    getOrThrow(key: string): T[] {
      let arr = map.get(key);
      if (!arr) throw new Error("item does not exist");
      return arr;
    },
  };
};

interface BenchmarkRet {
  fixed: { opsPerSecond: number };
  lib: Record<string, Record<string, Record<string, { opsPerSecond: number }>>>;
}

const runBenchmark = (
  config: BenchmarkConfig,
  runner: Runner,
): BenchmarkRet => {
  const schemaList = Object.keys(TEST_DATA(config));

  const combinations = schemaList.flatMap((schema) =>
    TEST_DATA(config)[schema].data.flatMap((d) =>
      config.libs.map((lib) => ({
        lib,
        schema,
        data: d.name,
      })),
    ),
  );

  const fixedBenchmarks: number[] = [];
  const resultMap = createMapWithDefaultEmptyArray<number>();

  for (let i = 0; i < 200; i++) {
    for (const combination of arrayShuffle(combinations)) {
      resultMap
        .getOrDefault(JSON.stringify(combination))
        .push(runner.run(getBenchmarkJsFilePath(combination)).opsPerSecond);
      fixedBenchmarks.push(
        runner.run("./resources/fixed-benchmark-script.js").opsPerSecond,
      );
    }
  }

  const fixed = { opsPerSecond: fixedBenchmarks };

  let lib = {};

  for (const combination of combinations) {
    lib = deepmerge(lib, {
      [combination.lib]: {
        [combination.schema]: {
          [combination.data]: {
            opsPerSecond: resultMap.getOrThrow(JSON.stringify(combination)),
          },
        },
      },
    });
  }

  return { fixed, lib };
};

import * as d3 from "d3-array";
import { getMetaData } from "./util";
export const runFixedBenchmarks = (
  runnerList: RunnerType[],
  iterationsCount: number,
): Record<RunnerType, number> => {
  const metrics: Record<string, number[]> = Object.fromEntries(
    runnerList.map((runnerType) => [runnerType, []]),
  );

  for (let i = 0; i < iterationsCount; ++i) {
    for (const runnerType of runnerList) {
      const result = runners[runnerType].run(
        "./resources/fixed-benchmark-script.js",
      );
      metrics[runnerType]!.push(result.opsPerSecond);
    }
  }
  return Object.fromEntries(
    runnerList.map((runnerType) => [
      runnerType,
      d3.median(metrics[runnerType]!)!,
    ]),
  ) as Record<RunnerType, number>;
};

const uniq = (xs: Iterable<string>): string[] => Array.from(new Set(xs)).sort();

const keysToObj = <T>(
  keys: string[],
  mapFn: (key: string) => T,
): Record<string, T> =>
  Object.fromEntries(keys.map((key) => [key, mapFn(key)]));

export const runBenchmarks = async (
  config: BenchmarkConfig,
): Promise<{
  runtime: Record<string, BenchmarkRet>;
  size: Record<string, Record<string, { raw: number; gzip: number }>>;
  meta: unknown;
}> => {
  const startTime = Date.now();
  const resultsPerRunner: Record<string, BenchmarkRet> = {};
  for (const runnerType of config.runners) {
    console.log(`Running benchmarks using ${runnerType}`);
    resultsPerRunner[runnerType] = runBenchmark(config, runners[runnerType]);
  }

  const libList = uniq(
    Object.values(resultsPerRunner).flatMap((m) => Object.keys(m.lib)),
  );
  const schemaList = uniq(
    Object.values(resultsPerRunner).flatMap((m) =>
      Object.values(m.lib).flatMap((x) => Object.keys(x)),
    ),
  );
  console.dir({ libList, schemaList }, { depth: null });

  await $`gzip --keep --best dist/schema/*.js`;

  const size = keysToObj(libList, (lib) =>
    keysToObj(schemaList, (schema) => ({
      raw: fs.statSync(`dist/schema/${schema}__${lib}.js`).size,
      gzip: fs.statSync(`dist/schema/${schema}__${lib}.js.gz`).size,
    })),
  );

  return {
    runtime: resultsPerRunner,
    size,
    meta: await getMetaData({ startTime, endTime: Date.now() }),
  };
};

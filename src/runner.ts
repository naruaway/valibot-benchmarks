import { spawnSync } from "node:child_process";
import {
  TEST_DATA,
  getBenchmarkJsFilePath,
  type Data,
  type Schema,
} from "./test_data";
import type { BenchmarkConfig, BenchmarkResults, RunnerType } from "./types";
import * as fs from "node:fs";
import * as path from "node:path";
import { detectOsType } from "./util";

const runCmd = (cmd: string, args: string[]) => {
  const ret = spawnSync(cmd, args, { encoding: "utf-8", env: { ...process.env, NODE_ENV: 'production' } });
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
      const result = runner.run(
        getBenchmarkJsFilePath(testDataName, { data, schema }),
      );
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

let slowerCount = 0,
  fasterCount = 0;

const runBenchmark = (config: BenchmarkConfig, runner: Runner): BenchmarkResults => {
  const benchmarkResult = Object.fromEntries(
    Object.entries(TEST_DATA(config)).map(([testDataName, testData]) => [
      testDataName,
      Object.fromEntries(
        testData.data.map((data) => [
          data.name,
          runBenchmarkWithRunner(config, testDataName, testData.schema, data, runner),
        ]),
      ),
    ]),
  );

  console.log(
    `Showing the result when running runtime environment (e.g. Node.js) ${config.iterationsCount} times for each:`,
  );
  for (const [testDataName, dataList] of Object.entries(benchmarkResult)) {
    for (const [dataName, results] of Object.entries(dataList)) {
      console.log(`case: "${testDataName}", data: "${dataName}"`);
      const baseline = assertNonNull(results[config.baseline]);
      const target = assertNonNull(results[config.target]);

      const { message, isFaster } = relativeMetrics({
        target: target.mean,
        baseline: baseline.mean,
      });
      if (isFaster) {
        fasterCount++;
      } else {
        slowerCount++;
      }

      console.log(` ${message}`);

      console.log(`  baseline: ${formatStat(baseline)}`);
      console.log(`  target: ${formatStat(target)}`);
    }
  }

  return {
    results: Object.entries(benchmarkResult).map(([schemaName, b]) => ({
      schemaName,
      results: Object.entries(b).map(([dataName, c]) => ({
        dataName,
        results: Object.entries(c).map(([libName, ret]) => ({
          libName,
          opsPerSecond: Math.round(ret.mean),
        })),
      })),
    })),
  };
};

export const runBenchmarks = async (config: BenchmarkConfig) => {

  for (const runnerType of config.runners) {
    console.log(`Running benchmarks using ${runnerType}`);
    const result = runBenchmark(config, runners[runnerType]);
    const resultDir = path.join("results", detectOsType());
    fs.mkdirSync(resultDir, { recursive: true });
    fs.writeFileSync(
      path.join(resultDir, runnerType + ".json"),
      JSON.stringify(result),
    );
  }

  console.log(
    `out of ${fasterCount + slowerCount
    } cases, ${fasterCount} cases (${percentage(
      fasterCount / (fasterCount + slowerCount),
    )}) were faster`,
  );
}

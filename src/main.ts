import type { BenchmarkResult, TestCase, Benchmark } from "./types.js";
import { TEST_CASES } from "./testcases.js";
import { createParse } from "./util.js";

const runBenchmark = (testCase: TestCase): BenchmarkResult => {
  const benchmarkResult: BenchmarkResult = {
    schemaName: testCase.name,
    results: [],
  };
  const inner = (onlyValidation: boolean) => {
    for (const data of testCase.data) {
      const resultsPerData: BenchmarkResult["results"][number]["results"][number][] =
        [];
      for (const [libName, schema] of Object.entries(testCase.schema)) {
        const run = createParse(schema);
        const start = performance.now();
        const opsPerSecond: number | undefined = (() => {
          for (let i = 0; ; ++i) {
            const ret = run(data.data);

            if (onlyValidation) {
              if (ret.success !== data.expected.success) {
                throw new Error(
                  `schema definition or data might have a bug for "${testCase.name} ${libName}"`,
                );
              }
              if (!ret.success && !data.expected.success) {
                if (ret.error.issues.length !== data.expected.issuesCount) {
                  throw new Error(
                    `schema definition or data might have a bug for "${testCase.name} ${libName}: expected errors count is different from actual. Actual: ${ret.error.issues.length}, Expected: ${data.expected.issuesCount}"`,
                  );
                }
              }
              return 0;
            }

            const elapsedTime = performance.now() - start;
            if (elapsedTime > 5000) {
              return Math.floor(i / (elapsedTime / 1000));
            }
          }
        })();

        if (!onlyValidation) {
          resultsPerData.push({
            libName,
            opsPerSecond,
          });
        }
      }
      if (!onlyValidation) {
        benchmarkResult.results.push({
          dataName: data.name,
          results: resultsPerData,
        });
      }
    }
  };
  inner(true);
  inner(false);
  return benchmarkResult;
};

(globalThis as unknown as { BENCHMARK: Benchmark })["BENCHMARK"] = {
  TEST_CASES,
  runBenchmark,
};

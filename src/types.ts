import type * as z from "zod";
import type * as v from "valibot";

export interface TestCase {
  name: string;
  data: {
    name: string;
    data: unknown;
    expected: { success: true } | { success: false; issuesCount: number };
  }[];
  schema: {
    valibot: v.BaseSchema;
    zod: z.Schema;
  };
}

export interface BenchmarkResults {
  results: BenchmarkResult[];
}

export interface BenchmarkResult {
  schemaName: string;
  results: {
    dataName: string;
    results: {
      libName: string;
      opsPerSecond: number;
    }[];
  }[];
}

export interface Benchmark {
  TEST_CASES: TestCase[];
  runBenchmark: (testCase: TestCase) => BenchmarkResult;
}

export type RunnerType = "nodejs" | "bun" | "deno" | "quickjs";

export interface BenchmarkConfig {
  libs: string[];
  durationMs: number;
  iterationsCount: number;
  runners: RunnerType[];
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

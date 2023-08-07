import "../../dist/main.js";
import * as fs from "node:fs";

/** @type {import('../types.js').Benchmark} */
const BENCHMARK = globalThis.BENCHMARK;

const results = BENCHMARK.TEST_CASES.map(BENCHMARK.runBenchmark);

/** @type {string|undefined} */
const outputFileName =
  typeof Deno !== "undefined" ? Deno.args[0] : process.argv[2];


/** @type {import('../types.js').BenchmarkResults} */
const benchmarkResults = {
  results
}
if (outputFileName) {
  fs.writeFileSync(outputFileName, JSON.stringify(benchmarkResults));
}

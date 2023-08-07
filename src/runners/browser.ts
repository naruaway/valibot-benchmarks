import { firefox } from "playwright";
import * as v from "valibot";
import type { Benchmark, BenchmarkResults } from "../types";

const port = v.transform(v.string(), Number).parse(process.argv[2]);

const browser = await firefox.launch({ headless: false });

const page = await browser.newPage();
await page.goto(`http://localhost:${String(port)}`);
const results = await page.evaluate(() => {
  const { BENCHMARK } = globalThis as unknown as { BENCHMARK: Benchmark };
  return BENCHMARK.TEST_CASES.map(BENCHMARK.runBenchmark);
});

const benchmarkResults: BenchmarkResults = {
  results,
};

console.log(JSON.stringify(benchmarkResults));

await browser.close();

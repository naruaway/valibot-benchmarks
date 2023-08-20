import { loadConfig } from "../src/load_config";
import { runBenchmarks } from "../src/runner";
import * as fs from 'node:fs'

const config = loadConfig()
const benchmarkResult = await runBenchmarks(config);
console.dir(benchmarkResult, { depth: null })

fs.writeFileSync('bench-output.json', JSON.stringify(benchmarkResult))

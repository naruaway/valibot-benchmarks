import type { BenchmarkConfig } from "./src/types";

export default {
  // List of libraries to run benchmarks for. It will search inside ./libs directory first before looking into node_modules.
  // You can use `@` to specify variants of libraries like `valibot@with-my-some-change`
  libs: ["valibot", "zod"],
  target: "valibot",
  baseline: "zod",
  durationMs: 100,
  iterationsCount: 100,

  runners: ["nodejs", "bun", "deno"],
} satisfies BenchmarkConfig;

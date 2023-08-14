import type { BenchmarkConfig } from "./src/types";

export default {
  /*
   * List of libraries to run benchmarks for. It will search inside ./libs directory first before looking into node_modules.
   * You can use `@` to specify variants of libraries like `valibot@with-my-some-change`.
   * For example, if you want to compare different version of valibot, you can configure like the following:
   *   libs: ["valibot@before", "valibot@after"],
   *   baseline: "valibot@before"
   *   target: "valibot@after"
   * Then you need to put locally built version of valibot into `./libs/valibot@before` and `./libs/valibot@after` respectively.
   */
  libs: ["valibot", "zod"],
  baseline: "zod",
  target: "valibot",

  durationMs: 100,
  iterationsCount: 100,

  runners: ["nodejs", "bun", "deno"],
} satisfies BenchmarkConfig;

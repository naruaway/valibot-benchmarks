import webpack from "webpack";
import { minify } from "terser";
import * as fs from "node:fs";
import * as path from "node:path";
import { TEST_DATA, getBenchmarkJsFilePath, isValibot } from "./test_data.js";
import type { BenchmarkConfig } from "./types.js";

const minifyJsFile = async (filePath: string) => {
  const result = await minify(fs.readFileSync(filePath, "utf-8"));
  if (typeof result.code !== "string") throw new Error("Terser error");
  fs.writeFileSync(filePath, result.code);
};

export const assertNonNull = <T>(x: T | null | undefined): T => {
  if (x == undefined) throw new Error("assertNonNull failed");
  return x;
};

const runWebpack = (
  webpackConfig: webpack.Configuration,
): Promise<webpack.Stats> =>
  new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      if (!stats) {
        reject(new Error("webpack stats is invalid"));
        return;
      }
      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
        reject(new Error("webpack error"));
        return;
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
      resolve(stats);
    });
  });

const build = async (options: {
  libName?: string;
  name: string;
  outputDir: string;
  entry: string;
}) => {
  const stats = await runWebpack({
    mode: "production",
    entry: { [options.name]: options.entry },
    output: {
      path: options.outputDir,
    },
    optimization: {
      minimize: false,
    },
    resolve: {
      modules: [path.resolve("libs"), "node_modules"],
      alias: {
        ...(options.libName && {
          [assertNonNull(options.libName.split("@")[0])]: options.libName,
        }),
      },
      extensionAlias: {
        ".js": [".ts", ".js"],
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        },
      ],
    },
  });
  for (const assetName of Object.keys(stats.compilation.assets)) {
    if (!assetName.endsWith(".js")) {
      throw new Error("Non JS output asset detected: " + assetName);
    }
    await minifyJsFile(path.join(options.outputDir, assetName));
  }
};

const generateBenchmarkJs = (config: BenchmarkConfig): string => {
  return `const safeParse = globalThis.BENCHMARK_VAR_SCHEMA_SAFE_PARSE;
  const data = globalThis.BENCHMARK_VAR_DATA;
  const now = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now();
  const start = now();
  for (let i = 0; ; ++i) {
    const ret = safeParse(data.data);

    // TODO: Remove this logic from here and implement specialized verifier for test data
    if (ret.success !== data.expected.success) {
      throw new Error('mismatch')
    }

    const elapsedTime = now() - start;
    if (elapsedTime > ${String(config.durationMs)}) {
       const result = {opsPerSecond: Math.floor(i / (elapsedTime / 1000))};
       if (globalThis.BENCHMARK_VAR_ON_FINISH) {
         globalThis.BENCHMARK_VAR_ON_FINISH(result);
       } else {
         console.log(JSON.stringify(result));
       }
       break
    }
  }
`;
};

const tmpEntryFilePath = path.resolve("dist/tmp.js");
const writeTmpFile = (data: string): string => {
  fs.writeFileSync(tmpEntryFilePath, data);
  return tmpEntryFilePath;
};

export const buildForConfig = async (config: BenchmarkConfig) => {
  for (const [testDataName, testData] of Object.entries(TEST_DATA(config))) {
    for (const data of testData.data) {
      const tmpFile = writeTmpFile(`
        import data from ${JSON.stringify(data.filePath)};
        globalThis.BENCHMARK_VAR_DATA = data;
    `);
      await build({
        name: testDataName + "__" + data.name,
        entry: tmpFile,
        outputDir: path.resolve("dist/data"),
      });
    }

    for (const schema of testData.schema) {
      const tmpFile = writeTmpFile(`
        ${isValibot(schema) ? "import { safeParse } from 'valibot';" : ""}
        import schema from ${JSON.stringify(schema.filePath)};
        globalThis.BENCHMARK_VAR_SCHEMA_SAFE_PARSE = ${
          isValibot(schema)
            ? "(data) => safeParse(schema, data)"
            : "(data) => schema.safeParse(data)"
        };
    `);
      await build({
        libName: schema.name,
        name: testDataName + "__" + schema.name,
        entry: tmpFile,
        outputDir: path.resolve("dist/schema"),
      });
    }

    for (const data of testData.data) {
      for (const schema of testData.schema) {
        const schemaJsFilePath = path.join(
          "dist/schema",
          testDataName + "__" + schema.name + ".js",
        );
        const dataJsFilePath = path.join(
          "dist/data",
          testDataName + "__" + data.name + ".js",
        );

        const benchmarkJsCode = `"use strict";
      ${fs.readFileSync(schemaJsFilePath, "utf-8")}
      ${fs.readFileSync(dataJsFilePath, "utf-8")}
      ${generateBenchmarkJs(config)}`;
        fs.mkdirSync("dist/benchmark", { recursive: true });
        fs.writeFileSync(
          getBenchmarkJsFilePath(testDataName, { data, schema }),
          benchmarkJsCode,
        );
      }
    }
  }
  fs.unlinkSync(tmpEntryFilePath);
};

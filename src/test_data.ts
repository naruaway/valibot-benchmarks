import * as fs from "node:fs";
import * as path from "node:path";
import type { BenchmarkConfig } from "./types";

const testDataRootDir = path.resolve("test_data");

export interface Schema {
  name: string;
  filePath: string;
}

export interface Data {
  name: string;
  filePath: string;
}

export const isValibot = (schema: Schema): boolean => {
  return schema.name.startsWith("valibot");
};

type TestData = Record<string, { schema: Schema[]; data: Data[] }>;

export const TEST_DATA = (config: BenchmarkConfig): TestData =>
  Object.fromEntries(
    fs.readdirSync(testDataRootDir).map((testDataName) => {
      const testDataDir = path.join(testDataRootDir, testDataName);
      const schemaDir = path.join(testDataDir, "schema");
      const libNames = fs
        .readdirSync(schemaDir)
        .filter((x) => x.endsWith(".ts"))
        .map((x) => x.replace(/\.ts$/, ""));

      const libDefs = libNames.map((libName) => ({
        name: libName,
        filePath: path.join(schemaDir, libName + ".ts"),
      }));
      const findLib = (libName: string) => {
        const found = libDefs.find((d) => libName.startsWith(d.name));
        if (!found) throw new Error("findLib failure");
        return found;
      };

      const dataDir = path.join(testDataDir, "data");

      const dataNames = fs
        .readdirSync(dataDir)
        .filter((x) => x.endsWith(".ts"))
        .map((x) => x.replace(/\.ts$/, ""));

      return [
        testDataName,
        {
          schema: config.libs.map((lib) => ({ ...findLib(lib), name: lib })),
          data: dataNames.map((name) => ({
            name,
            filePath: path.join(dataDir, name + ".ts"),
          })),
        },
      ];
    }),
  );

export const getBenchmarkJsFilePath = (
  testDataName: string,
  { schema, data }: { schema: Schema; data: Data },
): string => {
  return `dist/benchmark/${testDataName}__${data.name}__${schema.name}.js`;
};

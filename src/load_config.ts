import config from "../config.js";
import type { BenchmarkConfig } from "./types.js";

export const loadConfig = (): BenchmarkConfig => {
  if (config.libs.indexOf(config.target) === -1) {
    throw new Error("config.target does not exist in config.libs");
  }
  if (config.libs.indexOf(config.baseline) === -1) {
    throw new Error("config.baseline does not exist in config.libs");
  }
  return config;
};

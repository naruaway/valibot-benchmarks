import * as os from "node:os";
import { $ } from "zx";
import * as path from 'node:path'
import * as v from 'valibot'

import * as fs from "node:fs";

export const detectOsType = (): "linux" | "macos" | "windows" => {
  const osType = os.type();
  if (osType.startsWith("Darwin")) return "macos";
  if (osType.startsWith("Linux")) return "linux";
  if (osType.startsWith("Windows")) return "windows";
  throw new Error(`FIXME: Unknown OS: ${osType}`);
};

export const getMetaData = async () => {
  return {
    os: detectOsType(),
    arch: os.arch(),
    bun: {
      version: (await $`bun --version`).stdout.trim(),
    },
    nodejs: {
      version: (await $`node --version`).stdout.trim(),
    },
    npm: {
      version: (await $`npm --version`).stdout.trim(),
    },
  };
};

// Originally copied from https://github.com/kenchan0130/actions-system-info/blob/fa6e3c44fe5a4d62c5fd1fa589c8a1c898819f2b/src/systemInfo.ts (MIT License)

import os from "os";
import getosWithCb from 'getos'
import { promisify } from 'node:util'
import { assertNonNull } from "./build";

const getos = promisify(getosWithCb)

export type SystemInfo = {
  hostname: string;
  cpu: {
    core: number;
    model: string;
  };
  totalmem: number;
  kernel: {
    release: string;
    version: string;
  };
  name: string;
  platform: string;
  release: string;
};

export const getSystemInfo = async (): Promise<SystemInfo> => {
  const cpus = os.cpus();
  const getosResult = await getos();
  const [name, release] = (() => {
    if (getosResult.os === "linux") {
      return [getosResult.dist, getosResult.release];
    } else if (getosResult.os === "darwin") {
      return ['darwin', 'unknown'];
    } else if (getosResult.os === "win32") {
      return ['win32', 'unknown'];
    } else {
      throw new Error(`${getosResult.os} is not supported.`);
    }
  })();

  return ({
    hostname: os.hostname(),
    cpu: {
      core: cpus.length,
      model: assertNonNull(cpus[0]).model,
    },
    kernel: {
      release: os.release(),
      version: os.version(),
    },
    totalmem: os.totalmem(),
    platform: os.platform(),
    name,
    release,
  });
};

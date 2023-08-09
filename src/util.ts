import * as os from "node:os";

export const detectOsType = (): "linux" | "macos" | "windows" => {
  const osType = os.type();
  if (osType.startsWith("Darwin")) return "macos";
  if (osType.startsWith("Linux")) return "linux";
  if (osType.startsWith("Windows")) return "windows";
  throw new Error(`FIXME: Unknown OS: ${osType}`);
};

import * as fs from "node:fs";
import type { BenchmarkResults, BenchmarkResult } from "../types.js";
import type { ReactNode } from "react";
import * as v from "valibot";
import * as path from "node:path";
import { loadConfig } from "../load_config";

const config = loadConfig();
const formatNumber = (() => {
  const nf = new Intl.NumberFormat("en-US");
  return (n: number) => nf.format(n);
})();

const BenchmarkResultViewForData = ({
  result,
  maxOpsPerSecond,
}: {
  maxOpsPerSecond: number;
  result: BenchmarkResult["results"][number]["results"][number];
}) => {
  const barWidthRatio = result.opsPerSecond / maxOpsPerSecond;
  return (
    <div>
      <div className="h-[2em] relative mx-1 my-2 p-2 flex items-center">
        <div
          className={`absolute ${"bg-neutral-100"} inset-0 h-full pointer-events-none border-2 border-neutral-300 rounded`}
          style={{ width: (100 * barWidthRatio).toFixed(2) + "%" }}
        />
        <div className="relative p-1">
          <span className="font-bold">{result.libName}</span>{" "}
          {formatNumber(result.opsPerSecond)} ops/s
        </div>
      </div>
    </div>
  );
};

const percentage = (ratio: number): string => `${Math.round(ratio * 100)}%`;

const relativeMetrics = ({
  baseline,
  target,
}: {
  baseline: number;
  target: number;
}): { isFaster: boolean; message: string } => {
  if (target >= baseline) {
    return {
      isFaster: true,
      message: `${percentage((target - baseline) / baseline)} faster`,
    };
  } else {
    return {
      isFaster: false,
      message: `${percentage((baseline - target) / baseline)} slower`,
    };
  }
};

const Label = ({
  children,
  bgColorTw,
  colorTw,
  href,
}: {
  children: ReactNode;
  bgColorTw?: string;
  colorTw?: string;
  href?: string;
}) => {
  const className = `${bgColorTw ? bgColorTw : "bg-slate-100"} ${colorTw ?? ""
    } rounded px-2 py-1 mr-2`;
  return href ? (
    <a className={className} href={href}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
};

const getSchemaDefinitionLink = (schemaName: string): string => {
  return `https://github.com/naruaway/valibot-benchmarks/tree/main/test_data/${schemaName}/schema`;
};
const getDataDefinitionLink = (
  schemaName: string,
  dataName: string,
): string => {
  return `https://github.com/naruaway/valibot-benchmarks/tree/main/test_data/${schemaName}/data/${dataName}.ts`;
};

const BenchmarkResultView = ({ result }: { result: BenchmarkResult }) => {
  const maxOpsPerSecond = Math.max(
    ...result.results.flatMap((r) => r.results.map((x) => x.opsPerSecond)),
  );
  return (
    <>
      {result.results.map((r) => {
        const baseline = v
          .number()
          .parse(
            r.results.find((r) => r.libName === config.baseline)?.opsPerSecond,
          );
        const target = v
          .number()
          .parse(
            r.results.find((r) => r.libName === config.target)?.opsPerSecond,
          );

        const metrics = relativeMetrics({ baseline, target });

        return (
          <div className="pl-5 border rounded m-3 p-3">
            <div className="mb-3 flex">
              <Label
                bgColorTw={metrics.isFaster ? "bg-emerald-200" : "bg-rose-200"}
                colorTw={
                  metrics.isFaster ? "text-emerald-600" : "text-rose-600"
                }
              >
                {metrics.message}
              </Label>
              <Label href={getSchemaDefinitionLink(result.schemaName)}>
                schema: "{result.schemaName}"
              </Label>
              <Label
                href={getDataDefinitionLink(result.schemaName, r.dataName)}
              >
                data: "{r.dataName}"
              </Label>
            </div>
            <div className="m-1">
              {r.results.map((s) => (
                <BenchmarkResultViewForData
                  key={s.libName}
                  result={s}
                  maxOpsPerSecond={maxOpsPerSecond}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

const linkTw = "text-blue-600 dark:text-blue-500 hover:underline";

export default function Page() {
  const resultsDir = './results/macos'

  const data: Array<{ name: string; data: BenchmarkResults }> = fs
    .readdirSync(resultsDir)
    .filter((item) => item.endsWith(".json"))
    .map((item) => ({
      name: item.replace(/\.json$/, ""),
      data: JSON.parse(fs.readFileSync(path.join(resultsDir, item), "utf-8")),
    }));

  return (
    <div className="m-10">
      <h1 className="font-bold text-lg">Valibot Benchmarks</h1>
      <p>
        This is an unofficial benchmark suite for{" "}
        <a className={linkTw} href="https://github.com/fabian-hiller/valibot">
          Valibot
        </a>{" "}
        also to compare with competitors such as{" "}
        <a className={linkTw} href="https://github.com/colinhacks/zod">
          Zod
        </a>
        .
      </p>
      <p>
        Please check out{" "}
        <a
          className={linkTw}
          href="https://github.com/naruaway/valibot-benchmarks"
        >
          the GitHub repo
        </a>{" "}
        to see the motivation of this benchmark suite.
      </p>
      <p>
        <strong>
          Do not conclude anything about Valibot performance yet since{" "}
          <a
            className={linkTw}
            href="https://github.com/fabian-hiller/valibot/issues/73"
          >
            we are working on performance improvements actively
          </a>
        </strong>
      </p>
      {data.map((d) => (
        <>
          <div className="font-bold text-lg m-2">{d.name}</div>
          {d.data.results.map((r) => (
            <div key={r.schemaName}>
              <BenchmarkResultView result={r} />
            </div>
          ))}
        </>
      ))}
    </div>
  );
}

export default {
  output: "export",
  basePath: "/valibot-benchmarks",
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    if (config.resolve.extensionAlias) {
      throw new Error("webpack config already has extensionAlias");
    }
    config.resolve.extensionAlias = {
      ".js": [".ts", ".js"],
    };
    return config;
  },
};

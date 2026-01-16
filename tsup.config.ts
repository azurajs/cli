import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },

  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  outDir: "dist",
  minify: false,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  target: "es2020",

  esbuildOptions(options) {
    options.tsconfig = "./tsconfig.build.json";
  },
});

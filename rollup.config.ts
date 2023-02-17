import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "lib/index.cjs.js",
      format: "cjs"
    },
    {
      file: "lib/index.esm.js",
      format: "es"
    }
  ],
  plugins: [typescript(), nodeResolve(), commonjs(), json()]
};

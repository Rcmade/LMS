// import { nextJsConfig } from "@workspace/eslint-config/next-js"

// export default nextJsConfig
import pluginQuery from "@tanstack/eslint-plugin-query";
import { nextJsConfig } from "@workspace/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,

  ...pluginQuery.configs["flat/recommended"], // Adds all recommended TanStack rules
];

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

const withTM = require("next-transpile-modules")([
  // Add "math-helpers" to this array:
  "math-helpers",
]);

/** @type {import("next").NextConfig} */
const config = withTM({});

export default config;

const { defineConfig, globalIgnores } = require("eslint/config");
const vitalsModule = require("eslint-config-next/core-web-vitals");
const typescriptModule = require("eslint-config-next/typescript");
const nextVitals = vitalsModule.default || vitalsModule;
const nextTypeScript = typescriptModule.default || typescriptModule;

module.exports = defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([".next/**", "node_modules/**", "coverage/**", "next-env.d.ts"]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/set-state-in-effect": "off"
    }
  }
]);

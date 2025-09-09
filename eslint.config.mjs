// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
//
// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });
//
// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];
//
// export default eslintConfig;
// eslint.config.mjs
import nextPlugin from "@next/eslint-plugin-next";

export default [
  { ignores: [".next/*", "node_modules/*"] },
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
];

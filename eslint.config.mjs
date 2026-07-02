import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "_next/**",
    "out/**",
    "build/**",
    "about/**",
    "blog/**",
    "images/**",
    "lab/**",
    "lottie/**",
    "lottie-preview/**",
    "personal-blog-lottie-json-only/**",
    "projects/**",
    "resume/**",
    "tools/decap-oauth-worker/**",
    "博客Lab动态WebP素材包/**",
    "博客macOS风格光标与点击效果/**",
    "张颢轩正式博客-剩余图片素材包/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

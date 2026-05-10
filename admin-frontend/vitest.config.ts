import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],

      include: ["src/**/*.{ts,tsx}"],

      exclude: [
        "node_modules/**",
        "src/assets/**",
        "**/*.config.ts",
        "**/*.d.ts",

        "src/App.tsx",
        "src/main.tsx",
        "**/store/**",
        "**/hooks/redux.ts",
        "**/hooks/**",
        "**/slice/**",
        "**/constants/**",
        "**/components/**",
        "src/pages",
        "src/app/**",
        "src/layouts/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

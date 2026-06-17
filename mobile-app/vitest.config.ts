import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/**",
        "src/assets/**",
        "**/*.config.ts",
        "**/*.d.ts",
        "src/lib/utils.ts",
        "src/App.tsx",
        "src/main.tsx",
        "src/index.css",
        "**/store/hook.ts",
        "**/components/ui/**",
        "**/components/layout/**",
        "**/components/FormErrorMessage.tsx",
        "**/components/FormSuccessMessage.tsx",
        "**/components/SubmitButton.tsx",
        "src/pages/**",
        "**/features/**/components/**/*.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

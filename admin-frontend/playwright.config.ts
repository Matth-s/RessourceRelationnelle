import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/__test__/scenarios",

  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },
});

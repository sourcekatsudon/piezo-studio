import { defineConfig } from "@playwright/test";

const projectRoot = __dirname;

export default defineConfig({
  testDir: "./tests",
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    locale: "en-US",
  },
  webServer: {
    command: "pnpm build && pnpm start -p 3000",
    cwd: projectRoot,
    port: 3000,
    reuseExistingServer: true,
    timeout: 120000,
  },
});

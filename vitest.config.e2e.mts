import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      NODE_ENV: "testing",
    },
    globals: true,
    root: "./",
    coverage: {
      provider: "v8",
      reporter: ["lcov", "text", "html", "cobertura", "json"],
      reportsDirectory: "coverage/e2e",
    },
    include: ["test/**/*.e2e-spec.{ts,mts}"],
  },
  plugins: [swc.vite()],
});

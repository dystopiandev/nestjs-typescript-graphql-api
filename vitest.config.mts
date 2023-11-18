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
      reportsDirectory: "coverage/unit",
    },
    include: ["test/**/*.spec.{ts,mts}"],
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});

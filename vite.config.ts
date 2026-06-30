import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiTarget = process.env.VEXA_API_TARGET || process.env.VELA_API_TARGET || "http://127.0.0.1:8798";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true
      }
    }
  }
});

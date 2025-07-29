// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0", // listen on all interfaces (LAN + localhost)
    port: 8080,
    proxy: {
      // Proxy any request starting with /api to your backend
      "/api": {
        target: "http://localhost:5000", // Adjust to your backend URL
        changeOrigin: true,
        secure: false,
        // ★ NO rewrite: keep the /api prefix intact
      },
    },
  },
});

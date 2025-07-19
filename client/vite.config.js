// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // replace with your backend URL/port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

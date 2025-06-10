import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cors from "cors";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cors: {
    origin: ["*"],
  },
});

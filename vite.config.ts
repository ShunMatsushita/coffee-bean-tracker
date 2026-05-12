import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/coffee-bean-tracker/",
  plugins: [react()],
});

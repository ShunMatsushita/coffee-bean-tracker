import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/coffee-bean-tracker/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon.svg"],
      manifest: {
        name: "Coffee Bean Tracker",
        short_name: "CoffeeBeans",
        description: "買ったコーヒー豆を記録するシンプルな Web アプリ",
        lang: "ja",
        start_url: "/coffee-bean-tracker/",
        scope: "/coffee-bean-tracker/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#fafaf9",
        theme_color: "#3e2917",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        navigateFallback: "/coffee-bean-tracker/index.html",
      },
    }),
  ],
});

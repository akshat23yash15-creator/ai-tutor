import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "https://learnai-ml-backend.onrender.com",
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: "https://ai-tutor-mauve-kappa.vercel.app"
        }
      },
      "/health": {
        target: "https://learnai-ml-backend.onrender.com",
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: "https://ai-tutor-mauve-kappa.vercel.app"
        }
      }
    }
  },
  envDir: "./",
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

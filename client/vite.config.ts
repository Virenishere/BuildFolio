import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise the warning threshold — our deps (framer-motion, @react-pdf/renderer)
    // are legitimately large. Real splitting happens via manualChunks below.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — tiny, changes rarely, cache-friendly
          "vendor-react": ["react", "react-dom", "react-router", "react-router-dom"],
          // Framer Motion — large animation lib, versioned separately
          "vendor-motion": ["framer-motion", "motion"],
          // PDF renderer — very large, only needed on download
          "vendor-pdf": ["@react-pdf/renderer"],
          // Radix UI primitives
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-label",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          // Lucide icons
          "vendor-icons": ["lucide-react"],
          // State & networking
          "vendor-state": ["zustand", "axios", "sonner"],
        },
      },
    },
  },
});

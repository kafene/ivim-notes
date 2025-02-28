import { defineConfig } from "vite";
import type { UserConfig } from "vite";
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    build: {
        sourcemap: true,
    },
    server: {
        port: 8300,
        historyApiFallback: true,
    },
}) satisfies UserConfig;

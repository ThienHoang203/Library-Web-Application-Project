import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "node:process";
// https://vite.dev/config/
console.log({ port: process.env.VITE_PORT });

export default defineConfig({
    plugins: [tailwindcss(), react()],
    server: {
        port: 4040,
        open: true
    }
});

import { defineConfig } from "astro/config";

export default defineConfig({
    output: "static",
    site: "https://jasontsemf.github.io",
    build: {
        format: "preserve"
    }
});

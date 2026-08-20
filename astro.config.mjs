import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
    output: "static",
    site: "https://jasontsemf.github.io",
    integrations: [mdx({ smartypants: false })],
    build: {
        format: "preserve"
    }
});

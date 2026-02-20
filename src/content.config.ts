import { defineCollection, z } from "astro:content";

const pages = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        route: z.string(),
        legacySource: z.string(),
        status: z.enum(["legacy-wrapped", "migrated"]).default("legacy-wrapped"),
        summary: z.string().optional()
    })
});

const projects = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        route: z.string(),
        legacySource: z.string(),
        year: z.number().int().optional(),
        status: z.enum(["legacy-wrapped", "migrated"]).default("legacy-wrapped"),
        summary: z.string()
    })
});

export const collections = { pages, projects };

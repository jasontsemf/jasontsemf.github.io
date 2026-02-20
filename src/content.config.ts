import { defineCollection, z } from "astro:content";

const contentStatus = z.enum(["legacy-wrapped", "migrated"]);
const pageKind = z.enum(["canonical", "redirect", "legacy"]);
const navKey = z.enum(["projects", "about", "contact"]);

const slugPattern = /^[a-z0-9-]+$/;
const routePattern = /^\/(?:[a-z0-9-]+\.html)?$/;
const htmlSourcePattern = /^[a-z0-9-]+\.html$/;

const titleSchema = z.string().trim().min(1).max(120);
const summarySchema = z.string().trim().min(10).max(220);
const routeKeySchema = z
    .string()
    .trim()
    .regex(slugPattern, "routeKey must use lowercase letters, numbers, and hyphens only.");
const legacySourceSchema = z
    .string()
    .trim()
    .regex(htmlSourcePattern, "legacySource must match '<name>.html' and stay at the repository root.");
const routeSchema = z
    .string()
    .trim()
    .regex(routePattern, "route must be '/' or '/<slug>.html'.");

const pages = defineCollection({
    type: "content",
    schema: z
        .object({
            title: titleSchema,
            routeKey: routeKeySchema,
            route: routeSchema,
            legacySource: legacySourceSchema,
            kind: pageKind,
            status: contentStatus,
            navKey: navKey.optional(),
            summary: summarySchema
        })
        .superRefine((data, ctx) => {
            const expectedRoute = data.routeKey === "home" ? "/" : `/${data.routeKey}.html`;
            const expectedSource = data.routeKey === "home" ? "index.html" : `${data.routeKey}.html`;

            if (data.route !== expectedRoute) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["route"],
                    message: `route must match slug-derived value '${expectedRoute}'.`
                });
            }

            if (data.legacySource !== expectedSource) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["legacySource"],
                    message: `legacySource must match slug-derived value '${expectedSource}'.`
                });
            }

            if (data.kind === "canonical" && data.status !== "migrated") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["status"],
                    message: "Canonical pages must use status 'migrated'."
                });
            }

            if (data.kind !== "canonical" && data.status !== "legacy-wrapped") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["status"],
                    message: "Non-canonical pages must use status 'legacy-wrapped'."
                });
            }

            if (data.kind !== "canonical" && data.navKey) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["navKey"],
                    message: "Only canonical pages may define navKey."
                });
            }

            if (data.routeKey === "home" && data.navKey) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["navKey"],
                    message: "Home page cannot define navKey."
                });
            }
        })
});

const projects = defineCollection({
    type: "content",
    schema: z
        .object({
            title: titleSchema,
            titleSuffix: titleSchema.optional(),
            routeKey: routeKeySchema,
            route: z
                .string()
                .trim()
                .regex(/^\/[a-z0-9-]+\.html$/, "project route must match '/<slug>.html'."),
            legacySource: legacySourceSchema,
            year: z.number().int().min(2000).max(2100).optional(),
            featured: z.boolean().default(false),
            tags: z.array(z.string().trim().min(1).max(32)).max(12).default([]),
            status: contentStatus,
            summary: summarySchema,
            socialImage: z.string().trim().min(1).max(400).optional(),
            socialDescription: summarySchema.optional(),
            socialCard: z.enum(["summary", "summary_large_image"]).default("summary_large_image"),
            includeCocoenAssets: z.boolean().default(false)
        })
        .superRefine((data, ctx) => {
            const expectedRoute = `/${data.routeKey}.html`;
            const expectedSource = `${data.routeKey}.html`;

            if (data.route !== expectedRoute) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["route"],
                    message: `route must match slug-derived value '${expectedRoute}'.`
                });
            }

            if (data.legacySource !== expectedSource) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["legacySource"],
                    message: `legacySource must match slug-derived value '${expectedSource}'.`
                });
            }

            if (new Set(data.tags).size !== data.tags.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["tags"],
                    message: "tags must be unique."
                });
            }
        })
});

export const collections = { pages, projects };

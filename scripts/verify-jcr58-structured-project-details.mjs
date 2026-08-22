import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const migratedProjectEntries = [
    "optimice",
    "bankheist",
    "binwatch",
    "pbc",
    "tagit",
    "falseawakening",
    "runvendor"
];

const expectedDetailNavigation = new Map([
    ["optimice", ["pbc.html", "projects.html", "bankheist.html"]],
    ["bankheist", ["optimice.html", "projects.html", "binwatch.html"]],
    ["binwatch", ["bankheist.html", "projects.html", "pbc.html"]],
    ["pbc", ["binwatch.html", "projects.html", "optimice.html"]],
    ["tagit", []],
    ["falseawakening", []],
    ["runvendor", []]
]);

function stripFrontmatter(source, filePath) {
    const match = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);

    if (!match) {
        throw new Error(`Unable to parse frontmatter in ${filePath}`);
    }

    return source.slice(match[0].length);
}

async function exists(filePath) {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function verifyMdxAuthoredProjectEntries() {
    const failures = [];
    const rawHtmlPattern = /<(?:div|p|h[1-6]|img|iframe|ul|ol|li|figure|a)(?:\s|>)/i;

    for (const entry of migratedProjectEntries) {
        const filePath = path.join(repoRoot, "src/content/projects", `${entry}.mdx`);
        const legacyMarkdownPath = path.join(repoRoot, "src/content/projects", `${entry}.md`);

        if (!(await exists(filePath))) {
            failures.push(`Authoring regression: missing MDX project entry ${path.relative(repoRoot, filePath)}.`);
            continue;
        }

        const source = await readFile(filePath, "utf8");
        const body = stripFrontmatter(source, filePath).trim();

        if (body.length === 0) {
            failures.push(`Authoring regression: ${path.relative(repoRoot, filePath)} has no project detail body.`);
        }

        const hasMarkdownProse = body
            .split(/\r?\n\s*\r?\n/)
            .some((block) => !/^(?:import\s|<|#|[-*+]\s|\d+\.\s)/.test(block.trim()) && block.trim().length >= 80);
        if (!hasMarkdownProse) {
            failures.push(`Authoring regression: ${path.relative(repoRoot, filePath)} has no normal Markdown prose.`);
        }

        if (rawHtmlPattern.test(body)) {
            failures.push(`Authoring regression: ${path.relative(repoRoot, filePath)} contains raw HTML content tags.`);
        }

        if (await exists(legacyMarkdownPath)) {
            failures.push(`Authoring regression: obsolete entry ${path.relative(repoRoot, legacyMarkdownPath)} still exists.`);
        }
    }

    return failures;
}

async function verifyNoRawHtmlFallback() {
    const failures = [];
    const projectDetailPagePath = path.join(repoRoot, "src/components/ProjectDetailPage.astro");
    const projectRoutePath = path.join(repoRoot, "src/pages/[routeKey].html.astro");
    const [projectDetailPageSource, projectRouteSource] = await Promise.all([
        readFile(projectDetailPagePath, "utf8"),
        readFile(projectRoutePath, "utf8")
    ]);

    if (projectDetailPageSource.includes("set:html")) {
        failures.push("Structured-content regression: src/components/ProjectDetailPage.astro still uses set:html.");
    }

    if (projectRouteSource.includes("project.body") || projectRouteSource.includes("rawBodyHtml")) {
        failures.push("Structured-content regression: src/pages/[routeKey].html.astro still loads raw project body HTML.");
    }

    return failures;
}

async function verifyGenericContentRoute() {
    const failures = [];
    const projectRoutePath = path.join(repoRoot, "src/pages/[routeKey].html.astro");
    const projectRouteSource = await readFile(projectRoutePath, "utf8");

    if (!/import\s*{[^}]*\brender\b[^}]*}\s*from\s*["']astro:content["']/.test(projectRouteSource)) {
        failures.push("Authoring regression: the dynamic project route does not import Astro content rendering.");
    }

    if (!/await\s+render\(project\)/.test(projectRouteSource) || !/<Content\s*\/>/.test(projectRouteSource)) {
        failures.push("Authoring regression: the dynamic project route does not render the collection entry generically.");
    }

    for (const routeKey of migratedProjectEntries) {
        if (projectRouteSource.includes(routeKey)) {
            failures.push(`Authoring regression: the dynamic project route contains project-specific key '${routeKey}'.`);
        }
    }

    const componentDir = path.join(repoRoot, "src/components/project-details");
    const componentFiles = await readdir(componentDir);
    const projectSpecificComponents = componentFiles.filter((fileName) => /DetailContent\.astro$/.test(fileName));
    if (projectSpecificComponents.length > 0) {
        failures.push(
            `Authoring regression: project-specific Astro content components remain: ${projectSpecificComponents.join(", ")}.`
        );
    }

    return failures;
}

async function verifyMdxIntegration() {
    const failures = [];
    const [astroConfigSource, packageSource] = await Promise.all([
        readFile(path.join(repoRoot, "astro.config.mjs"), "utf8"),
        readFile(path.join(repoRoot, "package.json"), "utf8")
    ]);
    const packageJson = JSON.parse(packageSource);

    if (!astroConfigSource.includes("@astrojs/mdx") || !/integrations:\s*\[\s*mdx\(/.test(astroConfigSource)) {
        failures.push("Authoring regression: Astro MDX integration is not enabled.");
    }

    if (!packageJson.devDependencies?.["@astrojs/mdx"] && !packageJson.dependencies?.["@astrojs/mdx"]) {
        failures.push("Authoring regression: @astrojs/mdx is not declared in package.json.");
    }

    return failures;
}

async function verifyBuiltDetailNavigation() {
    const failures = [];

    for (const [routeKey, expectedHrefs] of expectedDetailNavigation) {
        const filePath = path.join(repoRoot, "dist", `${routeKey}.html`);
        const html = await readFile(filePath, "utf8");
        const hasDetailNav = html.includes("work-pagination");

        if (expectedHrefs.length === 0) {
            if (hasDetailNav) {
                failures.push(`Navigation regression: dist/${routeKey}.html unexpectedly renders project pagination.`);
            }
            continue;
        }

        if (!hasDetailNav) {
            failures.push(`Navigation regression: dist/${routeKey}.html is missing project pagination.`);
            continue;
        }

        for (const href of expectedHrefs) {
            if (!html.includes(`href="${href}"`)) {
                failures.push(`Navigation regression: dist/${routeKey}.html is missing href '${href}'.`);
            }
        }

        if (!html.includes('</i> <span>Previous Project</span>')) {
            failures.push(`Navigation regression: dist/${routeKey}.html is missing spacing after the previous arrow.`);
        }

        if (!html.includes('<span>Next Project</span> <i')) {
            failures.push(`Navigation regression: dist/${routeKey}.html is missing spacing before the next arrow.`);
        }
    }

    return failures;
}

const failures = [
    ...(await verifyMdxAuthoredProjectEntries()),
    ...(await verifyNoRawHtmlFallback()),
    ...(await verifyGenericContentRoute()),
    ...(await verifyMdxIntegration()),
    ...(await verifyBuiltDetailNavigation())
];

if (failures.length > 0) {
    console.error("JCR-58 structured project detail verification failed:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log("JCR-58 structured project detail verification passed.");

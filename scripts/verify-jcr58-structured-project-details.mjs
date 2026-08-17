import { readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const migratedProjectEntries = [
    "optimice",
    "bankheist",
    "pbc",
    "tagit",
    "falseawakening",
    "runvendor"
];

const projectDetailComponents = new Map([
    ["optimice", "OptimiceDetailContent"],
    ["bankheist", "BankHeistDetailContent"],
    ["pbc", "PbcDetailContent"],
    ["tagit", "TagItDetailContent"],
    ["falseawakening", "FalseAwakeningDetailContent"],
    ["runvendor", "RunVendorDetailContent"]
]);

const expectedDetailNavigation = new Map([
    ["optimice", ["pbc.html", "projects.html", "bankheist.html"]],
    ["bankheist", ["optimice.html", "projects.html", "binwatch.html"]],
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

async function verifyMetadataOnlyProjectEntries() {
    const failures = [];

    for (const entry of migratedProjectEntries) {
        const filePath = path.join(repoRoot, "src/content/projects", `${entry}.md`);
        const source = await readFile(filePath, "utf8");
        const body = stripFrontmatter(source, filePath).trim();

        if (body.length > 0) {
            failures.push(`Structured-content regression: ${path.relative(repoRoot, filePath)} still contains body markup.`);
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

async function verifyStructuredComponentMapping() {
    const failures = [];
    const projectRoutePath = path.join(repoRoot, "src/pages/[routeKey].html.astro");
    const projectRouteSource = await readFile(projectRoutePath, "utf8");

    for (const [routeKey, componentName] of projectDetailComponents) {
        const componentPath = path.join(repoRoot, "src/components/project-details", `${componentName}.astro`);
        const componentSource = await readFile(componentPath, "utf8");

        if (!projectRouteSource.includes(`import ${componentName} from`)) {
            failures.push(`Structured-content regression: ${componentName} is not imported by the project route.`);
        }

        const routeCasePattern = new RegExp(`case\\s+["']${routeKey}["']:\\s*return\\s+${componentName};`);
        if (!routeCasePattern.test(projectRouteSource)) {
            failures.push(`Structured-content regression: routeKey '${routeKey}' is not mapped to ${componentName}.`);
        }

        if (!componentSource.includes('import ProjectDetailNav from "./ProjectDetailNav.astro"')) {
            failures.push(`Structured-content regression: ${componentName}.astro does not render ProjectDetailNav.`);
        }
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
    ...(await verifyMetadataOnlyProjectEntries()),
    ...(await verifyNoRawHtmlFallback()),
    ...(await verifyStructuredComponentMapping()),
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

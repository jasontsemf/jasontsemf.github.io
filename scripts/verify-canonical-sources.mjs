import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { astroManagedCanonicalRoutes } from "../config/legacy-routes.mjs";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");
const canonicalPages = [
    {
        route: "/",
        source: "src/pages/index.astro",
        removedBaseline: "index.html",
        output: "index.html",
        title: "Jason Tse &mdash; Electrical Design Engineer"
    },
    {
        route: "/projects.html",
        source: "src/pages/projects.html.astro",
        removedBaseline: "projects.html",
        output: "projects.html",
        title: "Jason Tse &mdash; Portfolio"
    },
    {
        route: "/about.html",
        source: "src/pages/about.html.astro",
        removedBaseline: "about.html",
        output: "about.html",
        title: "Jason Tse &mdash; About"
    },
    {
        route: "/contact.html",
        source: "src/pages/contact.html.astro",
        removedBaseline: "contact.html",
        output: "contact.html",
        title: "Jason Tse &mdash; Contact"
    }
];

const forbiddenPageShellTokens = [
    "<html",
    "<head",
    "<body",
    "<SiteHead",
    "<SidebarNav",
    "<SiteScripts",
    'id="jason-aside"',
    'id="jason-main-menu"',
    'class="jason-footer"'
];

async function exists(targetPath) {
    try {
        await access(targetPath);
        return true;
    } catch {
        return false;
    }
}

function countOccurrences(text, token) {
    return text.split(token).length - 1;
}

const failures = [];
const expectedRoutes = canonicalPages.map((page) => page.route);

if (JSON.stringify(astroManagedCanonicalRoutes) !== JSON.stringify(expectedRoutes)) {
    failures.push(
        `Canonical route registry drifted. Expected ${JSON.stringify(expectedRoutes)}, received ${JSON.stringify(astroManagedCanonicalRoutes)}.`
    );
}

for (const page of canonicalPages) {
    const removedBaselinePath = path.join(repoRoot, page.removedBaseline);
    if (await exists(removedBaselinePath)) {
        failures.push(
            `Standalone canonical baseline '${page.removedBaseline}' must not exist; maintain '${page.source}' instead.`
        );
    }

    const source = await readFile(path.join(repoRoot, page.source), "utf8");
    if (!source.includes('import CanonicalLayout from "../layouts/CanonicalLayout.astro";')) {
        failures.push(`${page.source} must import the shared CanonicalLayout.`);
    }
    if (countOccurrences(source, "<CanonicalLayout") !== 1) {
        failures.push(`${page.source} must render exactly one shared CanonicalLayout.`);
    }

    for (const token of forbiddenPageShellTokens) {
        if (source.includes(token)) {
            failures.push(`${page.source} duplicates canonical shell token '${token}'.`);
        }
    }

    const output = await readFile(path.join(distDir, page.output), "utf8");
    const requiredOutputTokens = [
        "<!DOCTYPE html>",
        `<title>${page.title}</title>`,
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        'id="jason-aside"',
        'id="jason-main-menu"',
        'class="jason-footer"',
        'src="js/main.js"'
    ];

    for (const token of requiredOutputTokens) {
        if (!output.includes(token)) {
            failures.push(`Generated ${page.output} is missing canonical contract token '${token}'.`);
        }
    }
}

const canonicalLayout = await readFile(path.join(repoRoot, "src/layouts/CanonicalLayout.astro"), "utf8");
const sharedShellComponents = ["SiteHead", "SidebarNav", "SiteScripts"];
for (const component of sharedShellComponents) {
    if (!canonicalLayout.includes(`import ${component} from`)) {
        failures.push(`CanonicalLayout must import ${component}.`);
    }
    if (countOccurrences(canonicalLayout, `<${component}`) !== 1) {
        failures.push(`CanonicalLayout must render exactly one ${component}.`);
    }
}

if (failures.length > 0) {
    console.error("Canonical source verification failed:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log("Canonical source verification passed.");

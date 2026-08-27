import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import {
    astroManagedProjectRoutes,
    rootLegacyRoutes,
    routeToDistPath
} from "../config/legacy-routes.mjs";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");
const execFileAsync = promisify(execFile);

const removedProjectSources = [
    "optimice.html",
    "bankheist.html",
    "pbc.html",
    "tagit.html",
    "falseawakening.html",
    "runvendor.html",
    "binwatch.html"
];

const retainedHtmlSources = [
    "portfolio.html",
    "work.html",
    "ResizeCounter/index.html",
    "backup/index.html",
    "cocoen/docs/demo-jquery.html",
    "cocoen/docs/demo.html",
    "date/heart.html",
    "date/index.html",
    "keyboardranger/Website/index.html",
    "keyboardranger/game.html",
    "keyboardranger/slider.html",
    "snap/index.html"
].sort();

const expectedRootLegacyRoutes = [
    { route: "/portfolio.html", source: "portfolio.html", type: "redirect" },
    { route: "/work.html", source: "work.html", type: "legacy" }
];

async function exists(targetPath) {
    try {
        await access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function listTrackedHtmlSources() {
    const { stdout } = await execFileAsync("git", ["ls-files", "-z", "--", "*.html"], {
        cwd: repoRoot,
        encoding: "utf8"
    });

    return stdout.split("\0").filter(Boolean).sort();
}

const failures = [];

for (const source of removedProjectSources) {
    if (await exists(path.join(repoRoot, source))) {
        failures.push(`Deprecated Astro-replaced project source must not exist: ${source}`);
    }

    const route = `/${source}`;
    if (!astroManagedProjectRoutes.includes(route)) {
        failures.push(`Removed project source is missing its Astro route registration: ${route}`);
    }
    if (!(await exists(path.join(distDir, routeToDistPath(route))))) {
        failures.push(`Removed project source is missing generated output: dist/${source}`);
    }
}

const actualHtmlSources = await listTrackedHtmlSources();
if (JSON.stringify(actualHtmlSources) !== JSON.stringify(retainedHtmlSources)) {
    failures.push(
        `Static HTML source inventory drifted.\nExpected: ${JSON.stringify(retainedHtmlSources)}\nReceived: ${JSON.stringify(actualHtmlSources)}`
    );
}

if (JSON.stringify(rootLegacyRoutes) !== JSON.stringify(expectedRootLegacyRoutes)) {
    failures.push(
        `Root compatibility route registry drifted.\nExpected: ${JSON.stringify(expectedRootLegacyRoutes)}\nReceived: ${JSON.stringify(rootLegacyRoutes)}`
    );
}

if (failures.length > 0) {
    console.error("Static HTML inventory verification failed:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log(
    `Static HTML inventory verification passed (${removedProjectSources.length} removed project baselines, ${retainedHtmlSources.length} classified exceptions).`
);

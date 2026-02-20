import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import {
    astroManagedCanonicalRoutes,
    copiedRootLegacyRoutes,
    passthroughEntries,
    routeToDistPath
} from "../config/legacy-routes.mjs";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");

async function pathExists(targetPath) {
    try {
        await access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function copyEntry(entry) {
    const sourcePath = path.join(repoRoot, entry.from);
    const destinationPath = path.join(distDir, entry.to);

    if (!(await pathExists(sourcePath))) {
        throw new Error(`Missing source path: ${entry.from}`);
    }

    await rm(destinationPath, { recursive: true, force: true });
    await mkdir(path.dirname(destinationPath), { recursive: true });
    await cp(sourcePath, destinationPath, { recursive: true });
}

async function normalizeAstroCanonicalRoute(route) {
    if (route === "/") {
        return false;
    }

    const canonicalPath = path.join(distDir, routeToDistPath(route));
    const astroHtmlExtensionPath = `${canonicalPath}.html`;

    if (!(await pathExists(astroHtmlExtensionPath))) {
        return false;
    }

    await rm(canonicalPath, { recursive: true, force: true });
    await mkdir(path.dirname(canonicalPath), { recursive: true });
    await cp(astroHtmlExtensionPath, canonicalPath);
    await rm(astroHtmlExtensionPath, { recursive: true, force: true });
    return true;
}

if (!(await pathExists(distDir))) {
    throw new Error("dist directory is missing. Run astro build before copying legacy assets.");
}

let normalizedCanonicalCount = 0;
for (const route of astroManagedCanonicalRoutes) {
    if (await normalizeAstroCanonicalRoute(route)) {
        normalizedCanonicalCount += 1;
    }
}

for (const route of copiedRootLegacyRoutes) {
    const destinationPath = path.join(distDir, routeToDistPath(route.route));
    await rm(destinationPath, { recursive: true, force: true });
    await mkdir(path.dirname(destinationPath), { recursive: true });
    await cp(path.join(repoRoot, route.source), destinationPath);
}

for (const entry of passthroughEntries) {
    await copyEntry(entry);
}

console.log(
    `Normalized ${normalizedCanonicalCount} Astro canonical route(s), copied ${copiedRootLegacyRoutes.length} legacy route file(s), and copied ${passthroughEntries.length} legacy asset path(s) into dist.`
);

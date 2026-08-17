import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");
const siteOrigin = "https://internal-link-check.invalid";
const attributePattern = /\b(?:href|src)\s*=\s*["']([^"'<>]+)["']/gi;
const srcsetPattern = /\bsrcset\s*=\s*["']([^"'<>]+)["']/gi;
const anchorPattern = /\b(?:id|name)\s*=\s*["']([^"'<>]+)["']/gi;

async function walkHtmlFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await walkHtmlFiles(entryPath)));
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            files.push(entryPath);
        }
    }

    return files;
}

function extractReferences(html) {
    const references = [];

    for (const match of html.matchAll(attributePattern)) {
        references.push(match[1]);
    }

    for (const match of html.matchAll(srcsetPattern)) {
        for (const candidate of match[1].split(",")) {
            const [reference] = candidate.trim().split(/\s+/, 1);
            if (reference) {
                references.push(reference);
            }
        }
    }

    return references;
}

function extractAnchors(html) {
    return new Set([...html.matchAll(anchorPattern)].map((match) => match[1]));
}

function resolveInternalReference(sourcePath, reference) {
    const trimmedReference = reference.trim();
    if (
        !trimmedReference ||
        trimmedReference === "#" ||
        /^(?:data|javascript|mailto|tel):/i.test(trimmedReference) ||
        trimmedReference.startsWith("//")
    ) {
        return null;
    }

    const sourceRelativePath = path.relative(distDir, sourcePath).split(path.sep).join("/");
    const sourceUrl = new URL(sourceRelativePath, `${siteOrigin}/`);
    const resolvedUrl = new URL(trimmedReference, sourceUrl);

    if (resolvedUrl.origin !== siteOrigin) {
        return null;
    }

    let decodedPath;
    try {
        decodedPath = decodeURIComponent(resolvedUrl.pathname);
    } catch {
        return { error: `contains invalid URL encoding: ${trimmedReference}` };
    }

    const relativeTargetPath = decodedPath.replace(/^\/+/, "");
    let targetPath = path.resolve(distDir, relativeTargetPath || "index.html");

    if (!targetPath.startsWith(`${distDir}${path.sep}`) && targetPath !== distDir) {
        return { error: `escapes dist/: ${trimmedReference}` };
    }

    if (decodedPath.endsWith("/")) {
        targetPath = path.join(targetPath, "index.html");
    }

    return {
        fragment: resolvedUrl.hash ? decodeURIComponent(resolvedUrl.hash.slice(1)) : "",
        targetPath
    };
}

async function fileExists(filePath) {
    try {
        return (await stat(filePath)).isFile();
    } catch (error) {
        if (error.code === "ENOENT") {
            return false;
        }
        throw error;
    }
}

const htmlFiles = await walkHtmlFiles(distDir);
const failures = [];
const anchorCache = new Map();
let checkedReferences = 0;

for (const sourcePath of htmlFiles) {
    const sourceHtml = await readFile(sourcePath, "utf8");
    const sourceRelativePath = path.relative(distDir, sourcePath);

    for (const reference of extractReferences(sourceHtml)) {
        const resolved = resolveInternalReference(sourcePath, reference);
        if (!resolved) {
            continue;
        }

        checkedReferences += 1;

        if (resolved.error) {
            failures.push(`${sourceRelativePath}: ${resolved.error}`);
            continue;
        }

        if (!(await fileExists(resolved.targetPath))) {
            failures.push(
                `${sourceRelativePath}: '${reference}' resolves to missing '${path.relative(distDir, resolved.targetPath)}'`
            );
            continue;
        }

        if (!resolved.fragment || !resolved.targetPath.endsWith(".html")) {
            continue;
        }

        let anchors = anchorCache.get(resolved.targetPath);
        if (!anchors) {
            anchors = extractAnchors(await readFile(resolved.targetPath, "utf8"));
            anchorCache.set(resolved.targetPath, anchors);
        }

        if (!anchors.has(resolved.fragment)) {
            failures.push(
                `${sourceRelativePath}: '${reference}' targets missing anchor '#${resolved.fragment}' in '${path.relative(
                    distDir,
                    resolved.targetPath
                )}'`
            );
        }
    }
}

if (failures.length > 0) {
    console.error("Internal link verification failed:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log(`Internal link verification passed (${checkedReferences} references across ${htmlFiles.length} HTML files).`);

import { readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");
const projectPages = ["optimice", "bankheist", "pbc", "tagit", "falseawakening", "runvendor"];

function stripHtmlComments(html) {
    return html.replace(/<!--[\s\S]*?-->/g, " ");
}

function getMainSection(html, pageFile) {
    const startIndex = html.indexOf('<div id="jason-main"');
    if (startIndex === -1) {
        throw new Error(`Unable to find #jason-main in ${pageFile}`);
    }

    const contentStartIndex = html.indexOf(">", startIndex);
    if (contentStartIndex === -1) {
        throw new Error(`Unable to find the end of #jason-main start tag in ${pageFile}`);
    }

    const legacyScriptSentinel = "<!-- jQuery -->";
    const distScriptSentinel = '<script src="js/jquery.min.js"';
    const sentinelIndexes = [legacyScriptSentinel, distScriptSentinel]
        .map((sentinel) => html.indexOf(sentinel, contentStartIndex))
        .filter((index) => index !== -1)
        .sort((left, right) => left - right);

    if (sentinelIndexes.length === 0) {
        throw new Error(`Unable to find the end of #jason-main in ${pageFile}`);
    }

    return html.slice(contentStartIndex + 1, sentinelIndexes[0]);
}

function stripDetailNav(html) {
    return html.replace(/<div class="row work-pagination[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, " ");
}

function normalizeTextContent(html, pageFile) {
    return stripDetailNav(stripHtmlComments(getMainSection(html, pageFile)))
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function extractContentRefs(html, pageFile) {
    return [...stripDetailNav(stripHtmlComments(getMainSection(html, pageFile))).matchAll(/\b(?:src|href)="([^"]+)"/g)]
        .map((match) => match[1])
        .filter(
            (value) =>
                value.startsWith("project/") || value.startsWith("http://") || value.startsWith("https://")
        );
}

function extractVisibleProjectCards(html, pageFile) {
    const sanitizedMain = stripHtmlComments(getMainSection(html, pageFile));

    return [
        ...sanitizedMain.matchAll(
            /<div class="col-md-6 work-item">[\s\S]*?<a href="([^"]+)">[\s\S]*?<img src="([^"]+)" alt="([^"]+)"[\s\S]*?<h3 class="jason-work-title">([\s\S]*?)<\/h3>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/a>[\s\S]*?<\/div>/g
        )
    ].map((match) => ({
        href: match[1],
        image: match[2],
        alt: match[3],
        title: match[4].replace(/\s+/g, " ").trim(),
        subtitle: match[5].replace(/\s+/g, " ").trim()
    }));
}

async function verifyProjectDetailParity() {
    const failures = [];

    for (const page of projectPages) {
        const pageFile = `${page}.html`;
        const [legacyHtml, distHtml] = await Promise.all([
            readFile(path.join(repoRoot, pageFile), "utf8"),
            readFile(path.join(distDir, pageFile), "utf8")
        ]);

        const legacyText = normalizeTextContent(legacyHtml, pageFile);
        const distText = normalizeTextContent(distHtml, `dist/${pageFile}`);

        if (legacyText !== distText) {
            failures.push(`Text parity drift detected in ${pageFile}`);
        }

        const legacyRefs = extractContentRefs(legacyHtml, pageFile);
        const distRefs = extractContentRefs(distHtml, `dist/${pageFile}`);

        if (JSON.stringify(legacyRefs) !== JSON.stringify(distRefs)) {
            failures.push(`Media/link parity drift detected in ${pageFile}`);
        }
    }

    return failures;
}

async function verifyProjectsListingParity() {
    const [legacyHtml, distHtml] = await Promise.all([
        readFile(path.join(repoRoot, "projects.html"), "utf8"),
        readFile(path.join(distDir, "projects.html"), "utf8")
    ]);

    const legacyCards = extractVisibleProjectCards(legacyHtml, "projects.html");
    const distCards = extractVisibleProjectCards(distHtml, "dist/projects.html");

    if (JSON.stringify(legacyCards) !== JSON.stringify(distCards)) {
        return ["Projects listing card parity drift detected in projects.html"];
    }

    return [];
}

const failures = [
    ...(await verifyProjectDetailParity()),
    ...(await verifyProjectsListingParity())
];

if (failures.length > 0) {
    console.error("JCR-45 project parity verification failed:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log("JCR-45 project parity verification passed.");

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { load as parseYaml } from "js-yaml";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");
const projectContentDir = path.join(repoRoot, "src/content/projects");
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

function decodeHtmlEntities(text) {
    const namedEntities = new Map([
        ["amp", "&"],
        ["apos", "'"],
        ["gt", ">"],
        ["lt", "<"],
        ["nbsp", " "],
        ["quot", '"']
    ]);

    return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
        if (code.startsWith("#x")) {
            return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
        }
        if (code.startsWith("#")) {
            return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
        }
        return namedEntities.get(code.toLowerCase()) ?? entity;
    });
}

function normalizeTextContent(html, pageFile) {
    return decodeHtmlEntities(stripDetailNav(stripHtmlComments(getMainSection(html, pageFile))).replace(/<[^>]+>/g, " "))
        .replace(/\s+/g, " ")
        .trim();
}

function extractContentRefs(html, pageFile) {
    return [...stripDetailNav(stripHtmlComments(getMainSection(html, pageFile))).matchAll(/\b(?:src|href)="([^"]+)"/g)]
        .map((match) => decodeHtmlEntities(match[1]))
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
        href: decodeHtmlEntities(match[1]),
        image: decodeHtmlEntities(match[2]),
        alt: decodeHtmlEntities(match[3]),
        title: decodeHtmlEntities(match[4].replace(/\s+/g, " ").trim()),
        subtitle: decodeHtmlEntities(match[5].replace(/\s+/g, " ").trim())
    }));
}

async function listProjectContentFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await listProjectContentFiles(entryPath)));
        } else if (/\.(?:md|mdx)$/.test(entry.name)) {
            files.push(entryPath);
        }
    }

    return files;
}

function parseFrontmatter(source, contentFile) {
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!match) {
        throw new Error(`Missing YAML frontmatter in ${contentFile}`);
    }

    const data = parseYaml(match[1]);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error(`Invalid YAML frontmatter object in ${contentFile}`);
    }

    return data;
}

function normalizeSchemaString(value) {
    return value.trim();
}

function normalizeRenderedText(value) {
    return normalizeSchemaString(value).replace(/\s+/g, " ");
}

function projectDataToListingCard(data) {
    const route = normalizeSchemaString(data.route);
    const routeKey = normalizeSchemaString(data.routeKey);

    return {
        href: data.listingHref ? normalizeSchemaString(data.listingHref) : route.replace(/^\//, ""),
        image: normalizeSchemaString(data.listingImage),
        alt: data.listingImageAlt ? normalizeSchemaString(data.listingImageAlt) : routeKey,
        title: normalizeRenderedText(data.listingTitle ?? data.title),
        subtitle: normalizeRenderedText(data.listingSubtitle ?? data.summary)
    };
}

function verifyListingNormalizationContract() {
    const normalized = projectDataToListingCard({
        route: "  /example.html  ",
        routeKey: "  example  ",
        listingImage: "  project/example/card.png  ",
        listingTitle: "  Example   Project  ",
        listingSubtitle: "  Typed content\n  remains canonical.  "
    });
    const expected = {
        href: "example.html",
        image: "project/example/card.png",
        alt: "example",
        title: "Example Project",
        subtitle: "Typed content remains canonical."
    };

    return JSON.stringify(normalized) === JSON.stringify(expected)
        ? []
        : ["Project listing frontmatter normalization contract drifted."];
}

async function getExpectedProjectCards() {
    const contentFiles = await listProjectContentFiles(projectContentDir);
    const entries = await Promise.all(
        contentFiles.map(async (contentFile) => ({
            contentFile,
            data: parseFrontmatter(await readFile(contentFile, "utf8"), path.relative(repoRoot, contentFile))
        }))
    );

    return entries
        .filter((entry) => (entry.data.listingOrder ?? 999) < 999)
        .sort((left, right) => {
            const orderDelta = left.data.listingOrder - right.data.listingOrder;
            if (orderDelta !== 0) {
                return orderDelta;
            }
            return normalizeSchemaString(left.data.routeKey).localeCompare(
                normalizeSchemaString(right.data.routeKey)
            );
        })
        .map((entry) => projectDataToListingCard(entry.data));
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

async function verifyProjectsListingContract() {
    const [expectedCards, distHtml] = await Promise.all([
        getExpectedProjectCards(),
        readFile(path.join(distDir, "projects.html"), "utf8")
    ]);
    const distCards = extractVisibleProjectCards(distHtml, "dist/projects.html");

    if (JSON.stringify(expectedCards) !== JSON.stringify(distCards)) {
        return [
            `Projects listing does not match typed project content.\nExpected: ${JSON.stringify(expectedCards)}\nReceived: ${JSON.stringify(distCards)}`
        ];
    }

    return [];
}

const failures = [
    ...verifyListingNormalizationContract(),
    ...(await verifyProjectDetailParity()),
    ...(await verifyProjectsListingContract())
];

if (failures.length > 0) {
    console.error("Project content verification failed:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log("Project content verification passed.");

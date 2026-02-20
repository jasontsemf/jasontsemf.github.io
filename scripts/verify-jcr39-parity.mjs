import { access, readFile } from "node:fs/promises";
import path from "node:path";
import {
    copiedRootLegacyRoutes,
    legacyRedirectExpectations,
    parityCriticalRoutes,
    requiredStaticDirectories,
    routeToDistPath
} from "../config/legacy-routes.mjs";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");

async function exists(targetPath) {
    try {
        await access(targetPath);
        return true;
    } catch {
        return false;
    }
}

function normalizeHtml(html) {
    return html.replace(/\r\n/g, "\n").trim();
}

async function verifyRoutes() {
    const failures = [];

    for (const route of parityCriticalRoutes) {
        const distPath = path.join(distDir, routeToDistPath(route));
        if (!(await exists(distPath))) {
            failures.push(`Missing route output: ${route} (${path.relative(repoRoot, distPath)})`);
        }
    }

    return failures;
}

async function verifyRootParity() {
    const failures = [];

    for (const route of copiedRootLegacyRoutes) {
        const sourcePath = path.join(repoRoot, route.source);
        const distPath = path.join(distDir, routeToDistPath(route.route));
        const [sourceHtml, distHtml] = await Promise.all([
            readFile(sourcePath, "utf8"),
            readFile(distPath, "utf8")
        ]);

        if (normalizeHtml(sourceHtml) !== normalizeHtml(distHtml)) {
            failures.push(`Route content drift detected for ${route.route}`);
        }
    }

    return failures;
}

function verifyTokenOrder(html, tokens, pageFile) {
    const failures = [];
    let previousIndex = -1;

    for (const token of tokens) {
        const currentIndex = html.indexOf(token);
        if (currentIndex === -1) {
            failures.push(`Missing token "${token}" in ${pageFile}`);
            return failures;
        }
        if (currentIndex < previousIndex) {
            failures.push(`Token order drift in ${pageFile}: "${token}"`);
            return failures;
        }
        previousIndex = currentIndex;
    }

    return failures;
}

async function verifyCanonicalBehavior() {
    const failures = [];
    const pages = ["index.html", "projects.html", "about.html", "contact.html"];
    const commonScriptOrder = [
        "js/jquery.min.js",
        "js/jquery.easing.1.3.js",
        "js/bootstrap.min.js",
        "js/owl.carousel.min.js",
        "js/jquery.stellar.min.js",
        "js/jquery.waypoints.min.js",
        "js/jquery.countTo.js"
    ];

    for (const pageFile of pages) {
        const html = await readFile(path.join(distDir, pageFile), "utf8");

        if (!html.includes('class="js-jason-nav-toggle jason-nav-toggle')) {
            failures.push(`Missing off-canvas nav toggle class in ${pageFile}`);
        }
        if (!html.includes('id="jason-aside"')) {
            failures.push(`Missing sidebar container in ${pageFile}`);
        }
        if (!html.includes('id="jason-main-menu"')) {
            failures.push(`Missing main navigation container in ${pageFile}`);
        }
    }

    const indexHtml = await readFile(path.join(distDir, "index.html"), "utf8");
    const projectsHtml = await readFile(path.join(distDir, "projects.html"), "utf8");
    const aboutHtml = await readFile(path.join(distDir, "about.html"), "utf8");
    const contactHtml = await readFile(path.join(distDir, "contact.html"), "utf8");

    failures.push(
        ...verifyTokenOrder(indexHtml, [...commonScriptOrder, "js/main.js", "js/typing_carousel.js"], "index.html")
    );
    failures.push(...verifyTokenOrder(projectsHtml, [...commonScriptOrder, "js/main.js"], "projects.html"));
    failures.push(...verifyTokenOrder(aboutHtml, [...commonScriptOrder, "js/main.js"], "about.html"));
    failures.push(
        ...verifyTokenOrder(
            contactHtml,
            [
                ...commonScriptOrder,
                "https://maps.googleapis.com/maps/api/js?key=",
                "js/google_map.js",
                "js/main.js"
            ],
            "contact.html"
        )
    );

    if (!indexHtml.includes('id="output"')) {
        failures.push('Missing home typing container "output" in index.html');
    }
    if (!indexHtml.includes('class="js-jason-nav-toggle jason-nav-toggle dark"')) {
        failures.push("Missing dark nav toggle class in index.html");
    }

    if (!contactHtml.includes('class="map"')) {
        failures.push('Missing contact map container "map" in contact.html');
    }
    if (!contactHtml.includes('class="js-jason-nav-toggle jason-nav-toggle dark"')) {
        failures.push("Missing dark nav toggle class in contact.html");
    }

    return failures;
}

async function verifyRedirects() {
    const failures = [];

    for (const expectation of legacyRedirectExpectations) {
        const distPath = path.join(distDir, routeToDistPath(expectation.route));
        const html = await readFile(distPath, "utf8");

        if (!html.includes('http-equiv="refresh"')) {
            failures.push(`Missing meta refresh tag for ${expectation.route}`);
        }

        if (!html.includes(expectation.destination)) {
            failures.push(`Redirect destination mismatch for ${expectation.route}`);
        }
    }

    return failures;
}

async function verifyCoreNavLinks() {
    const failures = [];
    const pages = ["index.html", "projects.html", "about.html", "contact.html"];
    const expectedLinks = ["index.html", "projects.html", "about.html", "contact.html"];

    for (const pageFile of pages) {
        const html = await readFile(path.join(distDir, pageFile), "utf8");
        for (const link of expectedLinks) {
            if (!html.includes(link)) {
                failures.push(`Missing core nav link token "${link}" in ${pageFile}`);
            }
        }
    }

    return failures;
}

async function verifyStaticDirs() {
    const failures = [];

    for (const relativeDir of requiredStaticDirectories) {
        const fullPath = path.join(distDir, relativeDir);
        if (!(await exists(fullPath))) {
            failures.push(`Missing static directory in dist: ${relativeDir}`);
        }
    }

    return failures;
}

if (!(await exists(distDir))) {
    console.error("dist directory is missing. Run npm run build before parity verification.");
    process.exit(1);
}

const checks = await Promise.all([
    verifyRoutes(),
    verifyRootParity(),
    verifyRedirects(),
    verifyCoreNavLinks(),
    verifyCanonicalBehavior(),
    verifyStaticDirs()
]);

const failures = checks.flat();

if (failures.length > 0) {
    console.error("JCR-39 parity verification failed:");
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log("JCR-39 parity verification passed.");

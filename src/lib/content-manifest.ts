import { getCollection, type CollectionEntry } from "astro:content";

export type PageEntry = CollectionEntry<"pages">;
export type ProjectEntry = CollectionEntry<"projects">;

const requiredCanonicalPageRoutes = ["/", "/about.html", "/projects.html", "/contact.html"] as const;
const requiredCanonicalPageRouteSet = new Set<string>(requiredCanonicalPageRoutes);
const expectedNavByCanonicalRoute = new Map<string, PageEntry["data"]["navKey"] | undefined>([
    ["/", undefined],
    ["/about.html", "about"],
    ["/projects.html", "projects"],
    ["/contact.html", "contact"]
]);

interface ContentManifest {
    pages: PageEntry[];
    projects: ProjectEntry[];
    routes: Set<string>;
}

function assertUniqueRoute(route: string, owner: string, routeOwners: Map<string, string>) {
    const existingOwner = routeOwners.get(route);
    if (existingOwner) {
        throw new Error(`Duplicate content route '${route}' found in '${owner}' and '${existingOwner}'.`);
    }
    routeOwners.set(route, owner);
}

function assertCanonicalRouteParity(pages: PageEntry[]) {
    const canonicalPages = pages.filter((entry) => entry.data.kind === "canonical");
    const canonicalRoutes = new Set(canonicalPages.map((entry) => entry.data.route));

    for (const route of requiredCanonicalPageRoutes) {
        if (!canonicalRoutes.has(route)) {
            throw new Error(`Missing required canonical page route '${route}'.`);
        }
    }

    for (const route of canonicalRoutes) {
        if (!requiredCanonicalPageRouteSet.has(route)) {
            throw new Error(`Unexpected canonical page route '${route}'. Update parity expectations intentionally if this is desired.`);
        }
    }

    for (const entry of canonicalPages) {
        const expectedNavKey = expectedNavByCanonicalRoute.get(entry.data.route);
        if (expectedNavKey !== entry.data.navKey) {
            throw new Error(
                `Canonical page '${entry.id}' must use navKey '${expectedNavKey ?? "undefined"}' for route '${entry.data.route}'.`
            );
        }
    }
}

async function createContentManifest(): Promise<ContentManifest> {
    const [pages, projects] = await Promise.all([getCollection("pages"), getCollection("projects")]);
    const routeOwners = new Map<string, string>();

    for (const entry of pages) {
        assertUniqueRoute(entry.data.route, `pages/${entry.id}`, routeOwners);
    }

    for (const entry of projects) {
        assertUniqueRoute(entry.data.route, `projects/${entry.id}`, routeOwners);
    }

    assertCanonicalRouteParity(pages);

    return {
        pages,
        projects,
        routes: new Set(routeOwners.keys())
    };
}

let manifestPromise: Promise<ContentManifest> | undefined;

export function ensureContentManifestValidated() {
    if (!manifestPromise) {
        manifestPromise = createContentManifest();
    }
    return manifestPromise;
}

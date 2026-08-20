import type { ProjectEntry } from "./content-manifest";

export interface ProjectDetailNav {
    previousHref: string;
    nextHref: string;
}

function toProjectHref(entry: ProjectEntry): string {
    const href = entry.data.listingHref ?? entry.data.route;
    return href.replace(/^\//, "");
}

function getOrderedListedProjects(projects: ProjectEntry[]): ProjectEntry[] {
    return [...projects]
        .filter((entry) => entry.data.listingOrder < 999)
        .sort((left, right) => {
            const orderDelta = left.data.listingOrder - right.data.listingOrder;
            if (orderDelta !== 0) {
                return orderDelta;
            }
            return left.data.routeKey.localeCompare(right.data.routeKey);
        });
}

export function buildProjectDetailNavByRouteKey(projects: ProjectEntry[]): Map<string, ProjectDetailNav> {
    const orderedProjects = getOrderedListedProjects(projects);

    if (orderedProjects.length < 2) {
        return new Map();
    }

    return new Map(
        orderedProjects.map((entry, index) => {
            const previousEntry = orderedProjects[(index - 1 + orderedProjects.length) % orderedProjects.length];
            const nextEntry = orderedProjects[(index + 1) % orderedProjects.length];

            return [
                entry.data.routeKey,
                {
                    previousHref: toProjectHref(previousEntry),
                    nextHref: toProjectHref(nextEntry)
                }
            ];
        })
    );
}

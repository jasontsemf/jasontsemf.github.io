export const astroManagedCanonicalRoutes = ["/", "/projects.html", "/about.html", "/contact.html"];
export const astroManagedRedirectRoutes = [];
export const astroManagedProjectRoutes = [
    "/cat-ai.html",
    "/optimice.html",
    "/bankheist.html",
    "/binwatch.html",
    "/pbc.html",
    "/tagit.html",
    "/falseawakening.html",
    "/runvendor.html"
];
export const astroManagedRoutes = [
    ...astroManagedCanonicalRoutes,
    ...astroManagedRedirectRoutes,
    ...astroManagedProjectRoutes
];

export const rootLegacyRoutes = [
    { route: "/portfolio.html", source: "portfolio.html", type: "redirect" },
    { route: "/work.html", source: "work.html", type: "legacy" }
];

export const copiedRootLegacyRoutes = rootLegacyRoutes.filter(
    (item) => !astroManagedRoutes.includes(item.route)
);

export const parityCriticalRoutes = [
    ...astroManagedRoutes,
    ...rootLegacyRoutes.map((item) => item.route),
    "/date/index.html",
    "/date/heart.html",
    "/ResizeCounter/index.html",
    "/snap/index.html",
    "/keyboardranger/Website/index.html",
    "/keyboardranger/game.html",
    "/keyboardranger/slider.html",
    "/cocoen/docs/demo.html",
    "/cocoen/docs/demo-jquery.html"
];

export const legacyRedirectExpectations = [
    {
        route: "/portfolio.html",
        destination: "https://jasontsemf.github.io/projects.html"
    }
];

export const passthroughEntries = [
    { from: "css", to: "css" },
    { from: "js", to: "js" },
    { from: "images", to: "images" },
    { from: "fonts", to: "fonts" },
    { from: "download", to: "download" },
    { from: "project", to: "project" },
    { from: "date", to: "date" },
    { from: "ResizeCounter", to: "ResizeCounter" },
    { from: "snap", to: "snap" },
    { from: "keyboardranger", to: "keyboardranger" },
    { from: "cocoen/docs", to: "cocoen/docs" },
    { from: "cocoen/dist", to: "cocoen/dist" },
    { from: "sitemap.xml", to: "sitemap.xml" }
];

export const requiredStaticDirectories = [
    "css",
    "js",
    "images",
    "fonts",
    "download",
    "project",
    "date",
    "ResizeCounter",
    "snap",
    "keyboardranger",
    "cocoen/docs",
    "cocoen/dist"
];

export function routeToDistPath(route) {
    return route === "/" ? "index.html" : route.replace(/^\//, "");
}

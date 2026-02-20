export const astroManagedCanonicalRoutes = ["/", "/projects.html", "/about.html", "/contact.html"];
export const astroManagedProjectRoutes = [
    "/optimice.html",
    "/bankheist.html",
    "/pbc.html",
    "/tagit.html",
    "/falseawakening.html",
    "/runvendor.html"
];
export const astroManagedRoutes = [...astroManagedCanonicalRoutes, ...astroManagedProjectRoutes];

export const rootLegacyRoutes = [
    { route: "/", source: "index.html", type: "canonical" },
    { route: "/projects.html", source: "projects.html", type: "canonical" },
    { route: "/about.html", source: "about.html", type: "canonical" },
    { route: "/contact.html", source: "contact.html", type: "canonical" },
    { route: "/optimice.html", source: "optimice.html", type: "canonical" },
    { route: "/bankheist.html", source: "bankheist.html", type: "canonical" },
    { route: "/pbc.html", source: "pbc.html", type: "canonical" },
    { route: "/tagit.html", source: "tagit.html", type: "canonical" },
    { route: "/falseawakening.html", source: "falseawakening.html", type: "canonical" },
    { route: "/runvendor.html", source: "runvendor.html", type: "canonical" },
    { route: "/binwatch.html", source: "binwatch.html", type: "redirect" },
    { route: "/portfolio.html", source: "portfolio.html", type: "redirect" },
    { route: "/work.html", source: "work.html", type: "legacy" }
];

export const copiedRootLegacyRoutes = rootLegacyRoutes.filter(
    (item) => !astroManagedRoutes.includes(item.route)
);

export const parityCriticalRoutes = [
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
        route: "/binwatch.html",
        destination: "https://jason1996429.wordpress.com/2020/12/09/time-final-binwatch/"
    },
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

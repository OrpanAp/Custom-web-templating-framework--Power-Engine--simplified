import App from "./runtime/App.js";

const siteProps = {
    frameworkName: "P.O.W.E.R.",
    version: "2.0"
};

const app = new App({
    root: document.getElementById("app"),

    routes: {
        home: {
            href: "/",
            path: "./pages/home/index.html",
            title: "P.O.W.E.R. 2.0 — Build with intent.",
            description: "Explore P.O.W.E.R. 2.0, its capabilities, quick start, documentation, and source code.",
            props: siteProps
        },
        docs: {
            href: "/docs.html",
            path: "./pages/docs/index.html",
            title: "Documentation — P.O.W.E.R. 2.0",
            description: "The main documentation index for the P.O.W.E.R. 2.0 Node.js web framework.",
            props: siteProps
        },
        "quick-start": {
            href: "/quick-start.html",
            path: "./pages/docs/quick-start.html",
            title: "Quick Start — P.O.W.E.R. 2.0",
            description: "Install, configure, and run your first P.O.W.E.R. 2.0 application.",
            props: siteProps
        },
        cli: {
            href: "/cli.html",
            path: "./pages/docs/cli.html",
            title: "CLI Reference — P.O.W.E.R. 2.0",
            description: "Explore the P.O.W.E.R. 2.0 command-line interface and developer commands.",
            props: siteProps
        },
        deployment: {
            href: "/deployment.html",
            path: "./pages/docs/deployment.html",
            title: "Deployment — P.O.W.E.R. 2.0",
            description: "Deployment setup and production considerations for P.O.W.E.R. 2.0 applications.",
            props: siteProps
        },
        architecture: {
            href: "/architecture.html",
            path: "./pages/docs/architecture.html",
            title: "Architecture — P.O.W.E.R. 2.0",
            description: "Understand the architecture and major application layers in P.O.W.E.R. 2.0.",
            props: siteProps
        },
        configuration: {
            href: "/configuration.html",
            path: "./pages/docs/configuration.html",
            title: "Configuration — P.O.W.E.R. 2.0",
            description: "Configuration options and environment setup for P.O.W.E.R. 2.0.",
            props: siteProps
        },
        database: {
            href: "/database.html",
            path: "./pages/docs/database.html",
            title: "Database Guide — P.O.W.E.R. 2.0",
            description: "Database configuration and integration guidance for P.O.W.E.R. 2.0.",
            props: siteProps
        },
        routing: {
            href: "/routing.html",
            path: "./pages/docs/routing.html",
            title: "Routing — P.O.W.E.R. 2.0",
            description: "Route definitions and request handling in P.O.W.E.R. 2.0.",
            props: siteProps
        },
        security: {
            href: "/security.html",
            path: "./pages/docs/security.html",
            title: "Security — P.O.W.E.R. 2.0",
            description: "Security practices and configuration notes for P.O.W.E.R. 2.0 applications.",
            props: siteProps
        },
        "power-1-docs": {
            href: "/power-1-docs.html",
            path: "./pages/docs/power-1/index.html",
            title: "POWER Engine 1.0 — Source Documentation",
            description: "A source-oriented guide to POWER Engine 1.0 routing, templates, props, includes, and page scripts.",
            props: {
                frameworkName: "P.O.W.E.R. Engine",
                version: "1.0"
            }
        },
        "404": {
            href: "/404",
            path: "./pages/errors/not-found.html",
            title: "Page Not Found — P.O.W.E.R.",
            description: "The requested P.O.W.E.R. page could not be found.",
            props: siteProps
        }
    },

    authenticate: {}
});

app.Run().catch(error => {
    console.error("POWER Engine could not render this page:", error);
    const root = document.getElementById("app");
    if (root) {
        root.innerHTML = '<main style="max-width:760px;margin:4rem auto;padding:1.5rem;font-family:system-ui"><h1>POWER Engine could not load this page</h1><p>Check the browser console and confirm the page template is available.</p></main>';
    }
});

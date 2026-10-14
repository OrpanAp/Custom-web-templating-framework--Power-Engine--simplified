import App from "./App.js";

const app = new App({
    root: document.getElementById("app"),

    routes: {
        home: {
            href: "/",
            path: "./pages/power-site.html"
        },
        docs: {
            href: "/docs.html",
            path: "./pages/site-docs.html"
        },
        "quick-start": {
            href: "/quick-start.html",
            path: "./pages/site-quick-start.html"
        },
        cli: {
            href: "/cli.html",
            path: "./pages/site-cli.html"
        },
        deployment: {
            href: "/deployment.html",
            path: "./pages/site-deployment.html"
        },
        architecture: {
            href: "/architecture.html",
            path: "./pages/site-architecture.html"
        },
        configuration: {
            href: "/configuration.html",
            path: "./pages/site-configuration.html"
        },
        database: {
            href: "/database.html",
            path: "./pages/site-database.html"
        },
        routing: {
            href: "/routing.html",
            path: "./pages/site-routing.html"
        },
        security: {
            href: "/security.html",
            path: "./pages/site-security.html"
        },
        "power-1-docs": {
            href: "/power-1-docs.html",
            path: "./pages/site-power-1-docs.html"
        },
        "404": {
            href: "/404",
            path: "./pages/notfound.html"
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

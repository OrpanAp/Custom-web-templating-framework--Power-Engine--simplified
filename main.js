import App from "./App.js";

const app = new App({
    root: document.getElementById("app"),

    routes: {
        "home": {
            href: "/",
            path: "./Custom-web-templating-framework--Power-Engine--simplified/pages/home.html",
            props: {
                msg: 'Welcome to Power Engine ⚡(1.0)'
            }
        },
        "about": {
            href: "/about",
            path: "./Custom-web-templating-framework--Power-Engine--simplified/pages/about.html"
        },
        "use": {
            href: "/use",
            path: "./Custom-web-templating-framework--Power-Engine--simplified/pages/use.html"
        },
        "demo": {
            href: "/demo-page",
            path: "./Custom-web-templating-framework--Power-Engine--simplified/pages/demo-page.html",
            props: {
                user: {
                    name: "Alex",
                    role: "Developer",
                }
            }
        },
        "404": {
            href: "/404",
            path: "./Custom-web-templating-framework--Power-Engine--simplified/pages/notfound.html"
        }
    },

    authenticate: {} // placeholder
});

app.Run();

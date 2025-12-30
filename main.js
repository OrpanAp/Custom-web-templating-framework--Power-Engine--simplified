import App from "./App.js";

const app = new App({
    root: document.getElementById("app"),

    routes: {
        "home": {
            href: "/",
            path: "pages/home.html",
            props: {
                msg: 'Welcome to Power Engine ⚡(1.0)'
            }
        },
        "about": {
            href: "/about",
            path: "./pages/about.html"
        },
        "use": {
            href: "/use",
            path: "./pages/use.html"
        },
        "demo": {
            href: "/demo-page",
            path: "./pages/demo-page.html",
            props: {
                user: {
                    name: "Alex",
                    role: "Developer",
                }
            }
        },
        "404": {
            href: "/404",
            path: "pages/notfound.html"
        }
    },

    authenticate: {} // placeholder
});

app.Run();

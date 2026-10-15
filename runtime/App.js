class App {
    /* Authenticate is placeholder for now: fixed ❌ */
    constructor({root = document.body, routes = {}, authenticate = {}}) {
        this.root = root;
        this.routes = routes;
        this.authenticate = authenticate;
        this.pages = new Map(); /* Info: This not only store pages, it also keeps record of props and script executionior */
    }

    async Run() {
        App.ApplyThemePreference();
        if(!this.routes) throw new Error(`Error: Undefined routes`);
        if(typeof this.routes !== 'object') throw new Error(`Type Error: Required route type of: "object"`);
       
        /* Route loades only selected page and 
        scripts for script runtime optimazation */
        this.pages = await App.TemplateBuilder(this.routes);
        await App.IdentifyInlineCommands(this.pages);
        
        await App.Route(this.root, this.pages, this.authenticate);
    }

    static SetTheme(theme) {
        const nextTheme = theme === "dark" ? "dark" : "light";
        const root = document.documentElement;

        // Set both the attribute and native color-scheme so CSS variables,
        // form controls, and browser-native surfaces follow the same choice.
        root.setAttribute("data-theme", nextTheme);
        root.style.colorScheme = nextTheme;

        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            const isDark = nextTheme === "dark";
            button.textContent = isDark ? "☀ Light mode" : "☾ Dark mode";
            button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
            button.setAttribute("aria-pressed", String(isDark));
            button.title = isDark ? "Switch to light theme" : "Switch to dark theme";
        });
    }

    static ApplyThemePreference() {
        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem("power-theme");
        } catch {
            // Storage may be disabled by the browser.
        }

        let preferredTheme = "light";
        try {
            preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        } catch {
            // Use light when system preference cannot be read.
        }

        App.SetTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : preferredTheme);
    }

    static ApplyResponsiveNavigation() {
        const header = document.querySelector("header");
        if (!header) return;

        const nav = header.querySelector("nav");
        const container = header.querySelector(".topnav, .nav");
        const links = header.querySelector(".toplinks, .navlinks");
        if (!container || !links) return;

        // The landing page has its own carefully tuned menu controller.
        if (document.getElementById("menu-toggle")) return;

        let menu = container.querySelector("[data-global-menu]");
        if (!menu) {
            menu = document.createElement("button");
            menu.type = "button";
            menu.setAttribute("data-global-menu", "");
            menu.setAttribute("aria-expanded", "false");
            menu.textContent = "☰ Menu";
            menu.style.cssText = "display:none;align-items:center;justify-content:center;flex:0 0 auto;white-space:nowrap;min-height:40px;padding:9px 13px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font-weight:800;cursor:pointer";
            container.appendChild(menu);
        }

        Object.assign(container.style, { position: "relative", flexWrap: "wrap", minWidth: "0" });
        Object.assign(links.style, { flexWrap: "wrap", alignItems: "center" });

        const applyLayout = () => {
            const compact = true; // Keep the navigation collapsed on every viewport, matching the home page.
            menu.style.display = compact ? "inline-flex" : "none";
            if (!compact) {
                links.style.display = "flex";
                links.style.position = "static";
                links.style.flexDirection = "row";
                links.style.width = "auto";
                menu.setAttribute("aria-expanded", "false");
                menu.textContent = "☰ Menu";
                return;
            }
            const open = menu.getAttribute("aria-expanded") === "true";
            links.style.display = open ? "flex" : "none";
            links.style.position = "absolute";
            links.style.top = "calc(100% + 1px)";
            links.style.left = "0";
            links.style.right = "0";
            links.style.width = "100%";
            links.style.zIndex = "60";
            links.style.flexDirection = "column";
            links.style.alignItems = "stretch";
            links.style.gap = "0";
            links.style.padding = "10px";
            links.style.border = "1px solid var(--line)";
            links.style.borderRadius = "0 0 14px 14px";
            links.style.background = "var(--panel)";
            links.style.boxShadow = "0 18px 42px #0002";
            links.style.maxHeight = "calc(100vh - 100px)";
            links.style.overflowY = "auto";
            links.querySelectorAll("a").forEach(a => {
                a.style.display = "block";
                a.style.padding = "11px 13px";
                a.style.borderRadius = "9px";
            });
        };

        if (!menu.dataset.bound) {
            menu.dataset.bound = "true";
            menu.addEventListener("click", () => {
                const open = menu.getAttribute("aria-expanded") !== "true";
                menu.setAttribute("aria-expanded", String(open));
                menu.textContent = open ? "✕ Close" : "☰ Menu";
                applyLayout();
            });
            links.addEventListener("click", event => {
                if (event.target.closest("a")) {
                    menu.setAttribute("aria-expanded", "false");
                    menu.textContent = "☰ Menu";
                    applyLayout();
                }
            });
            window.addEventListener("resize", applyLayout);
        }

        applyLayout();
    }

    static ApplyThemeControl() {
        const header = document.querySelector("header");
        if (!header) return;

        const nav = header.querySelector("nav");
        const host = header.querySelector(".actions")
            || header.querySelector(".topnav")
            || header.querySelector(".nav")
            || nav;

        if (!host) return;

        // Avoid duplicate controls when the route changes in the single-page app.
        const existingButton = header.querySelector("[data-theme-toggle]");
        if (existingButton) existingButton.remove();

        const button = document.createElement("button");
        button.type = "button";
        button.className = "theme-toggle";
        button.setAttribute("data-theme-toggle", "");
        button.setAttribute("aria-live", "polite");
        button.setAttribute("aria-pressed", String(document.documentElement.dataset.theme === "dark"));

        button.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const nextTheme = currentTheme === "dark" ? "light" : "dark";
            App.SetTheme(nextTheme);
            try {
                localStorage.setItem("power-theme", nextTheme);
            } catch {
                // The theme still changes for the current page when storage is disabled.
            }
        });

        host.appendChild(button);
        App.SetTheme(document.documentElement.dataset.theme || "light");
    }

    static async TemplateBuilder(routes) {
        const pages = new Map();
        
        for(const key in routes) {
            const route = routes[key];
            if(!route.href) throw new Error(`Error: Undefined route href`);
            if(!route.path) throw new Error(`Error: Undefined route path`);
            if(typeof route.href !== 'string') throw new Error(`Type Error: Required route.href type of: "string"`);
            if(typeof route.path !== 'string') throw new Error(`Type Error: Required route.path type of: "string"`);
            
            const href = this.NormalizeRoute(route.href);
            const html = await this.GetHtml(route.path);
            const fragment = await this.CopyChildNodesAsFragment(html);

            if(route.props && typeof route.props !== 'object') {
                throw new Error(`Type Error: Required 'route.props' type of: "object"`);
            }

            pages.set(href, {
                fragment,
                props: route.props ?? {},
                title: route.title || "P.O.W.E.R. 2.0",
                description: route.description || ""
            });
        }

        return pages;
    }

    static async GetHtml(path) {
        path = this.NormalizeFilePath(path);
        const baseUrl = new URL(this.BASE_PATH, location.origin);
        const requestUrl = new URL(path, baseUrl).href;

        const res = await fetch(requestUrl);
        if(!res.ok) throw new Error(`Failed to load path: ${requestUrl} with status: ${res.status}`);

        const html = await res.text();
        const div = document.createElement('div');
        div.innerHTML = html;

        return div;
    }

    static async CopyChildNodesAsFragment(html) {
        const fragment = document.createDocumentFragment();

        while (html.firstChild) {
            fragment.appendChild(html.firstChild);
        }

        return fragment;
    }

    static NormalizeRoute(path) {
        return "/" + path.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
    }

    static NormalizeFilePath(path) {
        return path.replace(/\/+/g, "/").replace(/^\/+/, "");
    }


    static async IdentifyInlineCommands(pages) {
        if(!pages || pages.size === 0) return;

        for(const [key, value] of pages) {
            const page = value.fragment;

            /* Injection request */
            await this.LoadIncludeCommands(page); /* All at once */
        }
    }

    static async LoadIncludeCommands(page) {
        const includeNodes = page.querySelectorAll('include');
        if (includeNodes.length === 0) return;

        for(const include of includeNodes) {
            const type = include.getAttribute('type');
            const path = include.getAttribute('path');

            if(!type || !path) throw new Error(`Undefined Error: Missing one or many 'type: "string"' or 'path: "string"'`);
            if(typeof type !== 'string') throw new Error(`Type Error: Unknown type: "type"`);
            if(typeof path !== 'string') throw new Error(`Type Error: Unknown type: "path"`);

            const normalizedPath = this.NormalizeFilePath(path);
            
            if(type === 'html') {
                const html = await this.GetHtml(normalizedPath);
                const fragment = await this.CopyChildNodesAsFragment(html);

                include.replaceWith(fragment);
                await this.LoadIncludeCommands(page); /* recursive: allow nested commands to load in current context */
            }
            else if(type === 'css') {
                // Check if this CSS is already loaded(DIrect DOM)
                const stylesheetUrl = new URL(this.BASE_PATH + normalizedPath, location.origin).href;
                const existingLink = Array.from(document.head.querySelectorAll('link'))
                    .find(link => link.rel === 'stylesheet' && link.href === stylesheetUrl);
                if(existingLink) {
                    include.remove();
                    continue;
                }

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = stylesheetUrl;

                document.head.appendChild(link);
                include.remove();
            }
        }
    }
    


    static async Route(root, pages, authenticate) {
        if(authenticate && typeof authenticate !== 'object') throw new Error(`Type Error: Unknown authenticate type: object`);

        /* Event bug : svg with key page loader, Fixed:✅ */
        document.addEventListener('click', async (e) => {
            const trigger = e.target.closest('[data-meta-href]');
            if (!trigger) return;

            e.preventDefault();

            const key = trigger.getAttribute('data-meta-href');
            if (!key) return;

            const href = trigger.getAttribute('href') || '';
            const hashIndex = href.indexOf('#');
            const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : '';

            await this.LoadRequestedPage(key, root, pages);

            if (hash) {
                const target = document.getElementById(decodeURIComponent(hash));
                if (target) target.scrollIntoView();
                else window.scrollTo(0, 0);
            } else {
                window.scrollTo(0, 0);
            }
        });


        window.addEventListener("popstate", async () => {
            await this.LoadRequestedPage(location.pathname, root, pages);
        });


        await this.LoadRequestedPage(location.pathname, root, pages);
    }


    /* Html props support is broken, Fixed:✅ */
    static async PropsUpdater(page) {
        if (!page.props) return null;

        const fragment = page.fragment.cloneNode(true);

        // 0️⃣ Attribute injection support
        const elements = fragment.querySelectorAll('*');

        for (const element of elements) {
            // Keep literal examples and executable source intact.
            if (element.closest('pre, code, script, style, textarea')) continue;

            for (const attr of [...element.attributes]) {
                if (!attr.value.includes('{{')) continue;

                let value = attr.value;

                // HTML-style {{{ }}}
                value = value.replace(/\{\{\{\s*([\w\.]+)\s*\}\}\}/g, (_, key) => {
                    return key.split('.').reduce((o, i) => o?.[i], page.props) ?? '';
                });

                // Text-style {{ }}
                value = value.replace(/\{\{\s*([\w\.]+)\s*\}\}/g, (_, key) => {
                    return key.split('.').reduce((o, i) => o?.[i], page.props) ?? '';
                });

                element.setAttribute(attr.name, value);
            }
        }

        // 1️⃣ Collect text nodes first
        const walker = document.createTreeWalker(
            fragment,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) {
            textNodes.push(node);
        }

        // 2️⃣ Process collected nodes safely
        for (const textNode of textNodes) {
            // Documentation snippets may intentionally contain {{ placeholders }}.
            if (textNode.parentElement?.closest('pre, code, script, style, textarea')) continue;

            let text = textNode.nodeValue;

            // HTML injection {{{ prop }}}
            text = text.replace(/\{\{\{\s*([\w\.]+)\s*\}\}\}/g, (_, key) => {
                const value = key.split('.').reduce((o, i) => o?.[i], page.props);
                return value != null ? String(value) : '';
            });

            // Text injection {{ prop }}
            text = text.replace(/\{\{\s*([\w\.]+)\s*\}\}/g, (_, key) => {
                const value = key.split('.').reduce((o, i) => o?.[i], page.props);
                return value != null ? String(value) : '';
            });

            // If HTML exists → replace node with DOM
            if (text.includes('<')) {
                const temp = document.createElement('span');
                temp.innerHTML = text;

                const frag = await this.CopyChildNodesAsFragment(temp);

                textNode.replaceWith(frag);
            } else {
                textNode.nodeValue = text;
            }
        }

        return fragment;
    }

    static BASE_PATH = (() => {
        const parts = location.pathname.split('/');
        return parts.length > 2 && parts[1] ? `/${parts[1]}/` : '/';
    })();

    static ResolveRouteKey(path) {
        let routePath = String(path || '/');
        const base = this.BASE_PATH;

        if (base !== '/' && routePath.startsWith(base)) {
            routePath = '/' + routePath.slice(base.length);
        }

        const routeKey = this.NormalizeRoute(routePath);
        return routeKey === '/index.html' ? '/' : routeKey;
    }

    static BuildLocationPath(key) {
        const routePath = this.NormalizeRoute(key);
        const base = this.BASE_PATH === '/' ? '' : this.BASE_PATH.slice(0, -1);
        return routePath === '/' ? `${base}/` : `${base}${routePath}`;
    }
    
    static async FindScriptsAndModuleThem(page) {
        const scripts = [];
        const scriptNodes = page.querySelectorAll('script');

        for(const script of scriptNodes) {
            const src = script.getAttribute('src');
            const type = script.getAttribute('type') || 'text/javascript';
            let blobUrl = '';
            let jsText = '';

            if(src) {
                /* External js */
                if(typeof src !== 'string') throw new Error(`Type Error: Unknown type of: "src"`);

                const normalizedPath = this.NormalizeFilePath(src); 
                const res = await fetch(App.BASE_PATH  + normalizedPath);
                if(!res.ok) throw new Error(`Error: Failed to load script: ${src} with status: ${res.status}`);

                jsText = await res.text();
                jsText = `(() => {\n${jsText}\n})();`;
            }
            else {
                /* Inline js */
                /* Critical fix: function wrapper */
                jsText = `(() => {${script.textContent}})();`;
            } 

            const blob = new Blob([jsText], {type});
            blobUrl = URL.createObjectURL(blob);

            scripts.push({type, blobUrl});
            script.remove();
        }

        return scripts;
    }

    /* problem: Blob url gets invalid, Fixed:✅ */
    static async LoadScriptForThisPage(scripts, root) {
        if(!scripts || scripts.length === 0) return;

        /* using key ignores any logic,
        because clonable template is the current script container */
        for(const script of scripts) {
            const scriptEl = document.createElement('script');
            scriptEl.type = script.type || 'text/javascript';
            scriptEl.src = script.blobUrl || null;

            // Inline scripts as blob
            if(script.blobUrl) {
                await new Promise((resolve, reject) => {
                    scriptEl.onload = () => resolve();
                    scriptEl.onerror = () => reject(`Failed to load script blob: ${script.blobUrl}`);
                    root.appendChild(scriptEl);
                    URL.revokeObjectURL(script.blobUrl);
                });
            } else {
                scriptEl.textContent = script.jsText || '';
                root.appendChild(scriptEl);
            }
        }
    }

    /* initial page */
    static async LoadRequestedPage(key, root, pages) {
        const routeKey = this.ResolveRouteKey(key);
        const page = pages.get(routeKey) ?? pages.get('/404');

        if (!page) {
            console.warn(`No page found for trigger: ${key}`);
            return;
        }

        document.title = page.title || "P.O.W.E.R. 2.0";
        const descriptionMeta = document.querySelector('meta[name="description"]');
        if (descriptionMeta) descriptionMeta.setAttribute('content', page.description || "");
        document.documentElement.dataset.route = routeKey;

        const targetPath = this.BuildLocationPath(routeKey);
        if (location.pathname !== targetPath) {
            history.pushState({}, "", targetPath);
        }

        /* Replace all props with actual data */
        const fragment = (await this.PropsUpdater(page)) || page.fragment.cloneNode(true);
        const scripts = await this.FindScriptsAndModuleThem(fragment) || null;
        root.innerHTML = '';
        root.appendChild(fragment);

        await this.LoadScriptForThisPage(scripts, root);
        this.ApplyThemeControl();
        this.ApplyResponsiveNavigation();
    }
}

export default App;

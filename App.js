class App {
    /* Authenticate is placeholder for now: fixed ❌ */
    constructor({root = document.body, routes = {}, authenticate = {}}) {
        this.root = root;
        this.routes = routes;
        this.authenticate = authenticate;
        this.pages = new Map(); /* Info: This not only store pages, it also keeps record of props and script executionior */
    }

    async Run() {
        if(!this.routes) throw new Error(`Error: Undefined routes`);
        if(typeof this.routes !== 'object') throw new Error(`Type Error: Required route type of: "object"`);
       
        /* Route loades only selected page and 
        scripts for script runtime optimazation */
        this.pages = await App.TemplateBuilder(this.routes);
        await App.IdentifyInlineCommands(this.pages);
        
        await App.Route(this.root, this.pages, this.authenticate);
    }

    static async TemplateBuilder(routes) {
        const pages = new Map();
        
        for(const key in routes) {
            const route = routes[key];
            if(!route.href) throw new Error(`Error: Undefined route href`);
            if(!route.path) throw new Error(`Error: Undefined route path`);
            if(typeof route.href !== 'string') throw new Error(`Type Error: Required route.href type of: "string"`);
            if(typeof route.path !== 'string') throw new Error(`Type Error: Required route.path type of: "string"`);
            
            const href = this.PathStrNormalizer(route.href);
            const html = await this.GetHtml(route.path);
            const fragment = await this.CopyChildNodesAsFragment(html);

            if(route.props && typeof route.props !== 'object') {
                throw new Error(`Type Error: Required 'route.props' type of: "object"`);
            }
            else if(route.props) {
                pages.set(href, {fragment, props: route.props});
            }
            else {
                pages.set(href, {fragment});
            }
        }

        return pages;
    }

    static async GetHtml(path) {
        path = this.PathStrNormalizer(path);

        const res = await fetch(path);
        if(!res.ok) throw new Error(`Failed to load path: ${path} with status: ${res.status}`);

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

    static PathStrNormalizer(path) {
        return "/" + path.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
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

            const normalizedPath = this.PathStrNormalizer(path);
            
            if(type === 'html') {
                const html = await this.GetHtml(normalizedPath);
                const fragment = await this.CopyChildNodesAsFragment(html);

                include.replaceWith(fragment);
                await this.LoadIncludeCommands(page); /* recursive: allow nested commands to load in current context */
            }
            else if(type === 'css') {
                // Check if this CSS is already loaded(DIrect DOM)
                const existingLink = Array.from(document.head.querySelectorAll('link')).find(l => l.rel === 'stylesheet' && l.href === normalizedPath);
                if(existingLink) return;

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = normalizedPath;

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

            await this.LoadRequestedPage(key, root, pages);
        });


        window.addEventListener("popstate", async () => {
            await this.LoadRequestedPage(location.pathname, root, pages);
        });


        await this.LoadRequestedPage('/', root, pages);
    }


    /* Html props support is broken, Fixed:✅ */
    static async PropsUpdater(page) {
        if (!page.props) return null;

        const fragment = page.fragment.cloneNode(true);

        // 0️⃣ Attribute injection support
        const elements = fragment.querySelectorAll('*');

        for (const element of elements) {
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
                
                const res = await fetch(src);
                if(!res.ok) throw new Error(`Error: Failed to load script: ${src} with status: ${res.status}`);

                jsText = await res.text();
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
        const page = pages.get(key) ?? pages.get('/404');

        if (!page) {
            console.warn(`No page found for trigger: ${key}`);
            return;
        }

        history.pushState({}, "", key);

        /* Replace all props with actual data */
        const fragment = (await this.PropsUpdater(page)) || page.fragment.cloneNode(true); /* Now page keeps record of scripts to inside template */
        const scripts = await this.FindScriptsAndModuleThem(fragment) || null; /* detect script request */
        root.innerHTML = '';
        root.appendChild(fragment);
        
        await this.LoadScriptForThisPage(scripts, root);
    }
}

export default App;
# ⚡ POWER Engine

**Page Observer with Extraction & Route** is a lightweight, dependency-free client-side runtime for modular single-page applications (SPAs), built with native browser APIs.

This repository also contains the live documentation website for P.O.W.E.R. 2.0. The website is rendered by the original POWER 1.0 runtime in `runtime/App.js`.

> **Project status:** Experimental / educational. Review the source and documented security limitations before using the runtime in production.

## ✨ Runtime features

- Declarative route configuration and route validation
- HTML-fragment templates cached with `Map` and `DocumentFragment`
- Route props and nested `{{ property.path }}` interpolation
- Explicit raw HTML interpolation with `{{{ property.path }}}`
- Reusable HTML includes and dynamically loaded CSS includes
- Inline and external page scripts
- Client-side navigation using `data-meta-href`
- Browser Back/Forward handling through the History API
- Route-specific document titles and meta descriptions
- GitHub Pages subpath support and a configured not-found fallback
- Zero third-party runtime dependencies

## 📁 Project structure

```text
.
├── .github/workflows/static1.yml
├── assets/
│   ├── css/site.css
│   ├── css/not-found.css
│   └── js/pages/home.js
├── components/site-footer.html
├── pages/
│   ├── home/index.html
│   ├── docs/
│   │   ├── index.html
│   │   ├── quick-start.html
│   │   ├── cli.html
│   │   ├── deployment.html
│   │   ├── architecture.html
│   │   ├── configuration.html
│   │   ├── database.html
│   │   ├── routing.html
│   │   ├── security.html
│   │   └── power-1/index.html
│   └── errors/not-found.html
├── runtime/App.js
├── scripts/build-site.mjs
├── main.js
├── index.html
└── 404.html
```
The source keeps one canonical HTML shell rather than repeating document boilerplate in every route. The build script generates the small root-level aliases required by GitHub Pages, so direct links and refreshes work without maintaining duplicate HTML documents. Page content, title, description, styles, and page scripts are managed by the runtime and fragments.

## 🚀 Run locally

From the repository root, start a local HTTP server (templates use `fetch()`, so opening files with `file://` is not supported):

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## 🧭 Configure routes

Routes are defined in `main.js`. Each route can provide a URL, a template fragment, metadata, and interpolation props:

```javascript
{
    href: "/example.html",
    path: "./pages/docs/example.html",
    title: "Example — P.O.W.E.R.",
    description: "A description used by search engines and browser metadata.",
    props: {
        frameworkName: "P.O.W.E.R.",
        version: "2.0"
    }
}
```

- `href` is the browser-facing route.
- `path` points to a fragment, not a complete HTML document.
- `title` and `description` update the document metadata on navigation.
- `props` are interpolated into the fragment, including HTML loaded through components.

## 🧩 Use template features

**CSS include**

```html
<include type="css" path="assets/css/site.css"></include>
```

**Reusable HTML component**

```html
<include type="html" path="components/site-footer.html"></include>
```

**Route props**

```html
<h1>{{ pageTitle }}</h1>
<p>Hello, {{ user.name }}</p>
```

Use normal double braces for text. Triple braces insert raw HTML and must never be used with untrusted values. The current runtime is experimental and its interpolation pipeline is not a complete HTML sanitizer.

**Page scripts**

Inline scripts are executed with the rendered page. External scripts can be referenced from a fragment:

```html
<script src="assets/js/pages/example.js"></script>
```

Keep page-specific behavior in the template or in its own file under `assets/js/pages/`.

## 🌐 Deployment

Pushing to `master` runs `.github/workflows/static1.yml`. The workflow stages only the runtime, assets, templates, components, and required root HTML shells before publishing to GitHub Pages.

## ⚠️ Known limitations

- The `authenticate` constructor option is a placeholder, not a working authentication system.
- Raw HTML interpolation can create XSS vulnerabilities when supplied untrusted content.
- The runtime does not provide a full component lifecycle, route guards, dynamic route parameters, or a security sandbox for page scripts.
- Test direct routes, refreshes, Back/Forward navigation, includes, and failed template loads before deploying changes.

## 📚 Related project

P.O.W.E.R. 2.0 is the separate Node.js framework documented by this website: [OrpanAp/power-2.0](https://github.com/OrpanAp/power-2.0).

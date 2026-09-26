# ⚡ POWER Engine

### Page Observer with Extraction & Route

**POWER Engine** is a lightweight, dependency-free client-side runtime for building modular Single Page Applications (SPAs) using **native HTML, CSS, and JavaScript**.

Instead of relying on a virtual DOM or a large frontend framework, POWER Engine works directly with browser DOM APIs. It loads HTML templates, converts them into reusable `DocumentFragment`s, injects route-specific data, handles client-side navigation, loads page-specific scripts, and supports reusable HTML/CSS includes.

The project is designed primarily as an **experimental and educational framework** for understanding how SPA routing, templating, component loading, and page-scoped JavaScript can be implemented from scratch.

> **Status:** Experimental / Educational

---

## ✨ Features

* ⚡ Lightweight client-side runtime
* 🧩 Declarative route configuration
* 🧭 Client-side SPA navigation
* 📄 HTML template loading
* 💾 Template caching with `Map`
* 🔗 Route-specific props
* `{{ prop }}` text interpolation
* `{{{ prop }}}` raw HTML interpolation
* 🏷️ Attribute interpolation
* `<include>` HTML component loading
* 🎨 Dynamic CSS inclusion
* 🔁 Recursive/nested HTML includes
* 📜 Inline page-script execution
* 📦 External page-script loading
* 🧪 Page-scoped script execution
* 🔗 Browser History API integration
* ⬅️ Back/Forward navigation with `popstate`
* 🚫 404 route fallback
* 🛡️ Route and configuration validation
* 🚫 Zero external dependencies
* 🌐 Native browser APIs only

---

# 🧠 What is POWER Engine?

POWER stands for:

```text
P — Page
O — Observer
W — With
E — Extraction
R — Route
```

The main idea is to create a small runtime capable of turning ordinary HTML files into dynamically rendered SPA pages.

Instead of writing a large application inside one HTML file, pages can be separated into individual templates:

```text
pages/
├── home.html
├── about.html
├── use.html
├── demo-page.html
└── notfound.html
```

POWER Engine then loads those templates and displays the requested page inside a single application container.

---

# 🎯 Core Philosophy

POWER Engine takes a different approach from frameworks that maintain a virtual representation of the DOM.

The runtime works directly with:

* `fetch()`
* DOM elements
* `DocumentFragment`
* `Map`
* `history.pushState()`
* `popstate`
* `Blob`
* `URL.createObjectURL()`
* event delegation

The basic concept is:

```text
Route Configuration
        ↓
Load HTML Template
        ↓
Convert Template to Fragment
        ↓
Store Template
        ↓
Process Includes
        ↓
User Navigation
        ↓
Resolve Route
        ↓
Inject Props
        ↓
Extract Scripts
        ↓
Render Fragment
        ↓
Execute Page Scripts
```

This keeps the runtime relatively small while still providing the fundamental building blocks of an SPA.

---

# 🛠️ Technologies

POWER Engine intentionally avoids external frameworks and libraries.

### Core technologies

* **JavaScript ES Modules**
* **HTML5**
* **CSS3**
* **Browser DOM API**
* **Fetch API**
* **History API**
* **Blob API**
* **DocumentFragment**
* **Map**
* **Regular Expressions**

### No framework dependencies

There is currently no dependency on:

* React
* Vue
* Angular
* Svelte
* jQuery
* React Router
* Vue Router
* external templating libraries

The runtime is implemented directly in JavaScript.

---

# 📁 Project Structure

The repository currently follows a simple structure:

```text
Custom-web-templating-framework--Power-Engine--simplified/
│
├── .github/
│   └── workflows/
│
├── components/
│   └── reusable HTML components
│
├── pages/
│   ├── home.html
│   ├── about.html
│   ├── use.html
│   ├── demo-page.html
│   ├── notfound.html
│   └── page-specific scripts
│
├── 404.html
├── App.js
├── main.js
├── index.html
├── demo.css
└── README.md
```

The repository also contains a GitHub Actions workflow directory for repository automation.

---

# ⚙️ Application Entry Point

The demo application starts from:

```text
main.js
```

It imports the POWER runtime:

```javascript
import App from "./App.js";
```

Then creates an application instance:

```javascript
const app = new App({
    root: document.getElementById("app"),
    routes: {
        ...
    }
});
```

Finally:

```javascript
app.Run();
```

This starts the runtime.

The current demo defines routes for:

```text
/
 /about
 /use
 /demo-page
 /404
```

and demonstrates route-specific properties on the home and demo pages.

---

# 🧱 App Class

The central implementation is:

```text
App.js
```

The main class is:

```javascript
class App
```

Its constructor accepts:

```javascript
new App({
    root,
    routes,
    authenticate
});
```

### Constructor options

| Option         | Purpose                               |
| -------------- | ------------------------------------- |
| `root`         | DOM element where pages are rendered  |
| `routes`       | Route configuration                   |
| `authenticate` | Reserved authentication configuration |

The default root is `document.body`.

The runtime also maintains:

```javascript
this.pages = new Map();
```

This `Map` stores prepared page templates and their associated props.

---

# 🧭 Routing System

Routes are defined declaratively.

Example:

```javascript
const app = new App({
    root: document.getElementById("app"),

    routes: {
        home: {
            href: "/",
            path: "./pages/home.html",
            props: {
                msg: "Welcome to Power Engine"
            }
        },

        about: {
            href: "/about",
            path: "./pages/about.html"
        }
    }
});
```

Each route requires:

```text
href
path
```

and can optionally contain:

```text
props
```

The runtime validates these values before building the page cache.

---

# 🔗 Navigation

Navigation is handled using the custom:

```html
data-meta-href
```

attribute.

Example:

```html
<a data-meta-href="/about">
    About
</a>
```

Buttons can also be used:

```html
<button data-meta-href="/demo-page">
    Demo
</button>
```

POWER Engine listens for clicks on elements containing this attribute.

The event listener uses:

```javascript
e.target.closest('[data-meta-href]')
```

This also allows nested elements inside navigation controls to work correctly.

---

# 🚀 Client-Side Navigation

When a navigation element is clicked:

```text
User clicks link
      ↓
POWER detects data-meta-href
      ↓
Prevent normal browser navigation
      ↓
Resolve route
      ↓
history.pushState()
      ↓
Load page
      ↓
Inject props
      ↓
Load scripts
      ↓
Render page
```

The browser therefore does not need to perform a complete page reload for every internal route.

---

# 🔙 Browser History

POWER Engine also listens for:

```javascript
window.addEventListener("popstate", ...)
```

This means browser Back/Forward navigation can request the corresponding route again.

For example:

```text
Home
  ↓
About
  ↓
Demo
  ↓
Browser Back
  ↓
About
```

The runtime responds to the browser history change and renders the appropriate page.

---

# 📦 Template Builder

The template preparation process is handled by:

```javascript
TemplateBuilder(routes)
```

For every configured route, POWER Engine:

1. Validates the route
2. Normalizes the route URL
3. Fetches the HTML file
4. Converts the HTML into a DOM structure
5. Extracts its child nodes
6. Creates a `DocumentFragment`
7. Stores the fragment in a `Map`

Conceptually:

```text
Route
  ↓
Fetch HTML
  ↓
HTML string
  ↓
DOM container
  ↓
DocumentFragment
  ↓
pages Map
```

This allows the runtime to prepare the available templates before navigation occurs.

---

# 💾 Page Cache

Prepared pages are stored using:

```javascript
Map
```

A simplified structure looks like:

```javascript
pages.set("/about", {
    fragment,
    props
});
```

This allows the runtime to associate:

```text
Route
+
HTML Fragment
+
Props
```

in one cached page record.

---

# 🧹 Route Normalization

POWER Engine normalizes route paths using:

```javascript
NormalizeRoute(path)
```

This ensures routes have a consistent format.

For example:

```text
about
/about/
/about
```

can be normalized toward the internal route representation:

```text
/about
```

File paths are normalized separately using:

```javascript
NormalizeFilePath(path)
```

This helps keep route identifiers and file paths consistent.

---

# 🧩 Props System

One of POWER Engine's core features is property interpolation.

A route can define:

```javascript
props: {
    msg: "Hello World!"
}
```

The corresponding HTML can contain:

```html
<h1>{{ msg }}</h1>
```

The runtime replaces:

```text
{{ msg }}
```

with:

```text
Hello World!
```

---

# 📝 Text Props

Standard interpolation uses:

```html
{{ value }}
```

Example:

```html
<h1>{{ user.name }}</h1>
```

Given:

```javascript
props: {
    user: {
        name: "Alex",
        role: "Developer"
    }
}
```

the result becomes:

```html
<h1>Alex</h1>
```

Nested properties are resolved using the property path.

For example:

```text
user.name
user.role
```

are resolved through the supplied props object.

---

# 🏷️ Attribute Props

Props can also be injected into HTML attributes.

Example:

```html
<img src="{{ image }}">
```

with:

```javascript
props: {
    image: "/images/profile.png"
}
```

The runtime replaces the placeholder inside the attribute value.

This is useful for dynamic:

* URLs
* image sources
* IDs
* classes
* attributes

The attribute processing happens before the page is inserted into the application root.

---

# ⚠️ Raw HTML Props

POWER Engine supports:

```html
{{{ value }}}
```

for inserting HTML content.

Example:

```javascript
props: {
    value: "<h1>Hello World!</h1>"
}
```

Template:

```html
<div>
    {{{ value }}}
</div>
```

produces actual HTML instead of displaying the markup as plain text.

### Security warning

Raw HTML interpolation can create an HTML injection/XSS vulnerability when the value originates from untrusted user input.

The project explicitly warns:

```text
Triple-brace {{{ }}} enables raw HTML injection.
Only use with trusted data.
```

Therefore:

```text
{{ value }}
```

should be preferred for untrusted text.

Use:

```text
{{{ value }}}
```

only when the HTML source is trusted.

---

# 🧱 Include System

POWER Engine supports reusable HTML and CSS resources through:

```html
<include>
```

Example:

```html
<include
    type="html"
    path="./components/message.html">
</include>
```

The runtime fetches the requested HTML file and replaces the `<include>` element with its contents.

---

# 📄 HTML Includes

Example:

```html
<include
    type="html"
    path="./components/navbar.html">
</include>
```

The engine:

```text
Find <include>
      ↓
Read type
      ↓
Read path
      ↓
Fetch HTML
      ↓
Convert to DocumentFragment
      ↓
Replace <include>
```

This allows pages to share reusable HTML pieces.

---

# 🎨 CSS Includes

CSS files can be loaded using:

```html
<include
    type="css"
    path="./styles/main.css">
</include>
```

The runtime creates:

```html
<link rel="stylesheet">
```

and adds it to the document `<head>`.

Before doing so, it checks whether the stylesheet has already been loaded to avoid adding the same stylesheet repeatedly.

---

# 🔁 Nested Includes

HTML includes can contain additional include elements.

POWER Engine recursively processes them.

For example:

```text
page.html
   │
   └── navbar.html
          │
          └── menu.html
                 │
                 └── item.html
```

The runtime continues processing includes until the current page has no remaining include commands.

This allows a basic component composition system without requiring a frontend component framework.

---

# 📜 Page-Scoped Scripts

POWER Engine treats page scripts differently from ordinary scripts in the loaded HTML.

During page rendering, the runtime searches for:

```html
<script>
```

elements.

Scripts are removed from the cloned page fragment and processed separately.

This gives POWER Engine control over when the script is executed.

---

# 🧪 Inline Scripts

An inline script such as:

```html
<script>
    console.log("Hello");
</script>
```

is wrapped in a function:

```javascript
(() => {
    // original script
})();
```

This provides an isolated execution scope for the inline code.

---

# 📦 External Scripts

External scripts are also supported:

```html
<script src="./pages/test.js"></script>
```

POWER Engine:

```text
Read src
   ↓
Normalize path
   ↓
Fetch JavaScript
   ↓
Create Blob
   ↓
Create Object URL
   ↓
Create <script>
   ↓
Append to root
   ↓
Wait for execution
```

The implementation uses:

```javascript
Blob
URL.createObjectURL()
```

to create a temporary executable resource for the page script.

---

# 🎯 Page-Specific JavaScript

One of the main design goals is to execute scripts only when their corresponding page is rendered.

For example:

```text
Home
 └── home-specific scripts

About
 └── about-specific scripts

Demo
 └── demo-specific scripts
```

Instead of treating every page script as globally active, POWER Engine associates scripts with the page being loaded.

This is one of the main differences between the runtime and a traditional static multi-page setup.

---

# 🖥️ Page Rendering Pipeline

When a route is requested, the runtime executes approximately this pipeline:

```text
Requested Route
      ↓
Find page in pages Map
      ↓
Fallback to /404 if necessary
      ↓
Update browser history
      ↓
Clone template fragment
      ↓
Inject props
      ↓
Find <script> elements
      ↓
Convert scripts into executable resources
      ↓
Clear root container
      ↓
Append rendered fragment
      ↓
Execute page scripts
```

This entire flow is handled by:

```javascript
LoadRequestedPage(key, root, pages)
```

in `App.js`.

---

# 🚫 404 Handling

If a requested route does not exist:

```javascript
pages.get(key) ?? pages.get('/404')
```

is used.

This allows the application to provide a custom 404 page.

The demo includes:

```text
/404
```

which points to:

```text
pages/notfound.html
```

Therefore:

```text
Unknown Route
      ↓
No matching page
      ↓
/404
      ↓
notfound.html
```

The demo also exposes an intentionally invalid `/unknown` navigation link to demonstrate the fallback behavior.

---

# 🛡️ Error Handling

POWER Engine validates important configuration values.

Examples include:

### Missing routes

```text
Undefined routes
```

### Invalid routes object

```text
routes must be an object
```

### Missing route href

```text
Undefined route href
```

### Missing route path

```text
Undefined route path
```

### Invalid props

```text
route.props must be an object
```

### Include errors

Missing:

```text
type
path
```

results in an error.

### Failed resource requests

If an HTML or JavaScript resource cannot be fetched successfully, the runtime throws an error containing the failed path and HTTP status.

---

# 🧪 Demo Application

The repository contains a working demonstration of the runtime.

The demo currently includes:

```text
Home
About
Documentation
Demo
404
```

The demo page specifically demonstrates:

* Route navigation
* Props/state binding
* HTML includes
* Inline scripts
* External scripts
* 404 routing

The demo page receives:

```javascript
props: {
    user: {
        name: "Alex",
        role: "Developer"
    }
}
```

and renders those values using:

```html
{{ user.name }}
{{ user.role }}
```

It also loads an HTML component and demonstrates page-level script execution.

---

# 🧭 Example Route Configuration

A minimal POWER Engine application can look like this:

```javascript
import App from "./App.js";

const app = new App({
    root: document.getElementById("app"),

    routes: {
        home: {
            href: "/",
            path: "./pages/home.html",
            props: {
                title: "Hello POWER"
            }
        },

        about: {
            href: "/about",
            path: "./pages/about.html",
            props: {
                title: "About POWER"
            }
        },

        "404": {
            href: "/404",
            path: "./pages/notfound.html"
        }
    }
});

app.Run();
```

---

# 🧩 Example Template

`pages/home.html`:

```html
<nav>
    <a data-meta-href="/">Home</a>
    <a data-meta-href="/about">About</a>
</nav>

<main>
    <h1>{{ title }}</h1>

    <include
        type="html"
        path="./components/message.html">
    </include>
</main>
```

POWER Engine handles the routing, prop replacement, and component inclusion.

---

# 🔗 Navigation Example

POWER navigation does not require a special router component.

Simply use:

```html
<a data-meta-href="/">
    Home
</a>

<a data-meta-href="/about">
    About
</a>

<button data-meta-href="/demo-page">
    Open Demo
</button>
```

The runtime observes those elements automatically.

---

# 🔄 Rendering Architecture

The framework can be visualized as:

```text
                    ┌─────────────────────┐
                    │      main.js        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       App           │
                    │      Runtime        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
             Routes         Templates        Props
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                     ┌─────────────────┐
                     │ DocumentFragment│
                     └────────┬────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
                 Includes            Scripts
                    │                   │
                    └─────────┬─────────┘
                              ▼
                       Rendered Page
                              │
                              ▼
                         Root Element
```

---

# ⚡ Why No Virtual DOM?

POWER Engine intentionally works with the native DOM instead of implementing a virtual DOM.

The runtime does not attempt to maintain a second representation of the entire application UI.

Instead, it:

```text
Fetches template
      ↓
Creates fragment
      ↓
Processes fragment
      ↓
Replaces application root
```

This keeps the architecture relatively straightforward and makes the implementation useful for learning how browser-level SPA systems can be built.

---

# 🆚 POWER Engine vs Traditional SPA Frameworks

POWER Engine is intentionally much smaller in scope than frameworks such as React, Vue, or Angular.

| Capability                     | POWER Engine |
| ------------------------------ | ------------ |
| HTML templates                 | ✅            |
| Client-side routing            | ✅            |
| Props                          | ✅            |
| HTML includes                  | ✅            |
| CSS includes                   | ✅            |
| Page scripts                   | ✅            |
| History API                    | ✅            |
| Virtual DOM                    | ❌            |
| Component state system         | Basic props  |
| Reactive rendering             | ❌            |
| Built-in state management      | ❌            |
| Build system                   | ❌            |
| Package ecosystem              | ❌            |
| Authentication                 | Placeholder  |
| Production framework ecosystem | ❌            |

The purpose is not to replace a mature frontend framework. It is to provide a lightweight runtime and demonstrate how several core SPA mechanisms can be implemented manually.

---

# 🔐 Authentication Status

The `App` constructor currently accepts:

```javascript
authenticate
```

However, authentication is explicitly marked as a placeholder in the current implementation.

Therefore, POWER Engine should **not** be described as providing a complete authentication or authorization system.

Authentication would need to be implemented as a future feature.

---

# ⚠️ Security Considerations

## Raw HTML Injection

The triple-brace syntax:

```html
{{{ value }}}
```

inserts HTML directly into the DOM.

For example:

```javascript
props: {
    value: "<img src=x onerror=alert(1)>"
}
```

could become dangerous if the data is not trusted.

Therefore:

```text
{{ value }}
```

should be preferred when rendering untrusted text.

Only use:

```text
{{{ value }}}
```

with trusted HTML.

The repository itself explicitly documents this security warning.

---

# ⚠️ Experimental Status

POWER Engine is currently marked:

```text
Experimental / Educational
```

It should therefore be considered a learning project and lightweight experimental runtime rather than a production-ready replacement for established SPA frameworks.

The current implementation is particularly useful for studying:

* DOM manipulation
* client-side routing
* template loading
* browser history
* dynamic script execution
* HTML composition
* property interpolation
* browser APIs

---

# 🌐 Live Demo

A live demonstration of POWER Engine is deployed through GitHub Pages.

You can explore the working demo here:

[POWER Engine Live Demo](https://orpanap.github.io/Custom-web-templating-framework--Power-Engine--simplified/?utm_source=chatgpt.com)

The repository itself also identifies this deployment as the project's preview.

---

# 🚀 Running the Project Locally

POWER Engine does not currently require npm packages or a build step.

The project is composed of browser-native JavaScript modules and static HTML/CSS/JS files.

### 1. Clone the repository

```bash
git clone <repository-url>
cd Custom-web-templating-framework--Power-Engine--simplified
```

### 2. Serve the project through a local web server

Because the runtime loads HTML and JavaScript files using `fetch()`, it is recommended to run it through a local HTTP server instead of opening `index.html` directly with a `file://` URL.

For example, with Python:

```bash
python -m http.server 8000
```

Then open the local server address in your browser.

---

# 📌 Important: Why a Local Server?

POWER Engine loads resources dynamically:

```javascript
fetch(path)
```

This includes:

* HTML pages
* HTML components
* external JavaScript files

Browser security restrictions can prevent these requests from working correctly when the application is opened directly from the filesystem.

A local HTTP server provides the environment expected by the runtime.

---

# 📚 Learning Goals

This project demonstrates how to build several pieces of a frontend framework from scratch.

### 1. Routing

Learn how:

```text
click event
   ↓
route lookup
   ↓
history.pushState()
   ↓
page rendering
```

can replace traditional full-page navigation.

### 2. Templating

Learn how:

```text
{{ value }}
```

can be converted into dynamic content.

### 3. Component loading

Learn how HTML fragments can be fetched and inserted dynamically.

### 4. Script lifecycle

Learn how page-specific JavaScript can be detected, transformed, and executed after the page has been rendered.

### 5. Browser APIs

The project provides practical examples of using:

* Fetch API
* History API
* DOM API
* DocumentFragment
* Blob
* Object URLs
* TreeWalker
* Event delegation

---

# 🔮 Possible Future Improvements

The architecture provides a foundation for additional features.

Possible future improvements include:

* 🔐 Real authentication/authorization
* 🧠 Reactive state management
* 🔄 Reactive prop updates
* 🧩 More advanced component lifecycle
* 🗂️ Layout/template inheritance
* 🛣️ Dynamic route parameters
* 🔍 Route guards
* 🧹 Better cleanup of page resources
* 🛡️ Automatic HTML escaping
* 🧪 Automated test suite
* 📦 Optional package distribution
* ⚡ More efficient template loading
* 📚 Formal API documentation
* 🧰 Development CLI
* 📦 Production build tooling
* 🧩 Plugin architecture
* 🗃️ Better page/component caching
* 🔄 Resource lifecycle management

---

# 🧠 Architecture Summary

POWER Engine can be summarized as five major systems:

```text
1. ROUTER
   Handles navigation and browser history.

2. TEMPLATE LOADER
   Fetches and prepares HTML templates.

3. PROPS ENGINE
   Injects dynamic values into HTML and attributes.

4. INCLUDE SYSTEM
   Loads reusable HTML and CSS resources.

5. SCRIPT RUNTIME
   Detects and executes page-specific JavaScript.
```

Together:

```text
                   POWER ENGINE
                        │
        ┌───────────────┼────────────────┐
        │               │                │
      Router        Templates          Props
        │               │                │
        └───────────────┼────────────────┘
                        │
                  Include System
                        │
                        ▼
                 Script Runtime
                        │
                        ▼
                  Native DOM
                        │
                        ▼
                   Web Page
```

---

# 📄 Project Status

**Experimental / Educational**

POWER Engine is currently best suited for:

* Learning frontend architecture
* Understanding SPA internals
* Experimenting with routing
* Building lightweight prototypes
* Studying browser APIs
* Exploring custom templating systems

It is not currently intended to compete with mature production frameworks.

---

# 👨‍💻 Author

**OrpanAp**

Built with:

**JavaScript + HTML + CSS + Native Browser APIs**

---

# ⚡ POWER Engine in One Sentence

> **POWER Engine is a lightweight, dependency-free JavaScript runtime that turns ordinary HTML files into modular SPA pages through client-side routing, template extraction, props interpolation, includes, and page-scoped script execution.**

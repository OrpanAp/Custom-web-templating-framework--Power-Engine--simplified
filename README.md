⚠️ SECURITY NOTE  
Triple-brace `{{{ }}}` enables raw HTML injection.  
Only use with trusted data.

# POWER Engine

**POWER** stands for **Page Observer with Extraction & Route**.

POWER is a lightweight client-side runtime that observes navigation events, extracts page templates, injects props, and routes content efficiently without full page reloads.

Unlike virtual-DOM frameworks, POWER works directly with native DOM fragments and page-scoped scripts for maximum control and performance.

## Features
- Declarative routing
- HTML template extraction
- Props interpolation
- Script sandboxing via Blob URLs
- Inline include system (HTML/CSS)
- Zero dependencies

## Why POWER?
Designed to optimize runtime performance by:
- Loading only required routes
- Executing page-scoped scripts
- Avoiding global re-renders

This makes POWER ideal for lightweight SPAs and performance-focused applications.

## How to use POWER Engine
Using POWER Engine is easy.

**Routes**
Identification:
```html
<a data-meta-href="/"></a>
<a data-meta-href="/about"></a>
<a data-meta-href="/products"></a>
<a data-meta-href="/services"></a>
//....
```
```html
<button data-meta-href="/"></button>
```

Constructor:
```js
const app = new App({
  routes: {
    home: {
      href: "/",
      path: "/",
      props: {},
    },
    about: {},
    // ...
  }
});
```

Execute:
```js
app.Run();
```

**Dom**
Inject into HTML:
```html
<Include type="html" path="/.html"></include>
```
```html
<Include type="css" path="/.css"></include>
```

**Scripts**
Script inside HTML:
```html
<script>
  (() => { /* logic */ })();
</script>
```

```html
<script type="module">
  (() => { /* logic */ })();
</script>
```

Script from external source:
```html
<script src=""></script>
<script type="module" src=""></script>
```

**Props**
Props as text:
```Html
<div>{{ value }}</div>
```
```js
new App({
  routes: {
    '/':{ props: { value: "Hello World!" }}
  }
});
```

Props as HTML:
```html
<div>{{{ value }}}</div>
```

```js
new App({
  routes: {
    '/':{ props: { value: "<h1>Hello World!</h1>" }}
  }
});
```

## What’s the difference between a vanilla <script> and a POWER <script>?

Have you ever faced an issue where a script tries to execute before the element even exists?

With a vanilla <script>, this often happens because the script may run before the DOM is fully loaded, unless you manually handle it using defer, async, or DOMContentLoaded.

A POWER <script>, on the other hand, executes after the element is rendered. It runs at the very end of the rendering process, ensuring the target elements already exist. POWER is aware of when and where the script should execute, so it runs in a controlled and predictable manner—unlike vanilla scripts.

## Status
Experimental / Educational

## Preview
Site is live at  
https://orpanap.github.io/Custom-web-templating-framework--Power-Engine--simplified/

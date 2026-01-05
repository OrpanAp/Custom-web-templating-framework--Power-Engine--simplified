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

## How to use POWER Engine
Using POWER Engine is easy.

Inject into HTML:
```html
<Include type="html/css?" path="/"></include>
```

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

Props as text:
```Html
<div>{{ value }}</div>
```
```js
new App({
  routes: {
    props: { value: "Hello World!" }
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
    props: { value: "<h1>Hello World!</h1>" }
  }
});
```

Contractor:
```js
const app = new App({
  routes:{
    '/':{
      href:'/',
      path:'/',
      props:{},
  }
});
```

## Status
Experimental / Educational

## Preview
Site is live at  
https://orpanap.github.io/Custom-web-templating-framework--Power-Engine--simplified/

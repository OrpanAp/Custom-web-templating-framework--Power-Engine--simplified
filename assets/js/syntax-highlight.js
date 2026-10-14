/* Dependency-free syntax highlighting for dynamically rendered POWER pages. */
(() => {
  const root = document.getElementById("app");
  if (!root) return;

  const highlightedSource = new WeakMap();
  const escapeHTML = (value) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const wrap = (kind, value) =>
    '<span class="syn-' + kind + '">' + escapeHTML(value) + '</span>';

  const keywords = new Set((
    "async await break case catch class const continue debugger default delete do else " +
    "export extends false finally for from function if import in instanceof let new null " +
    "of return static super switch this throw true try typeof undefined var void while yield " +
    "def elif except pass raise with as lambda True False None"
  ).split(/\s+/));

  const shellCommand = /^(?:git|cd|cp|mv|mkdir|rm|curl|wget|npm|npx|node|python|pip|Set-Location|Copy-Item|powershell(?:\.exe)?|irm|echo|export|sudo|bash|chmod)\b/i;

  function highlightShell(raw) {
    return raw.split("\n").map((line) => {
      if (/^\s*#/.test(line)) return wrap("comment", line);
      const prompt = line.match(/^(\s*)([$>])\s?(.*)$/);
      if (prompt) {
        return escapeHTML(prompt[1]) + wrap("prompt", prompt[2] + " ") +
          wrap("command", prompt[3]);
      }
      const command = line.match(/^(\s*)(\S+)(.*)$/);
      if (command && shellCommand.test(command[2])) {
        return escapeHTML(command[1]) + wrap("command", command[2]) + escapeHTML(command[3]);
      }
      return escapeHTML(line);
    }).join("\n");
  }

  function highlightMarkup(raw) {
    return raw.split(/(<\/?[A-Za-z][^<>]*?>)/g).map((part) => {
      if (!/^<\/?[A-Za-z]/.test(part)) return escapeHTML(part);
      let tag = escapeHTML(part);
      tag = tag.replace(/^(&lt;\/?)([A-Za-z][\w:-]*)/,
        (_, open, name) => open + wrap("tag", name));
      tag = tag.replace(/\s([\w:-]+)(=)/g,
        (_, name, equals) => " " + wrap("attr", name) + equals);
      tag = tag.replace(/=(["'])(.*?)\1/g,
        (_, quote, value) => "=" + quote + wrap("string", value) + quote);
      return tag;
    }).join("");
  }

  function highlightCode(raw) {
    const tokenPattern = /\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b|===?|!==?|=>|[+*/%=!<>-]/g;
    let html = "";
    let last = 0;
    for (const match of raw.matchAll(tokenPattern)) {
      html += escapeHTML(raw.slice(last, match.index));
      const token = match[0];
      let kind = "";
      if (/^(?:\/\/|\/\*|#)/.test(token)) kind = "comment";
      else if (/^["'`]/.test(token)) kind = "string";
      else if (/^\d/.test(token)) kind = "number";
      else if (keywords.has(token)) kind = "keyword";
      else if (/^[A-Za-z_$]/.test(token) &&
        /^\s*\(/.test(raw.slice(match.index + token.length, match.index + token.length + 8))) kind = "function";
      else if (/^(?:===?|!==?|=>|[+*/%=!<>-])$/.test(token)) kind = "operator";
      html += kind ? wrap(kind, token) : escapeHTML(token);
      last = match.index + token.length;
    }
    return html + escapeHTML(raw.slice(last));
  }

  function highlight(pre) {
    const raw = pre.textContent;
    if (!raw.trim() || highlightedSource.get(pre) === raw) return;

    let html;
    const looksLikeShell = /(^|\n)\s*(?:[$>]\s|#\s|git\s|cd\s|cp\s|curl\s|npm\s|node\s|Set-Location\b|Copy-Item\b|powershell\b|python\s|irm\s)/i.test(raw)
      && !/\b(?:const|let|function|class|return|import|export)\b/.test(raw);
    const looksLikeMarkup = /<\/?(?:a|div|include|script|style|h[1-6]|p|img|main|section|button|template|html|body|pre|code)\b/i.test(raw);

    if (looksLikeShell) html = highlightShell(raw);
    else if (looksLikeMarkup) html = highlightMarkup(raw);
    else html = highlightCode(raw);

    pre.innerHTML = html;
    pre.classList.add("syntax-block");
    highlightedSource.set(pre, raw);
  }

  function scan(node) {
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (node.nodeType === Node.ELEMENT_NODE && node.matches("pre:not([data-no-highlight])")) highlight(node);
    node.querySelectorAll?.("pre:not([data-no-highlight])").forEach(highlight);
  }

  scan(root);
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "childList") {
        record.addedNodes.forEach(scan);
        if (record.target.nodeType === Node.ELEMENT_NODE) {
          const parentPre = record.target.closest("pre:not([data-no-highlight])");
          if (parentPre) highlight(parentPre);
        }
      } else if (record.type === "characterData") {
        const parentPre = record.target.parentElement?.closest("pre:not([data-no-highlight])");
        if (parentPre) highlight(parentPre);
      }
    }
  });
  observer.observe(root, { childList: true, characterData: true, subtree: true });
})();

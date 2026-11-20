import React, { useMemo } from "react";

// Minimal HTML sanitizer — only allows safe tags/attrs.
// If you already use `dompurify`, replace this function with `DOMPurify.sanitize(html)`.
function sanitizeHtml(html) {
  if (typeof html !== "string") return "";
  // Remove scripts, styles, event handlers, iframes
  let out = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
  return out;
}

// Convert a minimal subset of markdown to HTML
function renderMarkdown(text) {
  if (typeof text !== "string") return "";
  let html = text;

  // Escape any raw < > to avoid accidental tag injection
  html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Links: [text](url)
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline break-words">$1</a>'
  );

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic: *text* or _text_
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Headings: ### / ## / #
  html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");

  // Horizontal rule
  html = html.replace(/^---+$/gm, "<hr />");

  // Preserve newlines
  html = html.replace(/\n/g, "<br />");

  return html;
}

// Convert raw newline-delimited text to paragraphs while escaping tags
function renderPlainText(text) {
  if (typeof text !== "string") return "";
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Linkify URLs
  const linkified = escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline break-words">${url}</a>`
  );

  // Paragraphs by double newline
  return linkified
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export default function TaskContentRenderer({ content, className = "" }) {
  const html = useMemo(() => {
    if (!content || typeof content !== "string") return "";

    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
    const looksLikeMarkdown = /(^|\n)(#{1,3} |\*\*|[-*] )|\]\(https?:/i.test(content);

    if (looksLikeHtml) return sanitizeHtml(content);
    if (looksLikeMarkdown) return renderMarkdown(content);
    return renderPlainText(content);
  }, [content]);

  return (
    <div
  className={`task-content ${className}`}
  dangerouslySetInnerHTML={{ __html: html }}
/>
  );
}
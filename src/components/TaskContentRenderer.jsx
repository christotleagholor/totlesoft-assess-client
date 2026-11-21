import React, { useMemo } from "react";
import { ExternalLink } from "lucide-react";

// ─────────── helpers (unchanged from before) ───────────

function sanitizeHtml(html) {
  if (typeof html !== "string") return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function renderMarkdown(text) {
  if (typeof text !== "string") return "";
  let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline break-words">$1</a>'
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
  html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");
  html = html.replace(/^---+$/gm, "<hr />");
  html = html.replace(/\n/g, "<br />");
  return html;
}

function renderPlainText(text) {
  if (typeof text !== "string") return "";
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const linkified = escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline break-words">${url}</a>`
  );

  return linkified
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

// ─────────── NEW: detect if content is a single URL ───────────

function isBareUrl(str) {
  if (typeof str !== "string") return false;
  const trimmed = str.trim();
  return /^https?:\/\/\S+$/i.test(trimmed);
}

// ─────────── component ───────────

export default function TaskContentRenderer({
  content,
  sourceUrl = null,       // optional explicit source URL from the task
  className = "",
}) {
  // Detect the URL to show as "View source":
  // 1. `sourceUrl` prop (from task.sourceUrl) takes priority
  // 2. Fall back to `content` if it's a bare URL
  const viewUrl = useMemo(() => {
    if (sourceUrl && /^https?:\/\//i.test(sourceUrl)) return sourceUrl.trim();
    if (isBareUrl(content)) return content.trim();
    return null;
  }, [content, sourceUrl]);

  const html = useMemo(() => {
    if (!content || typeof content !== "string") return "";

    // If content is *just a URL*, render it as a linkified paragraph
    // (so the "View source" button below isn't the only clickable thing)
    if (isBareUrl(content)) {
      const url = content.trim();
      const safe = url
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<p><a href="${safe}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline break-words">${safe}</a></p>`;
    }

    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
    const looksLikeMarkdown = /(^|\n)(#{1,3} |\*\*|[-*] )|\]\(https?:/i.test(content);

    if (looksLikeHtml) return sanitizeHtml(content);
    if (looksLikeMarkdown) return renderMarkdown(content);
    return renderPlainText(content);
  }, [content]);

  const hasContent = html && html.trim().length > 0;
  const showViewButton = Boolean(viewUrl);

  // If nothing to show at all, render nothing
  if (!hasContent && !showViewButton) return null;

  return (
    <div className={`task-content-wrapper ${className}`}>
      {hasContent && (
        <div
          className="task-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}

      {showViewButton && (
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 underline break-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          View source in new tab
        </a>
      )}
    </div>
  );
}
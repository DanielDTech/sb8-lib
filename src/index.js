// Text helpers shared by the sb7 applications. This package has no surface
// of its own: no server, no page, no command. It is exercised through the
// applications built on it.

/** A lowercase, dash separated slug. Characters outside a to z and 0 to 9 become separators. */
export function slugify(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** The five HTML special characters escaped, so any text is safe inside an element. */
export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** The text as is when it fits in `max` characters, otherwise cut with an ellipsis as the last character. */
export function truncate(text, max = 80) {
  const s = String(text ?? '');
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1))}…`;
}

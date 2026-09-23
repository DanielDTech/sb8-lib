// Text helpers shared by the sb7 applications. This package has no surface
// of its own: no server, no page, no command. It is exercised through the
// applications built on it.

const LATIN_FOLDING = new Map([
  ['ß', 'ss'],
  ['ø', 'o'],
  ['đ', 'd'],
  ['ħ', 'h'],
  ['ŧ', 't'],
  ['ı', 'i'],
  ['æ', 'ae'],
  ['œ', 'oe'],
  ['ł', 'l'],
  ['ð', 'd'],
  ['þ', 'th'],
  ['ﬁ', 'fi'],
  ['ﬂ', 'fl'],
  ['ﬀ', 'ff'],
  ['ﬃ', 'ffi'],
  ['ﬄ', 'ffl'],
  ['ĳ', 'ij'],
]);
const COMBINING_MARKS = /[\u0300-\u036f]/g;

function foldLatinLetters(text) {
  let folded = text;
  for (const [letter, plainForm] of LATIN_FOLDING) {
    folded = folded.replaceAll(letter, plainForm);
  }
  return folded;
}

/** A lowercase, dash separated slug. Accented Latin letters fold to their plain form, and the letters with no canonical decomposition fold through the mapping table; every remaining run of characters outside a to z and 0 to 9 becomes one separator. A letter with neither a decomposition nor a table entry is dropped at a word boundary and becomes a separator inside a word. */
export function slugify(text) {
  const withoutAccents = String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '');
  return foldLatinLetters(withoutAccents)
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

/** The text as is when it fits in `max` characters, otherwise cut with an ellipsis as the last character. A `max` below 1 has no room for the ellipsis and yields an empty string. */
export function truncate(text, max = 80) {
  const s = String(text ?? '');
  if (max < 1) return '';
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

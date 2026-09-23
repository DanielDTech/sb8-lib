import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, escapeHtml, truncate } from '../src/index.js';

test('slugify lowercases and joins the words with dashes', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
  assert.equal(slugify('  many   spaces  '), 'many-spaces');
  assert.equal(slugify('punctuation, too!'), 'punctuation-too');
  assert.equal(slugify(''), '');
});

test('escapeHtml escapes the five special characters', () => {
  assert.equal(
    escapeHtml(`<a href="x">Tom & 'Jerry'</a>`),
    '&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;',
  );
});

test('truncate keeps short text and cuts long text with an ellipsis', () => {
  assert.equal(truncate('short', 10), 'short');
  assert.equal(truncate('a'.repeat(20), 10), `${'a'.repeat(9)}…`);
});

test('truncate returns an empty string when max is zero', () => {
  assert.equal(truncate('abcdefgh', 0), '');
});

test('truncate pins the conformant outputs at the low end of max', () => {
  assert.equal(truncate('', 0), '');
  assert.equal(truncate('abcdefgh', 1), '…');
  assert.equal(truncate('a', 1), 'a');
  assert.equal(truncate('abcdefgh', 2), 'a…');
});

test('truncate returns an empty string when max is negative', () => {
  assert.equal(truncate('abc', -5), '');
  assert.equal(truncate('', -1), '');
});

test('slugify folds accented Latin letters to their plain form', () => {
  assert.equal(slugify('Café au lait'), 'cafe-au-lait');
  assert.equal(slugify('naïve'), 'naive');
  assert.equal(slugify('Zürich'), 'zurich');
  assert.equal(slugify('São Paulo'), 'sao-paulo');
  assert.equal(slugify('Ångström'), 'angstrom');
});

test('slugify folds the sharp s through the mapping table', () => {
  assert.equal(slugify('Straße'), 'strasse');
});

test('slugify pins the space to separator route', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
  assert.equal(slugify('First Post'), 'first-post');
});

test('slugify pins the run collapse route', () => {
  assert.equal(slugify('a&b'), 'a-b');
  assert.equal(slugify('  many   spaces  '), 'many-spaces');
});

test('slugify pins the trim and coerce route', () => {
  assert.equal(slugify('punctuation, too!'), 'punctuation-too');
  assert.equal(slugify(''), '');
  assert.equal(slugify(null), '');
  assert.equal(slugify(undefined), '');
});

test('slugify pins the scripts it does not reach', () => {
  assert.equal(slugify('Ωμέγα'), '');
  assert.equal(slugify('Привет'), '');
  assert.equal(slugify('日本語'), '');
});

const FOLD_TABLE_CASES = [
  { letter: 'ø', position: 'interior', input: 'Bjørn', expected: 'bjorn' },
  { letter: 'ø', position: 'interior', input: 'Søren', expected: 'soren' },
  { letter: 'ø', position: 'boundary', input: 'Øst', expected: 'ost' },
  { letter: 'æ', position: 'boundary', input: 'Æon', expected: 'aeon' },
  { letter: 'æ and ø', position: 'boundary and interior', input: 'Ærø', expected: 'aero' },
  { letter: 'ł', position: 'boundary', input: 'Łódź', expected: 'lodz' },
  { letter: 'þ', position: 'boundary', input: 'Þor', expected: 'thor' },
  { letter: 'ð', position: 'interior', input: 'Óðinn', expected: 'odinn' },
  { letter: 'đ', position: 'boundary and interior', input: 'Đorđe', expected: 'dorde' },
  { letter: 'ħ', position: 'boundary', input: 'Ħamrun', expected: 'hamrun' },
  { letter: 'œ', position: 'interior', input: 'Cœur', expected: 'coeur' },
  { letter: 'ı', position: 'boundary and interior', input: 'ılık', expected: 'ilik' },
  { letter: 'ŧ', position: 'interior', input: 'Deaŧnu', expected: 'deatnu' },
  { letter: 'ĳ', position: 'boundary', input: 'ĳsselmeer', expected: 'ijsselmeer' },
  { letter: 'ﬁ', position: 'boundary', input: 'ﬁle', expected: 'file' },
  { letter: 'ﬂ', position: 'boundary', input: 'ﬂow', expected: 'flow' },
  { letter: 'ﬀ', position: 'interior', input: 'oﬀer', expected: 'offer' },
  { letter: 'ﬃ', position: 'interior', input: 'oﬃce', expected: 'office' },
  { letter: 'ﬄ', position: 'interior', input: 'baﬄe', expected: 'baffle' },
];

for (const { letter, position, input, expected } of FOLD_TABLE_CASES) {
  test(`slugify folds ${letter} (${position}): ${input} -> ${expected}`, () => {
    assert.equal(slugify(input), expected);
  });
}

test('slugify pins the letters that already fold today', () => {
  assert.equal(slugify('Malmö'), 'malmo');
  assert.equal(slugify('Kraków'), 'krakow');
});

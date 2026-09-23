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

test('slugify pins the ligature as dropped, not folded', () => {
  assert.equal(slugify('ﬁle'), 'le');
});

test('slugify pins the scripts it does not reach', () => {
  assert.equal(slugify('Ωμέγα'), '');
  assert.equal(slugify('Привет'), '');
  assert.equal(slugify('日本語'), '');
});

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

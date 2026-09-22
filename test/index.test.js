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

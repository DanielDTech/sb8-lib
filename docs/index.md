# sb8-lib architecture

`sb8-lib` is a text utility library shared by the sb7 applications. It has no
surface of its own: no server, no page, no command line, no background worker.
Every behaviour it has is reached by importing it.

## What the code separates into

The repository is small enough that its own separation of concerns produces a
single code area plus the machinery around it. No area needs a file of its own,
so there is no `docs/areas/` directory; adding one before an area exists would
document a structure the code does not have.

### Text helpers — `src/index.js`

The whole public surface, and the only area a change to behaviour touches. It
owns three pure functions, each independent of the others and of any state:

- `slugify(text)` — lowercases, folds accented Latin letters to their plain
  form and `ß` to `ss`, then returns a dash separated slug. Every remaining
  run of characters outside `a-z0-9` becomes one separator; leading and trailing
  separators are stripped. Folding is canonical decomposition with the combining
  marks stripped, plus a mapping table for the letters that do not decompose. A
  letter that neither decomposes nor has a table entry, such as the `ﬁ`
  ligature, is dropped rather than folded.
- `escapeHtml(text)` — escapes the five HTML special characters (`&`, `<`, `>`,
  `"`, `'`) so arbitrary text is safe to place inside an element.
- `truncate(text, max = 80)` — returns the text unchanged when it fits in `max`
  characters, otherwise cuts it so the ellipsis is the last character and the
  result is exactly `max` characters. A `max` below 1 leaves no room for the
  ellipsis, so it yields `''` rather than a string longer than `max`.

Two conventions hold across all three and any function added beside them: the
input is coerced with `String(text ?? '')`, so `null` and `undefined` yield `''`
rather than throwing, and nothing mutates or reads anything outside its
arguments. The module is the package's `main` and its sole `exports` entry, so
adding a function here adds it to the public API and removing or renaming one is
a breaking change for every consumer.

### Test suite — `test/index.test.js`

One test file covering the helpers, using `node:test` and `node:assert/strict`.
No test framework is installed and none should be: the runner is the one built
into Node. Tests import from `../src/index.js`, the same entry consumers use.

### Package manifest — `package.json`

Declares the ES module type, the entry point, and the `test` script. The package
has no dependencies and no devDependencies, and that is a property worth keeping:
consumers pin this repository directly, so anything added here is added to them.

### Continuous integration — `.github/workflows/ci.yml`

One job on every push and pull request: checkout, Node 22, `npm install`,
`npm test`. This is the gate; no pull request merges while it is red or pending.

## Build, run and test

There is no build step. The package ships its source as ES modules and Node
loads `src/index.js` directly.

```
npm test        # runs `node --test` over test/
```

`npm install` exists only to satisfy CI's shape; there is nothing to install.
Node 22 is what CI runs and what local verification should match. Local lint,
type check and test are all covered by `npm test` — the project has no linter
and no type checker, so that one command is the full local verification that
must be green before anything is pushed.

## Delivery

None of web, iOS, Android, API or CLI. This package is not delivered to users on
any platform; it is consumed as source by the sb7 applications, which pin it as a
git dependency to a tag:

```
git+https://github.com/DanielDTech/sb8-lib.git#v0.2.0
```

A release here is therefore a tag, and consumers adopt it by bumping the ref
they pin. The repository has no deployment pipeline: its release stage is merge
to `master`, tag a version, and record the change for the consumers who bump.

Because the package has no surface of its own, it has no platform to be
validated on. It is exercised through the applications built on it, and their
validation is where its behaviour is proven in use; what is provable here is
`npm test` on the merge target.

# Documentation and release notes

Talking Carbon docs are **manual and curated**. They are not pulled from Docker Hub automatically.

## Terminology

| Term | Meaning | Example |
|------|---------|---------|
| **Generation** | Major compatibility family | ECO 1, ECO 2 |
| **Version** | Exact API release (semver string) | `1.1.1`, `1.4.2` |
| **Profile** | Extraction behaviour mode | `standard`, `strict` |
| **Preset** | What users pick in the UI | `eco-1`, `eco-1-strict`, `eco-2` |

Strict is a **profile**, not a version number. Do not label it `1.1 Strict` or `v1T`.

Docker image: `dfoshidero/eco-embodied-carbon-api` ([Docker Hub](https://hub.docker.com/r/dfoshidero/eco-embodied-carbon-api)).  
Website copy uses bare versions (`1.1.1`); Docker tags keep the `v` prefix (`v1.1.1`).

Source of truth: [`src/data/docs.js`](src/data/docs.js) → `ecoPresets`.

## When you publish a new Docker tag

1. **Changelog** — On the current preset (usually `eco-1`), **prepend** an entry:
   - `version` — bare semver (e.g. `1.1.2`)
   - `date` — release month/year
   - `notes` — user-visible bullets (one line is fine for dependency-only releases)

2. **Current version** — Update `currentVersion` on the preset. Update `dockerTag` if the Hub tag changes.

3. **Overview sections** — Edit `sections` only when behaviour, inputs, outputs, accuracy, or limitations change.

4. **New preset** — Add to `ecoPresets` when shipping a new generation (`eco-2`) or a profile that becomes selectable (`eco-1-strict` when strict extraction ships).

5. **Insight picker** — Set `status: "current"` and ensure `getInsightModelOptions()` reflects the new preset.

## What goes where

| Content | Location |
|--------|----------|
| Introduction, how it works, I/O, capabilities, limitations | Preset **Overview** (`sections` on `eco-1`) |
| Per-release notes | **What's new** (`changelog` on current preset) |
| Planned future work | Preset **preview** (`eco-1-strict`, `eco-2`) |
| Pointer to next generation | ECO 1 **Roadmap** section only |

## Example preset shape

```js
{
  id: "eco-1",
  label: "ECO 1",
  generation: 1,
  profile: "standard",
  status: "current",
  currentVersion: "1.1.1",
  compatibleRange: ">=1.1.1 <2.0.0",
  dockerImage: "dfoshidero/eco-embodied-carbon-api",
  dockerTag: "v1.1.1",
  sections: [ /* ... */ ],
  changelog: [ { version: "1.1.1", date: "May 2026", notes: [...] } ],
}
```

## Files to touch

- [`src/data/docs.js`](src/data/docs.js) — `ecoPresets`, `getInsightModelOptions()`, `formatStageLabel()`
- [`src/pages/Support/Support.jsx`](src/pages/Support/Support.jsx) — generation tabs, profile toggle (usually no change unless layout changes)
- [`src/pages/Insight/Insight.jsx`](src/pages/Insight/Insight.jsx) — only if picker behaviour changes

## Future: split extraction and prediction APIs

When endpoints split, extend each preset with optional `extractionVersion` and `predictionVersion` instead of a single `currentVersion`. The preset id (`eco-1`, etc.) stays stable for the UI.

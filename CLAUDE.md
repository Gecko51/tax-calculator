# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No linter or test runner is configured. There are no tests.

## Dependencies

React 18 + Vite 6. No routing, no state management library, no CSS framework, no component library. Vanilla CSS only.

## Architecture

**Single source of truth for all fiscal data:** `src/constants/taxRates.js`
All tax rates, thresholds, and constants for 2025–2026 live here. When fiscal rules change (yearly), only this file needs to be updated. All components and the hook import from it — never hardcode fiscal values elsewhere.

**Calculation logic is isolated in one hook:** `src/hooks/useTaxCalculator.js`
`useTaxCalculator()` accepts all user inputs and returns a single result object (or `null` if inputs are incomplete). It is wrapped in `useMemo` — only recalculates when inputs change. The hook handles three calculation paths:
1. **Cotisations sociales** — flat % of CA, halved if ACRE active
2. **IR via versement libératoire** — flat % of CA
3. **IR via barème progressif** — abattement forfaitaire → `calculerIRProgressif()` → differential between foyer with/without CA income

**State lives entirely in `App.jsx`.** All child components are stateless and receive props. The only exception is `ExpenseTracker`, which holds local form state for the current input row (not yet committed to the parent list).

**`InfoPanel` is a static display component** — it has no props from result and never needs updating when calculation logic changes; only update it when fiscal rules change.

**No routing, no state management library, no CSS framework.** See Dependencies section above.

## Styling

CSS custom properties (design tokens) are defined in `:root` in `src/styles/index.css` — use these tokens for any new styling. Key tokens: `--primary`, `--success`, `--warning`, `--danger` (+ `-light` variants), gray scale `--gray-50` to `--gray-900`, `--radius-sm`/`--radius`/`--radius-lg`, `--shadow-sm`/`--shadow`/`--shadow-lg`.

Responsive breakpoints: `1024px` (single column layout) and `640px` (compact mobile). Font: Inter / system-ui stack.

## Conventions

Locale `fr-FR`, devise EUR. Tous les labels et textes de l'UI sont en francais. Formatage monetaire via `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })`.

## Key data flows

- `depensesTva` (array of expense objects) flows from `App` → `useTaxCalculator` → drives `tva.deductible`. TVA deduction is only computed when `tva_assujetti === true` (CA > seuil majoré).
- The `result` object from `useTaxCalculator` is passed to both `TaxResults` and `TvaStatus`. Both components render `null`/empty state when `result` is `null`.
- TVA status has three mutually exclusive states on `result.tva`: `franchise`, `tolerance`, `assujetti` — exactly one is `true` at any time.
- The `year` state acts as a key to index into taxRates.js objects — e.g., `COTISATIONS_RATES[activityType][year]` — so all rate lookups are year-aware.

## Result object structure

`useTaxCalculator()` returns `null` (inputs incomplete) or an object with these fields:

| Champ | Type | Description |
|---|---|---|
| `ca` | number | CA saisi (parsé) |
| `plafond` / `depasse_plafond` | number / bool | Plafond micro-entreprise et dépassement |
| `cotisations` / `tauxEffectif` / `tauxCotisations` | number | Cotisations sociales et taux (brut & effectif avec ACRE) |
| `acreActive` | bool | ACRE appliqué |
| `impotRevenu` | number | IR calculé (VL ou barème) |
| `impotRevenuDetail` | object | `{ methode, taux, montant }` si VL ; `{ methode, abattement, revenuNetCA, impotBrut, impotBrutSansCA, ... }` si barème |
| `tva` | object | `{ franchise, tolerance, assujetti, seuilFranchise, seuilMajore, collectee, deductible, nette }` |
| `totalPrelevements` / `revenuNet` | number | Somme des charges / net après prélèvements |
| `tauxGlobalEffectif` | number | Taux effectif global (0-1) |

**Helper interne :** `calculerIRProgressif(revenuImposable)` — applique le barème par tranches (`TRANCHES_IR` de `taxRates.js`). Non exportée, utilisée uniquement dans le hook pour le calcul différentiel (IR foyer avec CA − IR foyer sans CA).

## Annual fiscal update (taxRates.js only)

When updating for a new year, add an entry for that year in:
- `COTISATIONS_RATES[activityType][year]`
- `VERSEMENT_LIBERATOIRE_RATES[activityType][year]`
- `CA_PLAFONDS[year]`
- `TVA_SEUILS[year]`
- Update `ACRE` end dates if needed
- Update `year` selector options in `RevenueInput.jsx`

## Fiscal scope and known limitations

This simulator covers only the three standard auto-entrepreneur regimes (BIC Ventes, BIC Services, BNC hors CIPAV). It does not handle: CIPAV-affiliated professions, mixed activities (ventes + services), furnished tourist rentals (meublés de tourisme), geographic exemptions (ZFU/ZRR), or tax credits. IR estimates are indicative only.

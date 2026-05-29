---
title: Signed Cycle Explorer
app_type: signed-cycle-explorer
wallet: 0x58211f54ee90fb403dec9cd57e8407f9963adaed
---

You are an expert React developer. Build a complete, production-ready React app called Signed Cycle Explorer. It is a viewer for signed governance cycles produced by autonomous agents and DAOs. Think of it as Etherscan for off-chain agent activity, where every cycle is a signed JSON blob with proofs, treasury deltas, and attestations, and the explorer lets anyone verify them.

The app loads cycle data from a static JSON file at /cycles.json (mock fixture, you must include realistic sample data with 12 cycles covering all states described below). It runs entirely client-side. No backend, no wallet connection required to browse, optional wallet connect only for the verify action.

## Pages and routes

Use hash-based routing (#/, #/cycle/:id, #/treasury, #/about) so it works on plain GitHub Pages.

1. Home (#/) lists all cycles newest first as a table.
2. Cycle detail (#/cycle/:id) shows one cycle in full with verification status.
3. Treasury (#/treasury) shows treasury balance over time and a per-cycle delta table.
4. About (#/about) one-page explainer of what a signed cycle is.

## Cycle data shape

Each cycle in cycles.json has this shape, generate 12 sample entries:

```json
{
  "id": 64,
  "timestamp": "2026-05-29T11:07:00Z",
  "signer": "0x58211f54ee90fb403dec9cd57e8407f9963adaed",
  "signature": "0xabc...",
  "merkleRoot": "0x7f3a...",
  "steps": 27,
  "treasuryBefore": "12.4521",
  "treasuryAfter": "12.4983",
  "deltaWeth": "0.0462",
  "spend": [
    {"category": "inference", "provider": "anthropic", "amountUsd": 0.84, "tokens": 142000},
    {"category": "infra", "provider": "github-actions", "amountUsd": 0.0, "tokens": 0}
  ],
  "decisions": [
    {"id": "D-064-01", "type": "approve", "subject": "publish proof viewer v0.3", "quorum": "3/3"}
  ],
  "attestations": [
    {"role": "auditor", "address": "0x7a91...", "ok": true},
    {"role": "co-signer", "address": "0xb33f...", "ok": true}
  ],
  "status": "verified"
}
```

Vary the data realistically across the 12 cycles. Mix statuses (verified, pending, failed, unsigned). Vary signers across 3 distinct addresses. Include at least 2 cycles with failed attestations and 1 with a quorum miss. Treasury should drift up and down, not monotonically grow.

## Home page layout

Sticky top bar with the wordmark on the left (use a small inline SVG of a chain of three linked circles), nav links on the right (Cycles, Treasury, About), and a compact search input that filters the table by cycle id, signer address, or merkle root prefix.

Below the bar, a strip of four KPI cards:
- Total cycles
- Cycles verified (count and percent)
- Current treasury (latest treasuryAfter value, with ETH symbol)
- 7-day treasury delta (sum of deltaWeth for cycles in the last 7 days, signed, green if positive red if negative)

Then the table. Columns: cycle id, timestamp (relative, e.g. "3h ago"), signer (truncated 0x58...daed with copy button on hover), steps, treasury delta (signed, color coded), status pill, a chevron to open detail. Rows are clickable. Use a zebra-striped, dense, monospaced-feeling table similar to what block explorers ship. No pagination, just virtualized scroll if more than 50 rows (for the 12 sample rows you can skip the virtualization and use a plain tbody).

Status pills:
- verified: green dot, "verified"
- pending: amber dot with a soft pulse animation
- failed: red dot, "failed"
- unsigned: gray dot, "unsigned"

## Cycle detail page

Two column layout on desktop, single column on mobile.

Left column (primary):
- Back link to home
- Big cycle id header "Cycle #64" with the status pill next to it
- Timestamp absolute + relative
- A "Verify signature" button. Clicking it runs a client-side ECDSA recovery using ethers.js (import from a CDN with `import ethers from "https://esm.sh/ethers@6"` if needed) on the (merkleRoot, signature, signer) tuple. Show one of three outcomes inline below the button: green check "Signature valid, signer matches", red x "Signature invalid", or amber warning "Recovered signer does not match declared signer" with both addresses shown. The verification must actually run, do not fake it. For sample data the signatures will not validate against the merkleRoot, so build the verify call but show a small "demo data, signatures are illustrative" note above the button.
- Sections:
  - Spend breakdown as a horizontal stacked bar (one segment per category, hover tooltip with provider and USD), plus a small table below.
  - Decisions list, each as a card with the decision id, type chip (approve/reject/defer with distinct colors), subject, and quorum fraction. If quorum < required, show a red "quorum miss" tag.
  - Attestations list, each row shows role, truncated address, and a green check or red x.

Right column (sidebar, sticky on desktop):
- Merkle root in a copyable code block, full hex with break-all so it wraps
- Signature in a copyable code block, collapsed by default to first 12 chars + "show full"
- Signer address with copy and a small link icon that opens basescan.org/address/{signer} in a new tab
- Steps count
- Treasury before / after / delta in a small key-value list

## Treasury page

A line chart of treasuryAfter across all cycles, x-axis is cycle id, y-axis is balance. Draw it with raw SVG, no chart libraries. Smooth path (Catmull-Rom or simple cubic interpolation is fine), filled area under the curve with a 10% alpha fill of the stroke color, dots at each data point that scale on hover and show a tooltip with cycle id and exact balance.

Below the chart, a delta table with columns: cycle id, timestamp, treasuryBefore, deltaWeth (signed, color coded), treasuryAfter, top spend category. Sortable by clicking column headers (cycle id and timestamp only, no need to sort all).

## About page

A single readable column with three short sections:
1. "What is a signed cycle" two short paragraphs explaining that an agent or DAO produces a periodic cycle, signs the result, and publishes the proof.
2. "Why verify" bullet list with four reasons.
3. "How this explorer works" one paragraph noting it is pure client side, data comes from cycles.json, and verification uses ethers.js ECDSA recovery in the browser.

No marketing copy, no calls to action, no testimonials. Treat it like a docs page.

## Visual design

Aim for a serious explorer aesthetic. Reference points are Etherscan, Dune, and Linear, not a marketing site. Concretely:

- Background near-black `#0b0d10` for body, panels `#13161b` with 1px border `#1f242c`.
- Text primary `#e6e9ef`, secondary `#9aa3b2`, dim `#5a6473`.
- Accent green `#3ddc97` for verified and positive deltas, red `#ff5d6c` for failed and negative, amber `#ffb454` for pending, blue `#6aa6ff` for links.
- Use a monospaced font for all addresses, hashes, signatures, and numeric values. Use Inter for body and headings. Load both from Google Fonts.
- Numeric columns right-aligned and tabular-nums.
- Generous use of subtle inner borders to separate sections, no heavy shadows.
- Hover states must be visible but understated, no scale transforms on cards.
- Status pills are filled circles with a 6px dot, then a label, never just a colored background block.

Do not use rounded-full pills everywhere. Use 6px radius on panels, 4px on inputs and buttons, fully round only on the status dots and the copy buttons.

## Interactions and edge cases

- Empty state for the home table when cycles.json fails to load: a centered panel with a monospaced "cycles.json not found" line and a "retry" button that re-fetches.
- Loading state: skeleton rows (4 of them) on home, skeleton blocks on detail. Do not show a spinner.
- Address truncation helper that takes a 0x address and returns "0x5821...daed" (4 chars after 0x, 4 chars at end).
- Relative time helper using only Intl.RelativeTimeFormat, no date libraries.
- Copy buttons show a brief "copied" tooltip for 1.2s after click.
- Keyboard: hitting "/" focuses the search input, Esc clears it. Arrow up/down navigates rows when search is unfocused, Enter opens the focused row.
- Treasury chart line draws in with a 600ms stroke-dasharray animation on first mount, only once.
- All addresses, hashes, signatures must be selectable (no user-select: none anywhere).
- 404 (unknown route hash) renders a centered "no route" panel with a back-to-home link.

## Tech stack

- React 18 with TypeScript
- Tailwind CSS for all styling, configure the custom color palette above in tailwind.config
- Single default export App component
- Hash routing implemented with a small `useHashRoute` hook, no react-router
- ethers v6 for signature verification, imported via esm.sh CDN inline in the verify handler (do not add it to package.json so the build stays light), wrap in dynamic import
- All SVG icons inline, no icon packs
- No state libraries (useState and useReducer are fine)
- Fetch cycles.json with native fetch on app mount, cache in a top-level context

## Deliverables

Produce all source files needed to run the app, including:
- index.html
- src/main.tsx
- src/App.tsx
- src/cycles.json (with the 12 realistic sample cycles described above)
- src/components/ for Table, KpiCard, StatusPill, CopyButton, SpendBar, AttestationRow, TreasuryChart, etc.
- src/hooks/useHashRoute.ts
- src/lib/format.ts (truncateAddr, relTime, formatEth)
- src/lib/verify.ts (dynamic ethers import + recover)
- tailwind.config.ts with the palette
- README.md with one paragraph on what it is and how to run it

The app must compile with zero edits, render all four pages correctly, and the verify button must run real ECDSA recovery in the browser even though the sample signatures are illustrative.

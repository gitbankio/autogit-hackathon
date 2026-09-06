---
title: Agent Procurement Dashboard
app_type: agent-procurement-dashboard
wallet: 0x756A9769725aF78F81fb0A9b66300aBb64A0551c
---

Build a polished, fully working React + TypeScript + Vite + Tailwind CSS application called **Agent Procurement Dashboard**. It is an internal enterprise dashboard for reviewing AI agents, APIs, MCP servers, and software vendors before purchase.

The generated app must run immediately with no backend, no API keys, no external services, no external UI libraries, and no icon packages. Use only React state, TypeScript, Tailwind CSS, and inline/local mock data. Export a single default `App` component.

## Product goal

A procurement or AI-governance team should be able to open the dashboard, inspect candidate vendors, see a deterministic PASS / WARN / BLOCK decision, understand why the decision was made, and run a new mock evaluation from a form.

## Layout

Create a responsive enterprise dashboard with:

1. A compact left sidebar on desktop and a simple top navigation on mobile.
2. Header title: **Agent Procurement Dashboard**.
3. Subtitle: **Machine-readable preflight for AI vendors, APIs and agents**.
4. Main content arranged in clean cards with strong spacing and readable typography.

Use a premium dark theme with slate/charcoal surfaces, subtle borders, rounded cards, restrained gradients, and accessible contrast. Do not depend on images or remote assets.

## Summary cards

At the top show four cards derived from the mock vendor list:

- Vendors reviewed
- PASS
- WARN
- BLOCK

Counts must be computed from the data rather than hard-coded separately.

## Vendor data

Create at least 8 realistic mock vendors with fields:

- id
- name
- category
- priceModel
- decision: PASS | WARN | BLOCK
- score: 0-100
- evidenceCoverage: percentage
- lastEvaluated
- strengths: string[]
- risks: string[]
- recommendation

Use categories such as AI model API, data provider, MCP server, agent platform, web automation, enrichment API, compliance tooling, and payments infrastructure.

## Vendor table

Show a responsive table or stacked-card equivalent with:

- Vendor
- Category
- Price model
- Score
- Evidence coverage
- Decision
- Last evaluated

Include:

- Search by vendor or category
- Decision filter: All / PASS / WARN / BLOCK
- Sort by score high-to-low and low-to-high
- Clear visual decision badges

Clicking a vendor must select it and open a detail panel on the same page.

## Vendor detail panel

For the selected vendor show:

- Vendor name and category
- Large score
- PASS / WARN / BLOCK badge
- Evidence coverage progress bar
- Strengths list
- Risks list
- Recommendation
- A small evidence summary section with mock items such as pricing transparency, security documentation, terms available, data handling policy, uptime evidence, and support channel.

The panel should feel useful to an enterprise reviewer, not like a generic demo.

## New evaluation form

Add a section titled **Run procurement preflight** with form fields:

- Vendor / service name
- Website or endpoint
- Category select
- Pricing transparency: Yes / Partial / No
- Security documentation: Yes / Partial / No
- Terms available: Yes / No
- Data handling policy: Yes / Partial / No
- Public support channel: Yes / No

On submit, calculate a deterministic score in the browser:

- Start from 50
- Add points for strong evidence and transparency
- Subtract points for missing security, terms, or data-policy evidence
- Clamp score between 0 and 100
- PASS for 80-100
- WARN for 55-79
- BLOCK below 55

Also calculate evidence coverage from the completed evidence fields. Show the new result immediately in a result card with score, decision, short strengths, risks, and recommendation. No network request is allowed.

## UX requirements

- All buttons and controls must work.
- Search, filtering, sorting, selection, and the evaluation form must be functional.
- Provide useful empty states when filters return no vendors.
- Use semantic HTML and keyboard-friendly controls.
- Make it visually polished at desktop and mobile widths.
- Avoid decorative complexity that could break compilation.
- Do not reference undefined packages, images, APIs, environment variables, or backend endpoints.

## Technical constraints

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Functional components and hooks only
- No router required; keep it as one self-contained dashboard screen
- No external UI/component/icon/chart libraries
- No fetch calls
- No backend
- No authentication
- No placeholder TODOs
- The app must compile and render on first generation

The final result should look like a credible procurement operations product that an enterprise team could use in a demo, with strong information hierarchy and deterministic local behavior.
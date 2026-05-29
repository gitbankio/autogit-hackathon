---
title: Invoice Maker for Freelancers
app_type: invoice-maker
wallet: 0x44858fB397e5bf6B6cC7C65FCddcA47E782539F9
---

Build a single-page invoice maker for freelancers. The whole thing is one screen with a form on the left and a live, print-ready invoice preview on the right. People who Google "free invoice generator" should land on this and never need anything else.

## Who this is for

A freelance designer, developer, writer, or consultant who sends 1 to 10 invoices a month, does not want a SaaS account, and just needs a clean PDF-quality invoice they can print to PDF from the browser. They will fill out the form, save their business profile in localStorage so they do not retype it next month, and print.

## Top level layout

Two columns on desktop, single column stacked on mobile (form on top, preview below).

Header strip across the top:
- Wordmark on the left, in a serif font, says "Ledger" with a small dot after it
- Three buttons on the right: "New invoice", "Save draft", "Print"
- "Print" button calls window.print() and triggers a print-only stylesheet that hides everything except the preview pane, sized to A4

Form column (left, 40% width on desktop):
- Sticky to the viewport
- Scrolls internally if the form is taller than the viewport

Preview column (right, 60% width):
- Renders the invoice as it will print
- Updates live as the form changes
- White paper background, soft drop shadow to feel like a sheet sitting on the desk

## Form fields, in order

Group 1: Your business
- Business name (text)
- Your name (text)
- Email (text)
- Address (multiline)
- Logo upload (file picker, accepts png and svg, stored as data URL in localStorage, optional)

Group 2: Client
- Client name (text)
- Client email (text)
- Client address (multiline)

Group 3: Invoice details
- Invoice number (text, auto-filled with "INV-" + current date in YYYYMMDD format, editable)
- Issue date (date input, defaults to today)
- Due date (date input, defaults to today + 14 days)
- Currency (select: USD, EUR, GBP, AUD, CAD, JPY, INR, default USD)

Group 4: Line items
- Repeating block. Each row has: description (text), quantity (number, default 1), unit price (number, two decimal places), and a remove button
- "Add line item" button at the bottom of the list
- The first row should be pre-populated as an empty editable row so the user sees the shape

Group 5: Adjustments
- Tax rate (number, percent, default 0)
- Discount (number, currency amount, default 0)
- Notes (multiline, optional, free text, appears at the bottom of the invoice for things like payment instructions or thank-you notes)

The "Your business" group should collapse into a summary line ("Business: Acme Studio") once filled, with an edit pencil to reopen. Same behavior for "Client" once a client name is entered. This keeps the form short during the actual invoice flow.

## Preview rendering

The preview is a single A4-shaped panel (aspect ratio 1 to 1.414) with internal padding around 56 pixels. Inside, top to bottom:

1. Top row: logo on the left (if present), the word "Invoice" in large serif on the right
2. Below the top row, two columns side by side: business block on the left, client block on the right. Each block has the name in bold, then the address and email in smaller text.
3. A thin divider line
4. Three meta rows: Invoice number, Issue date, Due date. Each row is a small label on the left and value on the right, right-aligned.
5. The line items table. Columns: Description, Qty, Unit price, Amount. The amount column is qty times unit price, computed live. Numeric columns right-aligned, tabular figures.
6. Below the table, a totals stack on the right (about 40% of the width): Subtotal, Tax (only if tax rate > 0), Discount (only if discount > 0, shown as a negative line), Total. Total is in bold, slightly larger.
7. Notes block at the bottom, italic, smaller, only if notes is not empty.

## Calculations

- Per-line amount = qty * unit price
- Subtotal = sum of all line amounts
- Tax amount = subtotal * (tax rate / 100)
- Total = subtotal + tax amount - discount
- All money values formatted with the selected currency code (use Intl.NumberFormat). Use two decimal places except JPY which uses zero.

If the user enters a negative quantity or negative unit price, clamp to zero silently.

## Visual design

Professional, neutral, document-like. Not crypto, not techy, not a SaaS landing page. Closer to Stripe's invoice emails or Notion's print view.

- Page background: warm off-white #F7F5F1
- Form column background: solid white panel with a 1px border #E5E1D8
- Form labels: small caps, 11px, letter-spacing 0.06em, color #6B655B
- Form inputs: 14px, border #D9D4C8, focus ring 2px in #1F2937, no shadow
- Buttons: filled charcoal #1F2937 for primary, ghost (border only) for secondary
- Preview "paper": pure white #FFFFFF, drop shadow rgba(0,0,0,0.08) blur 20px y-offset 4px
- Invoice typography: Playfair Display or another transitional serif for the word "Invoice" and the business name, Inter for everything else. Load both from Google Fonts.
- Numeric values use tabular-nums and a slightly tighter line height
- Accent color used only for the "Total" label: a deep ink blue #1E40AF

## Local persistence

- The user's business profile (business name, your name, email, address, logo data URL) is saved to localStorage under the key `invoice-maker.profile` automatically as they type, with a 400ms debounce
- The most recent client and the most recent invoice (number, dates, items, tax, discount, notes) is saved under `invoice-maker.draft`. On load, if a draft exists, restore it.
- "New invoice" clears the draft (after a confirm dialog) but keeps the business profile.
- "Save draft" is a no-op visually (since autosave runs), but flashes a small "Saved" pill near the button for 1.2 seconds so the user feels in control.

## Print behavior

When the user clicks "Print", the page enters print mode:
- A print-only CSS rule hides the form column, the header strip, and the preview's drop shadow
- The preview pane expands to fill the printable area at exactly A4 size
- Background colors are set to print (color-adjust: exact)
- Page margins set to 0 so the invoice fills the page

The print preview that the browser opens should look identical to the on-screen preview, full bleed white paper with the invoice content.

## Edge cases the AI must handle

- Zero line items: show an empty placeholder row in the preview that says "No line items yet" in light gray italic
- Very long descriptions: wrap inside the cell, do not overflow the column
- Negative or zero totals: still render, do not show errors
- Missing logo: leave the top-left empty, do not show a broken image
- Currency JPY: zero decimal places, comma thousands separator, ¥ symbol
- Browser without crypto.randomUUID: fall back to Date.now() + Math.random() for unique IDs
- A4 preview must not overflow the viewport on narrow screens, scale down with transform: scale() if needed while keeping aspect ratio

## Tech stack

- React 18 with TypeScript
- Vite as the build tool
- Tailwind CSS, with the custom palette wired into tailwind.config.ts
- No state management library. useState and useReducer only.
- No date library. Use the native Date object and Intl.DateTimeFormat.
- No PDF library. Browser print is the export mechanism.
- One default export App component. Components broken out into src/components/ as makes sense (Form, Preview, LineItemRow, TotalsBlock, etc.)
- Helpers in src/lib/ for money formatting, persistence (localStorage with try-catch), and clamp utilities.

## Files the codegen must produce

- index.html with print stylesheet linked
- src/main.tsx
- src/App.tsx
- src/components/InvoiceForm.tsx
- src/components/InvoicePreview.tsx
- src/components/LineItemRow.tsx
- src/components/TotalsBlock.tsx
- src/lib/money.ts
- src/lib/storage.ts
- src/styles/print.css
- tailwind.config.ts
- package.json with only react, react-dom, and vite + tailwind as deps
- README.md, two short paragraphs: what it is, how to run it

## Acceptance criteria

The app passes if a freelancer can:
1. Open it, fill out their business once, see it persist on refresh
2. Type a client and three line items in under 60 seconds
3. Click Print and get a clean A4 invoice with their logo, totals, and notes
4. Close the tab, reopen tomorrow, and see their last invoice draft restored

If any of those four flows requires manual code edits, the template has failed.

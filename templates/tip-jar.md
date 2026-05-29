---
title: Tip Jar Page
app_type: tip-jar
wallet: 0x44196D512Dc6eE1C208F8fa6Df3fE23F39B577dE
---

I want a single page tip jar. Something I can host on a free static host and share as one URL. No login, no backend, no analytics. Just a page that says who I am, lists a few wallet addresses people can tip, generates QR codes on tap, and has a small amount picker that opens a payment URI in any decent crypto wallet on mobile.

The page must look like a real person made it for themselves, not a SaaS product. Cold studio black background, a single warm accent in burnt orange, generous whitespace, no rounded everything. Think a self hosted page for a writer or open source maintainer, not a Cash App clone.

**The hero.** Top of the page sits a small block, max width 560px, centered. A 64px circular avatar on the left (with the owner's first initial as a fallback if no image is set, drawn in the accent color over a soft panel background). To the right of the avatar, the owner's display name in 22px medium weight, and one line of bio underneath in 14px muted. Below the avatar and name, one row of small social pills (twitter, github, mastodon, website), each pill is a 28px round button with an inline SVG glyph, the pill is just a 1px border and shows nothing if that social link is empty in config. The whole hero is quiet, almost a card title.

**The currencies.** Below the hero, a vertical stack of currency cards. Each card is full width up to the 560px container, 88px tall when collapsed, expands to 320px tall when the QR is opened. From left to right inside the card: a 36px round chain glyph drawn inline (a stylized B with the Base sans serif treatment for Base, an orange B for Bitcoin, a purple S for Solana, a hex outline for Ethereum), then a stacked label (network name in 13px small caps in muted text, address truncated in 15px monospaced, in the format 0xd8dA...96045 for ethereum addresses and similar for others), then on the right two icon buttons, a copy glyph and a QR glyph. The copy button copies the full address and flashes a small "copied" pill in the accent color for 1.4 seconds. The QR button toggles the card open, animating the height over 240ms, and renders a QR encoding the chain's payment URI for that address (no amount preset, just the address). The QR is 180px square, sits in white card padding inside the expanded portion of the card with the address printed below it in monospace 12px.

The seed list of currency cards is fixed at four, in this order, and each has a real demo address baked in.

1. Base mainnet, ETH and USDC on the same address, address `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`, chain id 8453.
2. Ethereum mainnet, address `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`, chain id 1.
3. Bitcoin mainnet, address `bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq` (a well known example bech32 address from the BIP examples, replace in your own copy).
4. Solana mainnet, address `So11111111111111111111111111111111111111112` (this is the wrapped SOL mint, a recognizable Solana address format, replace in your own copy).

These addresses are demo only. The owner can replace them in the settings sheet described later.

**The quick tip strip.** Sitting between the hero and the currency stack, a small horizontal strip with five preset amount buttons. The buttons read $1, $5, $10, $25, and Custom. They are 44px tall, 60px wide except Custom which is wider, ghost style with a 1px border in dim cream, the selected one fills with the accent orange and switches text color to deep black. When an amount is selected, a small line appears under the strip that says "Tip $5 in ETH on Base" and shows a thin button labeled "Open wallet" on the right. Tapping "Open wallet" constructs an EIP 681 URI and triggers a window.location.assign on it. For ETH on Base at $5 with a baked rate of $2400 per ETH, the URI is `ethereum:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@8453?value=2083333333333333` (5 divided by 2400 times 1e18, rounded). Mobile wallets like Rainbow and Metamask open from this URI. Desktop wallets often handle it via the wallet's browser extension intercept.

Selecting Custom expands a small number input that accepts a USD value with two decimals. The same calculation applies. If the user has not selected an amount, no link line shows.

**The chain switch.** Above the amount strip, a tiny tab row that lets the tipper choose which chain the quick tip should go to. Tabs: Base, Ethereum, Bitcoin, Solana. Defaults to Base. The URI scheme switches accordingly. For Bitcoin the URI is `bitcoin:<address>?amount=<btc>`. For Solana the URI is `solana:<address>?amount=<sol>&label=<displayName>&message=Tip`. The conversion to crypto units uses a baked rate table inside the page (1 ETH = 2400 USD, 1 BTC = 60000 USD, 1 SOL = 140 USD). The rate table sits in `src/lib/rates.ts` and the owner can edit it through the settings sheet. A tiny line under the strip reads "rates cached, owner editable" in 11px italic muted text. This line is honest framing, not a feature.

**The thanks wall.** Below the currency cards, a small panel labeled "Recent thanks". It contains five static demo tip entries with anonymized sender names like "crypto_friend.eth tipped 5 USDC", "@indiehacker tipped 0.001 ETH", "anonymous tipped $1", "n0vember.lens tipped 0.05 SOL", "luca tipped 25 USDC". Each row has a small accent dot on the left, the sender name in 14px regular, the amount in 14px medium, and a relative timestamp on the right in 12px muted. This list is fake demo data, the owner cannot edit it through the settings sheet, and a small note in 11px italic muted reads "demo wall, real tips do not appear here". The owner can hide this wall entirely with a single toggle in settings. The wall exists to make the page feel warm on first paint, not to imply onchain activity.

**The settings sheet.** A small gear button in the top right of the page opens a slide over sheet on the right side of the screen (or full screen on mobile). Inside the sheet, a form with these fields, in this order. Display name (text, required), bio (text, optional, max 140 chars with a counter), avatar emoji or single letter (text input that accepts one to two characters, used if no avatar image is set), avatar image URL (text, optional, validates as a URL on blur). Then a section for socials with four URL inputs labeled twitter, github, mastodon, website. Then a section for currencies, four rows matching the seed list, each row lets the owner change the address and toggle the card on or off. Then a section for rates with three number inputs (ETH USD, BTC USD, SOL USD). Then a section for the thanks wall, just one toggle, on or off. At the bottom of the sheet, three buttons: Save, Cancel, and Export config. Save persists to localStorage and updates the URL hash. Cancel discards changes. Export config opens a small modal showing the encoded URL ready to copy, with the format `https://your-host.example/#config=<base64>`.

**URL hash configuration.** The whole config is encodable in the URL hash. On page load, the app reads the hash, if there is a `config=` value, base64 decodes it, parses the JSON, and uses it as the source of truth. If there is no hash, falls back to localStorage. If there is no localStorage either, falls back to the seed data baked in the prompt. When the owner edits and saves, the hash updates in place so they can copy the URL anytime. This makes the page fully shareable as a single URL with no server.

**QR generation.** Use the `qrcode` npm dependency. Render to SVG strings inside React. The QR encodes the payment URI for the card's chain, not just the raw address, so scanning with a wallet camera opens the wallet to the right network. Error correction level M, white background, near black foreground at #0a0a0a so the QR pops against the white card portion. Module padding 8 modules around the data. The QR rerenders if the owner changes the address or if a tipper changes the amount on the chain switch row.

**Mobile.** Single column under 720px viewport. The settings sheet covers the whole screen instead of sliding from the right. The currency cards are still 88px tall but the chain glyph and address share a stacked layout if needed. The QR opens as a full screen takeover modal rather than expanding the card inline.

**Edge cases.** No avatar image and no initial set, render the accent colored letter "T" by default. Bio over 140 chars truncates the input. Address that fails simple format validation (starts with 0x and 40 hex for EVM, starts with 1, 3, or bc1 for BTC, base58 for Solana) shows a small warning on the card under the address line that reads "address format check failed", the card still renders the QR but with a yellow border. The yellow is `#D4A24C`. Selecting Custom amount with empty input shows the link line with the amount as `$0.00` and the Open wallet button is disabled. If `qrcode` fails to render for any reason, the card shows a textual fallback inside the QR area that says "scan unavailable, copy the address above" in 13px muted italic.

**Loading.** Synchronous. The owner config is in the URL hash or localStorage so the first paint includes everything. No spinner, no skeleton. If the hash is malformed base64 or malformed JSON, the page logs a warning to console once and falls back to seed data silently.

**The look.** Background `#0a0a0a`, page accent orange `#FF6B2C`, panel background `#141414`, panel border `#1f1f1f`, primary text `#EDEDED`, muted text `#9A9A9A`, dim text `#5F5F5F`, warning yellow `#D4A24C`. White inside the QR portion of an open card. The accent is used sparingly, only on the selected amount button, the copy confirmation pill, the avatar initial, and the thanks wall row dots. Type uses Inter for everything, with IBM Plex Mono for addresses and amounts in cards. Tabular figures wherever numbers appear. Both fonts loaded from Google Fonts. Corners are 6px on panels and cards, 999px on the round social pill buttons and the avatar, 4px on inputs and buttons inside the settings sheet. No blur effects, no glassmorphism, no gradients. One subtle drop shadow on the settings sheet only, `0 8px 24px rgba(0,0,0,0.4)`.

**Motion.** QR open animates the card height over 240ms cubic ease out. Selected amount button transition is 80ms color change only. Copy confirmation pill fades in over 120ms and out over 200ms. No spinners, no continuous animations, no parallax.

**Keyboard.** The chain tabs are reachable by tab and switchable with arrow keys. Pressing C with the page focused copies the currently selected card's address. Pressing 1 through 5 selects amount presets. Pressing Q toggles the QR on the currently selected card. Esc closes the settings sheet if open or collapses any open QR.

**Tech.** React 18 with TypeScript. Tailwind CSS for all styling, with the custom palette extended in tailwind.config.ts. Vite as build tool. Single default `App` export from src/App.tsx. No state libraries, useState and useReducer only. No date library, native Date and Intl only. No icon packs, all glyphs inline SVG. The only npm dependency outside the base stack is `qrcode` for QR generation, which is a utility library not a UI library.

Files to produce.

1. index.html with Google Fonts link.
2. src/main.tsx.
3. src/App.tsx (single default export, hosts all top level state).
4. src/components/Hero.tsx.
5. src/components/QuickTipStrip.tsx.
6. src/components/ChainTabs.tsx.
7. src/components/CurrencyCard.tsx.
8. src/components/ThanksWall.tsx.
9. src/components/SettingsSheet.tsx.
10. src/components/CopyButton.tsx.
11. src/lib/uri.ts (EIP 681 builder for ETH and Base, bitcoin URI builder, solana URI builder, exact unit conversion in wei, satoshi, lamport).
12. src/lib/qr.ts (thin wrapper around the `qrcode` library that returns an SVG string).
13. src/lib/config.ts (base64 encode and decode, URL hash read and write, localStorage read and write with try catch).
14. src/lib/rates.ts (rate table and USD to crypto conversion helpers).
15. src/lib/format.ts (address truncation, currency formatting, relative time for the thanks wall).
16. tailwind.config.ts.
17. package.json with react, react dom, vite, tailwind, qrcode.
18. README.md with one short paragraph on what it is and one on how to run and host it.

**The seed config baked in for first paint.**

```json
{
  "name": "Lena Park",
  "bio": "open source maintainer, occasional tip welcome",
  "avatarLetter": "L",
  "avatarUrl": "",
  "socials": {
    "twitter": "https://twitter.com/example",
    "github": "https://github.com/example",
    "mastodon": "",
    "website": "https://example.com"
  },
  "currencies": [
    { "id": "base",     "label": "Base",     "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "chainId": 8453, "enabled": true },
    { "id": "eth",      "label": "Ethereum", "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "chainId": 1,    "enabled": true },
    { "id": "btc",      "label": "Bitcoin",  "address": "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",                  "enabled": true },
    { "id": "sol",      "label": "Solana",   "address": "So11111111111111111111111111111111111111112",                  "enabled": true }
  ],
  "rates": { "ethUsd": 2400, "btcUsd": 60000, "solUsd": 140 },
  "thanksWall": true
}
```

**Done when.** A first time visitor lands on the page and within five seconds sees the owner's name, bio, four tippable chains, and a wall of recent tips that feels alive. They tap a QR on the Base card and a clean black on white QR appears that any phone wallet can scan. They tap $5 on the chain switch row, the link line shows, they tap Open wallet on a phone and their wallet app opens to a prefilled send screen at the right address with the right network. The owner opens settings, changes their bio and one address, hits Export config, and gets a single URL they can share that contains their entire page. Reloading from the URL produces the same page on any device with no setup.

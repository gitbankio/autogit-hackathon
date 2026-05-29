---
title: Crypto News Sentiment Feed
app_type: crypto-sentiment-feed
wallet: 0x52Ab53912D37759B2ad364f22dD06B16714b6C06
---

Build a production-quality real-time crypto news sentiment dashboard as a single React TypeScript app using Tailwind CSS. The app displays a live stream of crypto news headlines scored as bullish, bearish, or neutral, with trend charts, asset filtering, and a sentiment summary panel.

## Layout

Full-viewport dark dashboard. Fixed top bar, then a three-column body below it filling remaining height. No page scroll — each panel scrolls internally.

- **Top bar** (full width, ~56px): Logo text "SentimentFeed" in indigo, live timestamp updating every second, a marquee-style ticker strip scrolling asset names with their current sentiment score (BTC +0.72 ▲, ETH -0.31 ▼, SOL +0.44 ▲, etc.), and a global market mood pill (RISK ON / RISK OFF / NEUTRAL)
- **Left panel** (~220px): Asset filter + sentiment summary stats
- **Center panel** (flex-grow): Live headline feed
- **Right panel** (~300px): Trend chart + top movers

## Color scheme

Background: `#060b18`. Cards/panels: `#0d1424`. Borders: `#1a2540`. Bullish: `#10b981` (green). Bearish: `#ef4444` (red). Neutral: `#6b7280` (gray). Primary accent: `#818cf8` (indigo-400). Text primary: `#e2e8f0`. Text muted: `#64748b`. Panel headers: `#94a3b8`.

## Ticker Strip (top bar)

Horizontally scrolling marquee using CSS animation (`@keyframes scroll`). Show 12 assets cycling: BTC, ETH, SOL, BNB, AVAX, LINK, ARB, OP, BASE, MATIC, DOT, ADA. Each shows: asset symbol, sentiment score (-1.0 to +1.0), and a colored up/down triangle. Scores update every 10 seconds with small random drift.

## Left Panel — Asset Filter & Stats

**Asset selector**: Grid of toggle buttons, 3 per row, for 12 assets. Active assets highlighted with indigo border. Selecting/deselecting filters the headline feed. "All" button to reset.

**Sentiment summary** below: Three stat boxes:
- BULLISH: count of bullish headlines in last hour (green)
- BEARISH: count of bearish headlines in last hour (red)  
- NEUTRAL: count of neutral headlines in last hour (gray)

Below that: **Overall Score** — a large number from -1.0 to +1.0, color-coded, labeled "Market Sentiment Index". Below it a thin horizontal bar: left half red (bearish), right half green (bullish), with a white marker showing current position.

**Signal strength meter** at bottom: four filled bars (like WiFi signal) colored by confidence level.

## Center Panel — Headline Feed

Scrollable list of 30 headlines, newest at top. New headlines animate in from the top every 4–6 seconds using setInterval. Each headline card:

- Left border 3px: green (bullish), red (bearish), or gray (neutral)
- Asset badge(s): small colored pill(s) for mentioned assets (BTC, ETH, etc.)
- Headline text: one line, truncated with ellipsis
- Source name in muted text (e.g. "CoinDesk", "The Block", "Decrypt", "Bloomberg Crypto", "CryptoSlate")
- Sentiment score badge: e.g. "+0.82" in green or "-0.61" in red
- Time: "just now", "1m ago", "3m ago" etc., updating in real time
- On hover: card background lightens slightly, full headline visible via title attribute

Pool of 40+ realistic headline templates to cycle through randomly, filling in asset names dynamically:
- "{asset} surges {n}% as institutional demand hits record levels"
- "Analysts warn {asset} faces resistance at key technical level"
- "DeFi protocol built on {asset} crosses $1B TVL milestone"  
- "SEC delays decision on {asset} ETF application for third time"
- "Whale wallet moves {n}M {asset} to exchange — sell signal?"
- "{asset} network records lowest transaction fees in 18 months"
- "Major bank initiates {asset} custody service for institutional clients"
- "On-chain data shows {asset} accumulation at current price levels"
- "Layer 2 built on {asset} achieves 50,000 TPS in stress test"
- "{asset} correlation with equities reaches 6-month high"

## Right Panel — Trend Chart & Top Movers

**Sentiment trend chart** (top half of right panel): SVG line chart showing overall market sentiment score over the last 60 minutes. X-axis: time labels every 10 minutes. Y-axis: -1.0 to +1.0 with a horizontal dashed line at 0. Line colored green above 0, red below 0. Fill area under the line with 20% opacity matching color. Plot 61 data points (one per minute), update by shifting left and appending a new point every 60 seconds. No external chart library — pure SVG with TypeScript.

**Top Movers** (bottom half of right panel): Title "Top Movers (1h)". Two sections side by side:
- 🔥 Most Bullish: top 3 assets ranked by sentiment score, show score and a small green bar
- 📉 Most Bearish: bottom 3 assets ranked by sentiment score, show score and a small red bar

Update rankings every 30 seconds.

## Mock data and simulation

Define all mock data as TypeScript interfaces and constants in App.tsx. Use `useState`, `useEffect`, and `useCallback` for all state. No external API calls. All simulated updates must use setInterval with cleanup functions returned from useEffect.

Seed the feed with 20 headlines on initial render using `useMemo`. Generate timestamps spread over the last 15 minutes.

Define a `SentimentScore` type as `number` between -1 and 1. Define `Headline` interface with: `id`, `asset: string[]`, `text`, `source`, `score: SentimentScore`, `timestamp: Date`, `sentiment: 'bullish' | 'bearish' | 'neutral'`. Sentiment is derived: score > 0.1 = bullish, score < -0.1 = bearish, else neutral.

## Technical requirements

- Single file: `App.tsx` exporting default `App`
- TypeScript with explicit types for all data structures and component props
- Tailwind CSS only — no external CSS files, no styled-components
- No external component libraries or icon packages (use emoji or Unicode characters)
- CSS keyframe animation for ticker defined using a `<style>` tag rendered inside the component
- All `useEffect` hooks must return cleanup functions
- Compile and render with zero errors and zero TypeScript warnings on first try

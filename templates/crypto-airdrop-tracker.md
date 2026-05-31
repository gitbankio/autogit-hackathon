---
title: Crypto Airdrop Tracker & News
app_type: crypto-airdrop-tracker
wallet: 0x1e660a9a1f1f08afef9c03c96d66260122464cf2
---

You are an expert React developer. Generate a complete, production-ready React application for a crypto airdrop tracker and news site.

**App Overview:**
A dark-themed web app that lets users browse confirmed & potential crypto airdrops alongside daily crypto news. No login required. All data is mock/static.

**Pages & Routes:**
- `/` — Home: hero section with tagline, featured airdrops row, and latest news preview
- `/airdrops` — Airdrop Tracker: filterable table of airdrops
- `/news` — News Feed: grid of news cards

**Airdrop Tracker (`/airdrops`):**
- Search bar to filter by project name
- Filter tabs: All | Confirmed | Potential | Ended
- Table columns: Project (logo + name), Category (DeFi / L1 / L2 / NFT), Status badge (Confirmed = green, Potential = yellow, Ended = gray), Estimated Value, End Date, Action button ("Check Eligibility" opens a modal with placeholder wallet input)
- Include at least 8 mock airdrop entries covering: Berachain, Monad, Sui, ZKsync, LayerZero, Scroll, Linea, StarkNet

**News Feed (`/news`):**
- Grid of news cards (3 columns desktop, 1 mobile)
- Each card: category tag (DeFi / Regulation / L2 / Bitcoin), headline, 2-line excerpt, source name, time ago
- Include at least 6 mock news articles

**Shared Components:**
- Navbar: logo ("Ouwibo"), nav links (Home / Airdrops / News), dark background
- Footer: tagline, links, "No signup required" badge

**Design System:**
- Dark theme: background `#0f172a`, card `#1e293b`, accent `#6366f1` (indigo)
- Font: Inter
- Status badges use colored pill shapes
- Fully responsive with Tailwind CSS utility classes

**Technical Constraints:**
- Export a single default App component with client-side routing using react-router-dom
- No external UI libraries (no shadcn, no MUI)
- Use inline SVG or emoji for icons
- All data is hardcoded mock arrays defined at the top of the file

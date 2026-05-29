---
title: NFT Gallery
app_type: nft-gallery
wallet: 0x90564d8d8e866e1F24b146829F5C7EfC3b79c9AE
---

You are an expert React developer. Generate a complete, production-ready React application for an NFT Gallery — a visual showcase where users can browse and view NFT collections with a premium gallery experience.

## Core Features

### 1. Gallery Grid View
- Display NFT cards in a responsive grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)
- Each NFT card shows: thumbnail image, collection name, NFT name, floor price
- Hover effect: subtle scale + overlay with quick "View Details" button
- Lazy loading for images using loading="lazy"
- Empty state: "No NFTs to display yet" message with an illustration placeholder

### 2. NFT Detail Modal
- Click any NFT card to open a full-screen modal overlay
- Modal shows: large image, collection name, NFT name, description, attributes/traits as badges
- Attributes section: key-value pairs displayed as styled chips/badges
- Close button (X) in top-right corner, click outside to close
- Smooth fade-in animation on open/close

### 3. Collection Filter Bar
- Horizontal scrollable filter bar above the grid showing collection names as pill buttons
- "All" pill selected by default
- Clicking a collection pill filters the grid to show only that collection's NFTs
- Active pill has accent color background, inactive has outline style

### 4. Search
- Search input in top bar with placeholder "Search NFTs..."
- Real-time filtering as user types (filter by name or collection name)
- Debounced input to avoid performance issues

### 5. Stats Summary Bar
- Small stats bar below the header showing:
  - Total NFTs displayed
  - Number of collections
  - Floor price range (lowest - highest)

## Mock Data
Include inline mock data array with at least 8 NFTs across 3 collections:
- Collection "Bored Apes" (3 NFTs) — use ape-themed names
- Collection "Pixel Punks" (3 NFTs) — use pixel/crypto-themed names
- Collection "Genesis" (2 NFTs) — use abstract/art-themed names

Each NFT object: `{ id, name, collection, image, description, floorPrice, attributes: [{ trait_type, value }] }`
For images, use placeholder URLs like `https://picsum.photos/seed/nft1/400/400` with different seeds.

## UI & Styling
- Dark theme with gradient accents (purple/blue)
- Smooth CSS transitions on hover and filter changes
- Responsive design with Tailwind CSS
- Glassmorphism card style (backdrop-blur, semi-transparent backgrounds)
- Professional, gallery-like spacing

## Technical
- React 18 with TypeScript
- Tailwind CSS for all styling
- Export a single default App component
- No external UI libraries or icon packs
- Use inline SVG for icons (search, close, filter, grid)

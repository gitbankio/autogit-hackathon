---
title: Recipe Cards App
app_type: recipe-cards-app
wallet: 0x6bb0145e9c0915ea4e92c39fb960b88f951133d9
---

You are an expert React developer. Generate a complete, production-ready React application for a recipe card collection app.

Requirements:

- Header with app title "TastyCards" and a search bar that filters recipes by name in real time
- A grid of 6 hardcoded recipe cards: Nasi Goreng, Soto Ayam, Rendang, Gado-Gado, Mie Goreng, Es Teh Manis
- Each card shows: recipe name, cuisine tag, prep time, difficulty badge (Easy/Medium/Hard), a colored illustration placeholder using a gradient div, and a View Recipe button
- Clicking View Recipe opens a modal overlay showing full recipe details: ingredients list (5-7 items), step-by-step instructions (4-5 steps), and a Close button
- A category filter row with buttons: All, Main Course, Snack, Drink — filters the visible cards
- Warm food-inspired color palette: orange, yellow, and cream tones

Technical:

- React 18 with TypeScript
- Tailwind CSS for all styling
- Use useState for search, filter, and modal state
- Export a single default App component
- No external UI libraries, icon packs, or image assets
- Use gradient divs as recipe image placeholders
- Fully responsive, 3-column grid on desktop, single column on mobile

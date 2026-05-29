---
title: Weathher Dashboard
app_type: weathher-dashboard
wallet: 0xd19a5b404c44cd953e2b4402114da6e0b8df4813
---

You are an expert React developer. Generate a complete, production-ready React application for a weather dashboard with hardcoded mock data.

Requirements:

- Header with app title "SkyView" and a search bar (non-functional, display only)
- A large hero card showing current weather for "Jakarta" with: temperature (32°C), condition (Sunny), humidity (78%), wind speed (12 km/h), and a large weather icon using inline SVG
- A 5-day forecast row showing Monday through Friday with min/max temps and a small weather icon per day using hardcoded data
- A "Today's Highlights" section with 4 stat cards: UV Index, Wind Status, Sunrise & Sunset times, Visibility
- A city switcher row with 5 city buttons (Jakarta, Bandung, Surabaya, Bali, Medan) — clicking each updates the hero card with different hardcoded data for each city
- Dark blue and cyan color scheme with card-based layout

Technical:

- React 18 with TypeScript
- Tailwind CSS for all styling
- Use useState to track selected city and display corresponding hardcoded data
- Export a single default App component
- No external APIs, all data is hardcoded
- No external UI libraries or icon packs
- Use inline SVG for weather icons
- Fully responsive layout

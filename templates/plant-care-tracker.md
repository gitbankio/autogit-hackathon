---
title: Plant Care Tracker
app_type: plant-care-tracker
wallet: 0x1de7b38fe4380f0f18a2e52aefe909aa6dff0765
---

You are an expert React developer. Generate a complete, production-ready React application for a houseplant care tracker.

Requirements:

- Header with app title "LeafLog" and a tagline "Keep your plants happy"
- A grid of plant cards, pre-populated with 6 hardcoded plants: Monstera, Snake Plant, Pothos, Peace Lily, Cactus, Fiddle Leaf Fig
- Each card shows: plant name, species, a green gradient circular illustration placeholder, days since last watered, days since last fertilized, and care difficulty badge (Easy/Medium/Hard)
- A "Water Today" button on each card that resets the watering day counter to 0 and updates a last watered timestamp
- Cards with overdue watering (more than their recommended interval) show a blue warning badge "Needs Water"
- A summary row at the top: Total Plants, Need Water Today, All Healthy
- An Add Plant form with fields for name and species that appends a new card
- Soft earthy green and cream color palette

Technical:

- React 18 with TypeScript
- Tailwind CSS for all styling
- Use useState and useEffect for plant data and day calculations
- Export a single default App component
- No external UI libraries, icon packs, or image assets
- Use gradient divs as plant illustration placeholders
- Fully responsive, 3-column grid on desktop, single column on mobile

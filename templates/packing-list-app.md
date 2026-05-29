---
title: Packing List App
app_type: packing-list-app
wallet: 0x8a09478e23e9a2a540265ae2e97825d501bcdb39
---

You are an expert React developer. Generate a complete, production-ready React application for a travel packing list organizer.

Requirements:

- Header with app title "PackRight" and a trip name input field at the top (default value "My Trip to Bali")
- Items organized into 4 category sections: Clothing, Toiletries, Electronics, Documents
- Each section is collapsible (click header to expand or collapse)
- Pre-populate each section with 5 hardcoded items
- Each item row has: a checkbox to mark as packed, the item name, and a delete button
- A progress bar at the top showing overall packing percentage (packed items / total items)
- An Add Item form at the bottom of each section with a text input and Add button
- A "Clear Packed" button that removes all checked items at once
- Clean travel-themed design with sky blue and white color palette

Technical:

- React 18 with TypeScript
- Tailwind CSS for all styling
- Use useState for items, checked state, and collapsed sections
- Export a single default App component
- No external UI libraries or icon packs
- Use inline SVG for any icons needed
- Fully responsive layout

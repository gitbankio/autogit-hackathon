---
title: Nowes App
app_type: nowes-app
wallet: 0x584a7ca7a9fa215997a740566aeba3a849eb2619
---

You are an expert React developer. Generate a complete, production-ready React application for a minimal notes taking app.

Requirements:

- Header with app title "Noteify" and a New Note button
- A two-panel layout: left sidebar listing all notes, right panel showing the selected note content
- Pre-populate with 4 hardcoded notes with titles and body text
- Each note in the sidebar shows: title, first 60 characters of body as preview, and date created
- Clicking a note in the sidebar loads it in the right panel for reading
- The right panel has an editable title and body textarea that updates the note in the sidebar list in real time
- A delete button on each sidebar note item with a confirmation step (button turns red and says "Confirm?" before deleting)
- A search bar at the top of the sidebar that filters notes by title in real time
- Color tags: each note has a colored dot (red, yellow, green, blue) selectable from the right panel
- Clean minimal design with white panels on a soft gray background

Technical:

- React 18 with TypeScript
- Tailwind CSS for all styling
- Use useState for notes list, selected note, and search state
- Export a single default App component
- No external UI libraries or icon packs
- Use inline SVG for any icons needed
- Fully responsive, collapses sidebar on mobile

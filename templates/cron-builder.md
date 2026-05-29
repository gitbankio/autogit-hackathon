---
title: Visual Cron Expression Builder
app_type: cron-builder
wallet: 0x75E2e6e9b675BBe9ED599dA0FF5a36880A5f4815
---

You are an expert React developer. Generate a complete, production-ready React application that is a visual cron expression builder and tester.

Requirements:
- A clean header with the app title "Cron Builder" and a one-line tagline
- A live cron expression display showing the current expression in a large monospace font, with a one-click copy button
- Five segmented inputs for the cron fields: minute, hour, day of month, month, day of week. Each field supports `*`, exact numbers, comma lists, ranges (e.g. `1-5`), and step values (e.g. `*/15`). Show inline validation errors when the user types something invalid
- Quick preset buttons for common schedules: Every minute, Every 5 minutes, Hourly, Daily at midnight, Weekdays at 9am, First of every month
- A natural-language description of the current cron expression that updates live as the user edits any field (e.g. "At 09:00, Monday through Friday")
- A next 5 run times preview list, computed from the current expression in the user's local timezone, showing the date and time of each upcoming run
- Responsive two-column layout on desktop, stacked single column on mobile, using Tailwind CSS utility classes
- Subtle hover and focus states on all interactive elements
- Empty and error states clearly visible

Technical:
- React 18 with TypeScript
- Tailwind CSS for all styling
- Compute next run times directly in component code, no external scheduling library
- Export a single default App component
- No external UI libraries or icon packs
- Use inline SVG for any icons
- All cron parsing and validation logic must live inside the App file

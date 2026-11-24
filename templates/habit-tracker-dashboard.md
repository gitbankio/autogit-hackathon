---
title: Personal Habit Tracker Dashboard
app_type: habit-tracker-dashboard
wallet: 0x8403552cc81858eb301efbed64bb0a25b33ef727
---

You are an expert React and TypeScript developer. Generate a complete, production-ready single-page
habit tracking application. It must compile with no manual edits.

Stack (fixed, do not substitute):
- React 18 with TypeScript
- Tailwind CSS for all styling
- No external UI, icon, chart, or state libraries. Use only React and Tailwind classes.
- Export exactly one default component named App from App.tsx
- Persist everything in localStorage; there is no backend

Data model:
- Define an interface Habit with: id (string), name (string), emoji (string), color (string),
  createdAt (string ISO date), and history (Record<string, boolean>) where the key is a
  YYYY-MM-DD date string
- Store the full array of habits in localStorage under the key "habits-v1"

Layout, top to bottom:
1. Header bar: the app title "Habit Tracker" on the left, today's date on the right in the format
   "Mon, 24 Nov".
2. Summary row with three cards: total habits, completed today, and current streak in days.
   Each card shows a large number and a small label underneath.
3. Habit list. Each habit is a card with:
   - the emoji on the left in a rounded square tinted with the habit colour
   - the habit name and, underneath it, a 7-day strip of small squares: the last seven days,
     filled if the habit was done that day, outlined if not, with the weekday letter under each
   - a circular check button on the right that toggles today's completion
4. A composer at the bottom of the list: a text input for the name, a small emoji picker offering
   eight fixed emoji, and an "Add habit" button. Pressing Enter also adds.

Behaviour:
- Toggling today updates that habit's history and immediately persists to localStorage
- Streak is the count of consecutive completed days ending today
- Deleting a habit is available from a small text button on the card and asks for confirmation
  through window.confirm
- Empty state: when there are no habits, show a centred card with a short message and an arrow
  pointing at the composer
- Seed three example habits the first time the app runs so the UI is never empty

Visual design:
- Light theme with a neutral gray background, white cards, rounded-xl corners, and a subtle shadow
- Accent colour is indigo-600 for primary actions
- Generous spacing, text-sm for secondary text, text-2xl semibold for headings
- Fully responsive: the summary row is a three column grid on small screens and stays three
  columns on desktop; the habit list is a single column with a maximum width of 2xl and centred

Technical requirements:
- One file per concern is fine, but keep it to App.tsx plus at most one types file
- Use useEffect to load from localStorage on mount and to write back on every change
- Use useMemo for the derived streak and the last-seven-days arrays
- Guard localStorage access with a try/catch so the app still renders in restricted environments
- No console errors, no unused imports, no any types

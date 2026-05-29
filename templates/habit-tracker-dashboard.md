---
title: Habit Tracker Dashboard
app_type: habit-tracker-dashboard
wallet: 0x7d8369c99339e1b9fd1087db50d24926ed06095c
---

You are an expert React developer. Generate a complete, production-ready React application for a personal habit tracker dashboard.

Requirements:

- Header with app title "HabitFlow" and the current date displayed
- A grid of habit cards, each showing: habit name, a 7-day streak indicator (circles for each day, filled if completed), current streak count, and a "Mark Today" toggle button
- Pre-populate with 5 example habits: Drink 8 glasses of water, Morning meditation, Read 20 minutes, Exercise, No social media after 9pm
- A summary bar at the top showing: total habits, habits completed today, and current longest streak
- Clicking "Mark Today" toggles today's completion and updates the streak count immediately
- A weekly progress chart section rendered as a simple horizontal bar chart using only div elements and Tailwind width utilities (no chart libraries)
- Clean dashboard layout with a sidebar on the left for navigation links (Today, Weekly, All Habits) and main content on the right
- Motivational quote banner at the bottom that rotates through 5 hardcoded quotes on page load

Technical:

- React 18 with TypeScript
- Tailwind CSS for all styling
- Use useState and useEffect for all interactivity and state
- Export a single default App component
- No external UI libraries, icon packs, or chart libraries
- Use inline SVG for any icons needed
- All data is stored in component state, no backend or localStorage required
- Fully responsive layout, stacks to single column on mobile

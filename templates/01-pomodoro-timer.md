---
title: Pomodoro Focus Timer
app_type: pomodoro-focus-timer
wallet: 0x7d8369c99339e1b9fd1087db50d24926ed06095c
---

You are building a Pomodoro Focus Timer app called "FocusFlow" using React + Vite + Tailwind CSS. Generate a complete, fully functional single-page application.

## App Requirements

Build a productivity timer with these exact features:

### Timer Section
- A large circular countdown display (SVG ring progress, no external chart library)
- Three modes: Work (25 min), Short Break (5 min), Long Break (15 min)
- Start / Pause / Reset buttons
- Auto-switch to break mode when work timer ends
- Track completed pomodoro count (show tomato 🍅 icons, max 4 then reset)

### Task List Section
- Input field to add a task with an "Add" button
- Each task shows: checkbox (mark done), task name, delete button
- Completed tasks get strikethrough styling
- Show count: "X tasks remaining"

### Stats Section
- Display: Total Pomodoros today, Total focus minutes today
- Persist stats in localStorage so they survive page refresh

### Visual Design
- Dark theme: deep navy (#0f172a) background, soft white text
- Accent color: warm red (#ef4444) for active work mode, green (#22c55e) for break mode
- Clean sans-serif font (use Google Fonts: "DM Sans")
- Subtle fade-in animation on load
- Smooth color transition when switching modes

### Technical Rules
- Use only React useState and useEffect hooks
- Use setInterval for countdown, clear it on pause/unmount
- Do NOT use any external libraries except Tailwind and React
- All logic in a single App.jsx component
- App must work standalone without backend

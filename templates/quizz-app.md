---
title: Quizz App
app_type: quizz-app
wallet: 0x673e9bef13ae2d9bab96baadedeeac2f6cbc0743
---

You are an expert React developer. Generate a complete, production-ready React application for an interactive multiple-choice quiz app.

Requirements:

- A welcome screen with app title "BrainBurst", a short description, and a Start Quiz button
- 8 hardcoded general knowledge questions, each with 4 answer options and one correct answer
- One question displayed at a time with a question number indicator (e.g. "Question 3 of 8")
- A progress bar at the top showing how far through the quiz the user is
- After selecting an answer, immediately show green highlight for correct and red for wrong, then a Next button appears
- A 20-second countdown timer per question — if time runs out, the question is marked wrong automatically
- A results screen at the end showing: score out of 8, a performance message (e.g. "Great job!" for 6+), and a Retake Quiz button that resets everything
- Clean modern design with a dark navy and bright accent color scheme

Technical:

- React 18 with TypeScript
- Tailwind CSS for all styling
- Use useState and useEffect with setInterval for timer logic
- Export a single default App component
- No external UI libraries or icon packs
- Use inline SVG for any icons needed
- Fully responsive layout

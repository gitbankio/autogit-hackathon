---
title: Workout Plan Generator
app_type: workout-plan-generator
wallet: 0x72c347443cb7ee8f30098a5895856aa898bfbe3d
---

You are an expert React developer. Generate a complete, production-ready React application for a weekly workout plan generator.

Requirements:

- Header with app title "FitPlan" and tagline "Your weekly workout, sorted"
- A setup form with 3 options: fitness goal (Lose Weight, Build Muscle, Stay Active), experience level (Beginner, Intermediate, Advanced), and days per week (3, 4, 5)
- A Generate Plan button that displays a full weekly workout schedule based on the selected options using hardcoded plan data mapped to each combination
- The plan shows a card for each training day with: day name, muscle group focus, 4-5 exercises each with sets and reps (e.g. "Push-ups — 3 sets x 12 reps")
- Each exercise card has a checkbox to mark it as done, which strikes through the text
- A weekly progress bar showing percentage of exercises completed
- A Reset button to clear all checkboxes

Technical:

- React 18 with TypeScript
- Tailwind CSS for all styling
- Use useState for form selections and checkbox state
- Export a single default App component
- No external UI libraries or icon packs
- All plan data is hardcoded in the component
- Fully responsive layout, 2-column grid on desktop

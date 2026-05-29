---
title: Flashcard Study App
app_type: flashcard-study-app
wallet: 0x1e660a9a1f1f08afef9c03c96d66260122464cf2
---

You are an expert React developer. Generate a complete, production-ready, single-file React application for a spaced-repetition flashcard study app. The goal is a genuinely useful study tool, not a toy card flipper. The code must compile and run on the first try with no manual edits.

CORE STUDY EXPERIENCE
- A central flashcard that shows the question (front). Clicking it, or pressing Space, flips it with a smooth CSS 3D flip animation to reveal the answer (back).
- Once the answer is revealed, show four review buttons that also work via keyboard 1/2/3/4: "Again" (1), "Hard" (2), "Good" (3), "Easy" (4). Hide the rating buttons until the card has been flipped.
- A header showing the deck name, a "X due today" counter, and the position in the current session ("card X of Y").
- A progress bar that fills as the user works through the cards due in the current session.
- A completion screen after the last due card, summarizing how many cards were rated Again / Hard / Good / Easy this session, the new total due tomorrow, and a "Study again" / "Back to decks" choice.

SPACED REPETITION (implement a lightweight SM-2 style scheduler)
- Each card stores: front, back, repetitions, easeFactor (start 2.5), intervalDays (start 0), and dueDate (ISO string).
- On rating: "Again" resets repetitions to 0 and sets the card due in 10 minutes; "Hard" multiplies the interval by ~1.2; "Good" advances the interval using the SM-2 progression (1 day, then 6 days, then interval * easeFactor); "Easy" gives a larger jump and increases easeFactor. Clamp easeFactor to a minimum of 1.3.
- A card is "due" when its dueDate is now or in the past. A study session only serves due cards, ordered by dueDate.
- Show each card's next-review interval as a small label on the rating buttons (e.g. "Good — 6d").

DECKS & EDITING
- Support multiple named decks. A decks list screen shows each deck with its name, total cards, and number due today, plus buttons to study, edit, or delete it, and a "New deck" action.
- "Add card" form with front and back inputs that appends to the current deck.
- Bulk import: a textarea where the user pastes multiple lines in "front | back" format (one card per line); parse and add them all, skipping blank lines.
- Allow deleting an individual card.
- Ship with two built-in starter decks (e.g. "World Capitals" and "Spanish Basics"), each with at least 8 real question/answer pairs, so the app is useful immediately on first load.

PERSISTENCE
- Persist all decks and scheduling state to localStorage under a single key, loading on mount and saving on every change with useEffect. Wrap reads/writes in try/catch so a parse error falls back to the starter decks instead of crashing.

DESIGN & UX
- Clean, calm, study-focused design: soft palette, rounded corners, subtle shadows, generous spacing, centered responsive layout that works on mobile and desktop.
- A dark / light mode toggle in the header that applies a dark theme via Tailwind classes and persists the choice.
- Smooth, non-distracting transitions. Use inline SVG for all icons.
- Show a friendly empty state when a deck has no cards and a "you're all caught up" state when nothing is due.

TECHNICAL CONSTRAINTS
- React 18 with TypeScript, functional components and hooks only (useState, useEffect, useMemo, useCallback as needed).
- Tailwind CSS utility classes for all styling. No external UI libraries, state managers, date libraries, or icon packs.
- Export a single default App component; all other components and helpers live in the same file.
- Strongly type cards, decks, and ratings; no use of `any`.
- All logic is client-side; no network requests. The app must build and run cleanly with zero manual edits.

---
title: Flashcard Study App
app_type: flashcard-study-app
wallet: 0x1e660a9a1f1f08afef9c03c96d66260122464cf2
---

You are an expert React developer. Generate a complete, production-ready React application for a flashcard study app with spaced-repetition style review.

Requirements:
- Header with the app title and a counter showing "card X of Y" for the current deck
- A central flashcard that flips between question (front) and answer (back) when clicked, with a smooth 3D flip animation
- Below the card, three review buttons: "Again", "Good", and "Easy" that move to the next card and track how the user rated each card
- A deck of at least 6 built-in sample cards stored in component state (question/answer pairs on a general-knowledge topic)
- A "+ Add card" form with two inputs (front and back) that appends a new card to the deck
- A progress bar that fills as the user advances through the deck
- A completion screen shown after the last card, summarizing how many cards were rated Again / Good / Easy, with a "Restart" button that reshuffles and starts over
- Keyboard shortcuts: Space to flip the card, and 1 / 2 / 3 to rate Again / Good / Easy
- Fully responsive, centered layout that works on mobile and desktop
- Clean, calm study-focused design with a soft color palette, rounded corners, and subtle shadows

Technical:
- React 18 with TypeScript, using functional components and hooks (useState, useEffect)
- Tailwind CSS for all styling (use utility classes only)
- Export a single default App component
- No external UI libraries, state libraries, or icon packs
- Use inline SVG for any icons
- All state is local; no network requests or persistence required
- The code must compile and run without any manual edits

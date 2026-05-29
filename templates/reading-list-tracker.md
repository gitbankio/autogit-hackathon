---
title: Reading List Tracker
app_type: reading-list-tracker
wallet: 0xfc15c947e9cb6a846eefd1bb77d5a98209c9ef19
---

You are an expert React developer. Generate a complete, production-ready React application for a personal reading list tracker.

Requirements:

- Header with app title "PageLog" and a subtitle "Track every book you read"
- Three tabs at the top: "Want to Read", "Reading Now", "Finished" — clicking each filters the book list
- Pre-populate with 6 hardcoded books spread across the three tabs, each with: title, author, genre tag, and cover color placeholder (a colored div with initials)
- A simple Add Book form with fields for title and author and a dropdown for status — clicking Add appends the book to the correct tab list
- Each book card has a status change button to move it to the next stage (Want to Read → Reading Now → Finished)
- A stats bar showing total books, currently reading count, and finished count
- Clean card grid layout with a warm beige and brown color scheme

Technical:

- React 18 with TypeScript
- Tailwind CSS for all styling
- Use useState for book list and active tab state
- Export a single default App component
- No external UI libraries or icon packs
- No external APIs, all data starts hardcoded in state
- Fully responsive, 2-column grid on desktop, single column on mobile

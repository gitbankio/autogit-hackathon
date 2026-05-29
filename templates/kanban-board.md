---
title: Kanban Board
app_type: kanban-board
wallet: 0x48047b2006b8E7b80F2a86065123aAC2eCB818Df
---

A small page that holds a kanban board with three columns, todo, doing, done. Cards live in columns, the visitor drags cards from one column to another with the mouse or with a touch, edits a card's title or description inline, sets a priority tag from a small dropdown. The board lives in localStorage on the visitor's device. There is no signup, no team, no notification, the board is for one person at a time.

## the columns

A warm grey background, the slightly off cream of an architect's notebook. Raven for body type. Three column accents, sky for todo, sunset for doing, sprout for done. Each color is used only in the column header band and the small priority dot on the cards in that column. Manrope at 18px 500 for column headers, at 15px 400 for card titles, at 13px 400 for card descriptions. Geist Mono at 11px for the small timestamps and card counts. Two typefaces, two roles, no overlap. The page is one row of three columns on desktop, stacked vertically on phones.

Each column is a vertical card 28 percent of the width on desktop, padded 16px, with a 1px raven hairline at fifteen percent opacity. At the top of each column, a small header band 32px tall in the column accent color with the column name in 18px Manrope soft white on the left, and a small count of cards in 12px Geist Mono soft white on the right. Below the band, the card list scrolls vertically when there are many cards, with a thin scrollbar styled to match the column accent.

At the bottom of each column, a single text button reading add a card in 13px Manrope 500 in the column accent color on a soft warm grey band, padded 8px, with a soft 1px hairline. Tapping it inserts a new empty card at the bottom of the column, the title is immediately focused for the visitor to type.

## the cards

Each card is a small rectangle on a soft white background, padded 14px, with a 1px raven hairline at twenty percent opacity, no rounded corners. Inside the card, three regions stacked vertically.

The first region is the title in 15px Manrope 500 raven, rendered as a contenteditable span. Tapping the title selects it for editing, pressing enter commits and blurs. The title is the heart of the card and is always visible.

The second region is the description in 13px Manrope 400 raven muted, also contenteditable. Long descriptions wrap up to four lines and then truncate with a small chevron that expands the card on tap. An empty description is shown as a faint italic placeholder reading add a description.

The third region is a horizontal strip at the bottom of the card with three small pieces. On the left, the priority dot in 8px, colored by the priority value (sky for low, sunset for medium, sprout for high). To the right of the dot, the priority label in 11px Geist Mono raven muted. On the right end of the strip, the date the card was created in 11px Geist Mono raven muted, in the form 29 May.

Tapping the priority dot opens a small dropdown with three options, low, medium, high. The visitor picks one, the dot and label update.

A small remove glyph appears in the top right of the card on hover (or always on touch devices), tapping it removes the card after a small inline confirm reading remove this card, with a small cancel.

## the drag

Cards can be dragged between columns and within a column using the HTML5 drag and drop api. Tapping and holding a card initiates the drag (the standard pointer drag, not a long press, so phones may need a small drag handle in the top left of each card on touch devices). The drag image is a semi transparent clone of the card with a thin 2px raven border at thirty percent opacity.

Dropping a card onto a column adds it at the bottom of the column if the column has cards, or as the only card if the column is empty. Dropping a card between two existing cards inserts it at that position, the surrounding cards reflow to make room. Dropping outside any column cancels the drop, the card returns to its original position.

The drop targets fire a soft 200ms ease in border highlight in the column accent color when a card is dragged over them, so the visitor sees where the card will land.

The shape of one card, written into src/lib/cards.ts.

```
{
  id:          '7d3c2a',           // 6 char random hex
  title:       'review the design',
  description: 'follow up on the second iteration',
  priority:    'medium',           // 'low' | 'medium' | 'high'
  createdAt:   '2026-05-29T13:00:00.000Z',
  column:      'doing'             // 'todo' | 'doing' | 'done'
}
```

The board is the array of all cards plus a stable index of the order within each column.

## the undo

Every mutation (add, remove, move, edit) pushes a snapshot of the full board state onto a stack capped at 50 entries. The snapshot is taken through structuredClone so the stack holds independent copies of the board. Pressing ctrl plus z (or cmd plus z) walks the stack backward, ctrl plus shift plus z walks forward. The stack persists across reloads in localStorage so the visitor can undo even after closing the tab.

A small text button in the top right of the page in 12px Manrope reads undo, paired with a redo button next to it. Both are dimmed when the matching stack direction is empty.

## the storage and edges

The board state is mirrored to localStorage under the key kanban.board.v1 within 400ms of idle. On boot, the App reads the saved state and renders the board. If localStorage is unavailable, the board lives in memory and a small italic 11px line at the bottom of the page reads this board is not being kept on this device.

A small text button at the very bottom of the page in 12px Manrope reads export the board as json. Pressing it downloads the full board state as a json file through a temporary anchor click. A second button reads import a board from json, which opens a file picker, validates the picked json, and replaces the current board after a confirm.

A card with no title and no description and no priority change is auto removed when the visitor blurs without typing anything, so empty cards do not pile up in the columns.

A column with more than 50 cards shows a small italic 11px line at the bottom of the column reading this column is getting long, consider splitting. The page does not refuse, the visitor decides.

A card dragged to its own column at the same position is a no op, the snapshot is not pushed, the undo stack stays clean.

## the build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding warm grey, raven, sky, sunset, sprout, soft white. Vite as the build tool. State is plain useState and one useReducer for the cards array, the active drag, and the undo and redo stacks. No router, no global store, no context provider, no drag and drop library, no kanban library, no icon pack. HTML5 drag and drop, ResizeObserver, contenteditable, structuredClone, and the standard keyboard events are used directly.

Files. index.html with the Manrope and Geist Mono links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the board, the active drag, and the undo and redo stacks. src/components/Column.tsx for one column with its header band, card list, and add button. src/components/Card.tsx for one card with its title, description, priority, and timestamp. src/components/UndoBar.tsx for the top right undo and redo buttons. src/components/IO.tsx for the export and import buttons. src/lib/cards.ts for the card shape, the empty card factory, and the localStorage. src/lib/drag.ts for the drag and drop event handlers. src/lib/history.ts for the undo and redo stack management. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a laptop. The warm grey surface paints, three columns sit side by side with sky, sunset, and sprout header bands reading todo, doing, done. The todo column has two example cards seeded on first load, the doing column has one, the done column is empty. They tap add a card in the todo column, type a title, press enter, the card lands at the bottom of todo. They drag a card from todo into doing, the sunset border highlights the doing column during the drag, the card lands. They tap the priority dot on a card, change it to high, the dot turns sprout. They reload the page, the same board waits for them, the undo stack is still alive.

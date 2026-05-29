---
title: Shopping List
app_type: shopping-list
wallet: 0xA90A609A3e2556bDaD092Df041E6A21C30D4CF48
---

A simple shopping list that lives in the browser. The visitor types what they need, picks a category from a small dropdown, and the item slides into a list grouped by aisle. Tapping a row strikes it through and dims it once it lands in the cart. There is no signup, no sync, no advertising. The list is the kind of small tool a household pins to the fridge.

# 1. The look

Warm white background, the color of a clean kitchen counter in morning light. Forest green for body type and the title bar. Tomato red for the small remove glyph on each row. Soft yellow for the highlighted active category chip. Plus Jakarta Sans at 16px 400 for body, at 14px 500 for buttons. DM Serif Display at 28px for the page title and the section headings (one heading per aisle category). The page is one column at most 560px wide, centered, 24px gutter on phones.

The first thing the visitor sees is the title shopping list at the top in DM Serif Display, a small italic subtitle below it reading what we need today in Plus Jakarta Sans 13px forest muted. Below the subtitle, the add row. Below the add row, the grouped lists.

# 2. The add row

A single text input in 16px Plus Jakarta Sans, soft warm white background with a 1px forest hairline at twenty five percent opacity, padded 14px. The placeholder reads add an item, like bananas or olive oil. To the right of the input, a small dropdown in Plus Jakarta Sans 14px showing the eight categories. To the right of the dropdown, a small text button in Plus Jakarta Sans 14px 500 reading add. The categories are produce, dairy, bakery, pantry, frozen, drinks, household, other. Tapping add (or pressing enter inside the input) inserts the typed item into the list under the chosen category, clears the input, and keeps focus on the input so the next item can be typed without reaching for the mouse.

A small lozenge below the add row shows the visitor's last used category in soft yellow with the category name in 13px Plus Jakarta Sans forest. Tapping the lozenge restores it as the active dropdown value, useful when the visitor is moving through one aisle at a time.

# 3. The lists

The list region holds eight sub lists, one per category, each headed by the category name in DM Serif Display 22px forest. Empty categories are not shown at all (only categories with at least one item appear), keeping the page short while the basket is small.

Inside each category, the rows are stacked top to bottom in the order the items were added. Each row has three regions. The first region is a small round check button on the left, 22px round, with a thin 1px forest border. The second region is the item text in 16px Plus Jakarta Sans forest, on a single line, truncated with an ellipsis when too long. The third region is a small remove glyph on the right, 14px tomato red inline svg, dimmed to thirty percent until the row is hovered or focused.

Tapping the check button toggles the row's done state. A done row strikes through the item text in forest at fifty percent opacity, dims the check button to a filled forest circle, and slides quietly to the bottom of its category. A second tap restores the row. The order of done rows is preserved within each category so the visitor can flip them back without losing their place.

Tapping the remove glyph removes the row after a small inline confirm that asks remove this item, with a small cancel option inline next to it. The confirm appears below the row's three regions, fades in over 120ms, and clears if the visitor ignores it for 6 seconds.

The shape of one row in storage, written into src/lib/items.ts.

```
{
  id:       'a3b9',         // 4 char random hex
  text:     'whole milk',
  category: 'dairy',
  done:     false,
  addedAt:  '2026-05-29T14:30:00.000Z'
}
```

# 4. The reorder

Rows inside a category can be dragged up or down using a small drag handle that appears at the very left edge of each row when the row is hovered. The drag is the standard browser drag and drop with DataTransfer. Dropping the row updates the order, persisted on the next save. Rows can also be moved between categories by dragging from one category into another, the row's category field updates, the original category slot empties (and the category vanishes if it was the only item).

A small text button at the top right of each category reads check the whole aisle. Tapping it toggles every row in the category to done. A second tap un dones them. Useful at the checkout when the visitor wants to clear the aisle in one motion.

# 5. The list itself

Below the eight category lists, a small text button row holds three buttons in Plus Jakarta Sans 13px forest. The first reads clear the cart, which removes every done row from the list after a small confirm that says remove all checked items, with a small cancel. The second reads clear the whole list, which removes every row after a stricter confirm that says clear every item from the list, with cancel. The third reads send to my notes, which copies the entire list to the clipboard as plain text (one category per block, with the items listed under each), so the visitor can paste it into a notes app, a messaging chat, or an email.

A small summary line at the bottom of the page reads 12 items, 4 in the cart, with the numbers updated live. To the right of the line, a small text button in 12px Plus Jakarta Sans muted forest reads sort each aisle by name, which alphabetises the rows inside every category. The sort is reversible (the same button toggles back to the original add order if pressed a second time).

# 6. The save

The list lives in localStorage under the key shopping.list.v1 as a single object with the array of items and the most recently used category. The save runs within 400ms of idle, batched, so a fast typer does not write storage on every keystroke. On boot, the App reads the saved list and renders it. If localStorage is unavailable, the list holds in memory and a small italic 11px line at the bottom of the page reads this list is not being kept on this device.

A small text button next to the save indicator reads share this list. Pressing it builds a base64url string of the list and copies a url with that string appended after a hash to the clipboard. Pasting the url on another device opens the page with the imported list, with a small banner at the top reading replace the current list with this one, with a confirm and a cancel.

# 7. The keys

Pressing the enter key in the add input adds the typed item. Pressing the tab key moves focus from the input to the dropdown. Pressing the arrow keys inside a category moves a small focus ring up and down the rows. Pressing the space key on a focused row toggles its done state. Pressing the d key on a focused row removes the row (with the inline confirm).

# 8. The edges

An item with empty text is not accepted, a small italic 11px line under the input reads type something before adding for 1500ms.

An item longer than 120 characters is accepted but truncated to 120, with a small italic 11px line under the input reading the item was shortened to fit.

A list with no items at all shows a single Plus Jakarta Sans 16px italic forest muted line in the center reading what do we need today, with a small inline svg of a tiny basket above it.

A list of more than 200 items shows a small Plus Jakarta Sans 11px italic line at the top of the page reading the list is getting long, consider clearing the cart, with a small text button to clear the checked items inline next to it.

# 9. The build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding warm white, forest, forest muted, tomato, soft yellow. Vite as the build tool. State is plain useState and one useReducer for the items array and the active category. No router, no global store, no context provider, no drag and drop library, no animation library, no icon pack. Every glyph including the small check and the remove are inline svg in the row component.

Files. index.html with the Plus Jakarta Sans and DM Serif Display links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the items array, the active category, and the share import banner state. src/components/Header.tsx for the title and subtitle. src/components/AddRow.tsx for the input, dropdown, and add button. src/components/Aisle.tsx for one category. src/components/Row.tsx for one item. src/components/Footer.tsx for the clear, copy, sort buttons and the summary line. src/lib/items.ts for the item shape and the localStorage. src/lib/share.ts for the base64url encode and decode. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page in any modern browser. The warm white page paints, the title shopping list sits at the top in DM Serif Display, the add row sits below, an empty space with the small basket icon and the line what do we need today fills the middle. They type bananas, pick produce from the dropdown, press enter. Bananas appears as the first row under a produce heading. They type olive oil, pick pantry, press enter. The pantry heading appears below produce with one row. They walk through the aisle, tap each row as they put items in the cart, the rows strike through and sink to the bottom of their categories. At the checkout they tap clear the cart, the checked rows disappear, the page is ready for next week.

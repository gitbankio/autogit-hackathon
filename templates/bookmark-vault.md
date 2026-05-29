---
title: Bookmark Vault
app_type: bookmark-vault
wallet: 0x87eE0c6Ef42665D3d241Ac927387CD2Abd2963de
---

A small offline catalogue of bookmarks that lives inside the browser. Not synced, not signed up, not shared. A title, a url, a few tags, a tiny note, a date. The page lets you save a link, search across everything, filter by tag, export the catalogue as a json file you can keep, and import an old catalogue back later. The catalogue is held in IndexedDB so it survives a quota purge that would wipe localStorage, and a single index on tag lets the page filter ten thousand bookmarks without breaking a sweat.

· The page

A manila colored background, the color of an archive folder warmed by a desk lamp. India ink for the body text. Two accent colors. Terracotta for the title bar at the top and for the small numeric pills that show match counts. Faint green is reserved for the small dot next to a tag that is currently being used as a filter. EB Garamond serif at 18px for body and 22px for the small section labels, weights 400 and 500 and italic 400. Inconsolata at 13px for urls, dates, and the tag pills. No icons except a small inline svg of a folded card filed in a drawer in the top left of the page, sixteen pixels across, two paths. The page is one column at most 760px wide, centered, 24px gutter on phones. Spacing is generous, list rows breathe, the page does not feel like a database administration tool even though it is one underneath.

· The bar

A thin horizontal bar across the top of the page, terracotta, twenty four pixels tall, with the title bookmark vault in EB Garamond 15px 500 manila inside on the left and the bookmark count in 13px Inconsolata manila on the right, in the form 87 saved, with the number in a small pill that picks up faint green if a filter is active. The bar never grows, never adds buttons. Below the bar a small text button in 13px Inconsolata terracotta reads keep a new bookmark, which opens a small panel below the bar with four inputs. Title, url, tags as a single line of comma separated words, and a tiny note field of one line. The submit button reads keep it in 13px Inconsolata faint green. Pressing it writes the bookmark to the IndexedDB store and slides the panel closed. Pressing escape inside the panel cancels.

· The search

Directly below the keep panel, a single line input in 14px Inconsolata india ink with no border on a paper colored card, the cursor placed inside on load. Typing into the search filters the visible list in real time. The search is case insensitive and matches against the title, the url, the note, and any tag. To the right of the input a horizontal row of tag chips, each tag in 12px Inconsolata terracotta on a manila pill with a 1px india ink hairline at twenty percent opacity, sorted by frequency descending, capped to twelve chips with a small more text button after them that expands the row to all tags. Tapping a chip toggles a filter on that tag, the chip gets a small faint green dot to its left when active, the list narrows accordingly. Multiple active tag filters narrow the list further (a bookmark must match all active tags). Tapping the chip again removes the filter. A small text button in 12px Inconsolata muted ink reads clear all filters, which removes every tag filter and clears the search input.

· The list

Below the search and chips, a vertical list of bookmarks, each row separated by a thin india ink hairline at ten percent opacity. Each row is three lines plus a tag row.

The first line is the title in 18px EB Garamond 500 india ink, the favicon (a 14px inline svg circle in terracotta if no favicon is known, otherwise a 14px img tag with the resolved favicon) to its left. The favicon resolution is a single try at https plus the url's host plus slash favicon dot ico, with a 200ms onload timeout, falling back to the terracotta circle on any failure. There is no other network call from the page, ever.

The second line is the url in 12px Inconsolata muted ink, truncated to 64 characters with an ellipsis in the middle (the start and the end of the url are both preserved). Clicking the url copies it to the clipboard with a small toast saying copied to clipboard for 1200ms. To the right of the url a small text button in 12px Inconsolata terracotta reads open in a new tab, which opens the link with a noopener noreferrer rel.

The third line is the note in 13px EB Garamond italic muted ink, omitted if empty.

Below the three lines a row of tag pills, each pill in 11px Inconsolata terracotta on a manila background with a 1px india ink hairline. Tapping a pill on a row toggles the filter for that tag the same way as the chips at the top.

To the right of each row, a small text button in 11px Inconsolata muted ink reads forget, with a confirm prompt that says remove this bookmark from the catalogue, and a small cancel. Below the forget button, a small text button reads edit, which opens the same keep panel populated with the bookmark's values and a submit button that reads save changes.

The list is sorted by the most recently saved at the top by default. A small text button in 12px Inconsolata muted ink at the top right of the list reads sort by oldest first, which toggles the order, persisting the choice in the preferences store.

· The store

The catalogue is held in an IndexedDB database called bookmark_vault, version 1, with one object store named bookmarks and one keyPath of id. The store has two indexes. The first index, by tag, multiEntry true, on the tags property, which is an array of strings. The second index, by savedAt, unique false, on the savedAt property, which is an iso timestamp string. The store has a second sibling store named prefs with a keyPath of key, which holds the current sort order and the most recent set of active tag filters under the keys order and filters.

The shape of a bookmark record looks like this, written here so the codegen has no doubt.

```
{
  id:        '7d3c2a',           // 6 char random hex, the keyPath
  title:     'a clean note app',
  url:       'https://example.org/notes',
  host:      'example.org',
  tags:      ['ref', 'productivity'],
  note:      'small and pretty, no signup',
  savedAt:   '2026-05-29T11:02:00.000Z',
  visitedAt: null
}
```

The visitedAt field is updated to the current iso string whenever the visitor presses open in a new tab on that row. A tiny line under the row date reads opened a few minutes ago when visitedAt is set, in 11px Inconsolata muted ink.

· The export and the import

A small text button in 13px Inconsolata terracotta at the bottom of the page reads export the catalogue. Pressing it asks the visitor to pick a target file through the File System Access API if available (showSaveFilePicker), and writes a single json file containing the array of every bookmark and the prefs sub object. If the File System Access API is not available, the page falls back to a temporary anchor element click that downloads the same json file with a filename of bookmark vault and the date.

A second small text button reads import a catalogue. Pressing it asks the visitor to pick a json file. The picked file is parsed, validated for the expected shape, and inserted into the IndexedDB store. Existing bookmarks with the same id are updated in place, new ones are added, no deletions happen on import. A small line below the buttons after a successful import reads imported 42 records, with the count in faint green.

structuredClone is used to copy the prefs object into the worker free runtime when reading and writing, so the same object never reaches IndexedDB twice. There is no other reason for the structuredClone call, it is simply the cleanest copy on the platform.

· The edges

A bookmark with no tags renders without a tag row, the row simply ends after the note line. A search with no matches shows a single italic 14px EB Garamond muted ink line below the search input reading nothing in the catalogue matches that, and the list region is empty. A search across the catalogue is bounded by a small in source size cap of fifty thousand records, at which point a tiny line at the bottom of the page reads this catalogue is approaching the size cap, and the keep new bookmark button is dimmed but still functional. Resizing the window below 380px stacks the chips row above the search input, the rest of the layout is unchanged. If IndexedDB is unavailable (private browsing in some browsers), the page falls back to an in memory store and writes a tiny italic 11px line at the bottom reading this catalogue is not being kept on this device, the keep, search, filter, export, and import buttons all still work for the session.

· The build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding manila, india ink, ink muted, terracotta, and faint green. Vite as the build tool. State is plain useState and one useReducer for the open keep panel and the edit target. No router, no global store, no context provider, no database library, no full text search library, no icon pack. IndexedDB is used directly through a small wrapper in src/lib/db.ts that opens the database, runs migrations, and exposes a handful of typed functions, all returning promises. The text matching for the search is a simple toLower includes pass over the visible fields, which is fast enough at the size of catalogues a person actually keeps. The favicon resolution is a single image load with onerror.

Files. index.html with the EB Garamond and Inconsolata links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the catalogue snapshot, the search query, the active tag filters, and the open keep panel state. src/components/TitleBar.tsx for the top terracotta strip. src/components/KeepPanel.tsx for the new and edit form. src/components/SearchRow.tsx for the input and the chips. src/components/BookmarkRow.tsx for one bookmark in the list. src/components/Footer.tsx for the export and import buttons. src/lib/db.ts wrapping the IndexedDB calls. src/lib/favicon.ts for the small image load helper. src/lib/file.ts for the export and import through the File System Access API with the anchor fallback. src/lib/id.ts for the 6 character random hex. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page. The bar reads bookmark vault, the count reads 0 saved. They press keep a new bookmark, fill the form with a title and a url and the tags reference and productivity, and a tiny note, and press keep it. The list paints a single row. They press keep again, add a second bookmark with the tag reference only. The count reads 2 saved. They type "ref" into the search, both rows stay. They tap the reference chip, the faint green dot lights up, both rows stay. They tap productivity, only one row remains. They clear filters. They export the catalogue, a json file lands in their downloads folder. They close the tab, reopen tomorrow, the two bookmarks are still there with the favicons resolved.

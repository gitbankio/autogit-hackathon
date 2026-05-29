---
title: Markdown Livewire
app_type: markdown-livewire
wallet: 0x7cb82DE7Be2b41738D75e3951a14a0e61dd88A7E
---

A small page that holds a single contenteditable surface in the middle of the screen. The visitor types in plain text using markdown shorthand. As they type, the page parses the text and rewrites the surface in place, applying styles to headers, lists, emphasis, code, and quotes. The visitor's caret stays exactly where it was, the selection is preserved, and the rewrite happens through a MutationObserver that watches the surface and reacts within a frame. There is no separate preview pane. The text becomes its own preview.

▸ surface ▸

An ivory background. Raven for body type. Two accents only, citrus for the active heading colors and the small modeline at the top right, rose blush for the small underline used on emphasized words. Reforma 1969 (or Lora Display as a fallback) at 28px 500 for the heading levels (h1 36, h2 28, h3 22, h4 18) when the surface renders them. Geist Sans at 17px 400 for body text. IBM Plex Mono at 14px for inline code and at 13px for code blocks. Three typefaces, three roles, no overlap. The page is one column at most 760px wide, centered, 32px gutter on phones. The surface fills the page from a thin top mode line down to the bottom.

▸ surface ▸

The editing surface is a single div with contenteditable set to plaintext only, so the visitor can paste and type freely without the browser inserting its own html. The page paints the styles by reading the visible text every time it changes and rewriting the surface's children to a series of span and div elements with className mapped to the markdown tokens. The rewrite is a careful pass that runs inside a single animation frame, builds the new tree off screen, swaps it into the surface in one mutation, and restores the visitor's caret position and any active selection. The visitor sees no flicker, no jump, no surprise.

▸ observer ▸

A MutationObserver is attached to the surface with the configuration below.

```
{
  childList:    true,
  characterData: true,
  subtree:      true
}
```

The observer fires on every keystroke that mutates the text. The handler is debounced to one frame through requestAnimationFrame, multiple keystrokes in the same frame coalesce into a single rewrite. The handler reads the visitor's caret position before the rewrite (by walking the Range from the start of the surface), runs the markdown parser over the text, builds the new dom in a DocumentFragment, replaces the surface's children in a single mutation, and restores the caret to the same offset measured against the same starting position. The result is that typing across a heading boundary, an emphasis boundary, or even a code block boundary does not jolt the caret.

The shape of the caret save and restore, written into src/lib/range.ts.

```
function saveCaret (surface) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  const before = range.cloneRange();
  before.selectNodeContents(surface);
  before.setEnd(range.endContainer, range.endOffset);
  return before.toString().length;
}
```

The restore walks the new tree counting characters until it reaches the saved offset, then sets the selection there. The walk is iterative, not recursive, to stay fast even on long documents.

▸ markdown ▸

The supported subset is small and unambiguous.

A line starting with one to four pound signs and a space is a heading at that level. The pound signs and the space are kept in the surface as the visitor's literal text, but the line is styled in Reforma 1969 at the matching size and citrus color. The rendering is a single span wrapping the line, the visitor can put their caret between two pound signs and the styles update on the next frame.

A line starting with a hyphen or an asterisk and a space is a list item. The marker stays visible. The line is rendered in Geist Sans 17px with a small CSS counter increment, but the page does not number unordered lists, it simply draws a small dot in citrus next to the line through a ::before pseudo element. Lines starting with a number, a dot, and a space are ordered lists, the page uses CSS counters with counter increment and a content pattern of decimal followed by the dot to render the visible number, which lets the visitor reorder items without renumbering them by hand.

Text wrapped in single asterisks or single underscores is emphasized, rendered in italic with a thin rose blush 1px underline. Text wrapped in double asterisks or double underscores is strong, rendered in 600 weight. Text wrapped in backticks is inline code, rendered in IBM Plex Mono on a faint ivory band.

A line beginning with a right pointing angle bracket and a space is a blockquote, rendered with a 2px citrus left border and a slight left padding.

A run of three backticks on a line by itself opens a code block. The lines that follow until a matching closing run of three backticks are styled as a single IBM Plex Mono code block on a soft raven band with five percent opacity. The opening and closing backticks themselves stay visible.

The parser is hand written in src/lib/md.ts as a small line based scanner. Lines outside any open code block are tokenized individually. Inside a code block, lines are emitted verbatim until the closing run.

▸ animation ▸

When a heading level changes (the visitor adds a pound sign to a line that was h2 so it becomes h1), the new span is animated through the Web Animations api with a single small scale and color keyframe set.

```
span.animate(
  [
    { transform: 'scale(0.96)', color: '#888' },
    { transform: 'scale(1)',    color: 'currentColor' }
  ],
  { duration: 220, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' }
);
```

The animation runs only on the boundary of a style change, not on every keystroke inside an already styled span, so the surface stays quiet during ordinary typing. The same animation runs on the strong, emphasized, and code spans when they first acquire their style, so the visitor sees a soft pop at the moment a token becomes recognizable.

▸ modeline ▸

A thin line at the top right of the surface in 12px IBM Plex Mono citrus shows the live state of the surface. The line reads things like

```
12 lines, 384 words, 2.1 kb, caret at line 4 column 17
```

The numbers update on every rewrite, the modeline is the only piece of chrome on the page. To the left of the numbers, a small text button in 12px IBM Plex Mono raven reads copy as markdown, which copies the raw text to the clipboard through navigator.clipboard.writeText. A second small text button reads copy as html, which serializes the rendered dom to a string with the inline styles baked in and copies that.

▸ selection ▸

The page hooks selectionchange so it can show a small floating actions panel above any non empty selection, in 11px IBM Plex Mono citrus, with three text buttons reading wrap in bold, wrap in italic, wrap in code. Tapping a button inserts the matching markdown shorthand on each side of the selection and restores the selection over the wrapped text. The floating panel uses CSS anchor positioning where supported (or a fallback to manual top and left positioning) so it follows the selection.

A second small text button in the floating panel reads make this a heading, which prepends the right number of pound signs to the start of the line containing the selection, demoting any existing heading by one level on each tap and snapping back to h1 after h4.

▸ storage ▸

The text in the surface is mirrored to localStorage under the key markdown.livewire.text.v1 within 400ms of idle. On boot, the App reads the saved text and pastes it back into the surface, running the parser once to apply styles. The text holds a small example document if no text is saved, a short paragraph with one of each kind of token so a first time visitor sees the page do its work.

If localStorage is unavailable, the text lives only in the current session, a small italic 11px line at the bottom right of the modeline reads this document is not being kept on this device. The page still works for the session.

▸ edges ▸

A very long line (more than 4000 characters) is rendered with no special treatment, the page does not wrap or truncate, the visitor can scroll the line horizontally if the viewport is narrow. The modeline byte counter reflects the size accurately.

A paste of html (the visitor copied a region from a browser page) is intercepted through the paste event handler. The plain text version is read from the clipboardData and inserted at the caret, the html version is discarded. This is what plaintext only is supposed to do at the contenteditable level, the paste handler adds belt and braces.

A pasted block that contains markdown tokens is rendered immediately, the visitor sees the styles fire on the next frame.

A drag and drop of a text file (rather than a paste) reads the file through FileReader.readAsText and inserts its content at the caret. Other file types are ignored with a small italic 11px line at the modeline reading the surface only accepts plain text and markdown for 1500ms.

▸ build ▸

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding ivory, raven, raven faint, citrus, rose blush. Vite as the build tool. State is plain useState for the small bookkeeping around the modeline. The surface itself is managed imperatively, the React component renders a stable contenteditable div on mount and the imperative code inside src/lib/surface.ts owns every subsequent dom mutation. No router, no global store, no context provider, no markdown library, no editor library, no slate, no prosemirror, no lexical, no icon pack. The MutationObserver, Selection api, Range api, Web Animations api, and Clipboard api are used directly.

Files. index.html with the Reforma 1969 (or Lora Display fallback), Geist Sans, and IBM Plex Mono links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the modeline state and the surface ref. src/components/Surface.tsx for the contenteditable div with the MutationObserver and the imperative rewrite. src/components/Modeline.tsx for the small top right line. src/components/FloatingActions.tsx for the selection panel. src/lib/md.ts for the line based parser. src/lib/render.ts for the dom builder. src/lib/range.ts for the caret save and restore. src/lib/anim.ts for the small Web Animations helpers. src/lib/storage.ts for the localStorage try catch. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a laptop. The ivory page paints, the surface fills the middle, a soft caret blinks at the start of a small example document. They place the caret at the start of a line and type a pound sign and a space. The line styles itself as an h1 in Reforma 1969 with a citrus accent, a small scale animation runs once. They select a phrase, the floating actions panel appears above the selection, they tap wrap in bold, the page inserts the double asterisks and re selects the wrapped text. The modeline updates the word and byte counts in real time. They close the tab, reopen later, the document waits exactly as they left it.

---
title: Regex Playground
app_type: regex-playground
wallet: 0xba8f5f005de900e45C072CDB2040429D9A513d7e
---

You paste a regex at the top of the page. You paste a sample of text below it. Every match is highlighted in real time. Every capture group is listed in a small inspector beside the text. The flag toggles sit between them. If your pattern is broken, the page tells you what it expected and where. Nothing else is on the page. No login, no library, no editor surface heavier than a textarea.

## What is on the page?

A warm white field, one column at 760px max width, centered. A small header in plum that reads regex playground in 18px DM Sans medium. Below the header a single line in 13px DM Sans muted plum saying you paste, you see matches, you keep working. Below that the editor opens. Beneath the editor a cheatsheet drawer, collapsed by default. That is the whole page. The plum is used for the active pattern and the section labels. The mint is the only other color and it is used only to highlight matches inside the text and to mark the active group chip.

## What does the editor look like?

The editor is two stacked rows separated by a 1px plum hairline at twenty percent opacity. The first row is the pattern input. It is rendered as a single line of Fira Code 16px in plum, with a soft warm white background and 12px vertical padding, no border, the cursor placed inside on load. To the left of the input a small slash glyph in muted plum, to the right of the input the second slash glyph followed by the active flags rendered as small mint pills, one per flag, in Fira Code 12px lowercase. Tapping a pill removes that flag. Below the pattern row, a horizontal strip of small text buttons in DM Sans 12px for the flags that are off, in muted plum, one for each of g, i, m, s, u, y. Tapping a flag adds it to the active set and replaces it with a mint pill above. Pressing the slash key while inside the pattern input does nothing special, the leading and trailing slashes are decorative and never part of the pattern string.

Below the first row is the test text. A monospaced multi line textarea in Fira Code 14px, soft warm white background, twelve rows tall on desktop, six on mobile, no border, padded 14px. The textarea behaves like a normal textarea except that the matches are visually overlaid through a positioned layer behind the live text, redrawn on every keystroke and every pattern change. Each match is rendered as a 6px tall mint underline that hugs the matched text, with the active match (the one selected in the inspector) drawn instead as a soft mint fill behind the text. Overlapping matches inside the same regex (only possible with lookarounds) stack the underline at two heights.

If the pattern fails to compile, the first row outlines briefly in a soft pink, the section below the second row dims, and a tiny italic line in 12px DM Sans appears under the slashes reading the engine could not read this pattern, followed by the message from the SyntaxError as plain text without the word SyntaxError in front of it.

## What shows up in the inspector?

To the right of the editor on desktop, below the editor on mobile, sits a panel in soft warm white with a 1px plum hairline. The panel is sized to roughly forty percent of the page width on desktop. Inside the panel three regions stacked. The first region is the count line in 14px DM Sans, plum, reading something like 11 matches across 4 lines. The second region is the match list, a vertical stack of small cards, one per match, each card showing the match text in 13px Fira Code on a single line truncated with an ellipsis at 36 characters, followed below by a tiny line in 11px DM Sans muted plum reading the position as start to end and the line number, and to the right a small chevron that expands the card to show every named or numbered capture group as a stack of group chips. A group chip is a small pill in 12px Fira Code, group number on the left in muted plum, group value on the right in plum. Tapping a chip copies its value to the clipboard with a small toast that says copied to clipboard for 1200ms. The third region is the replace strip, a one line Fira Code 13px input prefixed with a small dollar arrow glyph, where the user types a replacement template using the usual dollar sign group references like $1 or $<name>. As the user types, a small live preview appears under the input showing the replaced version of the test text in 12px Fira Code on a soft mint band. A small text button next to the replace input reads apply to the text, which writes the replacement directly into the textarea, no undo.

A toggle above the inspector switches between the live mode and the explain mode. The explain mode replaces the match list with a vertical breakdown of the pattern itself, each token from the pattern shown on its own row with the token in 13px Fira Code on the left, a plain language description on the right in 13px DM Sans, examples below. For example, a row for \d+ shows the token then the description one or more digits, with a small example string. The breakdown is built by walking the pattern with a small in source parser that handles the common tokens, anchors, escapes, character classes, groups, alternation, and quantifiers. Tokens the parser does not recognize render as the literal pattern fragment with the description unknown in muted plum, so the breakdown never crashes on a working pattern.

## How do you keep your work?

Every change to the pattern, the flags, the test text, and the replacement template is mirrored to localStorage under the key regex.playground.last.v1 within 300ms of idle. On boot, if storage has a saved state, restore it. Otherwise, seed a small example. The seeded pattern is a small one for parsing key value pairs like name: alex, the test text is three short lines of mock notes containing those pairs, and the replace template is set to a clean rewrite that produces a list of just the values.

The url hash is also used. Pressing a small text button in the top right reading share this in 12px DM Sans plum copies a url to the clipboard that encodes the current pattern, flags, test text, and replace template as a base64url string after a hash. Loading the page with that hash decodes and shows the same state, leaving localStorage untouched until the user makes a change. There is no server. There is no account.

```
example pattern: \b([A-Za-z]+):\s*(\w+)\b
example flag set: g
example text: name: alex
age: 31
example replace: $1 => $2
```

## What about edge cases?

A pattern containing a global flag is required for the match list to show more than one match. The page does not silently add g for the user. The flag pills make this obvious by showing only what the user actually picked. A pattern with no matches renders the count line as no matches with a small dot, the match list region simply remains empty. A pattern that compiles but loops forever (the case where g is on and the pattern matches an empty string at position zero) is detected after a soft 12ms timeout per single match step inside the matcher loop, after which the engine halts, the count line reads stopped early after a possible infinite loop, and the match list shows the partial results so far in muted plum. A test text longer than 200 kilobytes shows a tiny line under the test input reading the text is being truncated to two hundred kilobytes for the live view, and the matcher runs only against the truncated portion. A replace template using a group that does not exist renders the literal token in the preview without throwing.

The cheatsheet drawer sits at the bottom of the page. A small text button in 13px DM Sans muted plum reads show the small cheatsheet. Pressing it expands a single block of four columns, each column listing six common tokens with a tiny description and an example, including anchors, character classes, quantifiers, groups, lookarounds, and escapes. The drawer is purely reference, nothing inside it is clickable.

## Why?

A regex you cannot read is a regex you cannot keep. The page is small on purpose. It exists so that the loop between writing a pattern and seeing what it does is shorter than the time it takes to give up on the pattern.

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding warm white, plum, muted plum, and the mint accent. No router, no global store, no context provider, no syntax highlighter library, no regex library beyond the platform RegExp object. State is plain useState and one useReducer for the editor block. Every glyph including the slashes and the chevron is inline svg in the component that uses it.

Files. index.html with the DM Sans and Fira Code links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component. src/components/PatternRow.tsx. src/components/FlagStrip.tsx. src/components/TestArea.tsx with the overlay layer for match highlighting. src/components/Inspector.tsx. src/components/MatchCard.tsx. src/components/ReplaceStrip.tsx. src/components/Explain.tsx for the pattern breakdown. src/components/Cheatsheet.tsx for the bottom drawer. src/lib/parse.ts for the small token walker used by Explain. src/lib/safeMatch.ts for the timeout protected matcher. src/lib/hash.ts for the url hash encode and decode. src/lib/storage.ts for the localStorage try catch. src/lib/seed.ts for the initial example. tailwind.config.ts. package.json with react, react dom, vite, and tailwind only. README.md with two short paragraphs.

A first time visitor opens the page and sees a pattern in the top row, a small note text below it with several matches underlined in mint, eleven matches counted on the side, the first one expanded showing two groups. They edit the pattern. The underlines move. They press share this, paste the url into a new tab, the same state opens. They reload the original tab and the state is still there.

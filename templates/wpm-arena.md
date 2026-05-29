---
title: WPM Arena
app_type: wpm-arena
wallet: 0xb0a307Dc229d985147F22A6c0CEE86c0458eCd92
---

Sixty seconds. One paragraph on the screen. The user types it. Words per minute and accuracy climb in two big numbers at the top. When the timer hits zero the run lands on the leaderboard which lives in this browser. There is no signup, no friends list, no streak shaming, no power up. The page is a small arena that opens when the user lands and closes when they leave. Each visit, a fresh paragraph from a small built in corpus.

## The track

### Surface

A track black background, the color of a sprint lane at night. Lane white as the primary text color. A single lane line yellow used only for the live caret, the current letter under the caret, and the small timer bar at the bottom. A second accent, finish red, used only when the timer ends and when the accuracy drops under ninety percent during a run. Space Grotesk at 18px for the body of the paragraph and at 13px for the smaller readouts. JetBrains Mono Bold at 56px for the two live numbers at the top, the wpm and the accuracy. No icons except a small inline svg stopwatch in the top left corner of the page, 14px, drawn with three paths.

### Layout

One column at most 720px wide, centered, 28px gutter on phones. From top to bottom, the readout row, the paragraph, the timer bar, the leaderboard. Each region is separated by 24px of vertical space. The page never scrolls during a run, the layout is sized to one viewport on a standard laptop and a phone, the leaderboard sits below the fold on a phone so the user does not see it while typing.

## The run

### The readouts

Two large numbers side by side at the top. The left one is the live wpm, JetBrains Mono Bold 56px lane white, the number recomputed on every keystroke. To the right of the number a small lane white caption in Space Grotesk 13px reading words per minute. The right large number is the accuracy as a percent, no decimal, same size and weight as the wpm. The accuracy caption reads accuracy. When accuracy drops under ninety percent during a run, the right number's color crossfades to finish red over 200 milliseconds, and returns to lane white when accuracy crosses back above ninety. A small lane line yellow line below the two numbers shows the live elapsed seconds out of sixty in Space Grotesk 13px, like 18 of 60.

### The paragraph

Below the readouts sits the target paragraph in 22px Space Grotesk 400 lane white at sixty percent opacity, line height 1.6, padded 20px inside a card with a 1px lane white hairline at fifteen percent opacity, no rounded corners. The paragraph is one of twenty short paragraphs in the corpus, picked at random on page load. As the user types, the typed characters fade from sixty percent to full lane white in place. The current character under the caret gets a thin 2px lane line yellow underline. A mistyped character is rendered finish red and does not advance the caret unless the user types the correct character or the user presses backspace to remove the error. Spaces matter. Punctuation matters. The corpus uses no curly quotes or em dashes, only straight apostrophes and commas and periods, so the engine never has to fight a keyboard mapping. A small lane white caret line, 2px wide, blinks at 500ms cycle at the current position. When the user has typed the whole paragraph before the timer ends, the run ends early and the page paints a small lane line yellow congratulations line under the timer reading finished in 47.8 seconds with whatever the actual time was.

### Timing

The run starts on the first keystroke, not on page load. Before the first keystroke a small lane white line below the paragraph reads press any key to begin, in 14px Space Grotesk italic. The timer counts down from sixty seconds, the underlying clock is performance.now to avoid drift, the readouts update at 60Hz capped through requestAnimationFrame. When the timer hits zero, the page locks the input, dims the paragraph card to forty percent opacity, swaps the press any key line for a single text button in 14px Space Grotesk 600 lane line yellow that reads run another paragraph, and writes the result into the leaderboard.

### The bar

A thin horizontal bar across the full width of the column below the paragraph, 4px tall, lane white at twenty percent opacity, with a lane line yellow fill that grows from left to right as the timer runs. The bar is the only piece of motion that runs continuously during a run, the rest of the page only updates on keystroke.

## After the run

### Scoring

Words per minute is computed as the standard, characters typed correctly divided by five, divided by minutes elapsed. Backspace does not reduce the correct character count, it only removes the latest character from the typed prefix and rolls the caret back. Accuracy is correctly typed characters divided by total keystrokes. Runs that end early due to finishing the paragraph use the actual elapsed time. Runs that hit zero use sixty seconds flat.

### The leaderboard

Below the timer bar, a small block titled in 13px Space Grotesk 600 lane white reads recent runs in this browser. Below it a vertical list of the last ten runs, most recent on top. Each row is a single line, 14px Space Grotesk lane white, four columns. The first column is the date in the form 29 May 14:38. The second column is the wpm. The third column is the accuracy. The fourth column is the paragraph slug, the first three to five words of the paragraph that was typed, italic muted lane white. The top wpm in the list has its row tinted lane line yellow at six percent opacity, so the personal best stands out without making the rest dim. A small text button in 12px Space Grotesk muted lane white at the bottom of the list reads forget every run, with a confirm prompt that says clear every run from this browser, and a small cancel.

### What is kept

The list of runs is saved to localStorage under the key wpm.arena.runs.v1 as an array of objects, each with id, isoTimestamp, wpm, accuracy, secondsElapsed, paragraphSlug, paragraphIndex. The most recent ten are kept, older ones drop silently. The board never sends anything to a server, the page has no analytics, the corpus is shipped in source. If localStorage is unavailable, the board holds in memory and a small italic 11px line at the bottom of the page reads these runs are not being kept on this device.

The corpus is twenty short paragraphs of fifty to ninety words each, on subjects that are easy to type and uninteresting to memorise, so a returning visitor cannot game the score by knowing the text. Examples below are a few of the twenty, the full set is hardcoded in src/lib/corpus.ts.

```
the river slowly carved a path through the soft stone over many seasons.
making bread takes time, a little salt, a slow rise, and a hot oven.
the small town held a market on saturdays in the old square by the well.
notebooks are kept on the third shelf, sorted by the year of their first entry.
the cold air settled on the lake in the early hours before the wind picked up.
```

The corpus paragraphs are written in plain modern english with no curly punctuation. New paragraphs can be appended to the file later, the runtime picks one at random on load with a small bias toward paragraphs the visitor has not seen in the last three runs, tracked in a tiny seen list in localStorage.

## Build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding track, lane, lane line yellow, and finish red. Vite as the build tool. No router, no global store, no context provider, no animation library, no timing library, no virtual list, no icon pack. State is plain useState and one useReducer for the run state machine. Timing is performance.now, animation is requestAnimationFrame. The single audio context is not used, the arena is silent. Every glyph including the stopwatch and the caret is inline svg or a single span in the component that uses it.

Files. index.html with the Space Grotesk and JetBrains Mono links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the run state and the board. src/components/Readouts.tsx for the two large numbers. src/components/Paragraph.tsx for the target paragraph and the live caret. src/components/Bar.tsx for the timer bar. src/components/Board.tsx for the leaderboard. src/components/Header.tsx for the small stopwatch and the title line. src/lib/run.ts for the run reducer and the per keystroke handler. src/lib/score.ts for the wpm and accuracy calculations. src/lib/corpus.ts holding the twenty paragraphs. src/lib/storage.ts for the localStorage try catch. tailwind.config.ts. package.json with react, react dom, vite, and tailwind only. README.md with two short paragraphs.

A first time visitor opens the page and sees the two big zeros at the top, a paragraph in the card, a small italic line reading press any key to begin. They type the first letter, the timer begins, the wpm starts to climb, the bar fills from the left, the caret runs across the words. The paragraph ends at 47 seconds, the page locks, the result writes itself into the board with the paragraph slug in italic. They press run another paragraph, a different paragraph appears, the board stays. They reload the tab. Their three best runs from earlier are still in the board, the top run still tinted lane line yellow.

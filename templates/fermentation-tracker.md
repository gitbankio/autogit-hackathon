---
title: Fermentation Tracker
app_type: fermentation-tracker
wallet: 0x4b2c1444b45a5f291B304a9C2a95E11783F6970d
---

A jar on a kitchen counter is the smallest unit of slow time you can keep in your house. You want to know how old it is, how it tastes today, when to taste it again, and what the room temperature was the week the bubbles slowed down. The app is the small notebook that lives next to the jars. One page. One list of active ferments. One detail view per ferment. A reminder that you tasted it on Tuesday and the brine had gone right.

## § Surface

Bone background, the color of a folded linen napkin. Ferment brown for the type, never pure black. A soft oxidized copper for the rules and section labels. A single brine yellow used only for the taste it now button and the small dot next to a ferment that is past its target window. Spectral serif for body and headers, weight 400 and 500. IBM Plex Sans for the small labels, weight 400. No mono. No icons except a small inline svg of a mason jar in the page header, fourteen pixels tall, drawn with three paths.

## § Header

A horizontal line across the top of the page in copper, 1px thick. Above the line in 14px Plex Sans the words a small fermentation notebook, lowercase, slightly tracked. To the right of that line, the current month in 14px serif italic, like late may. Below the line a small jar svg followed by the count of active ferments in 22px serif, written as a sentence like seven ferments going right now.

## § The list

The main view is a single column of ferment cards, max width 680px, centered, 16px gap between cards. Each card is bone with a 1px copper hairline, padding 20px, no rounded corners. Inside a card, four regions stacked.

The first region is the name in 22px serif, the kind in 13px Plex Sans copper italic below the name, kinds are kraut, kombucha, sourdough, miso, kimchi, hot sauce, vinegar, brine pickle, kvass, mead. To the right of the name a small text button in 13px Plex Sans reading taste it now in brine yellow. If the ferment is past its target window without a taste in the last three days, a brine yellow dot 8 pixels across sits to the right of the taste button.

The second region is two small inline lines in 13px Plex Sans, the first reading day twelve of fourteen target with the target written in copper, the second reading last tasted three days ago with the time in copper. If a ferment is past target, the first line reads day sixteen, six over target in ferment brown.

The third region is a thin horizontal strip 8px tall stretching the full width of the card, divided into one square per day since pitch, each square colored by the taste rating that day if there was a taste, or empty if there was none. The five ratings map to soft bands. Flat is a desaturated grey bone. Promising is a pale brine yellow. On target is the copper. Sour is a deeper ferment brown. Over is a small x mark inside an otherwise empty square. Today's square has a 1px copper outline whether tasted or not.

The fourth region is a single line of 13px Plex Sans copper italic, the most recent note in plain text, truncated to one line with an ellipsis. Examples, brine cleared, bubbles slowed, smells like green apple, slightly metallic. If there is no note yet, the line is omitted, the card simply ends.

The cards sort by days remaining to target, ascending, with past target cards at the top.

## § The detail

Clicking anywhere on a card except the taste it now button opens the detail panel sliding in from the right edge, taking up 480px on desktop and the full width on mobile. The list dims to 30 percent opacity behind it. The panel has four regions stacked vertically inside a soft bone background.

The first is the header, the name in 26px serif, the kind in 14px Plex Sans copper, a small text button in the top right of the panel reading close in 13px Plex Sans.

The second is the schedule. Two date fields, pitched on and target taste, both editable through a small popover calendar in Plex Sans. Below the dates a single number field labelled room temperature in degrees celsius, optional, allowed values 8 to 35. A small checkbox below the temp field reads in a darker spot. The schedule fields save on blur.

The third is the tastings. A vertical timeline of taste entries in reverse chronological order, each entry shows the date in 14px serif, the rating as one of five small word labels (flat, promising, on target, sour, over) in 13px Plex Sans copper, and the note in 14px serif italic underneath. Each entry has a small text button to the right in 11px Plex Sans reading remove with a confirm prompt. At the top of the timeline a single tall input row, a rating chooser as a row of five small word buttons, a single line note field, and a submit button reading add tasting in 13px Plex Sans brine yellow. The new tasting takes today as the date.

The fourth is the danger. A small zone at the very bottom of the panel separated by a thin copper hairline. Two text buttons in 12px Plex Sans, the first reading archive this ferment in copper, the second reading delete forever in ferment brown. Archive moves the ferment out of the active list into a small archive at the bottom of the home view, shown as a single line that reads three ferments archived which expands when clicked. Delete is permanent with a confirm prompt that reads remove this ferment and every tasting written about it.

## § New ferment

A small text button in the top right of the home view, above the list, in 14px Plex Sans copper, reads start a new ferment. Tapping it opens a small modal at the top of the page sliding down. Five fields. Name in serif, kind as a dropdown of the ten kinds, pitched on as a date defaulting to today, target taste as a date defaulting to today plus a kind specific suggestion (kraut fourteen, kombucha seven, sourdough five, miso one hundred eighty, kimchi twenty one, hot sauce thirty, vinegar ninety, brine pickle ten, kvass three, mead sixty), room temperature optional. The submit button reads start it in brine yellow. Pressing it closes the modal and adds the card to the list, sliding in from the top of the list with a brief 200ms ease in motion.

## § Storage and shape

Every ferment is saved to localStorage under the key fermentation.tracker.v1 as an object containing an array of ferments and an array of archived ferments. The shape is straightforward, written in this TypeScript so the codegen has no doubt.

```ts
type Rating = 'flat' | 'promising' | 'on-target' | 'sour' | 'over';

interface Tasting {
  id: string;
  date: string;
  rating: Rating;
  note: string;
}

interface Ferment {
  id: string;
  name: string;
  kind: string;
  pitchedOn: string;
  targetTasteOn: string;
  roomTempC: number | null;
  darkerSpot: boolean;
  tastings: Tasting[];
}

interface Store {
  active: Ferment[];
  archived: Ferment[];
}
```

On boot, if storage holds a Store, render it. If not, seed three active ferments. A kraut on day twelve of fourteen with three tastings, the most recent promising with the note brine cleared. A kombucha on day five of seven with two tastings, the most recent on target with the note green apple is gone. A sourdough on day one of five with no tastings yet. Seed the archived list with one entry, a hot sauce that ran through its target, finished at over, with a final note too vinegary for the eggs. If storage is unavailable, fall back to memory and write a small italic 11px line at the bottom of the page reading this notebook is not being kept on this device.

## § Done

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding bone, copper, brine, ferment, and the three muted band colors. No router, no global store, no context provider, no date library, no animation library, no rich text editor, no icon pack. Native Date and Intl only. Every glyph including the small jar svg and the close x is inline svg in the component that uses it.

Files. index.html with the Spectral and IBM Plex Sans links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component. src/components/Header.tsx. src/components/FermentCard.tsx. src/components/StripChart.tsx for the small per day strip. src/components/Detail.tsx for the right panel. src/components/TastingList.tsx. src/components/NewFerment.tsx for the top modal. src/components/Archive.tsx for the expandable archive line at the bottom. src/lib/storage.ts with try catch. src/lib/dates.ts for day count, day remaining, and the human time helper. src/lib/seed.ts for the three seeded ferments and one archived. src/lib/kinds.ts for the suggested target durations. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page and sees the header, three cards, an archived line at the bottom, and the kraut card sits at the top with day twelve of fourteen, a strip of small bands, a recent note. They tap taste it now, the detail panel slides in, they pick on target, type the brine is good, submit. The strip on the home card gains a fresh copper square. They close the panel. They start a new ferment, a kimchi, the card slides in. They reload. Everything persists. They open the page next week, two of the ferments now show a brine yellow dot.

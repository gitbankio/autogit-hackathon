---
title: Moon Phase
app_type: moon-phase
wallet: 0x3D4519E714e761a4C1a42a70412C2713706997ba
---

The moon does not need an app to find it. The app is for the questions that come after. What phase is the moon in tonight. When will the next full one rise. What is the illuminated fraction at the moment you open the tab. The page is one column. The top is the moon, drawn in silver on midnight, large enough to read across the room. The middle is the number, the name of the phase, the date of the next four phase changes. The bottom is a thirty day strip of small moons running left to right showing where you are in the cycle. There is nothing else.

## Opening

A midnight blue page, almost black but warmer than ink, the color of a sky an hour after sunset before the stars come out. The type is Cardo serif at 18px for body and 22px for the small headers, silver as the primary color, pale gold reserved for the moon disc itself and for the date of the next full moon, faint blue reserved for the small captions that show times in the local timezone. IBM Plex Mono at 12px is used for percentages, hours, and the day numbers on the strip below. The column is at most 540px wide, centered, 32px gutter on phones. Above the column, a single line in 13px Cardo italic muted silver reads what is happening overhead tonight.

## Drawing the disc

The moon disc sits at the top of the column, 200px across, drawn in pure inline svg, no external image. The disc is a circle in the pale gold color with a clipped overlay in the midnight color that produces the current phase shape. The math is direct, no library needed. A waxing crescent is a gold disc with a midnight ellipse clipped against the right half. A waning crescent flips. A first quarter and last quarter are halves. A waxing gibbous is a gold disc with a smaller midnight ellipse on the left, and so on. The illuminated portion always appears on the side of the disc that is correct for the visitor's hemisphere, which the app guesses from the timezone offset, and a small text button in 11px Plex Mono below the disc reads view from southern hemisphere or view from northern hemisphere depending on the current guess, and tapping it flips the orientation for the rest of the session. The hemisphere choice is also saved.

A very faint silver halo at six percent opacity sits behind the disc at a radius of 16px more than the disc, drawn with a single radial gradient on a slightly larger circle, just enough to suggest the moon is bright without lighting up the page. The disc does not animate on first paint, it simply appears. The disc does animate when the visitor scrubs a small handle on the strip below, in real time, the clip shape recalculating to match the day under the handle.

## Naming the phase

Directly below the disc, in 26px Cardo 500, the phase name. The eight phases are new moon, waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, last quarter, waning crescent. The name uses the eighth that contains the current illumination and angle, computed from the synodic age in days since the most recent known new moon. To the right of the name, in 14px Plex Mono silver, the illuminated percentage rounded to a whole number with a percent sign, like 64 percent. Below the name line, a 13px Cardo italic muted silver caption reads the synodic age in human form, like four days and seven hours past the new moon.

## Listing what is next

Below the phase name, a small stack of four lines, one per upcoming phase change, sorted by date. Each line is two columns. The left column in 14px Cardo holds the phase name. The right column in 12px Plex Mono holds the date and local time in the form Sun 16 Aug, 03:17. The next full moon line has its right column rendered in pale gold instead of silver, so it can be picked out at a glance. A small text button at the right end of each line in 11px Plex Mono faint blue reads in the calendar, which copies a tiny iCalendar block for that single event to the clipboard, a self contained VEVENT, with a small toast confirming the copy. The calendar block uses the date, the phase name, and a single line description.

## Reading the strip

Below the four upcoming lines, separated by a thin 1px silver hairline at fifteen percent opacity, sits the thirty day strip. The strip is a single horizontal row of small moons, one per day, centered on today plus or minus fifteen days. Each small moon is a 22px disc drawn in the same way as the big one above, but compact, with a 10px gap between days. Today's moon is highlighted with a thin pale gold outline 2px thick, and a tiny line of 11px Plex Mono below it shows the date in the form 14 Aug. Days that contain a phase change (new, first quarter, full, last quarter) show a small dot of pale gold below the moon. Hovering or tapping a day moon promotes that day's data into the large disc above and the readout block, with a quick 200ms ease, and a small text button reading back to today appears next to the strip in 12px Plex Mono faint blue, which restores the live moment. The strip scrolls horizontally with the mouse wheel and with touch swipe, but it always snaps to days.

The view of the strip never changes the disc orientation. The hemisphere flip stays where the user set it.

## Picking a location

The local timezone is read from the browser. The latitude and longitude are not strictly required to compute the phase (the moon is in the same phase for everyone), but the rise and set times are local. A small text button in the top right corner of the page in 12px Plex Mono faint blue reads set a place. Tapping it opens a small inline panel below the title with two number inputs labelled latitude and longitude, both in decimal degrees, plus a small auto detect text button that reads my browser knows roughly, which calls the navigator.geolocation api once with a soft prompt fallback. If the browser refuses or the user dismisses, the panel leaves the numbers blank and the rise and set lines show a small italic dash. The chosen place is saved to localStorage under the key moon.phase.place.v1, and a small line below the location panel reads this place is kept only in this browser on this device.

The rise and set times for the current night, when a place is set, sit in a single 12px Plex Mono line directly under the strip, in faint blue, in the form rises 21:14, sets 06:48. Times are computed in the local timezone from a simple in source approximation that is accurate to a few minutes for civil purposes. If the moon does not rise during the next 24 hours (high latitude edge case), the line reads no rise or set today.

## Persisting the small choices

The visitor's hemisphere flip, the location numbers, and a small history of the last seven days the visitor has scrubbed to on the strip are saved to localStorage. The history is shown nowhere, it exists only as a kindness so that the next time the visitor opens the tab the strip is centered the same way it was, no animation, no jump. If localStorage is unavailable, the page falls back to in memory and a tiny italic 11px line at the bottom of the page reads these small choices are not being kept on this device. There is no account, no cloud, no sync.

The data sample below shows what a single computed day looks like inside the engine, for reference, never rendered to the visitor.

```
date: 2026-05-29
age: 12.4 days
illumination: 0.82
angle: 110 degrees
phase: waxing gibbous
rise: 16:22
set: 03:11
```

## Closing

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color only, custom palette in tailwind.config.ts adding midnight, silver, silver muted, pale gold, faint blue. Vite as the build tool. No router, no global store, no context provider, no date library, no astronomy library, no icon pack. The synodic age is computed from a single reference new moon timestamp known in source, the illumination is derived from the age, the phase name from the eighth, the rise and set times from a small in source approximation. All shapes including the disc, the small day moons, and the tiny calendar icon on the in the calendar button are inline svg in the component that uses it.

Files. index.html with the Cardo and IBM Plex Mono links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the chosen day, the hemisphere flip, the place, and the upcoming phase changes. src/components/Title.tsx. src/components/Disc.tsx for the big moon. src/components/PhaseName.tsx for the name and percentage. src/components/UpcomingList.tsx for the four phase lines and the iCalendar copy. src/components/Strip.tsx for the thirty day row. src/components/Place.tsx for the location panel. src/lib/lunar.ts for the synodic age, illumination, phase name, and angle calculations. src/lib/rise.ts for the local rise and set approximation. src/lib/ics.ts for the small iCalendar string builder. src/lib/storage.ts for the localStorage try catch. tailwind.config.ts. package.json with react, react dom, vite, and tailwind only. README.md with two short paragraphs covering what the page is and how to run it.

A first time visitor opens the page and within a second sees a large pale gold moon clipped to a waxing gibbous shape on a midnight field, a percentage of sixty four next to the name, four upcoming phase changes listed below with the next full moon date in pale gold, and a strip of thirty small moons with today outlined. They tap in the calendar next to the full moon line, an iCalendar block lands on the clipboard, ready to paste into a notes app. They tap a small day moon five days ahead, the big disc reshapes in real time. They press back to today, the page settles. They reload. The place they set is still saved. The disc shows whatever the sky is doing right now.

---
title: Ink Sketch
app_type: ink-sketch
wallet: 0x0C8EDb7D701b7120B7C3c1677fdf41F7644E2e8A
---

A page that turns a stylus into ink. The visitor drags across a rice paper canvas, pressure becomes line weight, tilt becomes a brush angle, every stroke is a real svg path the visitor can copy as a snippet, save as a file, or undo. The canvas is svg, not bitmap, so the sketch stays crisp at any zoom and exports as text. The whole rig is Pointer Events plus a small svg builder. No pen library, no canvas library.

### the surface

A rice paper colored field. Sumi ink for the strokes by default. Two color accents reserved for the toolbar, deep brick for the active brush button, indigo for the active color swatch when not the default black. Cormorant Infant 22px 500 for the small title at the top reading ink sketch on rice paper. Atkinson Hyperlegible at 14px 400 for the toolbar labels and any short messages on the page. Fira Code at 11px for the tiny coordinate readout at the bottom corner. The page is one column at most 1080px wide on desktop, centered, 16px gutter. The canvas takes the full available width and a height that fills the viewport minus the top toolbar and the bottom strip.

### · · ·

### the canvas

The canvas is a single svg element with a viewBox sized to the visitor's chosen working dimensions, default 1600 by 1200 user units. The svg sits inside a wrapper div that handles all Pointer Events. Every completed stroke is appended into the svg as a single path element, with a generated d attribute and a stroke width attribute that comes from the average pressure of the stroke, plus a small per segment stroke width applied through a clever construction explained below. The svg is the source of truth. The page never falls back to a bitmap.

A 1px sumi ink hairline at twelve percent opacity draws a faint grid behind the strokes at every two hundred user units, just visible enough to see the page is not infinite, dim enough to disappear in any export.

### · · ·

### the input

The wrapper div sets touch action to none and uses setPointerCapture on pointerdown. Every pointermove call asks the event for its coalesced events through event.getCoalescedEvents and walks the resulting array, producing one point per coalesced event with the x, y, pressure, tiltX, tiltY, and timestamp of that sub event. This yields up to ten or twenty points per visual frame on a stylus that ships them quickly, the line is smooth even at high speed.

Each point becomes a sample. The current stroke holds an array of samples. The d attribute of the stroke's path is rebuilt every few samples by walking the array and emitting a small set of cubic bezier segments smoothed through a Catmull Rom to bezier conversion. The stroke width per segment is computed by reading the pressure of the segment's start and end samples, mapped through a small linear curve from 0.4 to 12 user units, with a smooth interpolation between adjacent segments. Because svg path strokes have only a single width attribute, the page implements variable width by drawing each stroke as a series of small adjacent path segments inside a path with the fill set to the brush color and the stroke set to none, with each segment widened perpendicular to the stroke direction by the local width. The result is a closed shape that reads as a stroke with a tapered start and end.

The shape of a point in the sample array, written into src/lib/stroke.ts, looks like this.

```
{
  x:         number,
  y:         number,
  pressure:  number,    // 0..1 from PointerEvent.pressure
  tiltX:     number,    // degrees -90..90
  tiltY:     number,    // degrees -90..90
  t:         number     // ms since stroke start
}
```

A pointer with no pressure (a finger or a mouse) reports 0.5 as a flat pressure, which is mapped to the middle of the width curve. A pointer with no tilt reports zero, which keeps the brush angle on a default 0 degree orientation.

### · · ·

### the toolbar

A horizontal strip across the top of the canvas, 48px tall, rice paper with a 1px sumi ink hairline at fifteen percent opacity. Five regions left to right.

The first region is the brush selector, three small text buttons in 12px Atkinson Hyperlegible reading line, brush, marker. Line is a constant width stroke at 2 user units regardless of pressure. Brush is the variable width tapered stroke described above. Marker is a wide flat stroke at 6 user units that ignores pressure but uses tilt to angle the marker tip. The active brush button is filled deep brick with rice paper text.

The second region is the color swatch row, six small circles, 16px round each, in sumi ink, deep brick, indigo, a warm clay, a leaf green, and a soft cream. Tapping a swatch sets the brush color. The active swatch has a 2px sumi ink outline.

The third region is the eraser, a single small text button reading eraser. When active, every pointer stroke removes any path it intersects, computed through a simple sampled hit test against the existing svg path elements.

The fourth region is the undo button and the redo button, each in 12px Atkinson Hyperlegible. Undo removes the most recently added path. Redo restores the most recently removed path. The undo stack is bounded at fifty steps.

The fifth region is the export row, three small text buttons. clear the page, copy svg, download svg. Clear asks a small confirm. Copy svg writes the current svg element to the clipboard via navigator.clipboard.writeText, with a small toast saying copied to clipboard. Download svg downloads the file with a filename of ink sketch and the current ms timestamp.

### · · ·

### the bottom strip

A thin strip below the canvas, 28px tall, holding three Fira Code 11px lines. The left line shows the current pointer's live x and y in user units. The middle line shows the current pressure to two decimal places and the tilt in degrees. The right line shows the path count, the total point count across all paths, and a tiny ratio for the svg's serialized size in kilobytes. The strip is the only place Fira Code appears on the page.

### · · ·

### the persistence

The current svg's content (the inner xml of the svg element) is mirrored to localStorage under the key ink.sketch.v1 within 400ms of idle. On boot, if storage has saved content, the App parses it back into the svg element to restore the sketch. If storage is unavailable, the sketch holds in memory and a small italic 11px line at the bottom right of the strip reads this sketch is not being kept on this device. The toolbar settings (the active brush, the active color, the undo stack) are not persisted, every load starts with line and sumi ink as the defaults.

A small example of a generated path's d attribute, written into the page as a reference, looks roughly like this.

```
<path d="M 240.0 312.5 C 252.3 318.2, 266.7 327.0, 281.1 330.6 ..."
      fill="#15171B" stroke="none" />
```

The page also generates a vector friendly version of each stroke as a single line element when the brush is set to line, since a single width is enough there.

### · · ·

### the edges

A pointer that leaves the canvas continues the stroke while pointer capture is held, the visitor can drag off the edge and back to keep a flowing line. A pointer that crosses the right edge of the canvas does not wrap, the stroke simply ends visually at the edge of the viewBox but the path keeps its full coordinates so a later zoom out reveals the part outside.

If Pointer Events is unavailable (very old browsers), the page falls back to mouse events and touch events with a small line reading you are missing pressure on this device, in italic 11px. The sketch still works, every pressure value is fixed at 0.5.

The eraser uses a simple bounding box pre check on each existing path, then a small per segment distance check against the eraser stroke's path. A path with no intersection is left alone, a path with any intersection is removed. The eraser cannot partially erase a single path, the whole path is removed (which is the cleanest behavior for a vector sketch).

Resize events keep the viewBox at the working dimensions and rescale the display through the svg's intrinsic aspect ratio, so the sketch never distorts even if the visitor changes the window size mid stroke.

### · · ·

### the build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding rice, sumi, brick, indigo, clay, leaf, cream. Vite as the build tool. State is plain useState and one useReducer for the undo and redo stacks. No router, no global store, no context provider, no drawing library, no path math library, no icon pack. Every brush widget glyph and every cursor mark is inline svg in the component that uses it.

Files. index.html with the Cormorant Infant, Atkinson Hyperlegible, and Fira Code links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the svg ref, the current stroke samples, the undo and redo stacks, and the active brush. src/components/Toolbar.tsx for the top strip. src/components/Canvas.tsx wrapping the svg element and the pointer event handlers. src/components/BottomStrip.tsx for the three Fira Code lines. src/lib/stroke.ts for the sample buffer, the smoothing, and the variable width path builder. src/lib/erase.ts for the hit test. src/lib/io.ts for the clipboard copy and the download. src/lib/storage.ts for the localStorage try catch. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a tablet with a stylus. The rice paper canvas paints, the toolbar sits at the top, the brush is set to brush, the color is sumi ink. They press the tip against the screen and drag a slow line. The line tapers at the start, swells in the middle where they pressed harder, tapers again at the end. They lift the stylus, the path settles into the svg. They tap the indigo swatch and draw a second stroke. The page count climbs to two. They press copy svg, paste the result into a text editor, the same two strokes appear at the right coordinates. They close the tab, reopen the next day, the sketch is still there.

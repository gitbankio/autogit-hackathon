---
title: Pixel Paint
app_type: pixel-paint
wallet: 0x20615cb29177Ff5B858da25730a94b4A4A6Ef812
---

A tiny pixel art editor that runs entirely in the browser. The visitor picks a canvas size (8 by 8, 16 by 16, 32 by 32, 64 by 64), picks a color from a small palette or any custom hex, and paints by clicking or dragging on the grid. Each cell is one pixel of the final image, the canvas is rendered through a real Canvas2D ImageData write so the output is a real bitmap. The visitor can undo, redo, save as png at the true pixel size or at a chosen scale, and export an animated gif when they have built a few frames.

the cabinet

A cabinet grey background, the color of an arcade machine left under the stairs. Parchment for the body type. Two accents only, neon mint for the active palette swatch and the cursor highlight on the grid, pixel pink for the small layer count badge and the recording dot when the visitor is capturing a gif. Press Start 2P at 14px for the headers (the only place the retro font appears, with a system mono fallback when the font fails to load), IBM Plex Sans at 15px 400 for body and 12px 500 for the small button labels. Two typefaces, two roles, no overlap. The page is one column at most 920px wide on desktop, the canvas takes the full width minus the side panel, the side panel sits on the right at 280px.

the grid

The grid is a single canvas element sized to the chosen pixel resolution times a magnification factor. For an 8 by 8 image at 480 pixels of available width, the magnification is 60, so each pixel renders as a 60 by 60 block on screen. The Canvas2D context has imageSmoothingEnabled set to false so the magnified pixels stay crisp. A 1px cabinet grey grid line is drawn between every cell at thirty percent opacity to help the visitor count.

The page holds the canvas state as a single Uint8ClampedArray of length width times height times 4 (one rgba quad per pixel). The visitor's clicks read the mouse position, convert to grid coordinates, and write the active color into the matching four bytes of the array. The canvas is repainted in a single ImageData write through createImageData and putImageData, which is the cleanest way to push pixel data to a Canvas2D context.

```
const id = ctx.createImageData(width, height);
id.data.set(pixels);   // pixels is the Uint8ClampedArray
ctx.putImageData(id, 0, 0);
```

The repaint runs on every mouse drag through requestAnimationFrame so the page stays smooth even at 64 by 64. A larger off screen render canvas then upscales the ImageData to the magnified display size by drawing the source canvas with imageSmoothingEnabled false.

the side panel

The right side panel holds the tool, the palette, the layers, the export buttons. From top to bottom.

The tool row, four small text buttons in 12px IBM Plex Sans, reading pencil, eraser, fill, picker. Pencil paints the active color. Eraser writes transparent (sets alpha to zero). Fill flood fills the matching color region from the clicked cell using a standard scanline flood fill. Picker reads the color under the click and sets it as the active color.

The size row, four small text buttons reading 8, 16, 32, 64. The active size is filled neon mint. Switching size resets the canvas with a confirm prompt that says start fresh at this size, with a small cancel.

The palette, a vertical grid of small colored swatches, six wide. The default palette is the standard pico 8 palette plus a few extras (sixteen swatches total). Each swatch is 32 by 32, clickable. The active swatch has a 2px neon mint ring around it. Below the swatches a small text input lets the visitor type a custom hex value, like ff6fb8. The custom color becomes the active color and is added to the palette as a 17th swatch (or replaces the last custom swatch when one was already added).

The layers row holds a small list of frames, each frame is a tiny thumbnail of the canvas at 48 by 48, with the frame number in 11px IBM Plex Sans pink to its right. Tapping a frame switches the canvas to that frame, the visitor edits, the page persists every keystroke. A small text button at the bottom of the list reads add a frame, which clones the current frame as a new one at the end.

The export row, four small text buttons. save as png at true pixel size. save as png scaled to 16x. record a gif of all frames. clear the canvas. The png buttons toString and download through a temporary anchor click. The gif button opens a small dialog with the frame delay slider (default 120ms) and a small text button reading record, which encodes the frame sequence to an animated gif in source through a small LZW encoder (around 220 lines in src/lib/gif.ts), and downloads the result.

the gif shape

The gif encoder writes a small in source array of frame buffers, each frame is a Uint8ClampedArray plus a delay in centiseconds. The encoder produces a gif89a file with a global color table (the active palette) and per frame image data compressed through LZW. A small block of the encoder's frame shape, written into src/lib/gif.ts.

```
interface Frame {
  pixels:    Uint8ClampedArray,   // RGBA per pixel
  delay:     number,              // centiseconds (10ms units)
  disposal:  number               // GIF disposal method, default 2 (restore to background)
}
```

The full file is written into an ArrayBuffer, wrapped in a Blob, downloaded through a temporary anchor click. No external library, no canvas to blob shortcut.

undo and redo

Every drawing action pushes a small undo record onto a stack capped at 50 entries. A record holds the frame index, a list of changed pixels (each pixel is an index plus the previous color plus the new color), and a timestamp. Pressing ctrl plus z (or cmd plus z) walks the stack backward, ctrl plus shift plus z walks forward. The stack persists across page reloads in localStorage.

paste an image

Pressing ctrl plus v with an image on the clipboard triggers an import. The page reads the clipboard image (an ImageBitmap from the paste event's clipboardData items), draws it into an offscreen canvas at the visitor's current canvas size with imageSmoothingEnabled false, reads the resulting ImageData into the active frame's buffer, and repaints. The original image is downsampled to the canvas resolution, the result is a real pixel art conversion of whatever the visitor pasted in.

storage

Every frame, the active tool, the active color, and the visitor's custom palette additions are saved to localStorage under the key pixel.paint.state.v1 within 400ms of idle. On boot, if the saved state exists, the page restores everything including the frame the visitor was on. If localStorage is unavailable, the page holds in memory and a small italic 11px line at the bottom reads this drawing is not being kept on this device.

the build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding cabinet, parchment, parchment muted, neon mint, pixel pink. Vite as the build tool. State is plain useState and one useReducer for the frames array, the active frame, the undo stack, and the active tool. No router, no global store, no context provider, no canvas library, no gif library, no clipboard library, no icon pack. Canvas2D, ImageData, ImageBitmap, and the clipboard event are used directly.

Files. index.html with the Press Start 2P and IBM Plex Sans links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the frames, the active frame index, the active tool and color, and the undo stack. src/components/CanvasHost.tsx wrapping the canvas element and the mouse and touch event handlers. src/components/ToolRow.tsx for the four tool buttons. src/components/SizeRow.tsx for the four size buttons. src/components/Palette.tsx for the swatch grid and the custom hex input. src/components/FrameList.tsx for the thumbnails. src/components/ExportRow.tsx for the four export buttons. src/components/GifDialog.tsx for the small recording dialog. src/lib/draw.ts for the pencil, eraser, fill, picker logic. src/lib/render.ts for the upscale render and the png export. src/lib/gif.ts for the in source LZW gif89a encoder. src/lib/paste.ts for the clipboard image import. src/lib/storage.ts for the localStorage. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a laptop. The cabinet grey surface paints, the empty 16 by 16 grid sits on the left, the side panel waits on the right with the tool row, size row, palette, frame list, and export buttons. They click pencil, pick neon mint from the palette, draw a small heart shape across a few cells. They add a frame, draw a slightly larger heart, add another frame. They tap record a gif, set the delay, the page downloads a small animated gif of the three frames. They reload the page, the same three frames wait for them.

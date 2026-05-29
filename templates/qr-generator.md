---
title: QR Generator
app_type: qr-generator
wallet: 0xC79c3Aa5D35a0D0e62C4197376278e108f48a9f4
---

A small page that turns a piece of text into a QR code. Plain url, a wifi network, a contact card, or freeform text. The visitor types or pastes the input, the QR appears in real time, the visitor downloads it as png or svg. There is no signup, no upload, no api call. The QR encoder runs in source.

* MODES *

A horizontal row of four small chips at the top of the page, in 14px Inter 500. Each chip selects an input mode. text, url, wifi, contact. The active chip is filled signal red with white text and a 2px signal red ring. The four modes shape the input form below the chips.

In text mode, a single multi line textarea accepts any utf8 text up to 2000 characters.

In url mode, a single line text input with the placeholder https example com slash, with a small italic 11px line below reading the url is encoded as is, no shortening. The page validates that the input parses as a url before encoding, otherwise a small italic line in signal red reads the url is not valid yet, the visitor can keep typing.

In wifi mode, four inputs stacked, ssid, password, encryption type (none, wep, wpa, wpa2 dropdown), and a small checkbox labelled hidden network. The four values are formatted into the standard wifi qr string with the wpa colon ssid colon password colon h colon shape.

```
WIFI:T:WPA;S:my home wifi;P:correct horse battery staple;H:false;;
```

In contact mode, six inputs stacked, name, phone, email, organization, url, note. The six values are formatted into the standard vcard 3.0 string with the begin and end markers and the line breaks the format requires.

```
BEGIN:VCARD
VERSION:3.0
N:Asuka Kim
TEL:+1 555 010 1234
EMAIL:asuka example com
ORG:small bakery
URL:https example com
NOTE:weekend baker
END:VCARD
```

* CANVAS *

The QR code itself sits in the center of the page, drawn as a single inline svg, never as a raster bitmap. The svg is at most 480 by 480 pixels on desktop and the full available width on phones. The dark modules render in ink, the light modules render in white (the page background, no fill). A 16 module quiet zone sits around the code.

The encoder runs every time the input changes, debounced to one frame through requestAnimationFrame. The encoder runs in source, no library, written into src/lib/qr.ts as a clean port of the standard ISO 18004 algorithm. The encoder picks the smallest version that fits the input plus the chosen error correction level, places the timing patterns, the position patterns, the alignment patterns, and the format and version information bits, then walks the data placement zigzag and writes the bits, and finally applies the best mask through the standard penalty score check.

* OPTIONS *

A small panel below the canvas in 13px Inter holds three options.

The first is the error correction level, four buttons reading L, M, Q, H. The default is M (15 percent recovery). H gives 30 percent recovery, useful for printed codes that may get scratched. L gives 7 percent, useful when the input is very long and a smaller code is wanted.

The second is the foreground color, three swatches (ink, signal red, a custom hex input). Picking a non ink color shows a small italic 11px line below reading high contrast against white reads better, in grey, when the chosen color does not have enough contrast against white per the WCAG ratio of at least 4 to 1.

The third is the size of the rendered svg, a small slider from 240 to 720 pixels.

A small text button at the bottom of the panel reads use a logo in the center, which opens a small file picker for an image file (png, jpeg, svg). The picked image is centered inside the QR at one fifth of the QR's width. A small italic 11px line below reads a logo reduces the recovery, raise the level to H if the logo is large.

* DOWNLOAD *

Two small text buttons below the panel.

The first reads download as png. Pressing it serializes the svg to a string, draws it onto an offscreen canvas at the chosen size, and downloads the result through a temporary anchor click with a filename of qr code and the current timestamp.

The second reads download as svg. Pressing it serializes the svg directly and downloads the file with the same naming pattern. The svg version is preferred for printing because it scales without aliasing.

A third small text button reads copy svg to clipboard, which uses navigator.clipboard.write with a text/plain mime type holding the svg source. A small toast confirms with copied to clipboard for 1200ms.

* SCAN *

Above the canvas, a single line in italic 12px grey reads scan with any phone camera. To the right of the canvas on desktop (below on phones), a small block in 11px Inter shows three small status lines.

The first reads the chosen mode and the encoded length, like url mode, 38 bytes encoded.

The second reads the qr version and the data capacity, like version 3, level M, 53 of 77 bytes used.

The third reads the estimated scan distance at the current size, like the smallest module is 4 pixels, scannable from about 30 centimeters at 480 pixel size.

* HISTORY *

The last 10 inputs the visitor encoded are kept in localStorage under the key qr.generator.history.v1, with the mode and the input value. A small panel below the download buttons shows the history as a vertical list of small rows, each row showing the mode in 11px Inter grey, a 32 character preview of the input, and a small text button reading use this. Tapping the button restores the input to that history entry. A small text button at the bottom of the list reads forget every entry, with a confirm.

The page does not record the contact or wifi values in plaintext in the history (those modes are excluded from the saved list, since they are sensitive), only text and url modes are remembered.

* EDGES *

An input that exceeds the largest qr capacity at the chosen error correction level (around 2950 bytes for level L at version 40) shows a small italic 11px line in signal red reading the input is too long for any qr code at this level, with a suggestion to lower the level or shorten the input.

An input of zero length shows the canvas region as a faint dashed grey rectangle with a small italic 14px line in grey reading type something to see a qr code.

A wifi password with non ascii characters is allowed, the encoder uses the byte mode and most modern phone cameras handle the result correctly.

A custom foreground color whose contrast against white is below 3 to 1 shows the small italic line above the canvas, but the page does not block the rendering, the visitor decides.

* BUILD *

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding white, ink, signal red, grey. Vite as the build tool. State is plain useState and one useReducer for the input mode and the four mode specific input shapes. No router, no global store, no context provider, no qr library, no canvas library, no clipboard library, no icon pack. The encoder is hand written. fetch is not used. The page never opens any network connection.

Files. index.html with the Inter and JetBrains Mono links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the mode and the input shape and the options. src/components/ModeChips.tsx for the top row. src/components/InputForm.tsx for the per mode form. src/components/Canvas.tsx for the inline svg qr. src/components/Options.tsx for the level and color and size panel. src/components/DownloadRow.tsx for the three download buttons. src/components/Status.tsx for the three small lines. src/components/History.tsx for the saved list. src/lib/qr.ts for the qr encoder (around 300 lines, the algorithm in clear small functions). src/lib/wifi.ts for the wifi format string. src/lib/vcard.ts for the vcard 3.0 format. src/lib/raster.ts for the offscreen canvas png export. src/lib/clip.ts for the clipboard write. src/lib/storage.ts for the localStorage. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page in any modern browser. The white surface paints, the four chips sit at the top with text active, the empty canvas placeholder waits in the center. They tap url, paste a link, the qr appears almost immediately in ink on white, the status lines show url mode, 38 bytes, version 3 level M. They drag the size slider up, the qr scales. They press download as png, a file lands in the downloads folder. They tap wifi mode, fill the four inputs, the qr changes, anyone with a phone camera can join the network by scanning.

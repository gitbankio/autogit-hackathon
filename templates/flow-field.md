---
title: Flow Field
app_type: flow-field
wallet: 0x81b5c4362B5f70D55359B8bE4c758539BfE2a9b6
---

A page that paints a generative flow field on a full screen WebGL canvas, lets the visitor steer the noise with a few sliders, and saves a fifteen second video of the motion through MediaRecorder. The pixels do everything. No particle system on the cpu, no array of points, the whole motion lives inside a single fragment shader that samples noise, advects color, and feeds itself back through a framebuffer. The result is a moving poster the visitor can stare at for as long as they want.

# § ONE.

A studio white page background, three accents only. Deep navy for body text. Neon coral for the active slider thumb and the small recording dot. Lemon for the play and pause button when paused. Sora at 18px for body, Sora at 14px for the small slider labels, JetBrains Mono at 12px for numeric values, Archivo Black at 32px for the single header word reading flow at the very top left. Mono only for numbers, sans only for prose, black display only for the header. Three distinct typefaces, one role each, no overlap. The canvas fills the right two thirds of the viewport on desktop and stacks above the controls on phones. The controls strip is the remaining third on desktop, two hundred and forty pixels wide, padded twenty four pixels.

# § TWO.

The canvas is a single HTMLCanvasElement with a webgl2 context. On mount the App creates the gl context with antialias false (the fragment shader does its own filtering), depth false, and premultiplied alpha true. The viewport is sized to the device pixel ratio for crisp output on retina screens. Two framebuffers are created with a single rgba16f color texture each, the two buffers ping pong on every frame. The vertex shader is a tiny pass through that draws a fullscreen quad with two triangles. The fragment shader does all the work.

# § THREE.

The fragment shader reads the previous frame's color at the current fragment position, then computes a flow direction by sampling a curl noise function at that position with a small octave count, then advects the read sample backward along the negative of that direction by a small step, then mixes it with a fresh color seeded from a slow drifting palette function. The result is written to the second framebuffer. The framebuffers swap, the next frame reads the result. The flow direction is curl free, which keeps the colors from blowing out into uniform sheets. The palette function rotates through four three stop gradients over a sixty second cycle, the active palette is selectable through a small dropdown in the controls.

A small block of glsl, written into src/lib/shaders.ts, looks roughly like this. The text is in source for reference, the build does not import this block at runtime.

```
in vec2 uv;
uniform sampler2D prev;
uniform float time;
uniform float strength;
uniform float scale;
uniform int   palette;
out vec4 fragColor;

void main () {
  vec2 p = uv * scale;
  vec2 flow = curl(p + time * 0.05);
  vec2 sample = uv - flow * strength * 0.012;
  vec4 prevColor = texture(prev, sample);
  vec3 fresh = paletteColor(palette, time * 0.03 + uv.x * 0.2);
  vec3 mixed = mix(prevColor.rgb, fresh, 0.04);
  fragColor = vec4(mixed, 1.0);
}
```

The full shader file in the build holds the curl noise function (a stack of two simplex calls offset by a small epsilon), the palette function with all four gradients, and a small saturation lift at the end to keep the output from going muddy.

# § FOUR.

The controls strip on the right of the canvas holds five sliders and three buttons. The sliders are scale (from 1 to 12, default 4), strength (from 0 to 6, default 2.4), speed (from 0 to 4, default 1.2), grain (from 0 to 1, default 0.15), and seed (from 0 to 999, default a random integer at page load). Each slider is a 24px tall row with the label on the left in Sora 14px deep navy, the slider track in deep navy at twenty percent opacity, the thumb in neon coral 14px round, and the numeric value on the right in JetBrains Mono 12px deep navy. Dragging the slider updates the matching uniform in real time, no debouncing, the shader uses the new value the next frame. The seed slider triggers a regeneration of the small lookup texture that the noise function samples.

The first button below the sliders, Sora 14px deep navy on a small studio white card with a 1px deep navy hairline at thirty percent opacity, reads pause the motion. Pressing it freezes the rAF loop, the button text changes to play the motion in lemon. Pressing it again resumes. The second button reads save a snapshot as png. Pressing it calls toBlob on the canvas, downloads the result with a filename including the current seed. The third button reads record fifteen seconds.

# § FIVE.

The record button creates a MediaRecorder from a captureStream call on the canvas, with a target bit rate of six megabits per second and a mime type of video/webm with vp9 if available, falling back to video/webm with vp8 otherwise. A small neon coral dot blinks at 500ms cycle in the top right of the canvas during recording, with a Sora 12px deep navy line below it counting down from fifteen to zero. When the countdown ends the recorder stops, the blob is wrapped in an anchor tag, and a download triggers with a filename of flow field with the current seed and the recording timestamp. While recording the controls remain interactive, the visitor can drag the sliders to choreograph the recording. The recording captures the canvas as the visitor sees it, no extra encoding pass.

# § SIX.

The visitor's current control values are mirrored into the url hash on every change, encoded as a small base64url string. Loading the page with that hash decodes and restores the same values. This is the only sharing mechanism. localStorage saves the last used values under the key flow.field.last.v1 as a fallback when no hash is present. The recording feature does not persist anywhere on the device beyond the downloaded blob. The page makes no network calls.

# § SEVEN.

If webgl2 is unavailable on the visitor's browser, the App attempts to create a webgl1 context with a slightly simpler shader path (no integer uniforms, no half float textures, lower resolution). The visual output is similar but coarser. If neither context is available, the canvas shows a single Sora 14px line reading this browser does not support webgl, centered, deep navy. Everything else on the page still renders.

If MediaRecorder is unavailable, the record button is dimmed and a small Sora 11px line below it reads recording is not available in this browser. The snapshot button still works. The visual still moves.

A slider dragged below its minimum or above its maximum clamps in place. A seed change while a recording is in progress is allowed, the visitor can ride the seed during the take. A pause during a recording continues to record a still frame, the timer still counts down.

# § EIGHT.

The shape of the uniform set the App sends to the shader on every frame is small. Written into src/lib/uniforms.ts.

```
{
  time:     number,    // seconds since page load
  scale:    number,    // 1 to 12
  strength: number,    // 0 to 6
  speed:    number,    // 0 to 4
  grain:    number,    // 0 to 1
  seed:     number,    // 0 to 999
  palette:  number     // 0, 1, 2, or 3
}
```

The shader holds all four palettes as compile time arrays of three vec3 stops each. Switching palettes is a uniform int update, no recompile, no re link.

# § NINE.

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout only, custom palette in tailwind.config.ts adding studio, navy, neon coral, lemon. Vite as the build tool. State is plain useState and one useReducer for the slider values and the recording state machine. No router, no global store, no context provider, no glsl loader, no gl wrapper library, no shader composition library, no icon pack. WebGL2 is used directly through the standard browser api. The fragment and vertex shader sources are plain template literal strings in src/lib/shaders.ts.

Files. index.html with the Sora, Archivo Black, and JetBrains Mono links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the gl context, the framebuffers, the slider state, and the rAF id. src/components/Canvas.tsx wrapping the canvas element and the rAF loop. src/components/Header.tsx for the small flow header. src/components/Controls.tsx for the five sliders and the three buttons. src/components/RecBadge.tsx for the small recording dot and countdown. src/lib/gl.ts for the context, the framebuffer pair, the program compile, and the uniform helpers. src/lib/shaders.ts for the vertex and fragment shader strings. src/lib/uniforms.ts for the typed uniform shape. src/lib/palettes.ts for the four three stop gradients. src/lib/hash.ts for the url hash encode and decode. src/lib/storage.ts for the localStorage try catch. src/lib/recorder.ts for the MediaRecorder wrapper. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a laptop. The header word flow sits in the top left, the canvas fills the right side, deep navy and coral colors begin to swirl slowly in horizontal bands. They slide scale to eight, the bands break into smaller eddies. They slide speed to three, the motion quickens. They press record fifteen seconds, the coral dot blinks, they tweak strength and grain across the fifteen seconds, and a small webm file lands in their downloads folder. They reload the page with the resulting url, the same eddies pick up where they left off.

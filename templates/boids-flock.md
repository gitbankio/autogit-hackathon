---
title: Boids Flock
app_type: boids-flock
wallet: 0x946DEaf5072aE18Ae366E729c89a9abF0171308B
---

Ten thousand small triangles flying across the screen, every one obeying three rules. Stay with the flock, match the flock's heading, do not crowd a neighbor. The page runs the simulation on the gpu through a WebGPU compute shader, and falls back to a WebGL2 transform feedback path when WebGPU is unavailable. The shape on screen is a single triangle per boid, the color is a soft electric blue. The flock is the work.

[surface]

An inkwell background, the kind of near black that lets a small accent stay loud. Electric blue for body type and for the body of every boid triangle. Hot pink reserved for the small status pill in the corner and for the leader boid (one boid in the flock is the leader, drawn in pink, used to give the eye a thing to track). Dim grey for any muted small label. Manrope at 32px 600 for the single top header reading boids flock, at 14px 500 for the inline buttons. Berkeley Mono at 12px for the framerate and the boid count. Two typefaces, two roles, no overlap. The page is one full viewport, no scroll, the canvas fills the available space, a thin top bar holds the controls.

[backend]

On boot, the App tries to acquire a WebGPU adapter and device through navigator.gpu.requestAdapter. If both succeed, the backend variable is set to gpu and the App runs the WGSL compute shader pipeline. If either call fails (the api is unsupported, no adapter is present, the device is lost), the backend falls back to gl2 and the App initialises a WebGL2 context with transform feedback enabled. The two backends share the same render path (drawing the boid triangles), they differ only in the way the position and velocity buffers are updated each frame.

A small Berkeley Mono 12px line in the top right of the canvas reads either gpu (compute) or gl2 (transform feedback), so the visitor sees which backend is running on their browser. The line is hot pink when the gpu path is active.

[gpu path]

Boid positions and velocities live in two GPUBuffer pairs (ping pong), each holding an array of vec2 floats of length 10000. The compute shader reads from the current pair and writes to the next pair, the pair swaps each frame. The shader is a single WGSL module with one entry point. A small block of the shader, written into src/lib/boids.wgsl.

```
@compute @workgroup_size(64)
fn update (@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= count) { return; }

  let p = positions_in[i];
  let v = velocities_in[i];

  var sep = vec2<f32>(0.0);
  var ali = vec2<f32>(0.0);
  var coh = vec2<f32>(0.0);
  var n_ali: u32 = 0u;
  var n_coh: u32 = 0u;

  for (var j: u32 = 0u; j < count; j = j + 1u) {
    if (j == i) { continue; }
    let dp = positions_in[j] - p;
    let d  = length(dp);
    if (d < separation_radius) { sep = sep - dp / max(d, 0.001); }
    if (d < alignment_radius)  { ali = ali + velocities_in[j]; n_ali = n_ali + 1u; }
    if (d < cohesion_radius)   { coh = coh + positions_in[j];  n_coh = n_coh + 1u; }
  }

  if (n_ali > 0u) { ali = (ali / f32(n_ali)) - v; }
  if (n_coh > 0u) { coh = (coh / f32(n_coh)) - p; }

  let dv = w_sep * sep + w_ali * ali + w_coh * coh;
  let v_new = clamp_speed(v + dv, max_speed);
  let p_new = wrap_torus(p + v_new, bounds);

  positions_out[i]  = p_new;
  velocities_out[i] = v_new;
}
```

The naive nested loop is fine at 10000 boids on a recent gpu. For a future bump, a spatial hash grid would be the next step, but the page does not need it at this scale.

The workgroup size is 64. The shader receives a single uniform buffer holding the three radii, the three weights, the max speed, the bounds, and the boid count. Updating the uniform buffer is a one line writeBuffer call before each frame's submit.

[gl2 path]

The fallback uses transform feedback to update positions and velocities on the gpu through a vertex shader. The shader does the same three rules but reads the neighbor positions from a sampler2D texture that the App rebuilds each frame from the previous output, since transform feedback cannot read from the buffer being written. The neighbor texture is 100 by 100 (10000 texels), each texel holding a vec2 position in the rg channels. The math is identical, the bookkeeping is more involved. A small Berkeley Mono 11px line below the backend pill reads the fallback runs at full count but uses neighbor texture, which is slower than the compute path.

[render]

After the position update, the App renders all 10000 boids in a single draw call. Each boid is a small triangle, 5 pixels long on a side, drawn with two triangles wide enough to be visible at typical zoom. The render uses instanced drawing, one instance per boid, with the boid index passed as a vertex attribute. The vertex shader reads the boid's position and velocity from a storage buffer (gpu path) or a vertex buffer (gl2 path), and emits the three vertices of the triangle rotated to point in the direction of travel.

The fragment shader outputs a solid electric blue for every boid except the leader (boid index 0), which outputs hot pink. There is no alpha, no blending, no lighting. The triangles look like small darting fish on a black page.

[controls]

A thin top bar holds five small text buttons in Manrope 14px 500.

The first reads pause. Tapping it freezes the simulation loop, the boids hold their positions. Tapping again resumes.

The second reads gather, which sets the cohesion weight to a large temporary value for 600ms then eases it back to the visitor's chosen value. The flock contracts visibly.

The third reads scatter, which sets the separation weight to a large temporary value for 600ms then eases back. The flock spreads visibly.

The fourth reads shuffle, which randomises every boid's position to a fresh random spot inside the bounds and every velocity to a fresh random direction. The flock starts over from scratch.

The fifth reads settings. Tapping it opens an HTMLDialogElement modal with five sliders, one for each of the three rule weights (separation, alignment, cohesion), one for the max speed, and one for the boid count (capped at 30000 on the gpu path and 10000 on the gl2 path). The dialog is shown with showModal so the page dims behind it. Closing the dialog through the corner close button or pressing escape returns to the canvas. The slider values persist in localStorage under the key boids.flock.params.v1.

[scale]

The canvas resolution tracks the visitor's device pixel ratio, so a retina screen gets crisp triangles. The boid coordinate space is independent of the canvas pixel space, with a virtual bounds of 1000 by 1000 units. The canvas is fitted to this bounds with a uniform scale that preserves the aspect, the leftover space on the wider axis is just background. Resizing the window resizes the canvas, the boids continue their wrap around inside the original 1000 by 1000 space, the simulation does not need to know the screen size.

[edges]

A WebGPU device that is lost during the session (a driver reset, a tab suspended for too long) fires the GPUDevice lost event. The App catches it, switches the backend to gl2, drops the gpu buffers, allocates the fallback resources, and continues without dropping a frame visible to the visitor. A small Berkeley Mono 11px line at the bottom of the canvas reads the gpu backend was lost, the fallback is now active for 3 seconds.

A boid count above 20000 on the gl2 path is disallowed (the slider clamps), with a small italic 11px line under the slider in the settings dialog reading the gl2 path cannot reach this count, switch to a browser with webgpu support.

A canvas resize during a settings dialog open is paused, the dialog dim covers the canvas, the simulation continues in the background but the visible canvas does not redraw until the dialog closes.

[boot]

On first paint, the page seeds 10000 boids at random positions inside the 1000 by 1000 bounds with random velocities of magnitude between 0.4 and 1.2 in random directions. The leader boid is placed at the center with zero velocity (it will pick up speed within a few frames as it falls in with neighbors). The framerate counter starts ticking. A small Berkeley Mono 12px line at the bottom right of the canvas shows the current frame rate as 60 fps, updated every 500ms.

[build]

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout only, custom palette in tailwind.config.ts adding inkwell, electric blue, hot pink, dim grey. Vite as the build tool. State is plain useState and one useReducer for the params and the boot state. No router, no global store, no context provider, no boids library, no graphics library, no shader composition library, no icon pack. WebGPU and WebGL2 are used directly. The HTMLDialogElement is used directly. Every glyph is inline svg in the component that uses it (only the small backend pill chevron needs a glyph).

Files. index.html with the Manrope and Berkeley Mono links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the backend, the params, and the run state. src/components/Canvas.tsx wrapping the canvas element and the backend lifecycle. src/components/TopBar.tsx for the five buttons. src/components/SettingsDialog.tsx for the HTMLDialogElement modal. src/lib/gpu.ts for the WebGPU backend (adapter, device, pipeline, buffers). src/lib/gl2.ts for the WebGL2 backend (program, transform feedback, neighbor texture). src/lib/boids.wgsl as the WGSL compute shader source. src/lib/render.ts for the shared render pass. src/lib/params.ts for the param shape and the localStorage. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page in chrome with WebGPU enabled. The inkwell page paints, the gpu pill lights up hot pink in the top right of the canvas, 10000 small electric blue triangles spawn across the canvas, the hot pink leader appears in the middle. Within a second the flock starts to form, small swirls and currents emerge. The frame rate counter reads 60 fps. They press gather, the flock contracts, then eases back. They press scatter, the flock explodes. They open settings, raise the cohesion slider, the flock starts to clump more tightly when they close the dialog. They open the page on an older browser without WebGPU, the gl2 pill appears in dim grey, the same simulation runs slightly slower with the fallback path.

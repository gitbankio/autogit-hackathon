---
title: Quantum Circuit Lab
app_type: quantum-circuit-lab
wallet: 0xeDCb19f70F36D54cA5B5b226d512C4c3734C2DfB
---

(I.) preface

A drag and drop circuit builder for small quantum systems. Place gates on wires. Watch the state vector evolve in real time. Spin a Bloch sphere for any qubit. Run a thousand shots and read the histogram. Hear the wavefunction collapse as a tuned chord. Export the program as OpenQASM 3.0. Share a circuit by sending a URL.

The app simulates up to eight qubits, which means a complex amplitude vector of 256 entries, 4096 floats once split into real and imaginary parts, all of which fit easily into a GPU storage buffer. Below eight qubits, simulation is interactive and instant. The hard cap is intentional. The point is teaching, not benchmarking.

(II.) the canvas

The screen is a stave, four to eight horizontal wires, each labeled q0 through qN at the left margin. A toolbox runs across the top, holding twelve gate tiles, H, X, Y, Z, S, T, S dagger, T dagger, RX, RY, RZ, plus a two qubit CNOT and controlled Z. The wires extend rightward through a grid of time slots. Drag a tile from the toolbox onto a slot to schedule the gate. Drag the same tile across two wires to attach a control. Drop it back on the toolbox to undo.

The right rail holds the live readouts. A Bloch sphere renderer for the focused qubit rotates as the circuit progresses. Below the sphere sits the histogram of computational basis probabilities, eight bars or sixteen, recomputed on every edit. Below that sits a small ledger of the current state vector, listed only for amplitudes whose magnitude exceeds 0.001 to keep the panel readable.

(III.) palette and type

Background a deep navy, hex `#0b1020`. The wires draw in a parchment cream, hex `#e6dfd0`. Gate tiles take a muted gold, hex `#c9a961`, with the active drag a brighter gold `#f3c969`. Bloch sphere uses the same gold for the state arrow and a desaturated cyan, hex `#5a9a9a`, for the meridian rings. Errors land in a faded brick, hex `#a44a3f`. No gradients. No drop shadows. A single hairline rule under the toolbox in the cream tone at 30 percent opacity.

Headings render in Cormorant Garamond, weight 500, with a generous line height. Body and labels use Iosevka at 13 pixels, with `font-feature-settings: "calt" 1` for matrix bracket ligatures. Numeric readouts force tabular figures so amplitudes line up cleanly.

(IV.) compute pipeline

```wgsl
struct Amplitude { re: f32, im: f32 };
@group(0) @binding(0) var<storage, read_write> state: array<Amplitude>;
@group(0) @binding(1) var<uniform> gate: GateOp;
struct GateOp {
  kind: u32, target: u32, control: u32, pad: u32,
  m00_re: f32, m00_im: f32, m01_re: f32, m01_im: f32,
  m10_re: f32, m10_im: f32, m11_re: f32, m11_im: f32,
};
@compute @workgroup_size(64)
fn apply_single(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  let n = arrayLength(&state);
  if (i >= n / 2u) { return; }
  let mask = 1u << gate.target;
  let lo = ((i / mask) * mask * 2u) + (i % mask);
  let hi = lo | mask;
  if (gate.control != 255u) {
    let cmask = 1u << gate.control;
    if ((lo & cmask) == 0u) { return; }
  }
  let a = state[lo];
  let b = state[hi];
  state[lo] = Amplitude(
    a.re * gate.m00_re - a.im * gate.m00_im + b.re * gate.m01_re - b.im * gate.m01_im,
    a.re * gate.m00_im + a.im * gate.m00_re + b.re * gate.m01_im + b.im * gate.m01_re);
  state[hi] = Amplitude(
    a.re * gate.m10_re - a.im * gate.m10_im + b.re * gate.m11_re - b.im * gate.m11_im,
    a.re * gate.m10_im + a.im * gate.m10_re + b.re * gate.m11_im + b.im * gate.m11_re);
}
```

The host dispatches one workgroup pass per gate in the schedule. Eight qubits is 256 amplitudes, well below the 65535 dispatch limit even on integrated GPUs.

(V.) wasm fallback

When `navigator.gpu` is undefined, the app compiles a tiny inline Wasm module from a WAT string at startup, no toolchain in the build, no static binary to ship. The module performs the same kernel on the CPU using `f32x4` SIMD. A runtime switch probes for WebGPU first, then Wasm SIMD, then a pure JavaScript loop. The histogram, sphere, and equations do not care which path produced the state vector.

(VI.) bloch sphere

The sphere renders in a worker, on an OffscreenCanvas, at 60 fps when in focus and at 12 fps when off screen. The geometry is a unit icosphere subdivided three times, drawn as wireframe through a software rasterizer in the worker, no WebGL needed for so few triangles. The state arrow comes from the reduced density matrix of the focused qubit:

```
rho = trace_other(|psi><psi|)
x = 2 Re(rho_01)
y = 2 Im(rho_01)
z = rho_00 minus rho_11
```

The arrow tip lands at coordinates `(x, y, z)` on the unit sphere when the qubit is pure, inside the sphere when entangled. A length below 0.99 turns the arrow cyan to flag entanglement visually. Pointer drags rotate the camera. Inertia damps over half a second.

(VII.) measurement and sonification

A measurement button samples the computational basis according to the Born rule, collapses the state to the sampled eigenstate, and plays a chord. Each basis state maps to a triad in equal temperament, the qubit count picks the scale degree, the bit pattern picks an inversion. A WebAudio `OscillatorNode` per voice plus a shared `BiquadFilterNode` keeps the timbre warm. The chord rings for 1.4 seconds with a soft exponential decay envelope. A small Lissajous figure under the histogram pulses on each measurement, drawn from the chord frequencies, decoupled from the state vector.

(VIII.) houdini paint worklet

A custom CSS Paint Worklet draws an entanglement aura behind any pair of wires that share nonseparable amplitude. The worklet receives two CSS custom properties, the entanglement entropy and the phase of the cross term, and paints a soft halo whose hue tracks the phase and whose width tracks the entropy. Browsers without Paint Worklet support fall back to a flat cream tone. The aura is decorative. The math underneath is not.

(IX.) openqasm export

The toolbar carries an export button that serializes the circuit as OpenQASM 3.0:

```
OPENQASM 3.0;
include "stdgates.inc";
qubit[3] q;
bit[3] c;
h q[0];
cx q[0], q[1];
ry(1.5708) q[2];
c = measure q;
```

The export runs entirely in the browser, no server roundtrip. A copy button drops the text on the clipboard via `navigator.clipboard.writeText`. A second button downloads it as `circuit.qasm`. A small import textarea on the same panel parses pasted QASM back into a circuit, restricted to the gate set the toolbox supports.

(X.) sharing

The current circuit serializes to a compact base64 form in the URL hash, roughly 12 bytes per gate, so a 32 gate circuit fits in a 384 byte URL. Loading the page with a hash present rebuilds the circuit on mount and reruns the simulation. A share button copies the current URL to clipboard. There is no server. There is no telemetry.

(XI.) persistence

IndexedDB holds a named library of circuits. The library panel slides in from the right when the user hits a small bookmark icon. Each saved circuit shows a thumbnail rendered from the gate grid, a name field the user can rename inline, and a delete button. The library survives reload. Export of the whole library to a single JSON file lives in the panel footer.

(XII.) accessibility

Every gate tile carries an `aria-label` naming the gate and its current target. The Bloch sphere has a live region that reads the arrow vector to three decimal places after each gate is placed. The histogram is duplicated as a sortable table for screen readers. Color is never the only signal. Entanglement aura, when it appears, is also announced through the live region.

(XIII.) implementation notes

Build with React 18 and TypeScript. Single default export named `App`. Tailwind for spacing and color tokens. No external UI kit. Inline SVG for the wires, gate tiles, and histogram. The simulation kernel lives in a single TypeScript file that exports an `applyCircuit` function whose signature is the same regardless of backend.

State lives in a `useReducer`. Actions, `placeGate`, `removeGate`, `setQubitCount`, `runShots`, `measure`, `loadFromHash`, `saveToLibrary`, `loadFromLibrary`. The reducer keeps the canonical schedule, derives the state vector, and caches the last 16 results so undo is free.

Edge cases the reducer handles, an empty schedule renders the all zero state and a flat histogram. A schedule that exceeds eight qubits clamps to eight and surfaces a quiet note. A QASM import that references a gate outside the toolbox surfaces a one line note and refuses the import.

(XIV.) acceptance

The first render shows three wires, an empty toolbox row of twelve tiles, an empty schedule grid, a Bloch sphere on the north pole, and a histogram with a single bar at the all zero state. Dragging an H tile onto q0 produces an immediate update, the sphere swings to the equator, the histogram splits into two bars at 50 percent each. A CNOT from q0 to q1 produces a Bell state, the histogram splits into two bars at the all zero and all one positions, and the entanglement aura paints between q0 and q1. A measurement collapses the state, plays the chord, and updates the ledger. Refreshing the page with a hash URL rebuilds the same circuit.

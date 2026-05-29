---
title: Voice Notes
app_type: voice-notes
wallet: 0x10Ff359F8BaEdF48dDA6C6c32fC50FE07C17C686
---

A page that listens. The visitor presses one button, speaks, and the words appear on the cream paper of the page as they are recognized. When they finish, the page reads the note back to them in a soft synthetic voice if they want to hear it, and saves the text alongside a list of older notes. The whole apparatus runs in the browser through the Web Speech API. Nothing leaves the device.

Listening

A cream colored page, the color of unbleached paper held in early light. Warm brown for body and italic body, which is most of the page. A soft rose accent reserved for the recording dot and the small jump to today button when the visitor has scrolled into an older note. A second accent, leaf, used only for the small dot that marks a note that has been read back at least once. Lora at 18px italic 400 for the live transcript and the saved notes, Lora at 22px upright for the few small headers, Inter Tight at 13px 500 for buttons and the small labels. No mono anywhere on this page. No icons except a small inline svg of a single feather quill in the top left of the page, fourteen pixels tall, one path. The layout is a single column at most 640px wide, centered, 28px gutter on phones. Spacing is generous, the page does not feel busy when there are no notes.

The microphone

A single round button at the top of the column, 72 pixels round, cream with a 2px warm brown hairline outline at fifteen percent opacity, with a soft inline svg of a microphone inside, sixteen pixels tall. The button is unlit by default. Tapping it asks the visitor for microphone permission on first use, then starts the speech recognition. The button outline turns soft rose, a small pulse animation runs at 1200ms cycle to indicate active listening, and a tiny soft rose dot appears at the top right of the button. Tapping the button while listening stops the recognition.

While listening, the page shows the interim transcript directly under the button in Lora 18px italic warm brown at sixty percent opacity, refreshing as the engine refines its guess. Once a chunk is finalized, it commits to the upper half of the column in full opacity warm brown, on a new line, and the interim row clears for the next chunk. The page never erases finalized text, even if the engine returns alternates after committing. The text on the page is always what the visitor said.

The page uses webkitSpeechRecognition where Web Speech is exposed (chromium browsers), with continuous true and interimResults true, with the default language picked from the visitor's navigator.language and selectable from a small dropdown in the controls below. If the api is not available, the page shows a single line in italic warm brown muted reading speech recognition is not available in this browser, with a small text button below it reading type the note instead, which opens a plain textarea where the visitor types directly. The save flow, the playback, and the list are identical for typed notes.

Reading back

Under the microphone, two small text buttons in Inter Tight 13px. The first reads save this note. The second reads read it back to me. Save commits the current note to the saved list (described below). Read back hands the current text to the SpeechSynthesis api with the visitor's current preferred voice (picked at boot from the available voices using a small in source preference order, English voices first, then any voice whose name matches a list of pleasant sounding defaults). While reading, a thin soft rose progress hairline grows from left to right under the note, segment by segment, using onboundary events from SpeechSynthesisUtterance to advance the line per word. Tapping the read button while a read is in progress stops the read and clears the hairline. The visitor's voice and reading rate (a single slider in the controls row, default 1.0) are saved across sessions.

The controls

Below the buttons, a single thin row, Inter Tight 12px, holding two small dropdowns and one slider. The first dropdown is the language for recognition, picked from a short list of common locales. The second dropdown is the voice for reading, picked from the available SpeechSynthesisVoices on the visitor's system. The slider is the reading rate, 0.6 to 1.6, default 1.0, with a tiny numeric value to its right. Below the row, a small italic 11px warm brown muted line reads these settings are kept only on this device.

The notes

Below the controls, a vertical list of saved notes, most recent on top, separated by a thin warm brown hairline at ten percent opacity. Each note has three lines.

The first line is the date in long form like Saturday the twenty ninth of May in Lora 14px upright muted warm brown. To the right of the date, a tiny leaf dot in 8px appears if the note has been read back at least once. Further to the right, a small text button in 11px Inter Tight reading three actions stacked behind a small chevron, which on tap reveals three text buttons in 11px Inter Tight: read this back, copy the text, forget this note. Copy writes the note to the clipboard with a small toast that says copied to clipboard for 1200ms. Forget removes the note after a small confirm prompt that reads remove this note from the page, with a small cancel.

The second line is the note body in Lora 17px italic warm brown, line height 1.6. Long notes wrap normally. There is no truncation in the list, the visitor sees the whole note.

The third line is the duration in 11px Inter Tight muted warm brown, the number of words and the time the note was recorded, in human form like ninety four words, three minutes.

Word counting uses Intl.Segmenter with the word granularity, which handles non English text gracefully, falling back to a simple whitespace split when the Segmenter is unavailable.

The shape of a saved note

The list is held in localStorage under the key voice.notes.list.v1, an array of objects in the shape below, written into src/lib/notes.ts.

```
{
  id:        '7d3c2a',
  createdAt: '2026-05-29T11:42:00.000Z',
  text:      'the small notes I keep about the day are not for anyone but me.',
  language:  'en-US',
  durationMs: 134210,
  wordCount: 14,
  readCount: 2
}
```

A tiny preferences object is also kept under voice.notes.prefs.v1.

```
{
  language: 'en-US',
  voiceURI: 'Google US English',
  rate:     1.0
}
```

If localStorage is unavailable, the notes live in memory and a small italic 11px line at the bottom of the page reads these notes are not being kept on this device.

Pause when the tab is hidden

When the visitor switches tabs or minimizes the window, the Visibility API fires a visibilitychange event. If a recognition session or a synthesis playback is in progress at that moment, the page pauses it, with a small italic 11px line below the microphone reading paused while away. When the visitor returns to the tab, the page does not auto resume, the visitor must tap the microphone or the read button again. This is intentional, voice features are best when the visitor opts in.

Edges

A recognition session that returns no chunks for ten seconds shows a small italic 11px line under the microphone reading I am not hearing anything. The page does not stop the session, the visitor can keep speaking. A push of save this note with an empty note does nothing, the button is dimmed when the current text is empty. A read back of an empty note does nothing. A click on the microphone while the page is on the visitor's offline mode (navigator.onLine false) does not change behavior, recognition continues to work in chromium because the api can run locally on recent versions.

The build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding cream, warm brown, warm brown muted, soft rose, leaf. Vite as the build tool. State is plain useState and one useReducer for the recognition state machine, the playback state machine, and the saved list. No router, no global store, no context provider, no speech library, no audio library, no icon pack. The Web Speech API is used directly. Intl.Segmenter is used directly with a guarded fallback. Every glyph including the small quill and the microphone is inline svg in the component that uses it.

Files. index.html with the Lora and Inter Tight links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the live transcript, the saved list, the prefs, and the two state machines. src/components/Header.tsx for the quill and the title line. src/components/Microphone.tsx for the big round button and the pulse. src/components/Controls.tsx for the language, voice, and rate row. src/components/NoteList.tsx for the saved list. src/components/Note.tsx for a single note. src/lib/recognition.ts wrapping the Web Speech recognition. src/lib/synthesis.ts wrapping the synthesis voices and the utterance. src/lib/segment.ts for the Intl.Segmenter word count. src/lib/storage.ts for the localStorage try catch. src/lib/dates.ts for the long form date and the duration string. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a desktop. The cream paper paints, the quill sits in the corner. They tap the microphone, allow access, speak a short note about what they want to remember from the morning. The words appear in italic under the button as they speak, finalized chunks settle into the column above. They tap the microphone to stop. They tap save this note, the note slides into the list with today's date. They tap read it back to me. A soft voice reads the note while a soft rose hairline grows under the words. They close the tab. They reopen in the afternoon. The note is in the list, the leaf dot beside its date marks that it has been read.

---
title: Lyrics Board
app_type: lyrics-board
wallet: 0xC80f78C5676fAa83bD9E1434e594d280CcFaBc45
---

A page for writing the words to a song. The visitor types lines into a vertical board. Above each line, a small slot waits for the chord changes. Below the line, the syllable count appears in faint type. To the right, a small panel offers rhymes for the last word the cursor sat on. The board does not try to write the song. It holds the work while the visitor does.

❖ surface

A velvet background, the deep purple of a stage curtain just before the lights come up. Antique gold for the type, blush for the chord slot, fog for the syllable count and the small section captions. EB Garamond italic at 18px for the body lines (the lyrics themselves read in italic, which lets them feel sung rather than typed), Cormorant Garamond at 28px upright for the song title at the top, JetBrains Mono at 11px for the syllable counts and the chord names. Three typefaces, three roles, no overlap. The page is one column at most 760px wide on desktop, the right panel sits on the right at 240px holding the rhyme suggestions, the layout stacks on phones.

❖ title

A single text input at the top of the page in 28px Cormorant Garamond antique gold, on a velvet background with no border, the placeholder reads name your song. To the right of the title, a small JetBrains Mono 11px fog line shows the current time signature and tempo, both editable through small text buttons. The defaults are 4 over 4 and 100 bpm.

Below the title, a small italic 13px EB Garamond fog line reads draft, verse 1, chorus, verse 2, bridge, or any section the visitor wishes, written in lowercase as a small caption. The visitor edits this freely, no required structure. Tapping the caption opens an inline edit.

❖ board

The board fills the left side of the page. Each row of the board is one line of the song. A row holds three regions stacked vertically.

The first region is the chord slot, a single line of JetBrains Mono 11px blush, padded 4px above the lyric line. The visitor types chord names separated by spaces, like Am G F E, the chord positions are inferred to be roughly equally spaced across the lyric line below, and a faint blush vertical hairline at twenty percent opacity drops from each chord to the corresponding position in the lyric line below. The slot accepts any text, the page does not validate chord names against any theory, the visitor writes what they will play.

The second region is the lyric line, a single contenteditable span in 18px EB Garamond italic antique gold, padded 6px above and 2px below. Pressing enter at the end of a line creates a new row below. Pressing backspace at the start of an empty line removes the row. Selecting text and pressing tab indents the row by 24px (used for a verse two indent, for example), shift tab outdents.

The third region is the syllable count, a single JetBrains Mono 11px fog line below the lyric line, right aligned, in the form 9 syllables. The count is computed from a small in source heuristic in src/lib/syllables.ts that walks the words in the line and counts vowel groups with a small list of exceptions (silent e, double vowels treated as one, suffixes like ed and es that often do not add a syllable). The heuristic is good enough for casual songwriting, the visitor can override the count for a single line by tapping it and typing a number.

❖ rhymes

The right panel holds the rhyme suggester. When the visitor's cursor is sitting at the end of a word, the page reads the last word, looks up its phoneme spelling in the in source dictionary, and finds every other word in the dictionary that shares the same trailing phonemes. The matches are grouped by quality.

The first group is the perfect rhymes, words whose stressed vowel and everything after match exactly. Listed first in 14px EB Garamond antique gold.

The second group is the near rhymes, words whose stressed vowel matches but whose final consonant differs by one phonological feature (place or voice). Listed next in 14px EB Garamond fog.

The third group is the slant rhymes, words whose stressed vowel differs but whose final consonants match. Listed last in 14px EB Garamond fog at sixty percent opacity.

Each match is clickable, tapping it inserts the word at the cursor in the lyric line. A small italic 11px line above the rhyme panel reads rhyming with the word the visitor's cursor is on, in fog. If the cursor is not at the end of a word, the panel shows a single line reading place your cursor at the end of a word to see rhymes.

The dictionary is around 3000 common english words, shipped in source as a small array of objects, in src/lib/dict.ts. The shape is small.

```
{ word: 'silver', phonemes: ['S','IH1','L','V','ER0'], syllables: 2 }
```

The lookup runs in source through a hash table built at boot. Lookups complete in well under a millisecond, the panel updates on every cursor move.

❖ shape

Each line of the song is held in memory as a small object, written into src/lib/lines.ts.

```
{
  id:        'a3b9',
  chords:    'Am G F E',
  lyric:     'the river slowly carves a road',
  syllables: 8,                          // user override, or null for auto
  indent:    0                           // 24px increments
}
```

The board is an array of these lines plus a small list of section labels with their starting line indices. The visitor's full song state is saved to localStorage under the key lyrics.board.v1 within 400ms of idle. On boot, the board is restored intact.

❖ export

A small text button at the bottom of the page in 13px Cormorant Garamond reads copy as plain text. Pressing it walks the board and produces a plain text version with the chord lines above each lyric line, separated by blank lines for each section. The result is copied through navigator.clipboard.writeText, suitable for pasting into a notes app or a band's shared doc. A second small text button reads copy as a single line, which writes only the lyric lines without chords, useful when sharing the words alone.

A third small text button reads download as text. Pressing it writes the same plain text version to a file through a temporary anchor click, with a filename of the song title plus the date.

❖ animation

When a new rhyme suggestion appears in the right panel, the panel fades in over 180ms through the Web Animations api. When a line is added or removed, the surrounding lines slide into their new positions through a FLIP animation over 200ms. The motion is gentle, never distracting, always shorter than the time the visitor would take to register it consciously.

❖ edges

A line whose syllable count is more than 14 shows a small italic 11px caption next to the count reading this line is long for most tunes, in fog. The page does not refuse long lines, songwriters break the rule all the time.

A chord slot whose text exceeds the lyric line width visually wraps to a second slot line above, with the same blush vertical hairlines dropping to their target positions.

A rhyme lookup for a word not in the dictionary shows a small italic 12px line reading this word is not in the dictionary, try a simpler form, in fog. Common stems are mapped to their root form (running maps to run), so the lookup is forgiving.

A board with zero lines shows a single italic 16px line in the center of the board reading start writing, with the cursor placed inside an empty first row.

❖ build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding velvet, antique gold, antique gold muted, blush, fog. Vite as the build tool. State is plain useState and one useReducer for the lines array, the active line, and the section labels. No router, no global store, no context provider, no rhyme library, no nlp library, no animation library beyond Web Animations, no icon pack. The dictionary, the syllable counter, and the rhyme matcher are all hand written.

Files. index.html with the EB Garamond, Cormorant Garamond, and JetBrains Mono links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the board, the active line, and the rhyme cache. src/components/TitleRow.tsx for the song title and the time signature. src/components/SectionLabel.tsx for the small caption. src/components/Line.tsx for one row with the chord slot, the lyric, and the count. src/components/RhymePanel.tsx for the right side suggester. src/components/Footer.tsx for the export buttons. src/lib/lines.ts for the line shape and the localStorage. src/lib/dict.ts for the phoneme dictionary. src/lib/syllables.ts for the count heuristic. src/lib/rhyme.ts for the perfect, near, and slant matcher. src/lib/flip.ts for the line motion. src/lib/copy.ts for the plain text serializer. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a laptop. The velvet surface paints, the title input waits at the top, the board sits empty with a soft start writing line. They name the song quiet morning. They type a first lyric line in italic antique gold, place the cursor at the end of the last word, the right panel fills with perfect, near, and slant rhymes. They click a rhyme, the word lands at the cursor. They tab to the chord slot above the line, type Am G, the blush hairlines drop down to the lyric line. The syllable count under the line reads 8 syllables. They press enter, start a new line. After a verse and a chorus, they press copy as plain text, paste into a notes app, the chords and lyrics are formatted cleanly.

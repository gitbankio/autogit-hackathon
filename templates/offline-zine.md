---
title: Offline Zine
app_type: offline-zine
wallet: 0x2C5b6C9C6bafaF3a4990769Af6eaf82E85D44841
---

A small browser zine that reads like a printed pamphlet. Six pieces of writing, one home page that lists them, one page per piece. The first time the visitor lands the page, the service worker registers, caches the whole zine into the Cache Storage, and from that moment forward the zine works fully offline, on a train, on a plane, in a basement with no signal. A small status strip at the bottom of every page tells the visitor whether they are online or offline, and whether the cache is up to date or stale.

~~ what the zine is

A newsprint colored page, the warm color of a folded broadsheet. Ink for body and titles. Red ribbon for the small piece numbers and the active link state. Soft teal for the cache status indicator at the bottom. Newsreader serif at 18px regular for body, 26px for piece titles, 14px italic for byline lines. Spectral SC at 13px for the small section labels and the page numbers (a small caps face that gives the zine a printed feel). Space Mono at 11px for the cache status panel only. No icons except a small inline svg of a folded pamphlet in the top left corner of the home page, twelve pixels tall, two paths. The layout is one column at most 620px wide, centered, 28px gutter on phones. Pieces feel like they were typeset by hand.

~~ what the home page shows

At the top, the title of the zine in Newsreader 32px 500 ink, reading the offline zine for one quiet afternoon, on a single line. Below it a thin red ribbon hairline, one pixel tall, full width of the column, two pixels of space below. A small Spectral SC line in 12px ink muted reads issue one, may 2026.

Below the masthead, a small vertical list of six entries. Each entry has the piece number in red ribbon 14px Spectral SC (one through six in arabic style with a small dot, like 01., 02.), the piece title in Newsreader 22px 500 ink, the byline in Newsreader 13px italic muted ink. The byline is the writer's name, fictional, kept short, paired with a city like by ana herrera in cordoba. Below the byline a single sentence of the lede in Newsreader 14px italic ink at sixty percent opacity, the kind of dek that tells the reader whether the piece is for them. Each entry takes around 96 pixels vertically with 28 pixels of space between entries.

The six pieces are static, written into src/lib/zine.ts as plain markdown strings with frontmatter. The page renders them through a tiny in source markdown subset (paragraphs, italics, bold, em dashes are not used here, blockquotes, h2 headings, simple links). No markdown library is used.

~~ what the piece page shows

Tapping an entry navigates to the piece page. The url is a hash route like #/piece/three, no client side router library is used, the App holds a tiny string that reads the hash and renders the matching piece. The piece page shows the piece title in Newsreader 28px 500 ink, the byline below it in italic, a thin red ribbon hairline, then the body in Newsreader 18px ink with the line height of 1.65 and a max line length of around 60 characters for comfortable reading. The page ends with a small Spectral SC line reading return to the table of contents that goes back to the home page on click, plus a small piece number on the right in red ribbon Spectral SC.

The pieces are short, between 250 and 700 words each, on quiet subjects suited to a paper zine. Examples of piece titles: a small place by the river, the slow afternoon at the laundromat, three things my grandmother said only once, what the cats do when no one is watching, the bus that never came, the morning of the long walk. The pieces are warm without being sentimental, observational, written in clean modern english with straight punctuation (no curly quotes, no em dashes), so the page never has to fight the typography.

~~ what the cache strip shows

At the very bottom of every page sits a thin strip across the full width of the column, 28 pixels tall, on a slightly darker newsprint band. Inside the strip, on the left, a small Space Mono 11px line shows the current connection status, either online or offline, with a small dot (teal when online, ink at thirty percent when offline). In the middle, a Space Mono 11px line shows the cache state, either cached and up to date, cached, checking for updates, or not cached yet. On the right, a small text button in Space Mono 11px reads refresh the cache, which posts a message to the service worker asking it to fetch the latest version of every cached asset and update the cache, then shows a small line cache refreshed for 1500ms before settling back. The cache strip is the only piece of chrome that uses Space Mono on the page, which keeps it visually separate from the zine itself.

~~ what the service worker does

On boot, the App registers a service worker at src/sw.ts (built by Vite to /sw.js). The service worker has two events. On install, it opens a single cache named offline.zine.v1 and adds every asset the zine depends on (the html, the css, the js, the woff2 files for Newsreader, Spectral SC, Space Mono, the favicon, and the small pamphlet svg). On fetch, it applies a stale while revalidate strategy: respond from the cache immediately if a match exists, then fetch the network in the background, and replace the cache entry with the fresh response. The message handler responds to a single refresh message from the page by forcing every asset to fetch fresh and overwrite the cache.

A small block of the service worker fetch handler, written into src/sw.ts, looks roughly like this.

```
self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const cache = await caches.open('offline.zine.v1');
    const cached = await cache.match(event.request);
    const network = fetch(event.request).then((response) => {
      cache.put(event.request, response.clone());
      return response;
    }).catch(() => null);
    return cached || network || new Response('', { status: 504 });
  })());
});
```

The page listens to the controllerchange event on navigator.serviceWorker to detect when an updated worker takes over, and refreshes the cache strip's cache state line to read cached and up to date.

~~ what the manifest does

A Web App Manifest at /public/manifest.webmanifest tells the browser the zine can be installed. The shape is small.

```
{
  "name": "the offline zine",
  "short_name": "offline zine",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ECE5D9",
  "theme_color": "#1B1B1F",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

A small text button on the home page footer in Spectral SC 12px reads install this zine on this device. The button is only visible after the browser fires a beforeinstallprompt event (chromium and a few others), the button click calls the saved prompt and waits for the visitor's choice. On other browsers, the button is omitted and a small Spectral SC 11px line reads add this page to your home screen to keep it offline.

~~ what the edges look like

On a first visit while the network is offline, the service worker is not yet installed and the page will not render anything beyond the html shell. A small Newsreader 14px italic line at the top reads this is the first time you have opened the zine and you appear to be offline, refresh once with a connection and the zine will be saved on this device. After the first successful online visit, the zine is browsable offline forever, until the cache is purged by the browser or the visitor presses refresh the cache while offline (which fails silently and shows a small line could not reach the source for 1200ms).

A piece url that does not match any of the six pieces shows a single Newsreader 18px italic line reading that piece is not in this issue, and a small return link to the home page.

The cache strip continues to function with no network. The connection status flips to offline immediately when navigator.onLine becomes false (or when the offline event fires), the cache state remains cached and the visitor can keep reading.

~~ what the build looks like

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding newsprint, ink, red ribbon, soft teal. Vite as the build tool with the standard service worker pattern (src/sw.ts is built as a separate entry and referenced by the App's register call). State is plain useState, the only reducer is for the cache strip's cache state machine. No router library, the App holds the current hash and listens to hashchange. No markdown library, the tiny renderer lives in src/lib/markdown.ts and supports a small subset (paragraphs, italics with single asterisks, bold with double asterisks, h2 headings, links inside square and round brackets). No icon pack, every glyph is inline svg.

Files. index.html with the Newsreader, Spectral SC, and Space Mono links in the head, plus the manifest link. public/manifest.webmanifest. src/main.tsx as the React entry, registering the service worker. src/sw.ts as the service worker entry. src/App.tsx exporting one default component holding the current hash and the cache state. src/components/Home.tsx for the table of contents. src/components/Piece.tsx for one piece. src/components/CacheStrip.tsx for the bottom strip. src/lib/zine.ts holding the six pieces as plain strings. src/lib/markdown.ts for the small renderer. src/lib/cache.ts for the helpers that read the cache state and send the refresh message. src/lib/install.ts for the beforeinstallprompt save and trigger. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page online. The home page paints, the six pieces sit in their list, the cache strip at the bottom reads cached and up to date in teal after a brief checking pulse. They tap piece three, read it, return to the home. They put their laptop in their bag, take a train, open the laptop in a tunnel, the page is still there, the cache strip flips to offline in ink, the pieces are still readable. They install the zine through the small footer button. The standalone window opens. The zine reads the same. The visitor finishes the issue on the train.

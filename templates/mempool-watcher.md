---
title: Mempool Watcher
app_type: mempool-watcher
wallet: 0x559705116171B09fA11cf6487a017f9526D13b9f
---

A small page that watches the ethereum pending transaction pool and prints the most recent transactions as they arrive. Each row shows the from address, the to address, the value in eth, the gas price, and a decoded function name when the page can recognize the four byte selector. The visitor can filter by minimum value, by recipient, or by recognized function. The whole feed runs through plain json rpc against a public node, no key, no library.

01 › surface

A dark grey background, the muted slate of a debugging session at midnight. Pale off white for body type. Two accents only, cyan for any new transaction that just arrived (the row pulses cyan for 600 milliseconds on appear), magenta alert for any transaction whose value exceeds the visitor's chosen threshold or whose recipient matches the visitor's watch list. Inter Display at 18px 500 for body and at 22px 600 for the small section labels. Geist Mono at 13px for hex addresses, hashes, and gas values. Two typefaces, two roles, no overlap. The page is one column at most 880px wide, centered, 16px gutter on phones.

02 › top

The top of the page holds a single Inter Display 22px line in pale reading mempool watcher, with a small cyan dot pulsing once per second to indicate the feed is connected. To the right of the title, a small Geist Mono 12px line shows the live count of pending transactions in the pool, fetched from the txpool_status rpc method when supported (or estimated from the size of the pending block when not), in the form 4218 transactions waiting.

Below the title bar, a horizontal row of small filter chips in 12px Inter Display. minimum value, recipient match, function match, all. The active chip is filled cyan with dark grey text. Each chip opens a small inline panel with the matching filter input.

03 › feed

Below the filter row, the live feed. A vertical list of the most recent 100 pending transactions, newest at the top, oldest dropped silently as new ones come in. Each row holds three lines.

The first line is the function name in 14px Inter Display 500 pale on the left, and the value in eth in 14px Geist Mono pale on the right. The function name comes from a lookup of the first four bytes of the transaction's calldata against an in source database of well known function selectors (transfer, approve, swap, deposit, withdraw, multicall, mint, burn, plus around forty other common ones). If the selector is not recognized, the line shows the raw selector in Geist Mono with an italic note unknown function in pale muted.

The second line is the from address in 12px Geist Mono pale muted on the left, and the to address in 12px Geist Mono pale on the right, joined by a small chevron between them. Each address is truncated to the first six and last four hex chars (0x1234...abcd). Tapping an address copies the full hex to the clipboard with a small toast.

The third line is the gas price in gwei in 11px Geist Mono pale muted on the left, the gas limit in 11px Geist Mono pale muted in the middle, and the transaction hash truncated to first 8 chars in 11px Geist Mono pale muted on the right. Tapping the hash opens the row's detail drawer.

A new row pulses cyan on appear, the pulse is a 600 millisecond ease in out scale from 0.97 to 1.0 with a soft cyan box shadow that fades. A row matching the visitor's threshold or watch list appears with a magenta border on the left side, 2px wide, and stays magenta until the row drops off the bottom.

04 › detail

Tapping a row opens a small detail drawer below the row, sliding down with a 200ms ease. The drawer shows the full transaction details.

The full transaction hash, copyable.

The full from and to addresses, copyable.

The value in eth and in usd (computed from the same eth to usd rate the page fetches at boot).

The gas price in gwei and the gas limit, with the maximum possible cost in eth.

The nonce.

The decoded function call when the four byte selector is recognized. The page parses the calldata using the small abi for the well known selectors, prints each parameter on its own line with the parameter name and the decoded value (an address shows as truncated hex with a tappable expand, a uint256 shows the decimal value with a comma every three digits, a bytes value shows as a short hex, a string shows the utf8 text). A small italic 11px line at the bottom of the decoded list reads decoded against the in source four byte database.

The raw calldata in 11px Geist Mono pale muted at the bottom of the drawer, wrapped to fit, with a small text button to copy it.

A small text button at the very bottom of the drawer reads close, which slides the drawer back up.

05 › filters

Tapping a filter chip opens a small panel below the row.

minimum value, a single number input in 14px Geist Mono with the label gwei or eth toggle. Default 0, visitor can type any positive number. Transactions below the threshold are dimmed to thirty percent opacity in the feed but still rendered. Pressing the magenta alert toggle turns the threshold into a hard filter (rows below are hidden completely).

recipient match, a textarea where the visitor pastes one address per line. Up to 20 addresses are accepted. Transactions to or from any matching address are flagged with the magenta border. The list persists in localStorage.

function match, a multi select of the well known functions. Selecting a few (transfer, approve, swap) narrows the feed to only those calls. Selecting all returns to the full feed.

all, a single text button reading reset every filter, which clears all four states.

06 › the rpc

The page reads from a public ethereum json rpc with two methods.

```
{ method: 'eth_getBlockByNumber',     params: ['pending', true] }
{ method: 'txpool_content',           params: [] }
```

The first works on every public rpc and returns the next pending block, including its transactions. The second is the geth namespaced txpool method which gives the full pool, and is supported on a smaller set of public endpoints. The page tries txpool_content first, falls back to eth_getBlockByNumber pending if the method is rejected.

The polling interval is 2 seconds. Each poll diffs the new transactions against the previous set, the new transactions are the ones added to the feed at the top with the cyan pulse.

07 › four byte database

The page ships an in source map of around forty common four byte selectors to function signatures. The shape is small.

```
'0xa9059cbb': 'transfer(address,uint256)',
'0x095ea7b3': 'approve(address,uint256)',
'0x23b872dd': 'transferFrom(address,address,uint256)',
'0x18160ddd': 'totalSupply()',
'0x70a08231': 'balanceOf(address)',
'0xdd62ed3e': 'allowance(address,address)',
'0x40c10f19': 'mint(address,uint256)',
'0x42966c68': 'burn(uint256)',
'0xac9650d8': 'multicall(bytes[])',
'0xb6f9de95': 'swapExactETHForTokens(uint256,address[],address,uint256)',
```

A small text button below the feed in 12px Inter Display reads add a custom selector. Tapping it opens an input where the visitor pastes a four byte hex and a function signature. The page adds the entry to the in memory database, persisted in localStorage. The visitor's custom selectors take precedence over the built ins on collision.

08 › value usd

The page fetches the eth to usd rate from a public price endpoint at boot and refreshes every 60 seconds. The detail drawer shows the value in both eth and usd. The feed shows only eth to keep the rows narrow. If the rate fails to fetch, the usd line in the drawer reads usd unavailable in italic 11px pale muted.

09 › edges

A pending block with no transactions shows a single italic 14px line reading the pool is empty in pale muted, with the cyan dot still pulsing.

A rate limited rpc switches the polling to 10 seconds and shows a small italic 11px line at the bottom reading the rpc is rate limited, slowing the feed.

A txpool_content rejection shows a small italic 11px line at the bottom reading using the pending block fallback, the feed may show fewer transactions than the actual pool.

A transaction whose calldata does not match the abi for its declared selector (a non standard implementation, an old contract, a typo selector collision) shows the decoded list as the raw selector and the calldata, no parameters parsed. The drawer is still useful as a hex viewer.

10 › build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding dark grey, pale, pale muted, cyan, magenta alert. Vite as the build tool. State is plain useState and one useReducer for the feed buffer, the filters, and the detail drawer. No router, no global store, no context provider, no ethers, no viem, no rlp library, no abi library, no chain library, no icon pack. fetch, BigInt, DataView, and Intl.NumberFormat are used directly.

Files. index.html with the Inter Display and Geist Mono links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the feed, the filters, the detail drawer state, and the rpc state. src/components/Top.tsx for the title and pool count. src/components/Filters.tsx for the chip row and the inline panels. src/components/Feed.tsx for the scrollable list. src/components/Row.tsx for one transaction. src/components/Detail.tsx for the drawer. src/components/Custom.tsx for the add a custom selector input. src/lib/rpc.ts for the json rpc fetch wrapper. src/lib/abi.ts for the four byte database and the calldata decoder. src/lib/price.ts for the eth to usd rate. src/lib/storage.ts for the localStorage. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page in chrome on a laptop. The dark grey surface paints, the title sits at the top with the cyan dot, the pool count fills in within a second. The feed starts to scroll new rows from the top, each one pulses cyan briefly. They tap minimum value, set 1 eth, the threshold filter dims small transactions and highlights the few large ones. They paste an address into the recipient match panel, transactions involving that address light up with the magenta border. They tap a row, the detail drawer slides down showing the decoded transfer with the recipient and amount printed in plain text. They reload the page, the filters and the custom selectors are remembered.

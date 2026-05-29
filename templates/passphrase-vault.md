---
title: Passphrase Vault
app_type: passphrase-vault
wallet: 0x189E81dDcd91Cf5dCE62baB6c885E4792D346d31
---

A small page that holds a few short secrets behind a passphrase. The visitor sets a passphrase the first time. After that, every secret they paste in is encrypted in the browser with a key derived from the passphrase, the ciphertext sits in localStorage, the page cannot read the secrets without the passphrase being typed first. The page locks itself after sixty seconds of idle. The page has no server, no recovery, no email, no cloud, no signup. Forget the passphrase and the secrets are gone.

<1>

A vault grey page, the color of a steel locker. Parchment for the secret text. Brass for the section labels and the unlock button. Signal red for the lock button and for the small warning line when a decryption fails. Inter Tight at 18px 400 for body, at 22px 500 for the few short headers, at 13px 500 for the buttons and labels. Recursive Mono Casual at 12px for the ciphertext sample, the cryptographic parameters, and the timestamps. No icons except a small inline svg of a padlock at the top left corner of the page, fourteen pixels tall, two paths. The lock svg is closed when the vault is locked and open when it is unlocked, a single path animates between the two states over 200ms. The page is one column at most 640px wide, centered, 24px gutter on phones.

<2>

The page boots into one of three states. First boot, when no encrypted blob exists yet, the page shows the set up a passphrase view. Locked, when a blob exists and no passphrase has been entered this session, the page shows the unlock view. Unlocked, the page shows the secrets list.

The set up view has a single input in 18px Recursive Mono Casual parchment, an unbordered field on a slightly darker vault grey card, with a placeholder reading choose a passphrase, at least twelve characters. Below the input a small Inter Tight 12px line in parchment muted reads this passphrase is the only key. there is no recovery. write it down somewhere if you cannot remember long strings. Below that, a small estimate of strength as a single brass line, calculated by a tiny in source entropy estimator that combines length, character class diversity, and dictionary common phrase detection. The estimate is one of weak, fair, good, strong, in 13px Inter Tight 500. Submission is allowed at any strength but the page shows a small italic 11px confirm prompt asking are you sure when the estimate is weak. A single text button reads create the vault in 14px Inter Tight 500 brass. On submit, the page generates a random salt of sixteen bytes via crypto.getRandomValues, derives a non extractable key through PBKDF2 with the parameters described below, encrypts an empty payload as the first ciphertext blob, and writes the salt and the blob to localStorage.

The unlock view has the same single input, the placeholder reads enter the passphrase to unlock. A single text button reads unlock. On submit, the page derives the key from the entered passphrase and the stored salt, attempts to decrypt the most recent blob, and either unlocks or shows a small 12px italic signal red line reading the passphrase did not match. After three failed attempts in a row, the page locks the unlock button for thirty seconds with a small countdown shown beside it in 12px Recursive Mono Casual, then the visitor can try again. The attempt counter resets on a successful unlock.

<3>

The unlocked view has the secrets list. The list lives directly under the lock svg and a brass section label reading kept secrets in 22px Inter Tight 500. Each secret is a single card on a slightly darker vault grey background, 1px brass hairline at twenty percent opacity, padding 18px. Inside the card, three regions. The first region is the secret's title in 16px Inter Tight 500 parchment, plus a small text button on the right reading copy the value in 12px brass which copies the decrypted value to the clipboard with a small toast saying copied to clipboard for the next 1200 milliseconds, then clears the clipboard back to whatever was there before (via writeText with an empty string) after twenty seconds, a hardcoded auto wipe so the value does not linger. A small chevron next to the copy button reveals the actual value inside the card on press, in 14px Recursive Mono Casual parchment, with a press to reveal label that the visitor must touch a second time to see, ensuring a shoulder surfer who briefly opens the tab does not see the values by default. The second region is the small note for the secret in 13px Inter Tight italic parchment muted, if any. The third region is the metadata strip, a single Recursive Mono Casual 11px line showing the date the secret was added.

To the right of each card a small text button reads delete this in 12px Inter Tight signal red, with a confirm prompt. Delete writes a new ciphertext blob without the deleted secret, the old blob is overwritten in storage.

At the bottom of the list a small text button reads add a new secret in 14px Inter Tight 500 brass. Pressing it opens a small form with two inputs (title and value) and an optional note input. The value field is a textarea so multi line secrets work. Saving the form encrypts the entire updated list into a new ciphertext blob, the blob replaces the previous one in storage, the form closes, the new card slides into the list.

<4>

The cryptographic parameters are picked once and never changed. The salt is sixteen bytes from crypto.getRandomValues. The iv is twelve bytes from crypto.getRandomValues, regenerated for every new blob. The key derivation uses PBKDF2 with SHA 256, two hundred thousand iterations, a derived key length of two hundred fifty six bits. The cipher is AES GCM. The algorithm strings passed to subtle.deriveKey and subtle.encrypt are the standard web crypto identifiers in their canonical form, namely the literal SHA dash 256 and the literal AES dash GCM, exactly as the platform requires them. The ciphertext is the result of subtle.encrypt with the iv passed through the algorithm options. The on disk envelope is a small json object holding the version, the salt as base64url, the iv as base64url, and the ciphertext as base64url. Every value is plain text json so a visitor poking at localStorage with developer tools sees the structure but cannot read the secrets.

The shape of the envelope on disk is small and explicit, written into src/lib/envelope.ts.

```
{
  version:    1,
  salt:       'Vh3w...',     // 16 bytes, base64url
  iv:         'pT9r...',     // 12 bytes, base64url
  ciphertext: 'sFq...'        // base64url of the encrypted secrets array
}
```

The PBKDF2 parameter set the App passes to subtle.deriveKey looks like this.

```
{
  name:       'PBKDF2',
  salt:       <Uint8Array of 16 bytes>,
  iterations: 200000,
  hash:       'SHA-256'
}
```

The derived key is created with extractable false, key usages of encrypt and decrypt only, so even the page cannot read the raw key bytes once derived. The derived key is held in a single in memory variable for the duration of the session and is overwritten with null when the vault locks.

<5>

The vault locks automatically after sixty seconds of no interaction with the page. The interaction counter resets on any pointerdown, keydown, or focusin event on the page. When the lock fires, the derived key is set to null, the secrets array is set to an empty array, the unlock svg snaps closed, and the page swaps to the unlock view. The blob in storage is not touched. The visitor types the passphrase again to come back.

A second small text button at the top right of the page in 12px Inter Tight signal red reads lock the vault, which fires the lock immediately and resets the input. The visitor presses this any time they walk away. There is no idle warning, the lock simply happens.

If the page is reopened from a fresh tab while a session was active in another tab, the second tab also boots locked, derived keys do not cross tabs. A single in source check uses the BroadcastChannel api (named passphrase.vault.lock) to broadcast a lock event when one tab locks, so other open tabs lock at the same time, preventing a clever visitor from leaving a window unlocked behind them.

<6>

A small text button at the very bottom of the page reads change the passphrase in 12px Inter Tight 500 brass. The flow asks for the current passphrase, then a new passphrase twice, derives a new key with a fresh salt, re encrypts the secrets under the new key, and writes the new blob plus the new salt to storage. If the current passphrase fails, the change is aborted with the same small signal red line as the unlock view.

A second small text button reads forget everything in this vault in 12px signal red, with a two stage confirm (the first reads remove the vault from this device, the second reads this cannot be undone). On confirm, the localStorage key is deleted, the page returns to the set up view.

If localStorage is unavailable (private browsing on some browsers), the page keeps the salt and the blob in memory, the secrets disappear when the tab closes, and a small italic 11px line at the bottom of the page reads this vault is not being kept on this device. The visitor can still set a passphrase and use the page for the session.

<7>

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding vault grey, brass, parchment, parchment muted, signal red. Vite as the build tool. State is plain useState and one useReducer for the boot state machine (first boot, locked, unlocking, unlocked, changing passphrase, forgetting). No router, no global store, no context provider, no crypto library, no password strength library beyond a tiny in source estimator, no icon pack. Web Crypto is used directly through crypto.subtle. TextEncoder and TextDecoder are used directly. The base64url encoding is a small in source helper, no dependency.

Files. index.html with the Inter Tight and Recursive Mono Casual links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the boot state, the derived key, the secrets array, and the lock timeout. src/components/SetupView.tsx for the first boot. src/components/UnlockView.tsx for the locked view. src/components/SecretsList.tsx for the unlocked view. src/components/SecretCard.tsx for one secret. src/components/AddSecretForm.tsx. src/components/ChangePassphrase.tsx. src/components/ForgetVault.tsx. src/components/Header.tsx for the small padlock svg. src/lib/crypto.ts for the deriveKey, encrypt, decrypt wrappers around crypto.subtle. src/lib/envelope.ts for the on disk shape. src/lib/base64url.ts for the encoder and decoder. src/lib/strength.ts for the entropy estimator. src/lib/storage.ts for the localStorage try catch. src/lib/idle.ts for the idle lock timer and the BroadcastChannel sync. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a laptop. The vault grey page paints, the closed padlock sits at the top left. They type a passphrase of fourteen characters into the input, the strength estimate reads good in brass, they press create the vault. The page swaps to the unlocked view with an empty list and a brass add a new secret button. They tap it, type a title and a value, press save. The card appears. They tap copy the value, the clipboard receives the value, a small toast confirms. They walk away. After sixty seconds the page locks, the secrets disappear, the closed padlock returns. They come back, type the passphrase, the list returns intact.

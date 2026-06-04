# AutoGit Hackathon — Participant Guide

## What you get

- **5 gitUSDC** deposited automatically into your Gitbank vault the moment your PR merges
- A chance at **300 / 200 / 100 gitUSDC** bonus for the top 3 templates (team picks)
- 100 slots total, first come first served

---

## Step 1 — Check available slots and app types

Go to **https://gitbankio.github.io/autogit-hackathon/** and check:

- Is your app type already taken? Each `app_type` must be unique across all entries.
- Are there still open slots? Maximum 100 participants.

---

## Step 2 — Get a Base wallet

You need a wallet address on **Base** (an Ethereum L2 by Coinbase). This is where your gitUSDC reward will be sent.

If you do not have one:

1. Install **MetaMask** (metamask.io) or **Coinbase Wallet**
2. Add the **Base network** — MetaMask will add it automatically when you visit any Base app, or add it manually:

   | Field | Value |
   |---|---|
   | Network name | `Base` |
   | RPC URL | `https://mainnet.base.org` |
   | Chain ID | `8453` |
   | Symbol | `ETH` |

3. Copy your wallet address. It looks like `0x1a2b...ef90` (42 characters, starts with `0x`).

You do **not** need any ETH in the wallet. The Gitbank relayer pays all gas fees for you.

---

## Step 3 — Fork the repo

1. Go to **https://github.com/gitbankio/autogit-hackathon**
2. Click the **Fork** button (top right corner)
3. Keep all default settings and click **Create fork**

You now have your own copy at `https://github.com/YOUR_USERNAME/autogit-hackathon`

---

## Step 4 — Create your template file

In your fork, open the `templates/` folder and create a new file.

**File name:** use your `app_type` as the filename.

Example: `templates/saas-dashboard.md`

### Required frontmatter

Every template file must start with this block:

```
---
title: SaaS Dashboard
app_type: saas-dashboard
wallet: 0xYourBaseWalletAddressHere
---

Your prompt content goes here...
```

| Field | Description | Rules |
|---|---|---|
| `title` | Human-readable name | Any text |
| `app_type` | Unique identifier for your template | Kebab-case, not already taken |
| `wallet` | Your Base wallet address | 42 chars starting with `0x`, not the zero address |

### What goes after the frontmatter

A detailed system prompt that tells AutoGit exactly what app to build. The more specific, the better. Include:

- What the app does and who it is for
- All pages and features
- UI layout and component behavior
- Edge cases and error states
- Tech stack preferences (Tailwind CSS and TypeScript are always in the base stack)

See [templates/example-landing-page.md](templates/example-landing-page.md) for a reference example.

---

## Step 5 — Commit the file

In the GitHub file editor:

1. After writing your template, scroll down to **Commit changes**
2. Write a short commit message, e.g. `add saas-dashboard template`
3. Select **Commit directly to the `main` branch**
4. Click **Commit changes**

---

## Step 6 — Open a Pull Request

1. Go to your fork's main page
2. You will see a banner: **"This branch is 1 commit ahead"**
3. Click **Contribute → Open pull request**
4. Confirm the base repo is `gitbankio/autogit-hackathon` and base branch is `main`
5. Write a short PR title, e.g. `Add saas-dashboard template`
6. Click **Create pull request**

---

## Step 7 — Wait for the bot

After you open the PR, the GitHub Actions bot runs automatically in about 1-2 minutes.

It will:

1. **Validate** your submission:
   - Only one `.md` file added inside `templates/`
   - Frontmatter is complete (`title`, `app_type`, `wallet` all present)
   - `wallet` is a valid 42-character address
   - `app_type` is not already taken by another entry
   - This is your first entry (one per GitHub account)
   - Slots are still open

2. **Auto-merge** your PR if validation passes

3. **Add you to the participant list** at https://gitbankio.github.io/autogit-hackathon/ immediately

4. **Deploy your Gitbank vault** on Base mainnet (if you do not have one yet)

5. **Deposit 5 gitUSDC** into your vault on Base

6. **Post a comment** on your PR with:
   - Your entry number
   - Your vault address
   - Basescan transaction link

If validation fails, the bot will close your PR and explain exactly what to fix. You can open a new PR after fixing the issue.

---

## Step 8 — Access your reward

Your 5 gitUSDC is now in a **Gitbank vault on Base** permanently linked to your GitHub account.

To withdraw it to your wallet at any time, go to any GitHub issue or PR where `@gitbankbot` is installed and comment:

```
@gitbankbot withdraw 5 USDC to 0xYourWalletAddress
```

The bot will process the withdrawal on-chain and reply with a transaction hash. No gas required on your end.

---

## Common rejection reasons

| Error message | How to fix |
|---|---|
| `app_type` already taken | Pick a different, more specific identifier |
| Invalid wallet address | Make sure it is exactly 42 characters starting with `0x` |
| Zero address | Replace `0x000...000` with your actual wallet address |
| More than one file changed | Only add the single `.md` template file in your PR |
| File outside `templates/` | Make sure your file is inside the `templates/` folder |
| Already have an entry | One submission per GitHub account |
| Modifying existing template | Your PR must add a new file, not edit an existing one |
| All 100 slots filled | The hackathon is closed |

---

## Tips for the top 3 prizes

The 300 / 200 / 100 gitUSDC bonuses go to the templates that produce the **best app output** when run through AutoGit. The Gitbank team judges based on:

- **Output quality** — does it produce a fully working, compilable app on the first try with zero manual edits?
- **Prompt clarity** — are the instructions specific enough that AutoGit knows exactly what to build?
- **Usefulness** — is the app type something real projects would actually use?

**What makes a strong prompt:**

- Describe every page and its purpose
- List specific components and how they behave
- Specify data flow, state management, and API integrations
- Include edge cases (empty states, error states, loading states)
- Give layout hints (sidebar, grid, two-column, etc.)

A vague prompt produces a vague app. Be as specific as a product spec.

---

## Questions

Open an issue or reply in the [hackathon discussion thread](https://github.com/gitbankio/autogit-hackathon/issues/1).

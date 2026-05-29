# AutoGit Hackathon

Submit a prompt template for AutoGit, get paid automatically in gitUSDC when your PR merges.

## Rewards

| Reward | Amount | How |
|---|---|---|
| Every accepted entry | 5 gitUSDC | Auto-deposited into your Gitbank vault the moment your PR merges |
| Best template (team pick) | 300 gitUSDC | Announced after the hackathon closes |
| 2nd best (team pick) | 200 gitUSDC | Announced after the hackathon closes |
| 3rd best (team pick) | 100 gitUSDC | Announced after the hackathon closes |

Total slots: **100 entries**. First come, first served.

## How to participate

1. Check the [participant list](https://gitbankio.github.io/autogit-hackathon/) to confirm your app type is not already taken and slots are still open.
2. Fork this repo.
3. Create a new file in `templates/` named after your app type, for example `templates/saas-dashboard.md`.
4. Fill in the frontmatter and write your prompt. See [templates/example-landing-page.md](templates/example-landing-page.md) for the format.
5. Open a PR. Fill out the PR template completely.
6. The bot validates your submission automatically. If it passes, your PR is auto-merged and 5 gitUSDC is deposited into your Gitbank vault on Base.

## Template format

Every template file must start with a frontmatter block:

```
---
title: Your Template Title
app_type: your-app-type
wallet: 0xYourBaseWalletAddress
---

Your system prompt content here...
```

| Field | Description |
|---|---|
| `title` | Human-readable name for your template |
| `app_type` | Unique kebab-case identifier (e.g. `saas-dashboard`, `portfolio`) |
| `wallet` | Your Base wallet address, used as the owner of your Gitbank vault |

## Validation rules

Your PR will be auto-rejected if:

- The PR adds more than one file
- The file is not in the `templates/` folder
- The frontmatter is missing or has missing fields
- The `wallet` field is not a valid Base address (or is the example zero address)
- The `app_type` already exists in another template
- Your GitHub account has already had an entry merged
- All 100 slots are filled

## What makes a good template?

The bot tests your prompt live in AutoGit. A good template:

- Produces a working React app on the first try with no manual edits
- Uses clear, specific instructions about layout, sections, and behavior
- Specifies Tailwind CSS and TypeScript (the fixed infra stack)
- Does not rely on external UI libraries or icon packs not in the base setup
- Exports a single default `App` component

If the output requires fixing to compile, the template will not be accepted.

## Payment

When your PR merges, the bot automatically:

1. Deploys a Gitbank vault on Base mainnet for your GitHub account (if you do not have one yet)
2. Deposits 5 gitUSDC into your vault

gitUSDC is a soul-bound position in your Gitbank vault on Base. You can withdraw it to any address at any time using `@gitbankbot withdraw 5 USDC to 0xYourAddress` in any GitHub issue or PR where the bot is installed.

No gas required. The deployer pays all transaction fees.

## Top 3 prizes

After the hackathon closes (all 100 slots filled or announced end date), the Gitbank team reviews all accepted templates and picks the top 3 based on:

- Output quality (does it produce a great app?)
- Prompt clarity and specificity
- Usefulness of the app type for real projects

Winners are announced in the [hackathon thread](https://github.com/gitbankio/autogit-hackathon/issues/1) and paid to their Gitbank vault.

## Questions

Open an issue or reply in the [hackathon thread](https://github.com/gitbankio/autogit-hackathon/issues/1).

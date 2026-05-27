---
title: .vaultd Agent Payout Guard
app_type: vaultd-agent-payout-guard
wallet: 0x00f04a2a505116daf3b88eae17445d85bed4fbac
---

Build a complete React + Vite + TypeScript + Tailwind CSS app called ".vaultd Agent Payout Guard".

The app is a local-first payout brief and risk memo generator for crypto-aware AI agents, developer bounties, GitHub-native payments, x402 payments, and Gitbank-style merge payouts. It helps a human or AI agent prepare a clear bounty brief, payout condition, `@gitbankbot` command draft, and `.vaultd` evidence memo before money moves.

The app must be advisory-only. It must not connect to a wallet, request secrets, execute trades, sign messages, submit transactions, relay transactions, store private keys, ask for seed phrases, or claim that it provides financial, legal, tax, or investment advice.

Create a polished single-page application with a clean modern interface. Use only React, TypeScript, and Tailwind CSS. Do not use external UI libraries, icon packs, chart libraries, wallet libraries, blockchain SDKs, or remote APIs. The output must compile on the first try and export a single default `App` component.

Core product goal:

Before an agent gets paid, a bounty is assigned, a PR merge triggers a payout, or an x402 service is purchased, the app produces:

- a safe GitHub issue or PR bounty brief;
- a draft `@gitbankbot` command;
- payout acceptance criteria;
- a human review checklist;
- a structured `.vaultd`-compatible evidence memo.

The app classifies the proposed payout or agent-money action as one of:

- `protect`
- `watch`
- `review_required`
- `blocked`

The app must always remind the user that the final decision belongs to the human. Every money-related memo must end with: `DYOR. NFA.`

Required layout:

1. Hero section
   - Title: ".vaultd Agent Payout Guard"
   - Subtitle: "Before an agent gets paid, make the bounty, payout condition, and proof trail explicit."
   - Three trust badges:
     - "Local-first"
     - "Advisory-only"
     - "No wallet secrets"
   - Add a short line: "Gitbank pays. .vaultd slows the agent down before money moves."

2. Left panel: input form
   Include controlled React form fields for:
   - Workflow type: select with `assign_bounty`, `merge_payout`, `send_payment`, `x402_purchase`, `agent_invoice`, `receipt_review`, `other`
   - GitHub issue or PR URL
   - Task title
   - Recipient GitHub handle
   - Amount
   - Currency: select with `gitUSDC`, `USDC`, `ETH`, `other`
   - Chain: default `Base`
   - Payment condition: select with `on_merge`, `after_tests_pass`, `after_manual_review`, `after_delivery`, `milestone_based`, `unknown`
   - Acceptance criteria
   - Deliverable summary
   - Receipt or verification URL
   - User experience level: select with `beginner`, `intermediate`, `advanced`, `professional`, `unknown`
   - Treasury or payout context
   - Known red flags: checkboxes for `private key requested`, `seed phrase requested`, `unlimited approval`, `unknown contract`, `honeypot risk`, `phishing risk`, `missing recipient`, `unclear payout condition`, `guaranteed yield claim`

3. Center panel: generated GitHub brief
   Generate a clean GitHub-ready bounty or payout brief live from the form state. It must include:
   - title;
   - task summary;
   - deliverables;
   - acceptance criteria;
   - payout amount;
   - payout condition;
   - human review requirement;
   - draft `@gitbankbot` command.

   The draft command should use safe plain text only. It must never claim to execute anything.

   Command examples:
   - `@gitbankbot assign this task to @recipient with 5 gitUSDC bounty`
   - `@gitbankbot send 5 USDC to @recipient`

   If recipient, amount, payment condition, or GitHub URL is missing, do not generate a final command. Generate a placeholder command and mark it as `review_required`.

4. Right panel: generated `.vaultd` memo preview
   Generate a memo live from the form state. The memo must include:
   - Decision
   - Proposed payout
   - Why this protects the workflow
   - Payment condition
   - Risk checks
   - Missing information
   - Recommended next step
   - Evidence to store in `.vaultd`
   - Boundary reminder

5. Decision logic
   Implement deterministic client-side classification:
   - If private key requested or seed phrase requested: status `blocked`
   - If honeypot risk or phishing risk: status `blocked`
   - If guaranteed yield claim: status `blocked`
   - If unlimited approval or unknown contract: status `review_required`
   - If recipient is missing: status `review_required`
   - If amount is missing: status `review_required`
   - If payment condition is `unknown`: status `review_required`
   - If GitHub issue or PR URL is missing for `assign_bounty` or `merge_payout`: status `review_required`
   - If acceptance criteria are missing: status `review_required`
   - If workflow type is `assign_bounty`, `merge_payout`, `send_payment`, `x402_purchase`, `agent_invoice`, or `receipt_review` and all required fields are present with no red flags: status `protect`
   - Otherwise: status `watch`

6. Recommended next step logic
   Map status to:
   - `blocked` -> `block_action`
   - `review_required` -> `wait_for_more_data`
   - `protect` -> `proceed_to_human_review`
   - `watch` -> `document_thesis`

7. Evidence JSON
   Show a `.vaultd` evidence JSON block with:
   - `workflow_type`
   - `github_url`
   - `recipient`
   - `amount`
   - `currency`
   - `payment_condition`
   - `status`
   - `risk_level`
   - `human_approval_required: true`
   - `source_links`
   - `receipt_id`
   - `verification_url`
   - `tx_hash`
   - `notes`

8. UX details
   - Use a dark premium interface with subtle gradients.
   - Use accessible labels.
   - Use cards, rounded corners, and clear spacing.
   - Add colored status pill:
     - red for `blocked`
     - amber for `review_required`
     - blue for `watch`
     - green for `protect`
   - Add a "Copy GitHub brief" button that copies the generated bounty/payout brief to clipboard.
   - Add a "Copy .vaultd memo" button that copies the generated memo text to clipboard.
   - Add a "Reset" button that clears the form.
   - Add a footer note: "This tool is decision support only. It does not execute, sign, submit, approve, or certify anything."

9. Safety copy
   Include these fixed warnings in the UI:
   - "Never paste a private key, seed phrase, mnemonic, or recovery phrase."
   - "No transaction is executed by this app."
   - "The human user keeps the final decision."
   - "DYOR. NFA."

Implementation requirements:

- Use a single `App.tsx` style component as the default export.
- Use `useState` for form state.
- Keep all logic inside the component or helper functions in the same file.
- Do not import anything except React hooks if needed.
- Do not use localStorage, cookies, analytics, APIs, wallets, connectors, or external packages.
- Make the app work with empty fields and show missing information clearly.
- The app must be self-contained, compile successfully, and require no manual edits.

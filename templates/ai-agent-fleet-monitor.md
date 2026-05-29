---
title: AI Agent Fleet Monitor
app_type: ai-agent-fleet-monitor
wallet: 0x52Ab53912D37759B2ad364f22dD06B16714b6C06
---

Build a production-quality AI Agent Fleet Monitor dashboard as a single React TypeScript app using Tailwind CSS. The app monitors a fleet of autonomous AI agents — their live status, task queues, performance metrics, and cost tracking.

## Layout

Full-viewport dark dashboard. No scrolling on the main layout. Use CSS grid to divide the screen into four zones:

- **Top bar** (full width, ~60px): App title "Agent Fleet", live clock (updates every second), total agents count, a global health indicator pill (green = all healthy, yellow = degraded, red = critical)
- **Left panel** (~320px wide, full height minus top bar): Agent list
- **Center panel** (flex-grow): Task feed + performance chart
- **Right panel** (~280px wide): Cost tracker + alert log

## Color scheme

Background: `#0a0f1e`. Cards: `#111827`. Borders: `#1f2937`. Primary accent: `#6366f1` (indigo). Success: `#10b981`. Warning: `#f59e0b`. Error: `#ef4444`. Text primary: `#f9fafb`. Text muted: `#6b7280`.

## Agent List (left panel)

Show 6 agents. Each agent card shows:
- Status dot (pulsing green animation for RUNNING, static yellow for IDLE, static red for FAILED)
- Agent name (e.g. "Floyd", "Scout", "Arbiter", "Weaver", "Ledger", "Nexus")
- Current task truncated to one line, or "Waiting for task..." if idle
- Small stat row: tasks completed today | avg response time in ms | success rate %

Clicking an agent card highlights it and filters the center task feed to that agent.

## Task Feed (center panel, top half)

Scrollable list of the 20 most recent task events. Each row:
- Timestamp (HH:MM:SS)
- Agent name badge (colored pill matching agent)
- Task description (one line, truncated)
- Status chip: COMPLETED (green), RUNNING (indigo, pulsing), FAILED (red), QUEUED (gray)
- Duration in ms for completed tasks

New tasks animate in from the top. Simulate a new task event every 3-4 seconds using setInterval — cycle through agents randomly, pick from a pool of realistic task descriptions: "Analyze contract 0x4a2...", "Fetch ETH/USDC price feed", "Scan GitHub issues for bounty labels", "Generate sentiment report for AAPL", "Verify wallet risk score", "Summarize research paper", "Deploy static site to Pages", "Check staking yields across protocols".

## Performance Chart (center panel, bottom half)

A bar chart showing tasks completed per agent over the last 6 hours. Use only SVG — no chart library. X-axis: agent names. Y-axis: task count 0–50. Bars filled with indigo, hover shows a tooltip with exact count. Label each bar with the count above it.

## Cost Tracker (right panel, top)

Title: "Spend Today". Show a summary card with:
- Total API cost: formatted as $X.XX
- Breakdown by model: claude-haiku (green), claude-sonnet (indigo), gpt-4o (yellow) — show name, call count, and cost
- A thin horizontal stacked bar showing proportion of spend per model

Below that: "Tokens Used" showing input tokens and output tokens as two labeled progress bars (max = 2M tokens each).

Simulate costs updating every 8 seconds — increment randomly by small amounts.

## Alert Log (right panel, bottom)

Title: "Alerts". Show last 8 alerts, newest first. Each alert:
- Icon: ⚠️ warning, ❌ error, ✅ success, ℹ️ info
- Short message (one line)
- Relative timestamp: "2s ago", "1m ago", etc.

Pre-populate with realistic alerts: "Floyd exceeded 30s task timeout", "Scout reconnected after disconnect", "Ledger failed: rate limit hit", "3 tasks completed in under 500ms", "New bounty detected: $250 USDC". Add a new alert every 15 seconds.

## Mock data

Define all mock data as TypeScript constants at the top of App.tsx. Use `useState` and `useEffect` for all simulated live updates. No external API calls.

## Technical requirements

- Single file: `App.tsx` exporting default `App`
- TypeScript with explicit types for all data structures
- Tailwind only — no other CSS
- No external component libraries, no icon libraries (use emoji or inline SVG for icons)
- All useEffect cleanups must return the clearInterval/clearTimeout
- The app must compile and render with zero errors on first try

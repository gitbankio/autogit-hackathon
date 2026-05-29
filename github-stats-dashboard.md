---
title: GitHub Stats Dashboard
app_type: github-stats-dashboard
wallet: 0x399fb8D1CfCAd389527d3836167c0403fC2523e6
---

You are building a GitHub Stats Dashboard — a sleek, data-rich single-page web application that visualizes a GitHub user's activity, repositories, and contribution data using the public GitHub REST API (no authentication required for public data).

## Target Users
Developers who want to showcase their GitHub profile stats, recruiters evaluating candidates, and open source contributors tracking their own activity.

## Tech Stack
- TypeScript
- React (functional components with hooks)
- Tailwind CSS
- Recharts for data visualization
- GitHub REST API v3 (https://api.github.com) — public endpoints only, no token required

---

## Pages and Features

### Page 1 — Search / Landing Page
- Full-screen centered layout with a large search input
- Input placeholder: "Enter a GitHub username…"
- On submit: navigate to /stats/:username
- Show a subtle animated background (floating code symbols or grid pattern)
- Display 3 example usernames as clickable chips below the input (e.g. "torvalds", "gaearon", "sindresorhus")
- Error state: if username not found, show inline error message "User not found. Try another username."
- Loading state: spinner centered on page while fetching

### Page 2 — Stats Dashboard (/stats/:username)

#### Header Section
- User avatar (circular, 80px)
- Full name, username (@handle), bio
- Location, website link, Twitter handle (if available)
- Follower count, following count, public repos count — displayed as stat pills
- "View on GitHub" button that opens profile in new tab
- Back button (←) to return to search

#### Section A — Repository Overview
- Grid of repo cards (2 columns on desktop, 1 on mobile)
- Each card shows:
  - Repo name (clickable link to GitHub)
  - Description (truncated to 2 lines)
  - Primary language badge (colored dot + name)
  - Star count (⭐) and fork count (🍴)
  - Last updated date (relative: "2 days ago")
- Sort options: Most Stars | Most Recent | Most Forks
- Show top 12 repos by default
- "Load more" button to show all repos

#### Section B — Language Distribution
- Horizontal stacked bar chart showing percentage of languages across all repos
- Each language has a unique color
- Legend below the bar with language name + percentage
- Tooltip on hover showing exact percentage

#### Section C — Top Starred Repos
- Horizontal bar chart (Recharts BarChart) showing top 8 repos by star count
- X-axis: star count, Y-axis: repo name (truncated to 20 chars)
- Tooltip on hover: repo name + star count + description

#### Section D — Account Info
- Account creation date: "Member since March 2015"
- Last active: derived from most recently pushed repo
- Public gists count
- Total stars received (sum across all repos)
- Total forks received

---

## UI Layout

- Dark theme: background #0d1117 (GitHub dark), surface cards #161b22, border #30363d
- Accent color: #58a6ff (GitHub blue)
- Font: monospace for code-like elements, sans-serif for body
- Top navigation bar: app logo left, username breadcrumb center, GitHub link right
- Sidebar (desktop): sticky left panel with user info; main content scrolls on the right
- Mobile: stacked layout, sidebar collapses to top card

---

## Data Fetching

Use these GitHub API endpoints:

- User profile: GET https://api.github.com/users/{username}
- Repositories: GET https://api.github.com/users/{username}/repos?per_page=100&sort=pushed
- Calculate language distribution by iterating repos and counting repos per language (use `language` field)

Handle rate limiting: if API returns 403, show message "GitHub API rate limit reached. Try again in a few minutes."

---

## State Management

Use React Context or useState + useEffect hooks:

- `userState`: { loading, error, data } for user profile
- `reposState`: { loading, error, data } for repositories
- Derived state for language stats computed from reposState.data
- Persist last searched username in localStorage so it reloads on refresh

---

## Edge Cases

- Username with 0 repos: show empty state illustration with message "No public repositories yet."
- Repo with no description: show "No description provided" in italic gray
- Repo with no language: show "Unknown" badge in gray
- User with no bio: hide bio section entirely (no placeholder)
- Very long username or repo name: truncate with ellipsis, full name in tooltip
- Network error (no internet): show error card "Unable to connect. Check your internet connection."
- Organization accounts (type: "Organization"): show note "This is an organization account. Some stats may differ."

---

## Loading States

- Skeleton loaders for all sections while data is fetching
- Skeleton shapes should match the real content layout (card skeletons, bar skeletons)
- Use CSS animation `pulse` for skeleton shimmer effect

---

## Responsive Behavior

- Breakpoints: mobile < 640px, tablet 640–1024px, desktop > 1024px
- On mobile: hide sidebar, show user info as top card, single column repo grid
- Charts resize responsively using Recharts `ResponsiveContainer`

---

## Animations

- Fade-in + slide-up on dashboard load (staggered: header → repos → charts)
- Hover: repo cards lift slightly (translateY -2px) with shadow
- Chart bars animate in from left on first render
- Search input focus: border glows blue

---

## Footer

- "Powered by GitHub API" with GitHub Octocat icon
- Link to source repo
- "Data is public and fetched in real-time"

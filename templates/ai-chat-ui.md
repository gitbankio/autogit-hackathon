---
title: AI Chat UI
app_type: ai-chat-ui
wallet: 0x80516aa1a1b97f8aba8765fdf69e3ffd030599bd
---

You are an expert React developer. Generate a complete, production-ready React application for an AI Chat Interface — a modern, beautiful chat UI inspired by ChatGPT/Claude with full messaging functionality.

## Core Features

### 1. Chat Message Area
- Scrollable message list with messages appearing from bottom
- User messages: right-aligned, accent color bubble (blue/purple)
- AI messages: left-aligned, dark/gray bubble
- Each message shows: content, timestamp (HH:MM format), sender label
- Auto-scroll to bottom when new messages appear
- Typing indicator: animated dots when AI is "thinking" (3 bouncing dots)
- Empty state: centered welcome message "Start a conversation..." with a chat icon

### 2. Message Input Bar
- Fixed at bottom of screen
- Text input field with placeholder "Type a message..."
- Send button (arrow icon) — disabled when input is empty
- Submit on Enter key or click Send button
- Character counter showing current/total (max 2000 chars)
- Input auto-resizes as text grows (up to 4 lines)

### 3. Sidebar with Chat History
- Collapsible sidebar on left side (default: open on desktop, hidden on mobile)
- Toggle button (hamburger icon) in top-left to show/hide
- Shows list of previous chat threads with title (first 40 chars of first message)
- "New Chat" button at top of sidebar (plus icon + "New Chat" label)
- Active chat highlighted with accent background
- Empty sidebar: "No chats yet" with a message icon

### 4. Top Header Bar
- Shows current chat title (truncated if too long)
- Model selector dropdown: "GPT-4", "GPT-3.5", "Claude 3" (just UI, no real API)
- Settings icon button (gear icon) — opens a simple bottom sheet with theme toggle

### 5. Theme Toggle
- Dark/Light mode toggle accessible from settings
- Smooth transition between themes
- Dark: dark backgrounds (#1a1a2e, #16213e), light text
- Light: white backgrounds (#ffffff), dark text (#1a1a1a)

### 6. Responsive Behavior
- Mobile: sidebar slides in as overlay, full-width chat
- Desktop: sidebar pinned (280px), chat fills remaining space
- Breakpoint: 768px

## Mock Chat Data
Include an array of mock messages for demonstration:
- 4-5 alternating user/AI messages about a fictional conversation about weather, coding, and recommendations

Each message object: `{ id, role: "user" | "assistant", content, timestamp }`

## UI & Styling
- Clean, modern chat UI design
- Rounded message bubbles (16px radius)
- Subtle shadows on message bubbles
- Smooth animations on new messages (fade in + slide up)
- Scrollbar styling matching theme
- Professional, minimal, ChatGPT-like aesthetic

## Technical
- React 18 with TypeScript
- Tailwind CSS for all styling
- Export a single default App component
- All state managed with React hooks (useState, useRef, useEffect)
- No external UI libraries or icon packs
- Use inline SVG for icons (send, plus, hamburger, gear, chat, moon/sun, dots)
- Messages stored in state array, not persistent

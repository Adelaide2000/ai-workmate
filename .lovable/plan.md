# AI Workplace Productivity Assistant

A single-page dashboard app with a sidebar and 5 AI-powered tools, all wired to Lovable AI (Gemini). No login, no database — outputs are editable in-place and can be copied.

## Scope

All 5 tools included:
1. Smart Email Generator
2. Meeting Notes Summarizer
3. AI Task Planner
4. AI Research Assistant
5. AI Chatbot (streaming)

Plus: Dashboard home, Settings page (theme + disclaimer), Responsible AI disclaimer footer.

## Design direction

Clean, professional productivity aesthetic — think Linear/Notion. Light + dark mode. Sidebar-driven navigation using shadcn Sidebar. Distinct accent color per tool for quick visual identification. Not the generic purple-gradient AI look.

## Routes (TanStack Start)

```
src/routes/
  __root.tsx          → SidebarProvider + AppSidebar + Outlet
  index.tsx           → Dashboard home (tool cards + welcome)
  email.tsx           → Email Generator
  meetings.tsx        → Meeting Notes Summarizer
  tasks.tsx           → Task Planner
  research.tsx        → Research Assistant
  chat.tsx            → AI Chatbot (streaming)
  settings.tsx        → Theme toggle, disclaimer
  api/chat.ts         → Streaming chat endpoint (useChat transport)
```

## Backend

- Enable **Lovable Cloud** (needed to provision `LOVABLE_API_KEY` for AI Gateway).
- **Streaming chat**: `src/routes/api/chat.ts` server route using `streamText` + `google/gemini-3-flash-preview`.
- **One-shot tools** (email, meetings, tasks, research): `createServerFn` in `src/lib/ai.functions.ts` using `generateText` with tool-specific system prompts. Returns markdown/plain text that renders into an editable textarea.
- Shared gateway helper: `src/lib/ai-gateway.server.ts` (per `ai-sdk-lovable-gateway`).

## Tool specs

**Email Generator** — inputs: recipient, subject, purpose, tone (Formal/Friendly/Persuasive). Output: editable textarea + copy button.

**Meeting Summarizer** — input: notes textarea. Output: three sections (Key points, Decisions, Action items + deadlines), each editable.

**Task Planner** — dynamic task list (task/due date/priority: Low/Med/High), add/remove rows. Output: schedule as editable markdown.

**Research Assistant** — input: topic or pasted article. Output: Summary, Key insights, Recommendations sections.

**Chatbot** — `useChat` with `DefaultChatTransport` → `/api/chat`. Markdown rendering via `react-markdown`. Auto-scroll, disabled input while streaming, error toasts.

## Shared UI

- `AppSidebar` component with lucide icons per tool, active route highlight.
- Header with `SidebarTrigger` + page title + theme toggle.
- Reusable `ToolShell` component: title, description, form on left / output on right (stacks on mobile).
- `AIOutput` component: editable textarea + Copy + Regenerate + "AI-generated — review before use" note.
- Toast (sonner) for 429/402/network errors.
- Responsive: sidebar collapses to icons on tablet, offcanvas on mobile.

## Responsible AI

Persistent small footer note under every tool output plus a dedicated section on Settings and Dashboard home.

## Technical details

- Stack: TanStack Start + React 19 + Tailwind v4 + shadcn (existing template).
- Deps to add: `ai`, `@ai-sdk/openai-compatible`, `@ai-sdk/react`, `zod`, `react-markdown`.
- Model default: `google/gemini-3-flash-preview` for all tools.
- Design tokens: extend `src/styles.css` with semantic accent tokens per tool (`--tool-email`, `--tool-meetings`, etc.) in oklch.
- No auth, no database, no persistence — chat history is in-memory per session.
- SEO: per-route `head()` with distinct title/description.

## Out of scope

- User accounts, saved history, team sharing (can add later with Lovable Cloud auth + tables).
- File upload for meeting audio / research PDFs.
- Export to PDF/Docx.

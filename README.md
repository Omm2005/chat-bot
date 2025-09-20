<h1 align="center">AI Chatbot (Next.js + AI SDK)</h1>

Conversational AI app built with Next.js App Router, AI SDK, and shadcn/ui — featuring Gemini models, chain‑of‑thought reasoning, memory tools (Supermemory), artifacts, and attachments.

Links: Features · Quick Start · Environment · Usage · Troubleshooting

## Features

- Next.js App Router, RSCs + Server Actions
- AI SDK text + tools with Gemini (google/genai)
- Reasoning mode with extracted <think> chain‑of‑thought
- Memory tools with Supermemory
  - Add Memory and Search Memories tool calls in chat
  - Manual “Remember” popover to add memories quickly
- Artifacts side‑pane for documents and code
- Auth (guest and regular users) with per‑role entitlements
- Polished tool UI with real‑time status and error states

## Quick Start

1) Install dependencies

```bash
pnpm install
```

2) Configure environment (create `.env.local` from `.env.example`)

Required keys:

- `GOOGLE_GENERATIVE_AI_API_KEY` — Gemini
- `SUPERMEMORY_API_KEY` — Supermemory (memory tools)
- `POSTGRES_URL` — chat persistence
- `REDIS_URL` — resumable streaming (optional)
- `BLOB_READ_WRITE_TOKEN` — file uploads (optional)

Optional (to enable OpenRouter model):
- `OPENROUTER_API_KEY` — OpenRouter API key
- `OPENROUTER_SITE_URL` — your site URL for OpenRouter headers (default `http://localhost:3000`)
- `OPENROUTER_TITLE` — app title for OpenRouter headers (default `AI Chatbot`)

3) Run the app

```bash
pnpm dev
```

The app runs at http://localhost:3000.

## Environment

- Models are configured in `lib/ai/providers.ts`.
- Prompts and memory policy in `lib/ai/prompts.ts`.
- Chat route and tools in `app/(chat)/api/chat/route.ts`.
- Supermemory tool wrappers in `lib/ai/tools/supermemory-tools.ts`.

## Usage

Reasoning mode
- Toggle On/Off from the model selector in the input bar.
- When On, the UI streams a collapsed “Thinking…” panel you can expand.
- Implementation: `components/multimodal-input.tsx:504`.

Memory tools
- Automatic: the AI calls Add Memory when you share durable facts/preferences, and Search Memories when context helps.
- Manual: click “Remember” in the header to add a memory instantly via popover.
- Implementation:
  - Tool UI: `components/message.tsx`
  - Tool server wiring: `app/(chat)/api/chat/route.ts`
  - Supermemory wrappers: `lib/ai/tools/supermemory-tools.ts`
  - Manual API: `app/(chat)/api/memory/route.ts`
  - Manual UI: `components/memory.tsx`

Guest restrictions
- Guests can chat but memory tools are disabled.
- Guest avatar uses shadcn placeholder image.
- Logic: `components/sidebar-user-nav.tsx`, `components/Navbar/profile-dropdown.tsx`.

Tool UX
- Weather, Documents, Suggestions, and Memory tools render as expandable panels showing parameters and result/error.
- Error states are clearly labeled; success states show summaries (e.g., “Memory added”).

## Troubleshooting

Memory tool error “a.memories.add is not a function”
- Ensure dependencies are installed after updates: `pnpm install`.
- We call Supermemory directly via `supermemory` client. If you changed versions, reinstall to align the API.

Reasoning panel not visible
- Use the reasoning model (toggle On). The UI only shows the panel when the model emits reasoning parts.

Memory tools not visible
- You might be using a guest account. Log in as a regular user to enable memory tools.

## Scripts

- `pnpm dev` — start Next.js in dev
- `pnpm build` — migrate DB + build
- `pnpm start` — start production server

## Project Map

- Chat API: `app/(chat)/api/chat/route.ts`
- Memory API: `app/(chat)/api/memory/route.ts`
- Message UI: `components/message.tsx`
- Input + Model selector + Reasoning toggle: `components/multimodal-input.tsx`
- Manual memory popover: `components/memory.tsx`
- Supermemory tools: `lib/ai/tools/supermemory-tools.ts`
- Providers (Gemini + OpenRouter): `lib/ai/providers.ts`

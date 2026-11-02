# brainX: Frontend

This is the plan for `apps/web`. The visual rules are in [DESIGN.md](DESIGN.md), and the API is in [BACKEND.md](BACKEND.md#api). Nothing here is built yet.

Phase 6 starts only after the model milestone and Phase 5, so the UI connects to a real backend.

## Packages

Versions were checked on 2026-11-02.

**Compatibility test:** in a temporary project, every package below except the `shadcn` CLI was installed (only its `--version` and `init --help` were run) with Next.js 16.3.8, React 19.2.8, and TypeScript 7.0.2. A test page imported them, and `next build` and strict `tsc --noEmit` both passed.

Versions are the ones the test installed; the registry listed 5.105.1 and 4.16.1 at the time for two of them, so confirm the exact version when installing.

**Not tested yet:** running them in a browser, Tailwind styles, `shadcn init`, Vitest, and Playwright. The task that adds each one must confirm it works.

### Add when the feature is built

Each package is added only in its task, after approval.

| Package | Version | Why it's needed | Task |
|---|---|---|---|
| `vitest`, `@testing-library/react`, `@testing-library/dom`, `jsdom`, `@vitejs/plugin-react` | 5.0.5, 16.3.3, 10.4.2, 30.1.3, 6.1.2 | Component and logic tests | P6-T1 |
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | Styling and design tokens | P6-T2 |
| `shadcn` CLI, `radix-ui`, `lucide-react` | 4.23.0, 1.8.1, 1.66.0 | Accessible components that we own and can restyle, plus icons | P6-T3 |
| `react-markdown`, `remark-gfm` | 10.1.0, 4.0.1 | Markdown replies, including tables | P6-T8 |
| `shiki` | 4.5.0 | Code highlighting | P6-T9 |
| `next-themes` | 0.4.6 | Light and dark themes with no flash on load | P6-T10 |
| `sonner` | 2.0.8 | Toast notifications | P6-T11 |
| `@tanstack/react-query` | 5.105.0 | Conversations and messages from the API | P6-T12 |
| `zustand` | 5.0.16 | Settings saved in the browser | P6-T13 |
| `motion` | 14.9.0 | Small transitions that CSS can't handle well | P6-T14 |
| `@playwright/test` | 1.64.1 | Essential browser tests | P7-T3 |

`shadcn init` must use **`--base radix`**, because its current default is Base UI. It may also add helper packages, so list them for approval before running it.

### Add only if a real need appears

| Package | Version | Add only if | Why it starts out unused |
|---|---|---|---|
| `react-hook-form`, `zod`, `@hookform/resolvers` | 7.91.0, 4.6.7, 7.0.1 | Settings become a complex form | The basic panel has four number fields and a theme choice |
| `react-resizable-panels` | 4.16.0 | The collapsible sidebar isn't enough | It's optional, and a collapsible sidebar covers the requirement |

## Before adding any package

1. Explain why it's needed.
2. Check whether an existing dependency already solves the problem.
3. Verify compatibility with the installed versions.
4. Install only after approval.
5. Avoid overlapping packages.

## UI foundation (done early, 2026-11-02)

At the owner's request the shared design system was built before the model work. Both apps now use one set of tokens and components.

| Package | Version | Installed in | Used for |
|---|---:|---|---|
| `tailwindcss` | 4.3.3 | `packages/ui` | Styling, and the `@import` of the design tokens |
| `@tailwindcss/postcss`, `postcss` | 4.3.3, 8.5.32 | `web`, `admin` | Turns Tailwind classes into CSS |
| `radix-ui` | 1.8.1 | `packages/ui` | Accessible parts (the mobile menu dialog, the button `asChild` slot) |
| `class-variance-authority`, `clsx`, `tailwind-merge` | 0.7.1, 2.1.1, 3.7.0 | `packages/ui` | Button and badge variants, and joining class names safely |
| `lucide-react` | 1.66.0 | `packages/ui` | Icons (apps import them from `@repo/ui/icons`) |
| `next-themes` | 0.4.6 | `packages/ui` | System, Light, and Dark themes |
| `sonner` | 2.0.8 | `packages/ui` | Toast messages |

**What was checked:** `pnpm check-types`, `pnpm lint`, and `pnpm build` pass, and screenshots of both apps (light and dark, desktop and a true 390px width) match [DESIGN.md](DESIGN.md).

**What was not checked:** clicking the theme toggle, the mobile menu, and the toast in a real browser (only screenshots were taken), and `pnpm dev` hot reloading with the new setup. A dev server that was already running must be restarted to pick up the Tailwind and PostCSS files.

**Decisions made along the way:**

- The `geist` npm package was tried and removed: its type files export nothing under TypeScript 7. The apps keep using their local Geist font files, which also work offline.
- The shadcn CLI was **not** run. The components are written by hand in the same style (variants with `class-variance-authority`, parts from Radix). P6-T3 decides whether to use the CLI for further components.
- The old `src/` and `features/` layout in this file was replaced by the flat layout below.

**Pages that exist now:** `web` has a static chat preview (a header, a sample history, a sample reply with a streaming cursor, and a composer that only shows a toast). `admin` has an Overview with placeholder status cards and a `/design` page that shows every colour and component. Nothing is connected to the model or the API yet.

**Related tasks below:** P6-T2 (tokens) and P6-T10 (theme) are done. P6-T3, P6-T4, P6-T5, P6-T6, P6-T7, and P6-T11 are partly done, and each says what is left.

## Folder structure

Keep it flat: one level of folders and one file per job. Anything both apps need lives in a shared package (this is what Turborepo is for), so `web` and `admin` never copy code.

```text
packages/ui/src/           the shared look and feel, used by BOTH apps
  styles.css               colours, fonts, shapes (the design tokens)
  button.tsx, card.tsx ... one file per component
  app-shell.tsx            header + sidebar + main area
  cn.ts, icons.ts          small helpers
packages/ui/turbo/generators/   "turbo gen component" makes a new component file

apps/web/                  the chat app
  app/                     pages and layout (Next.js requires this folder)
  components/              pieces only the chat app uses
  hooks/  lib/  stores/  types/     added only when a task first needs them
apps/admin/                the same shape, with its own pages
  app/  components/
```

**Rule of thumb:** if both apps need it, it goes in `packages/ui`. If only one app needs it, it stays in that app's `components/`.

## State

Each piece of state has one owner, so nothing is stored twice.

| State | Owner | Saved? |
|---|---|---|
| Conversations and saved messages | TanStack Query cache, from the API | Yes, in PostgreSQL |
| Generation settings | Zustand store | Yes, in `localStorage` |
| Theme | `next-themes` | Yes, handled by the package |
| Text being typed, sidebar open or closed | React state | No |
| Reply being streamed | Chat feature, then refreshed from the API | The server saves the final text |

If `localStorage` is blocked or full, chat must keep working with default settings, and a toast explains that settings aren't being saved.

## Streaming and code highlighting

- Update the visible reply on a short timer (start with 50 ms), not on every token. This keeps the UI smooth, and P6-T11 checks the value.
- Render Markdown as the text streams. Half-finished Markdown may look odd briefly, then corrects itself.
- Highlight code only when the reply is finished, because highlighting is slow to re-run.
- Load Shiki only when a code block first appears, with a small set of languages, so the first page stays light. Before highlighting finishes, show plain code.
- Everything is bundled, so highlighting works offline.

## Keyboard shortcuts

| Keys | Action |
|---|---|
| `Enter` | Send |
| `Shift+Enter` | New line |
| `Esc` | Stop the reply |
| `/` | Focus the message box, when not already typing |
| `Cmd/Ctrl+B` | Show or hide the sidebar |

## Configuration

| Setting | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000/api/v1` | Where the browser finds the API ([BACKEND.md](BACKEND.md#api)). Set it in `apps/web/.env.local`, and commit an `apps/web/.env.example`. |

- `apps/web/.gitignore` contains `.env*`, which would also ignore `.env.example`. P1-T5 adds `!.env.example` after it, so the example file can be committed.
- The API allows only the origin `http://localhost:3000`, so open the app at `localhost:3000`, not `127.0.0.1:3000`.

## Tasks

Run them one at a time. All tasks also run `pnpm --filter web lint`, `check-types`, and `build` as part of testing.

### P6-T1: Frontend environment setup

- **Purpose:** Prepare a clean base with tests, so later work can be checked.
- **Prerequisites:** P5-T20 (Phase 5 is finished, so the backend exists).
- **Packages:** Vitest and Testing Library packages listed above.
- **Files:** `apps/web/app/`, `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/vitest.config.ts`.
- **Instructions:** Keep `app/` where it is (there is no `src/` folder). Confirm strict TypeScript is on, add Vitest, and add a `test` script. The starter page was already replaced by the UI foundation.
- **Acceptance:** The page shows the heading, and one sample test passes.
- **Testing:** Run `pnpm --filter web test`, then open the page.

### P6-T2: Tailwind and design tokens

- **Purpose:** Keep colours, type, and spacing in one place.
- **Status:** Done early. Tokens live in `packages/ui/src/styles.css` and both apps import them. Left: confirm the contrast rule for the code theme in P6-T9.
- **Prerequisites:** P6-T1.
- **Packages:** `tailwindcss`, `@tailwindcss/postcss`.
- **Files:** `apps/web/postcss.config.mjs`, `packages/ui/src/styles.css`, `apps/web/app/layout.tsx`.
- **Instructions:** Add Tailwind, then define every token in [DESIGN.md](DESIGN.md) for light and dark. Load Geist from the local font files.
- **Acceptance:** Text and borders use tokens, and both system themes show correctly.
- **Testing:** Switch the Mac's appearance setting and check the page. Confirm no font request leaves the machine.

### P6-T3: shadcn/ui configuration

- **Purpose:** Get accessible base components that we can restyle.
- **Status:** Partly done early. The components are hand-written in shadcn style with Radix. Left: decide whether to run the shadcn CLI (`--base radix`) for more components. It has not been tested here.
- **Prerequisites:** P6-T2.
- **Packages:** `shadcn` CLI, `radix-ui`, `lucide-react`, plus any helpers it lists.
- **Files:** `apps/web/components.json`, `packages/ui/src/`, `packages/ui/src/cn.ts`, `apps/web/package.json`.
- **Instructions:** Check the CLI's monorepo and Tailwind 4 behaviour first. Run `init` with `--base radix`, then add only `button`. Restyle it to match DESIGN.md.
- **Acceptance:** Button matches every state in DESIGN.md, using Radix and not Base UI.
- **Testing:** A test renders the button and clicks it. Tab to it and check the focus outline.

### P6-T4: Application shell

- **Purpose:** Create the page frame that holds everything.
- **Status:** Done early as a static shell: `AppShell` in `packages/ui/src/app-shell.tsx`, used by both apps. Left: connect it to real data.
- **Prerequisites:** P6-T3.
- **Packages:** None new.
- **Files:** `packages/ui/src/`, `apps/web/app/page.tsx`.
- **Instructions:** Build the header, sidebar area, message area, and composer area. Add the small-model notice and the empty conversation state.
- **Acceptance:** Matches the DESIGN.md layout, and the notice is always visible.
- **Testing:** A test checks that the notice and empty state render.

### P6-T5: Sidebar and navigation

- **Purpose:** Give the conversation list a home and support collapsing.
- **Status:** Partly done early: a fixed sidebar on desktop and a slide-over menu on mobile. Left: real conversation list, collapsing on desktop, and `Cmd/Ctrl+B`.
- **Prerequisites:** P6-T4.
- **Packages:** shadcn `sidebar`, if it fits; otherwise a simple component.
- **Files:** `packages/ui/src/`, `packages/ui/src/`.
- **Instructions:** Add a collapsible sidebar with a **New chat** button and placeholder list. Add `Cmd/Ctrl+B`.
- **Acceptance:** The sidebar opens and closes by mouse and keyboard.
- **Testing:** A test toggles the sidebar. Try it by hand.

### P6-T6: Chat message components

- **Purpose:** Show user and assistant messages.
- **Status:** Partly done early: a static sample message block in `apps/web/components/chat-preview.tsx`. Left: message states, the copy button, and real data.
- **Prerequisites:** P6-T5.
- **Packages:** None new.
- **Files:** `apps/web/components/`, `apps/web/types/`.
- **Instructions:** Build the message list and both message types, using sample data for each state: streaming, complete, stopped, failed. Add the **Copy** button.
- **Acceptance:** Each state matches DESIGN.md, and Copy puts the full text on the clipboard.
- **Testing:** Tests render each state and check Copy.

### P6-T7: Prompt composer

- **Purpose:** Let the user write and send a message.
- **Status:** Partly done early: a static composer. Left: auto-resize, Stop, and the keyboard shortcuts.
- **Prerequisites:** P6-T6.
- **Packages:** None new.
- **Files:** `apps/web/components/`.
- **Instructions:** Build an auto-resizing textarea with a maximum height, plus Send and Stop buttons. Add `Enter`, `Shift+Enter`, `Esc`, and `/`.
- **Acceptance:** Empty messages can't be sent, and Send becomes Stop while streaming.
- **Testing:** Tests cover each key and button state.

### P6-T8: Markdown rendering

- **Purpose:** Format assistant replies.
- **Prerequisites:** P6-T7.
- **Packages:** `react-markdown`, `remark-gfm`.
- **Files:** `apps/web/components/`.
- **Instructions:** Render assistant messages as Markdown and style each element with tokens. Don't enable raw HTML. Render links as plain text, so that invented links can't be clicked.
- **Acceptance:** Lists, tables, and code display correctly. HTML in a reply appears as harmless text.
- **Testing:** A test passes in `<script>` and `<img onerror>` text, and confirms no such element is created.

### P6-T9: Code highlighting

- **Purpose:** Make code blocks readable.
- **Prerequisites:** P6-T8.
- **Packages:** `shiki`.
- **Files:** `apps/web/components/`.
- **Instructions:** Build the code block with language label and Copy. Load Shiki on first use, and highlight only finished replies. Choose light and dark themes that meet the contrast rule.
- **Acceptance:** Code shows plain, then highlighted. An unknown language stays plain without an error. Code containing HTML appears as text.
- **Testing:** A test uses code containing `<script>`. Check the page's network requests with Wi-Fi off. Record the bundle-size change.

### P6-T10: Theme management

- **Purpose:** Let the user choose a theme.
- **Status:** Done early: `ThemeProvider` and `ThemeToggle` (System, Light, Dark) in `packages/ui`. Left: reload with no flash, checked by hand.
- **Prerequisites:** P6-T9.
- **Packages:** `next-themes`.
- **Files:** `apps/web/app/`, `packages/ui/src/`, `packages/ui/src/styles.css`.
- **Instructions:** Support System, Light, and Dark, with System as the default, and add a control to the header.
- **Acceptance:** The choice survives a reload, with no flash of the wrong theme.
- **Testing:** A test covers the control. Reload in each theme by hand.

### P6-T11: Streaming UI integration

- **Purpose:** Connect the UI to the real model.
- **Status:** Partly done early: `Toaster` and `toast` are installed and shown on the design page. Left: the API client, stream reader, and error states.
- **Prerequisites:** P6-T10, and the backend streaming API (P5-T11, P5-T12).
- **Packages:** `sonner`.
- **Files:** `apps/web/lib/`, `apps/web/components/`, `packages/ui/src/`, `apps/web/app/`, `apps/web/.env.example`.
- **Instructions:** Write the API client and stream reader. Read the API address from `NEXT_PUBLIC_API_URL` (see Configuration above). Handle the four stream events `start`, `delta`, `done`, and `error` described in [BACKEND.md](BACKEND.md#stream-events). Write the request and response types by hand in `apps/web/types` (no generator: `openapi-typescript` needs TypeScript 5 and this repo uses 7), then compare them once with the fields in the API's `/openapi.json`. Stream replies into the message list, with Stop aborting the request. Show errors as toasts and inline notices.
- **Acceptance:** A reply streams from the real backend, and Stop keeps the partial text. Errors for busy, no model, and server down are clear.
- **Testing:** Test the stream reader with events split across chunks. Try each error by hand.

### P6-T12: Conversation state

- **Purpose:** Show, reopen, and delete saved conversations.
- **Prerequisites:** P6-T11, and the conversation API (P5-T8, P5-T9).
- **Packages:** `@tanstack/react-query`.
- **Files:** `apps/web/app/`, `apps/web/components/`, `apps/web/components/`, `apps/web/lib/`.
- **Instructions:** Add the query provider. Connect New chat, the list, opening a chat, its messages, and delete to the API. Refresh the data after a reply finishes. Don't copy server data into another store.
- **Acceptance:** Conversations survive a reload and server restart. Follow-up replies use earlier messages. Delete asks for confirmation.
- **Testing:** Tests cover the list, delete, and loading states. Restart the API by hand.

### P6-T13: Settings interface

- **Purpose:** Let the user change theme and generation settings.
- **Prerequisites:** P6-T12, and the readiness and settings API (P5-T10, P5-T13).
- **Packages:** `zustand`, shadcn `dialog`.
- **Files:** `apps/web/components/`, `apps/web/stores/`, `packages/ui/src/`.
- **Instructions:** Build a dialog for temperature, top-k, top-p, and max reply length, with a reset. Read defaults and limits from `GET /api/v1/ready`, and send the values with each message.
- **Acceptance:** Settings survive a reload and reach the API. Out-of-range values can't be saved. Blocked storage doesn't break chat.
- **Testing:** Tests cover limits, reset, and blocked storage. Check a real request in browser dev tools.

### P6-T14: Responsive design

- **Purpose:** Work well on phones and desktops.
- **Prerequisites:** P6-T13.
- **Packages:** `motion`, only if CSS can't handle a needed transition.
- **Files:** `packages/ui/src/`, `apps/web/components/`.
- **Instructions:** Make the sidebar a slide-over panel on small screens, and keep the composer usable. Add subtle transitions under the DESIGN.md motion rules.
- **Acceptance:** No sideways scrolling at 375px. Motion is removed under `prefers-reduced-motion`.
- **Testing:** Check 375px, 768px, and 1280px in dev tools, with reduced motion both on and off.

### P6-T15: Accessibility

- **Purpose:** Make every action usable by keyboard and screen reader.
- **Prerequisites:** P6-T14.
- **Packages:** None new.
- **Files:** `apps/web/components/`, `apps/web/components/`.
- **Instructions:** Review labels, focus order, dialog focus trapping, live regions, and contrast against DESIGN.md. Fix what fails.
- **Acceptance:** A full chat, including settings and sidebar, works without a mouse.
- **Testing:** Do a keyboard-only run, and run the browser's accessibility checker. Report anything not checked.

### P6-T16: UI testing and final polish

- **Purpose:** Catch gaps before integration.
- **Prerequisites:** P6-T15.
- **Packages:** None new.
- **Files:** Existing files in `apps/web/` and `packages/ui/`, plus their tests.
- **Instructions:** Fill test gaps for critical behaviour, and make all loading, empty, and error states consistent. Remove unused components and packages.
- **Acceptance:** All tests pass, and every package in `package.json` is used.
- **Testing:** Run the full frontend checks, then walk through each state by hand.

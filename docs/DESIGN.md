# brainX: Design

The interface is a premium chat tool that combines **Minimalism, Neo-Brutalism, and developer-focused UI**: clear structure, strong type, bold lines, and little decoration. Phase 6 builds it, [FRONTEND.md](FRONTEND.md) describes implementation, and [QUALITY.md](QUALITY.md) describes visual, accessibility, and browser checks.

## Design-system architecture

The shared design system lives in `packages/ui`. It is the single visual source of truth for both `apps/web` and `apps/admin`; application features do not copy its components or redefine its tokens.

```text
packages/ui/src/styles.css       semantic colour, type, spacing, border, shadow tokens
packages/ui/src/*.tsx            reusable presentational components and variants
apps/web/components/             chat- and auth-specific composition
apps/admin/components/           admin-specific composition
```

| Rule | Reason |
|---|---|
| A token describes a purpose, not a page | `accent` keeps the same meaning in every screen and theme |
| A shared component owns its visual states | Two apps cannot accidentally create different focus, disabled, or dark-mode behaviour |
| Feature components compose shared primitives | Chat streaming, account forms, and API state stay outside the design system |
| New shared components use the generator and a visible example | Names, exports, styles, and accessibility stay consistent |
| No inline hex colours in feature components | Theme changes remain one-token changes |

## Colours

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#000000` | Page background |
| `fg` | `#000000` | `#FFFFFF` | Text and borders |
| `muted` | `#595959` | `#B3B3B3` | Secondary text |
| `accent` | `#0038FF` | `#FFE500` | Primary button and focus outline |
| `accent-fg` | `#FFFFFF` | `#000000` | Text on `accent` |
| `error` | `#B00020` | `#FF6B6B` | Error messages |

The theme defaults to the system setting, and the user can choose System, Light, or Dark. These values are implemented once, in `packages/ui/src/styles.css`, and both apps import that file.

Contrast against each theme's background was calculated: every colour is at least 6.9:1 (light `accent` is 6.98:1, and the others are 7.0:1 or more). All exceed the 4.5:1 WCAG AA minimum for normal text. Code themes get checked in P6-T9.

## Type, spacing, and shape

| Item | Rule |
|---|---|
| Fonts | Geist for UI and Geist Mono for code, loaded from local files so they work offline |
| Sizes | 14px small, 16px body, 20px section title, 28px page title |
| Weight | 400 for text, 700 for titles and buttons |
| Spacing | Multiples of 4px |
| Borders | Solid 2px `fg` |
| Corners | Square, 0 radius |
| Shadow | Only a hard offset on the primary button and dialogs: `4px 4px 0 fg` |
| Icons | Lucide, always with a text label or accessible name |
| Gradients and blur | None |

### Token usage

| Need | Use | Never do |
|---|---|---|
| Page surface | `bg` / `fg` | Hard-code a light-only background |
| Secondary text | `muted` | Use colour alone to communicate an error or state |
| Primary action and focus | `accent` + `accent-fg` | Use a second competing primary colour |
| Error | `error` plus a written explanation | Show only a red border or icon |
| Spacing | 4px scale | Add an arbitrary margin that breaks rhythm |

Component variants are intentionally limited: `default`, `secondary` where needed, `destructive` where an irreversible action needs it, plus `disabled`, `loading`, `focus-visible`, and theme states. A new variant needs a concrete screen and test, not only a future possibility.

## Motion

Motion should explain a change, and never decorate.

- Allowed: sidebar and dialog transitions, button press, the streaming cursor, and toasts.
- Keep transitions at 200ms or less.
- Text streaming must not shift the layout or jump the scroll position.
- Under `prefers-reduced-motion`, remove movement and the blinking cursor.

## Layout

```text
+--------------+---------------------------+
| brainX    [<]| Small model: answers can  |
| [+ New chat] | be wrong.    [Theme] [Set]|
|--------------|---------------------------|
| Rain chat    |  YOU                      |
| Story idea   |  What is rain?            |
|              |                           |
|              |  BRAINX             [Copy]|
|              |  Rain is water from       |
|              |  clouds._                 |
|              |---------------------------|
|              | [Type a message..] [Send] |
+--------------+---------------------------+
```

| Screen | Rule |
|---|---|
| 768px and wider | Sidebar is 280px and collapsible. Messages are up to 768px wide and centred |
| Below 768px | Sidebar becomes a slide-over panel. Margins are 16px, and the page must not scroll sideways |

## Components

| Component | States |
|---|---|
| Header | Includes the small-model notice, theme control, and settings |
| Sidebar | Open, collapsed, slide-over on mobile |
| New chat button | Default, hover, focus, disabled while streaming |
| Conversation list | Loading, empty, with items, selected item, delete confirmation |
| Message list | Empty, with messages, loading the first token |
| User message | Default |
| Assistant message | Streaming, complete, stopped, failed |
| Prompt composer | Empty, typing, disabled when no model is loaded |
| Send / Stop button | Send, disabled, Stop while streaming |
| Code block | Plain, highlighted, copied |
| Copy button | Default, copied |
| Settings dialog | Default, invalid value |
| Toast and error notice | Busy, no model, server unreachable, database unavailable, settings not saved |

**Empty state:** a short line saying "Ask something simple to begin."

**Loading:** show a plain "Generating..." line until the first token arrives. Don't use spinners or shimmer effects.

### Form and account states

| Component | Required states | Behaviour |
|---|---|---|
| Registration form | Empty, typing, invalid email, weak/invalid password, submitting, server error | Labels stay visible; field errors are connected to inputs; password never appears in a toast or log |
| Login form | Empty, invalid credentials, submitting, locked/rate-limited response | Use one generic invalid-credentials message so the UI does not reveal which account exists |
| Logout control | Default, submitting | Clear visible account state only after the server confirms logout |
| Protected chat route | Session loading, unauthenticated redirect, authenticated | Never briefly render another user's conversation while session state loads |
| Destructive delete | Default, confirmation, failure | Names the conversation being removed and remains keyboard accessible |

## Replies

- Assistant replies render as Markdown, including tables and code blocks. User messages stay plain text.
- Code blocks use a 2px border, Geist Mono, a language label, and Copy.
- Links render as plain text, because the model can invent addresses.
- Stopped replies keep their text and show a "Stopped" label.

## Accessibility

- Everything works by keyboard, with a visible 2px `accent` focus outline. [FRONTEND.md](FRONTEND.md#keyboard-shortcuts) lists the shortcuts.
- Dialogs and menus use Radix components, which handle focus and keyboard behaviour.
- Every input has a label, and icon-only buttons have accessible names.
- Errors use text as well as colour.
- Streaming text uses `aria-live="polite"`.

## Responsive and visual quality checks

Every user-facing page is reviewed at 375px, 768px, and 1280px in light and dark themes. The review checks no horizontal scroll, readable line length, visible focus, keyboard-only completion, error text, and reduced-motion behaviour.

The design system is tested in three layers:

1. **Component tests:** render state/variant combinations and keyboard interactions.
2. **Browser tests:** cover login, sidebar, composer, settings, stream/stop, and responsive navigation.
3. **Human visual review:** compare the live screen against this document before release.

Screenshots are evidence for layout only; they do not prove that buttons, focus handling, themes, or streaming behaviour work. Those need interactive tests. See [QUALITY.md](QUALITY.md#test-matrix).

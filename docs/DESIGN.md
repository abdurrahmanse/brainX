# brainX: Design

The interface is a premium chat tool that combines **Minimalism, Neo-Brutalism, and developer-focused UI**: clear structure, strong type, bold lines, and little decoration. Phase 6 builds it, and [FRONTEND.md](FRONTEND.md) has the tasks.

## Colours

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#000000` | Page background |
| `fg` | `#000000` | `#FFFFFF` | Text and borders |
| `muted` | `#595959` | `#B3B3B3` | Secondary text |
| `accent` | `#0038FF` | `#FFE500` | Primary button and focus outline |
| `accent-fg` | `#FFFFFF` | `#000000` | Text on `accent` |
| `error` | `#B00020` | `#FF6B6B` | Error messages |

The theme defaults to the system setting, and the user can choose System, Light, or Dark.

Each colour has at least 7:1 contrast against its background, by calculation. This exceeds the 4.5:1 WCAG AA minimum for normal text. Code themes get checked in P6-T9.

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

# brainX: Design

The interface is Minimalist + Neo-Brutalist: plain structure, strong type, black lines, and nothing decorative. Phase 6 builds it.

## Colours

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#000000` | Page background |
| `fg` | `#000000` | `#FFFFFF` | Text and borders |
| `muted` | `#595959` | `#B3B3B3` | Secondary text |
| `accent` | `#0038FF` | `#FFE500` | Primary button and focus outline |
| `error` | `#B00020` | `#FF6B6B` | Error messages |

The theme follows the system setting, with no toggle. Each colour has at least 7:1 contrast against its background (calculated, and above the 4.5:1 WCAG AA minimum for normal text).

## Type, spacing, and shape

| Item | Rule |
|---|---|
| Font | System monospace stack, with no downloaded fonts, so it works offline |
| Sizes | 14px small, 16px body, 24px heading |
| Weight | 400 for text, 700 for headings and buttons |
| Spacing | Multiples of 4px |
| Borders | Solid 2px `fg` |
| Corners | Square, 0 radius |
| Shadow | Only a hard offset on the primary button: `4px 4px 0 fg` |
| Icons | Text labels instead, such as `SEND` |
| Motion | Only a blinking cursor while streaming, removed under `prefers-reduced-motion` |

## Layout

```text
+------------------------------------------+
| brainX                 Small model:      |
|                        answers can be    |
|                        wrong.            |
+------------------------------------------+
|                                          |
|  YOU                                     |
|  What is rain?                           |
|                                          |
|  BRAINX                                  |
|  Rain is water from clouds._             |
|                                          |
+------------------------------------------+
| [ Type a message...           ] [ SEND ] |
+------------------------------------------+
```

The messages column is up to 768px wide and centred. On small screens it fills the width with a 16px margin, and the page must not scroll sideways.

## Components

| Component | States |
|---|---|
| Header | Includes the small-model notice |
| Message list | Empty, with messages, streaming |
| User message | Default |
| Assistant message | Streaming, complete, failed |
| Message box | Empty, typing, disabled while streaming |
| `SEND` button | Default, hover, focus, disabled |
| Error notice | Busy, no model, cannot reach server |

**Empty state:** a short line saying "Ask something simple to begin."

## Behaviour

- `Enter` sends the message, and `Shift+Enter` adds a new line.
- New text keeps the view scrolled to the bottom.
- Refreshing the page clears the conversation, because the MVP has no history.
- Replies are shown as plain text.

## Accessibility

- Everything works by keyboard, with a visible 2px `accent` focus outline.
- The message box has a label.
- Errors use text as well as colour.
- Streaming text uses `aria-live="polite"`.

import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about our own size and shadow names,
// otherwise it would treat "text-page" like a colour and drop it.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["page"] }],
      shadow: [{ shadow: ["hard", "hard-sm"] }],
    },
  },
});

/** Join class names. When two Tailwind classes clash, the later one wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

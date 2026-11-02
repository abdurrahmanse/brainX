"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "./button";

type Theme = "system" | "light" | "dark";

const order: Theme[] = ["system", "light", "dark"];
const labels: Record<Theme, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};
const icons: Record<Theme, LucideIcon> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

// The server does not know the saved theme, so we only trust it after mounting.
const subscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const current: Theme = mounted && theme ? (theme as Theme) : "system";
  const next = order[(order.indexOf(current) + 1) % order.length] ?? "system";
  const Icon = icons[current];

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${labels[current]}. Switch to ${labels[next]}.`}
    >
      <Icon size={16} aria-hidden="true" />
      <span className="hidden sm:inline">{labels[current]}</span>
    </Button>
  );
}

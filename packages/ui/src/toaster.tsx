"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

// Apps import both from here: <Toaster /> once in the layout, toast() anywhere.
export { toast } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-start gap-3 border-2 bg-bg p-4 text-fg shadow-hard",
          title: "font-bold",
          description: "text-sm text-muted",
        },
      }}
    />
  );
}

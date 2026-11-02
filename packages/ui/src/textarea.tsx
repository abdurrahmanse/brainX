import type { ComponentProps } from "react";
import { cn } from "./cn";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-20 w-full resize-y border-2 bg-bg px-3 py-2 text-base text-fg placeholder:text-muted disabled:opacity-50 aria-invalid:border-error",
        className,
      )}
      {...props}
    />
  );
}

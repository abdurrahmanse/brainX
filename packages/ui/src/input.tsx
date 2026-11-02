import type { ComponentProps } from "react";
import { cn } from "./cn";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full border-2 bg-bg px-3 text-base text-fg placeholder:text-muted disabled:opacity-50 aria-invalid:border-error",
        className,
      )}
      {...props}
    />
  );
}

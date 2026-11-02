import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "./cn";

const badgeStyles = cva(
  "inline-flex h-6 items-center border-2 px-2 text-sm font-bold uppercase",
  {
    variants: {
      variant: {
        default: "border-fg bg-bg text-fg",
        accent: "border-fg bg-accent text-accent-fg",
        muted: "border-muted bg-bg text-muted",
        error: "border-error bg-bg text-error",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeStyles>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ variant }), className)} {...props} />;
}

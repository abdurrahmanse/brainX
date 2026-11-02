import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "./cn";

// All the looks a button can have. Change a look here, it changes everywhere.
export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 border-2 font-bold whitespace-nowrap select-none transition-transform disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      variant: {
        primary:
          "border-fg bg-accent text-accent-fg shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-hard-sm active:translate-x-1 active:translate-y-1 active:shadow-none",
        secondary: "border-fg bg-bg text-fg hover:bg-fg hover:text-bg",
        ghost: "border-transparent bg-transparent text-fg hover:border-fg",
        danger: "border-error bg-bg text-error hover:bg-error hover:text-bg",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonStyles> & {
    /** Render the child element (for example a link) with button styles. */
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";
  return (
    <Component
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}

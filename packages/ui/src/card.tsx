import type { ComponentProps } from "react";
import { cn } from "./cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("border-2 bg-bg", className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("border-b-2 p-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("text-xl font-bold", className)} {...props} />;
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-4", className)} {...props} />;
}

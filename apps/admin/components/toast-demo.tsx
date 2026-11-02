"use client";

import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/toaster";

// Small client component so the design page can show a real toast.
export function ToastDemo() {
  return (
    <Button
      variant="secondary"
      onClick={() => toast("This is a toast", { description: "Used for short messages." })}
    >
      Show a toast
    </Button>
  );
}

"use client";

import { Button } from "@repo/ui/button";
import { Textarea } from "@repo/ui/textarea";
import { toast } from "@repo/ui/toaster";
import { SendHorizontal } from "@repo/ui/icons";
import type { FormEvent } from "react";

// A static preview of the chat screen. It is not connected to the model yet.
export function ChatPreview() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast("Preview only", {
      description: "The chat is not connected to the model yet.",
    });
  }

  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4">
      <div className="flex flex-1 flex-col gap-8 py-8">
        <div>
          <h1 className="text-page font-bold">Ask something simple to begin.</h1>
          <p className="mt-1 text-muted">Sample conversation below (not real).</p>
        </div>

        <section aria-label="Sample conversation" className="flex flex-col gap-6">
          <article>
            <p className="text-sm font-bold text-muted uppercase">You</p>
            <p className="mt-1">What is rain?</p>
          </article>

          <article>
            <p className="text-sm font-bold text-muted uppercase">brainX</p>
            <p className="mt-1">
              Rain is water that falls from clouds.
              <span className="animate-blink ml-0.5" aria-hidden="true">
                ▍
              </span>
            </p>
          </article>
        </section>
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 flex gap-2 border-t-2 bg-bg py-4"
      >
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <Textarea id="message" rows={2} placeholder="Type a message..." />
        <Button type="submit" className="self-end">
          <SendHorizontal size={16} aria-hidden="true" />
          Send
        </Button>
      </form>
    </div>
  );
}

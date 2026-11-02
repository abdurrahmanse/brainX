"use client";

import { Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState, type MouseEvent, type ReactNode } from "react";
import { Button } from "./button";
import { ThemeToggle } from "./theme-toggle";

type AppShellProps = {
  /** Name shown in the header, for example "brainX". */
  title: string;
  /** Short note shown next to the title (always visible). */
  notice?: string;
  /** The sidebar content: a fixed column on desktop, a slide-over menu on mobile. */
  sidebar: ReactNode;
  children: ReactNode;
};

// The page frame used by both apps: header, sidebar and main area.
export function AppShell({ title, notice, sidebar, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu when a link or button inside it is clicked.
  function closeOnClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a, button")) setMenuOpen(false);
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b-2 px-4">
        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu size={16} aria-hidden="true" />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-fg/50" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r-2 bg-bg shadow-hard">
              <div className="flex h-14 shrink-0 items-center justify-between border-b-2 px-4">
                <Dialog.Title className="text-xl font-bold">{title}</Dialog.Title>
                <Dialog.Close asChild>
                  <Button variant="secondary" size="sm" aria-label="Close menu">
                    <X size={16} aria-hidden="true" />
                  </Button>
                </Dialog.Close>
              </div>
              <Dialog.Description className="sr-only">
                Navigation menu
              </Dialog.Description>
              <div className="min-h-0 flex-1 overflow-y-auto" onClick={closeOnClick}>
                {sidebar}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <span className="text-xl font-bold">{title}</span>
        {notice ? (
          <p className="hidden truncate text-sm text-muted sm:block">{notice}</p>
        ) : null}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      {/* On small screens the notice moves under the header so it never disappears. */}
      {notice ? (
        <p className="shrink-0 border-b-2 px-4 py-1 text-sm text-muted sm:hidden">
          {notice}
        </p>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r-2 md:block">
          {sidebar}
        </aside>
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

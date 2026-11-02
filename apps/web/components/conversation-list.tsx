import { Button } from "@repo/ui/button";
import { Plus } from "@repo/ui/icons";

// Sample titles for the design preview. Real history comes later (Phase 6).
const sampleChats = ["What is rain?", "Tell me a short story", "Explain gravity simply"];

export function ConversationList() {
  return (
    <nav aria-label="Conversations" className="flex flex-col gap-4 p-4">
      <Button className="w-full">
        <Plus size={16} aria-hidden="true" />
        New chat
      </Button>

      <p className="text-sm font-bold text-muted uppercase">Sample history</p>

      <ul className="flex flex-col gap-1">
        {sampleChats.map((title, index) => (
          <li key={title}>
            <a
              href="#"
              aria-current={index === 0 ? "page" : undefined}
              className="block truncate border-2 border-transparent px-3 py-2 hover:border-fg aria-[current=page]:bg-fg aria-[current=page]:text-bg"
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

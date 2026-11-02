import { AppShell } from "@repo/ui/app-shell";
import { ChatPreview } from "../components/chat-preview";
import { ConversationList } from "../components/conversation-list";

export default function Home() {
  return (
    <AppShell
      title="brainX"
      notice="Small model: answers can be wrong."
      sidebar={<ConversationList />}
    >
      <ChatPreview />
    </AppShell>
  );
}

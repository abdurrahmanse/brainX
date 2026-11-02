import { AppShell } from "@repo/ui/app-shell";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { AdminNav } from "../../components/admin-nav";
import { ToastDemo } from "../../components/toast-demo";

// The colour names from the design system. The swatch class draws each colour.
const colours = [
  { name: "bg", swatch: "bg-bg" },
  { name: "fg", swatch: "bg-fg" },
  { name: "muted", swatch: "bg-muted" },
  { name: "accent", swatch: "bg-accent" },
  { name: "accent-fg", swatch: "bg-accent-fg" },
  { name: "error", swatch: "bg-error" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignSystem() {
  return (
    <AppShell
      title="brainX Admin"
      notice="Design system preview: every part is shared with the web app."
      sidebar={<AdminNav />}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10 p-4 md:p-8">
        <div>
          <h1 className="text-page font-bold">Design system</h1>
          <p className="mt-1 text-muted">
            Colours, type and components from <code className="font-mono">@repo/ui</code>.
            Switch the theme in the header to see both.
          </p>
        </div>

        <Section title="Colours">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {colours.map(({ name, swatch }) => (
              <div key={name}>
                <div className={`h-16 border-2 ${swatch}`} />
                <p className="mt-1 font-mono text-sm">{name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type">
          <p className="text-page font-bold">Page title, 28px</p>
          <p className="text-xl font-bold">Section title, 20px</p>
          <p>Body text, 16px. Geist is the font.</p>
          <p className="text-sm text-muted">Small text, 14px, in the muted colour.</p>
          <p className="font-mono text-sm">Code looks like this (Geist Mono)</p>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Text input" aria-label="Text input" />
            <Input placeholder="Invalid input" aria-label="Invalid input" aria-invalid="true" />
          </div>
          <Textarea placeholder="Textarea" aria-label="Textarea" rows={3} />
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="muted">Muted</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </Section>

        <Section title="Card, notices and toast">
          <Card>
            <CardHeader>
              <CardTitle>A card</CardTitle>
            </CardHeader>
            <CardBody>Cards group related things with a 2px border and square corners.</CardBody>
          </Card>
          <div role="alert" className="border-2 border-error p-4 text-error">
            <p className="font-bold">The model is busy.</p>
            <p className="text-sm">Wait for the current reply to finish, then try again.</p>
          </div>
          <div>
            <ToastDemo />
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

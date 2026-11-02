import { AppShell } from "@repo/ui/app-shell";
import { Badge } from "@repo/ui/badge";
import { Card, CardBody, CardHeader, CardTitle } from "@repo/ui/card";
import { AdminNav } from "../components/admin-nav";

// Placeholder status cards. Each one will show real data once its part exists.
const parts = [
  { name: "Model", status: "Not trained yet" },
  { name: "API", status: "Not built yet" },
  { name: "Database", status: "Not set up yet" },
  { name: "Training runs", status: "None yet" },
];

export default function Overview() {
  return (
    <AppShell
      title="brainX Admin"
      notice="Admin preview: nothing here is connected yet."
      sidebar={<AdminNav />}
    >
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <h1 className="text-page font-bold">Overview</h1>
        <p className="mt-1 text-muted">The state of each part of the project.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {parts.map(({ name, status }) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle>{name}</CardTitle>
              </CardHeader>
              <CardBody>
                <Badge variant="muted">{status}</Badge>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

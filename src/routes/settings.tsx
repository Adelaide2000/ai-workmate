import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/tool-shell";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workly AI" },
      { name: "description", content: "App info and responsible AI notice." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <ToolShell title="Settings" description="About Workly AI and responsible use.">
      <div className="space-y-6">
        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Workly AI is an AI-powered productivity suite. All AI features are powered by
            Lovable AI. No account required — outputs are generated per request and are not
            stored.
          </p>
        </section>
        <section className="rounded-lg border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Responsible AI</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                AI-generated content may contain mistakes or incomplete information. Review all
                outputs before using them for professional or business purposes. Do not share
                personal or confidential information with AI systems unless permitted by your
                organization's policies.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ToolShell>
  );
}

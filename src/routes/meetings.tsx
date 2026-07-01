import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
import { ToolShell } from "@/components/tool-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workly AI" },
      { name: "description", content: "Turn raw meeting notes into decisions and action items." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!notes.trim()) return toast.error("Paste meeting notes first");
    setLoading(true);
    try {
      const res = await fn({ data: { notes } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="Meeting Notes Summarizer"
      description="Extract key points, decisions, action items, and deadlines."
      accent="meetings"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-card p-5">
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your raw notes or transcript here…"
              rows={16}
              maxLength={20000}
            />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Summarizing…" : "Summarize"}
          </Button>
        </div>
        <AIOutput
          value={output}
          onChange={setOutput}
          onRegenerate={submit}
          loading={loading}
          placeholder="Your structured summary will appear here…"
          minRows={20}
        />
      </div>
    </ToolShell>
  );
}

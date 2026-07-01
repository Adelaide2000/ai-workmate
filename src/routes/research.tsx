import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { research } from "@/lib/ai.functions";
import { ToolShell } from "@/components/tool-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Workly AI" },
      { name: "description", content: "Summarize topics with insights, risks, and recommendations." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(research);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!topic.trim()) return toast.error("Enter a topic or paste an article");
    setLoading(true);
    try {
      const res = await fn({ data: { topic } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="Research Assistant"
      description="Summarize a topic or article with facts, benefits, risks, and recommendations."
      accent="research"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-card p-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or article</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 'AI in supply chain management' or paste an article…"
              rows={16}
              maxLength={20000}
            />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Researching…" : "Research"}
          </Button>
        </div>
        <AIOutput
          value={output}
          onChange={setOutput}
          onRegenerate={submit}
          loading={loading}
          placeholder="Your research briefing will appear here…"
          minRows={20}
        />
      </div>
    </ToolShell>
  );
}

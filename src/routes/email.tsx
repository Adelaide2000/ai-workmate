import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
import { ToolShell } from "@/components/tool-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — Workly AI" },
      { name: "description", content: "Generate professional emails with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<"Formal" | "Friendly" | "Persuasive">("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!recipient || !subject || !purpose) {
      toast.error("Fill in recipient, subject, and purpose");
      return;
    }
    setLoading(true);
    try {
      const res = await fn({ data: { recipient, subject, purpose, tone } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="Smart Email Generator"
      description="Draft professional emails in the tone you need."
      accent="email"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-card p-5">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Sarah, Head of Marketing"
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Q3 campaign kickoff"
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="What do you want to say? Include any key points."
              rows={5}
              maxLength={2000}
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={submit} disabled={loading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </div>
        <AIOutput
          value={output}
          onChange={setOutput}
          onRegenerate={submit}
          loading={loading}
          placeholder="Your generated email will appear here…"
        />
      </div>
    </ToolShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { planTasks } from "@/lib/ai.functions";
import { ToolShell } from "@/components/tool-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner — Workly AI" },
      { name: "description", content: "Turn a task list into a productive daily schedule." },
    ],
  }),
  component: TasksPage,
});

type Task = { title: string; due: string; priority: "Low" | "Medium" | "High" };
const empty: Task = { title: "", due: "", priority: "Medium" };

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState<Task[]>([{ ...empty }, { ...empty }, { ...empty }]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (i: number, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  const submit = async () => {
    const filled = tasks.filter((t) => t.title.trim());
    if (filled.length === 0) return toast.error("Add at least one task");
    setLoading(true);
    try {
      const res = await fn({ data: { tasks: filled } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="AI Task Planner"
      description="Organize tasks into a balanced daily schedule."
      accent="tasks"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-card p-5">
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 px-1 text-xs font-medium text-muted-foreground">
              <Label className="col-span-6">Task</Label>
              <Label className="col-span-3">Due</Label>
              <Label className="col-span-3">Priority</Label>
            </div>
            {tasks.map((t, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2">
                <Input
                  className="col-span-6"
                  value={t.title}
                  onChange={(e) => update(i, { title: e.target.value })}
                  placeholder="e.g. Finish quarterly report"
                />
                <Input
                  className="col-span-3"
                  value={t.due}
                  onChange={(e) => update(i, { due: e.target.value })}
                  placeholder="Today 5pm"
                />
                <div className="col-span-2">
                  <Select
                    value={t.priority}
                    onValueChange={(v) => update(i, { priority: v as Task["priority"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Med</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="col-span-1"
                  onClick={() => setTasks((p) => p.filter((_, idx) => idx !== i))}
                  aria-label="Remove task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setTasks((p) => [...p, { ...empty }])}
              className="flex-1"
            >
              <Plus className="mr-2 h-4 w-4" /> Add task
            </Button>
            <Button onClick={submit} disabled={loading} className="flex-1">
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Planning…" : "Plan my day"}
            </Button>
          </div>
        </div>
        <AIOutput
          value={output}
          onChange={setOutput}
          onRegenerate={submit}
          loading={loading}
          placeholder="Your daily schedule will appear here…"
        />
      </div>
    </ToolShell>
  );
}

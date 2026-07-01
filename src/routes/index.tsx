import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, BookOpen, MessageSquare, ArrowRight } from "lucide-react";
import { ToolShell } from "@/components/tool-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workly AI" },
      { name: "description", content: "Your AI workplace productivity suite." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    desc: "Draft professional emails in any tone.",
    to: "/email" as const,
    icon: Mail,
    accent: "bg-tool-email/15 text-tool-email",
  },
  {
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into decisions and actions.",
    to: "/meetings" as const,
    icon: FileText,
    accent: "bg-tool-meetings/15 text-tool-meetings",
  },
  {
    title: "AI Task Planner",
    desc: "Build a balanced daily schedule.",
    to: "/tasks" as const,
    icon: ListTodo,
    accent: "bg-tool-tasks/15 text-tool-tasks",
  },
  {
    title: "Research Assistant",
    desc: "Summarize topics with insights & risks.",
    to: "/research" as const,
    icon: BookOpen,
    accent: "bg-tool-research/15 text-tool-research",
  },
  {
    title: "AI Chat",
    desc: "Ask anything, workplace-focused.",
    to: "/chat" as const,
    icon: MessageSquare,
    accent: "bg-tool-chat/15 text-tool-chat",
  },
];

function Dashboard() {
  return (
    <ToolShell
      title="Welcome to Workly AI"
      description="A suite of AI tools to help you write, plan, and think faster."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group rounded-xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
          >
            <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${t.accent}`}>
              <t.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-70 transition-opacity group-hover:opacity-100">
              Open <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </ToolShell>
  );
}

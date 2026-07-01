import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  accent?: "email" | "meetings" | "tasks" | "research" | "chat";
  children: ReactNode;
};

const accentMap = {
  email: "bg-tool-email",
  meetings: "bg-tool-meetings",
  tasks: "bg-tool-tasks",
  research: "bg-tool-research",
  chat: "bg-tool-chat",
} as const;

export function ToolShell({ title, description, accent, children }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-start gap-3">
        {accent && (
          <span
            className={`mt-1.5 inline-block h-8 w-1 rounded-full ${accentMap[accent]}`}
            aria-hidden
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
      <p className="mt-8 text-xs text-muted-foreground">
        AI-generated content may be inaccurate. Review before use. Do not share confidential
        information unless permitted by your organization.
      </p>
    </div>
  );
}

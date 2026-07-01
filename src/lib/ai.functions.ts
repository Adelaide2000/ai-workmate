import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "./ai-gateway.server";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(DEFAULT_MODEL);
}

async function runPrompt(system: string, prompt: string) {
  const { text } = await generateText({
    model: getModel(),
    system,
    prompt,
  });
  return { text };
}

const EmailInput = z.object({
  recipient: z.string().min(1).max(200),
  subject: z.string().min(1).max(200),
  purpose: z.string().min(1).max(2000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are a professional email writer. Return only the email text (no code fences, no commentary). Include greeting, body, and professional closing.";
    const prompt = `Write a ${data.tone.toLowerCase()} email to ${data.recipient}.
Subject: ${data.subject}
Purpose: ${data.purpose}`;
    return runPrompt(system, prompt);
  });

const NotesInput = z.object({ notes: z.string().min(1).max(20000) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You summarize meeting notes into clear, actionable markdown. Use these exact H2 sections: '## Key Discussion Points', '## Decisions Made', '## Action Items', '## Deadlines'. Use bullet lists. Be concise.";
    return runPrompt(system, data.notes);
  });

const Task = z.object({
  title: z.string().min(1).max(200),
  due: z.string().max(100).optional().default(""),
  priority: z.enum(["Low", "Medium", "High"]),
});
const TasksInput = z.object({ tasks: z.array(Task).min(1).max(30) });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TasksInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are a productivity coach. Organize the given tasks into a realistic single-day schedule from 9:00 to 18:00. Prioritize High priority and time-sensitive items, batch similar work, include short breaks. Output markdown with a time-blocked list like '- **9:00** – Task (priority)'. Add a brief 2-sentence rationale at the end.";
    const list = data.tasks
      .map((t, i) => `${i + 1}. ${t.title} — due: ${t.due || "n/a"} — priority: ${t.priority}`)
      .join("\n");
    return runPrompt(system, list);
  });

const ResearchInput = z.object({ topic: z.string().min(1).max(20000) });

export const research = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are a research assistant. Explain the given topic or article in plain language. Use these exact H2 sections: '## Summary', '## Key Insights', '## Benefits', '## Risks', '## Recommendations'. Be factual and concise; use bullet lists where appropriate.";
    return runPrompt(system, data.topic);
  });

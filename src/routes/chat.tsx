import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { ToolShell } from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, User } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Workly AI" },
      { name: "description", content: "Chat with your workplace AI assistant." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = () => {
    const t = input.trim();
    if (!t || busy) return;
    setInput("");
    void sendMessage({ text: t });
  };

  return (
    <ToolShell
      title="AI Chat"
      description="Ask anything — writing help, explanations, planning, summaries."
      accent="chat"
    >
      <div className="flex h-[calc(100vh-16rem)] min-h-[420px] flex-col rounded-lg border bg-card">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <Sparkles className="mb-2 h-8 w-8 text-tool-chat" />
              <p>Start a conversation. Try:</p>
              <ul className="mt-2 space-y-1">
                <li>"Write a follow-up email after a sales call"</li>
                <li>"Explain OKRs in simple terms"</li>
                <li>"Summarize this paragraph: …"</li>
              </ul>
            </div>
          )}
          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isUser ? "bg-primary text-primary-foreground" : "bg-tool-chat/15 text-tool-chat"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                    isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{text}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{text || "…"}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Type a message… (Shift+Enter for newline)"
              rows={2}
              className="resize-none"
              disabled={busy}
            />
            <Button onClick={submit} disabled={busy || !input.trim()} size="lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

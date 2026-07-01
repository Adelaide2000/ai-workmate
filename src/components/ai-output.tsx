import { Copy, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onRegenerate?: () => void;
  loading?: boolean;
  placeholder?: string;
  minRows?: number;
};

export function AIOutput({
  value,
  onChange,
  onRegenerate,
  loading,
  placeholder = "AI output will appear here…",
  minRows = 14,
}: Props) {
  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" />
          Result
        </div>
        <div className="flex gap-1">
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={loading || !value}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={copy} disabled={!value}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {loading && !value ? (
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating…
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-0 flex-1 resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0"
          style={{ minHeight: `${minRows * 1.5}rem` }}
        />
      )}
    </div>
  );
}

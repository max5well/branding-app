"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Wand2, Loader2 } from "lucide-react";

interface AiGenerateButtonProps {
  onGenerate: () => Promise<string>;
  onResult: (result: string) => void;
  tooltip?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function AiGenerateButton({
  onGenerate,
  onResult,
  tooltip = "AI Generate",
  className,
  size = "sm",
}: AiGenerateButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const result = await onGenerate();
      onResult(result);
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      title={tooltip}
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-all",
        "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
        size === "sm" && "w-7 h-7",
        size === "md" && "gap-1.5 px-3 h-8 text-xs font-medium",
        loading && "opacity-60 cursor-wait",
        className,
      )}
    >
      {loading ? (
        <Loader2
          className={cn(
            "animate-spin",
            size === "sm" ? "w-3.5 h-3.5" : "w-3 h-3",
          )}
        />
      ) : (
        <Wand2 className={cn(size === "sm" ? "w-3.5 h-3.5" : "w-3 h-3")} />
      )}
      {size === "md" && (loading ? "Generating..." : tooltip)}
    </button>
  );
}

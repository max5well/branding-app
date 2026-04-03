"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  suggestions?: string[];
  className?: string;
}

export default function TagInput({
  tags,
  onChange,
  placeholder = "Type and press Enter...",
  max = 10,
  suggestions = [],
  className,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < max) {
      onChange([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase()),
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-1.5 p-2 min-h-[42px] rounded-lg border border-border/50 bg-card/50 focus-within:border-primary/50 transition-colors">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-sm"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-primary/70 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length < max && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
          />
        )}
      </div>
      {input && filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filteredSuggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              onClick={() => addTag(s)}
              className="px-2 py-0.5 rounded text-xs bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {max < 100 && (
        <p className="text-xs text-muted-foreground">
          {tags.length}/{max}
        </p>
      )}
    </div>
  );
}

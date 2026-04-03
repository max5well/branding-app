"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max?: number;
  allowCustom?: boolean;
}

export default function ChipSelector({
  options,
  selected,
  onChange,
  max = 3,
  allowCustom = false,
}: ChipSelectorProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else if (selected.length < max) {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <motion.button
              key={option}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(option)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
                !isSelected &&
                  selected.length >= max &&
                  "opacity-40 cursor-not-allowed",
              )}
              disabled={!isSelected && selected.length >= max}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
      {allowCustom && (
        <div className="mt-3">
          <input
            type="text"
            placeholder="Type a custom option and press Enter..."
            className="w-full bg-transparent border border-border/50 rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value.trim();
                if (
                  value &&
                  !selected.includes(value) &&
                  selected.length < max
                ) {
                  onChange([...selected, value]);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        {selected.length}/{max} selected
      </p>
    </div>
  );
}

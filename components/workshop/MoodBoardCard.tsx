"use client";

import { MoodBoard } from "@/lib/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface MoodBoardCardProps {
  board: MoodBoard;
  isSelected: boolean;
  onSelect: () => void;
}

export default function MoodBoardCard({
  board,
  isSelected,
  onSelect,
}: MoodBoardCardProps) {
  const primaryColor =
    board.colors.find((c) => c.usage === "primary")?.hex ||
    board.colors[0]?.hex ||
    "#666";
  const bgColor =
    board.colors.find((c) => c.usage === "background")?.hex ||
    board.colors[board.colors.length - 1]?.hex ||
    "#1a1a1a";
  const textColor =
    board.colors.find((c) => c.usage === "text")?.hex ||
    board.colors[0]?.hex ||
    "#fff";
  const accentColor =
    board.colors.find((c) => c.usage === "accent")?.hex ||
    board.colors[2]?.hex ||
    "#888";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300",
        isSelected
          ? "border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/10"
          : "border-border/50 hover:border-border",
      )}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      {/* Preview section styled in the mood board's own style */}
      <div
        className="p-8 relative overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <div className="relative z-10">
          <h3
            className="text-2xl font-bold mb-1"
            style={{
              color: primaryColor,
              fontFamily: `"${board.primaryFont}", sans-serif`,
            }}
          >
            {board.name}
          </h3>
          <p
            className="text-sm opacity-80 max-w-lg"
            style={{
              color: textColor,
              fontFamily: `"${board.secondaryFont}", sans-serif`,
            }}
          >
            {board.description}
          </p>
        </div>

        {/* Decorative shapes */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full opacity-15"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      {/* Details section */}
      <div className="p-6 space-y-5 bg-card/80">
        {/* Color palette */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Color Palette
          </h4>
          <div className="flex gap-2">
            {board.colors.map((color) => (
              <div key={color.hex} className="flex-1 group">
                <div
                  className="h-12 rounded-lg mb-1.5 ring-1 ring-white/10 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-[10px] text-muted-foreground truncate">
                  {color.name}
                </p>
                <p className="text-[10px] text-muted-foreground/60 font-mono">
                  {color.hex}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Typography
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground mb-1">Headings</p>
              <p
                className="text-lg font-bold"
                style={{ fontFamily: `"${board.primaryFont}", sans-serif` }}
              >
                {board.primaryFont}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground mb-1">Body</p>
              <p
                className="text-lg"
                style={{ fontFamily: `"${board.secondaryFont}", sans-serif` }}
              >
                {board.secondaryFont}
              </p>
            </div>
          </div>
        </div>

        {/* Visual keywords & details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Visual Keywords
            </h4>
            <div className="flex flex-wrap gap-1">
              {board.visualKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-full text-xs bg-muted/50 text-muted-foreground"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Shape Language
            </h4>
            <p className="text-xs text-muted-foreground">
              {board.shapeLanguage}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Logo Direction
            </h4>
            <p className="text-xs text-muted-foreground">
              {board.logoDirection}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Image Style
            </h4>
            <p className="text-xs text-muted-foreground">{board.imageStyle}</p>
          </div>
        </div>

        {/* Select button */}
        <button
          className={cn(
            "w-full py-2.5 rounded-lg text-sm font-medium transition-all",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {isSelected ? "Selected" : "Select This Direction"}
        </button>
      </div>
    </motion.div>
  );
}

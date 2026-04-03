"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBrandStore } from "@/lib/store";
import { generateMoodBoardPhase1, generateMoodBoardPhase2 } from "@/lib/ai";
import type { MoodBoardPhase1Option, MoodBoardPhase2Result, MoodBoardGenImage } from "@/lib/ai";
import PhaseHeader from "@/components/workshop/PhaseHeader";
import NavigationButtons from "@/components/workshop/NavigationButtons";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCw, ImageIcon, AlertCircle, Info, Check } from "lucide-react";
import type { GeneratedMoodBoard } from "@/lib/types";

function isImageResult(r: MoodBoardGenImage | { error: string }): r is MoodBoardGenImage {
  return "imageBase64" in r && !("error" in r);
}

function extractReasoning(text: string): string[] {
  const lines = text
    .split("\n")
    .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("•") || l.trim().startsWith("*"))
    .map((l) => l.replace(/^[\s\-•*]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
  return lines.length > 0 ? lines : ["AI-generated design choice"];
}

// ─── Reasoning Tooltip ───

function ReasoningTooltip({ reasoning }: { reasoning: string[] }) {
  const [showTooltip, setShowTooltip] = useState(false);
  if (!reasoning || reasoning.length === 0) return null;
  return (
    <div
      className="absolute top-2 right-2 z-10 opacity-0 group-hover/cell:opacity-100 transition-opacity"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
        <Info className="w-3.5 h-3.5 text-white" />
      </div>
      {showTooltip && (
        <div className="absolute top-8 right-0 w-64 p-3 rounded-lg bg-gray-900 text-white text-xs shadow-xl z-20">
          {reasoning.map((r, i) => (
            <p key={i} className="leading-relaxed mb-1 last:mb-0">• {r}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mood Board Card (masonry render for one option) ───

function MoodBoardPreview({
  board,
  project,
  isSelected,
  onSelect,
  generating,
}: {
  board: GeneratedMoodBoard;
  project: { strategy: { brand: { name: string; description: string; mission: string; vision: string } }; creativeBrief: { famousFor: string } };
  isSelected: boolean;
  onSelect: () => void;
  generating: boolean;
}) {
  const brand = project.strategy.brand;

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden bg-[#F8F7F4] transition-all cursor-pointer ${
        isSelected ? "border-primary shadow-lg" : "border-border/50 hover:border-border"
      }`}
      onClick={onSelect}
    >
      {/* Selection header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-border/30">
        <span className="text-sm font-semibold">{board.id.replace("option-", "Option ")}</span>
        <div className="flex items-center gap-2">
          {generating && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Generating images...
            </span>
          )}
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected
                ? "border-primary bg-primary text-white"
                : "border-gray-300"
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>

      <div className="p-4" style={{ columns: 3, columnGap: "12px" }}>
        {/* Logo */}
        <div
          className="break-inside-avoid mb-3 rounded-xl overflow-hidden relative group/cell"
          style={{ background: board.colors[3]?.hex || "#1A1A3E" }}
        >
          <ReasoningTooltip reasoning={board.logoReasoning} />
          <div className="p-8 flex flex-col items-center justify-center">
            {board.logoBase64 ? (
              <img
                src={`data:${board.logoMimeType};base64,${board.logoBase64}`}
                alt="Brand Logo"
                className="max-w-[120px] max-h-[70px] object-contain"
              />
            ) : (
              <div className="w-[120px] h-[70px] rounded-lg border-2 border-white/20 flex items-center justify-center text-white/30 text-xs">
                <Loader2 className="w-5 h-5 animate-spin text-white/40" />
              </div>
            )}
            <span className="mt-2 text-[9px] uppercase tracking-[3px] text-white/40">Logo</span>
          </div>
        </div>

        {/* Mood Image 1 (tall) */}
        <div className="break-inside-avoid mb-3 rounded-xl overflow-hidden relative group/cell" style={{ minHeight: 240 }}>
          <ReasoningTooltip reasoning={board.moodImage1Reasoning} />
          {board.moodImage1Base64 ? (
            <img
              src={`data:${board.moodImage1MimeType};base64,${board.moodImage1Base64}`}
              alt="Mood atmosphere"
              className="w-full h-full object-cover"
              style={{ minHeight: 240 }}
            />
          ) : (
            <div
              className="w-full flex items-center justify-center text-xs text-white/40"
              style={{ minHeight: 240, background: `linear-gradient(180deg, ${board.colors[1]?.hex || "#E2D9C8"}, ${board.colors[0]?.hex || "#c4b8a4"})` }}
            >
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
        </div>

        {/* Brand Message 1 */}
        <div
          className="break-inside-avoid mb-3 rounded-xl overflow-hidden"
          style={{ background: board.colors[3]?.hex || "#1A1A3E" }}
        >
          <div className="p-5">
            <h2
              className="text-lg font-normal leading-snug text-white mb-2"
              style={{ fontFamily: `'${board.headingFont}', serif` }}
            >
              {brand.mission || brand.description || "Brand message"}
            </h2>
            <p className="text-[11px] leading-relaxed text-white/50">
              {brand.description || ""}
            </p>
          </div>
        </div>

        {/* Colors */}
        <div className="break-inside-avoid mb-3 rounded-xl overflow-hidden relative group/cell" style={{ minHeight: 140 }}>
          <ReasoningTooltip reasoning={board.colorsReasoning} />
          <div className="grid grid-cols-2 grid-rows-2 h-full" style={{ minHeight: 140 }}>
            {board.colors.map((c, i) => {
              const isLight = parseInt(c.hex.slice(1), 16) > 0x888888;
              return (
                <div
                  key={i}
                  className="p-2.5 flex flex-col justify-end"
                  style={{
                    backgroundColor: c.hex,
                    borderRadius:
                      i === 0 ? "12px 0 0 0" : i === 1 ? "0 12px 0 0" : i === 2 ? "0 0 0 12px" : "0 0 12px 0",
                  }}
                >
                  <span className={`text-[9px] font-semibold uppercase tracking-wider ${isLight ? "text-black/50" : "text-white/80"}`}>
                    {c.name}
                  </span>
                  <span className={`text-[9px] font-mono ${isLight ? "text-black/35" : "text-white/60"}`}>
                    {c.hex}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mood Image 2 */}
        <div className="break-inside-avoid mb-3 rounded-xl overflow-hidden relative group/cell" style={{ minHeight: 160 }}>
          <ReasoningTooltip reasoning={board.moodImage2Reasoning} />
          {board.moodImage2Base64 ? (
            <img
              src={`data:${board.moodImage2MimeType};base64,${board.moodImage2Base64}`}
              alt="Mood product"
              className="w-full h-full object-cover"
              style={{ minHeight: 160 }}
            />
          ) : (
            <div
              className="w-full flex items-center justify-center text-xs text-white/40"
              style={{ minHeight: 160, background: `linear-gradient(135deg, ${board.colors[3]?.hex || "#1A1A3E"}, ${board.colors[2]?.hex || "#2a2a5e"})` }}
            >
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
        </div>

        {/* Iconography */}
        <div
          className="break-inside-avoid mb-3 rounded-xl overflow-hidden relative group/cell"
          style={{ background: board.colors[1]?.hex || "#E2D9C8" }}
        >
          <ReasoningTooltip reasoning={board.iconsReasoning} />
          <div className="p-5 flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-[3px] text-black/40 mb-2">Icons</span>
            {board.iconsBase64 ? (
              <img
                src={`data:${board.iconsMimeType};base64,${board.iconsBase64}`}
                alt="Icon set"
                className="max-w-full max-h-[120px] object-contain"
              />
            ) : (
              <div className="h-[60px] flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-black/30" />
              </div>
            )}
          </div>
        </div>

        {/* Typography */}
        <div className="break-inside-avoid mb-3 rounded-xl overflow-hidden bg-white border border-gray-100 relative group/cell">
          <ReasoningTooltip reasoning={board.fontsReasoning} />
          <div className="p-5">
            <span className="text-[9px] uppercase tracking-widest text-gray-400 block mb-0.5">Headline</span>
            <div
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: `'${board.headingFont}', serif`, color: board.colors[3]?.hex || "#1A1A3E" }}
            >
              {board.headingFont}
            </div>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 block mb-0.5">Body</span>
            <div className="text-xs text-gray-500" style={{ fontFamily: `'${board.bodyFont}', sans-serif` }}>
              {board.bodyFont} — the quick brown fox jumps
            </div>
          </div>
        </div>

        {/* Brand Message 2 */}
        <div
          className="break-inside-avoid mb-3 rounded-xl overflow-hidden"
          style={{ background: board.colors[2]?.hex || "#6366F1" }}
        >
          <div className="p-5">
            <h2
              className="text-lg font-normal leading-snug text-white mb-2"
              style={{ fontFamily: `'${board.headingFont}', serif` }}
            >
              {project.creativeBrief.famousFor || brand.vision || "Brand vision"}
            </h2>
            <p className="text-[11px] leading-relaxed text-white/60">
              {brand.vision || ""}
            </p>
          </div>
        </div>

        {/* Stock / Lifestyle Image */}
        <div className="break-inside-avoid mb-3 rounded-xl overflow-hidden relative group/cell" style={{ minHeight: 200 }}>
          <ReasoningTooltip reasoning={board.stockImageReasoning} />
          {board.stockImageBase64 ? (
            <img
              src={`data:${board.stockImageMimeType};base64,${board.stockImageBase64}`}
              alt="Lifestyle"
              className="w-full h-full object-cover"
              style={{ minHeight: 200 }}
            />
          ) : (
            <div
              className="w-full flex items-center justify-center text-xs text-white/40"
              style={{ minHeight: 200, background: `linear-gradient(180deg, ${board.colors[2]?.hex || "#2a2a5e"}, ${board.colors[0]?.hex || "#6366F1"})` }}
            >
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MoodBoardsPage() {
  const {
    getActiveProject,
    setGeneratedMoodBoards,
    selectGeneratedBoard,
    updateGeneratedBoard,
  } = useBrandStore();
  const project = getActiveProject();
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [generatingImages, setGeneratingImages] = useState<Set<string>>(new Set());

  if (!project) return null;

  const genBoards = project.generatedMoodBoards || [];
  const selectedId = project.selectedGeneratedBoardId;

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      // Phase 1: Colors + Fonts for 3 options (Claude Opus)
      setGenStep("Generating 3 color palettes & font pairings...");
      const options: MoodBoardPhase1Option[] = await generateMoodBoardPhase1(project);

      // Create 3 boards with colors+fonts, images pending
      const boards: GeneratedMoodBoard[] = options.map((opt, i) => ({
        id: `option-${i + 1}`,
        colors: opt.colors.colors,
        colorsReasoning: opt.colors.reasoning,
        headingFont: opt.fonts.headingFont,
        bodyFont: opt.fonts.bodyFont,
        fontsReasoning: opt.fonts.reasoning,
        logoReasoning: [],
        iconsReasoning: [],
        moodImage1Reasoning: [],
        moodImage2Reasoning: [],
        stockImageReasoning: [],
      }));

      setGeneratedMoodBoards(boards);
      setGenStep("");
      setGenerating(false);

      // Phase 2: Generate images for all 3 boards in parallel (background)
      for (const board of boards) {
        generateImagesForBoard(board.id, board.colors);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setGenStep("");
      setGenerating(false);
    }
  };

  const generateImagesForBoard = async (
    boardId: string,
    colors: { hex: string; name: string; role: string }[],
  ) => {
    setGeneratingImages((prev) => new Set([...prev, boardId]));
    try {
      const phase2: MoodBoardPhase2Result = await generateMoodBoardPhase2(project, colors);

      const updates: Partial<GeneratedMoodBoard> = {};

      if (isImageResult(phase2.logo)) {
        updates.logoBase64 = phase2.logo.imageBase64;
        updates.logoMimeType = phase2.logo.mimeType;
        updates.logoReasoning = extractReasoning(phase2.logo.text);
      }
      if (isImageResult(phase2.icons)) {
        updates.iconsBase64 = phase2.icons.imageBase64;
        updates.iconsMimeType = phase2.icons.mimeType;
        updates.iconsReasoning = extractReasoning(phase2.icons.text);
      }
      if (isImageResult(phase2.moodImage1)) {
        updates.moodImage1Base64 = phase2.moodImage1.imageBase64;
        updates.moodImage1MimeType = phase2.moodImage1.mimeType;
        updates.moodImage1Reasoning = extractReasoning(phase2.moodImage1.text);
      }
      if (isImageResult(phase2.moodImage2)) {
        updates.moodImage2Base64 = phase2.moodImage2.imageBase64;
        updates.moodImage2MimeType = phase2.moodImage2.mimeType;
        updates.moodImage2Reasoning = extractReasoning(phase2.moodImage2.text);
      }
      if (isImageResult(phase2.stockImage)) {
        updates.stockImageBase64 = phase2.stockImage.imageBase64;
        updates.stockImageMimeType = phase2.stockImage.mimeType;
        updates.stockImageReasoning = extractReasoning(phase2.stockImage.text);
      }

      updateGeneratedBoard(boardId, updates);
    } catch (err) {
      console.error(`Image generation failed for ${boardId}:`, err);
    } finally {
      setGeneratingImages((prev) => {
        const next = new Set(prev);
        next.delete(boardId);
        return next;
      });
    }
  };

  const canProceed = !!selectedId;

  return (
    <div>
      <PhaseHeader
        phase={4}
        title="Mood Board Generation"
        description="We generate 3 distinct visual directions. Pick one to refine."
      />

      {genBoards.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 border border-dashed border-border/50 rounded-2xl bg-card/20"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Generate Visual Mood Boards</h3>
          <p className="text-muted-foreground text-sm mb-1 max-w-lg mx-auto">
            Claude Opus picks colors & fonts. Gemini Nanobanana 2 generates logos, icons & mood images.
          </p>
          <p className="text-muted-foreground text-xs mb-6 max-w-md mx-auto">
            3 distinct directions generated in parallel
          </p>
          <Button onClick={handleGenerate} disabled={generating} size="lg" className="gap-2">
            {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {generating ? genStep || "Generating..." : "Generate Mood Boards"}
          </Button>
          {error && (
            <div className="mt-4 flex items-center gap-2 justify-center text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </motion.div>
      )}

      {genBoards.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Select one direction to continue with. Hover over cards to see AI reasoning.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
              className="gap-2"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {generating ? genStep || "Regenerating..." : "Regenerate All"}
            </Button>
          </div>

          <div className="space-y-6">
            {genBoards.map((board, index) => (
              <motion.div
                key={board.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MoodBoardPreview
                  board={board}
                  project={project}
                  isSelected={selectedId === board.id}
                  onSelect={() => selectGeneratedBoard(board.id)}
                  generating={generatingImages.has(board.id)}
                />
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </>
      )}

      <NavigationButtons currentPhase={4} canProceed={canProceed} />
    </div>
  );
}

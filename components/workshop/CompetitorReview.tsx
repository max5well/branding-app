"use client";

import { useState } from "react";
import { useBrandStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { analyzeCompetitor } from "@/lib/ai";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Building2, Globe, Loader2, Wand2 } from "lucide-react";

export default function CompetitorReview() {
  const {
    getActiveProject,
    addCompetitor,
    updateCompetitor,
    removeCompetitor,
  } = useBrandStore();
  const project = getActiveProject();
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

  if (!project) return null;

  const competitors = project.strategy.competitors;

  const handleAnalyze = async (compId: string, website: string) => {
    if (!website.trim()) return;
    setAnalyzingIds((prev) => new Set(prev).add(compId));
    try {
      const result = await analyzeCompetitor(website);
      updateCompetitor(compId, {
        name: result.name || "",
        description: result.description || "",
        strengths: result.strengths || "",
        weaknesses: result.weaknesses || "",
        visualStyle: result.visualStyle || [],
        brand: result.brand as any,
        analyzed: true,
      });
    } catch (err) {
      console.error("Failed to analyze competitor:", err);
    } finally {
      setAnalyzingIds((prev) => {
        const next = new Set(prev);
        next.delete(compId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Who are your competitors?</h3>
          <p className="text-sm text-muted-foreground">
            Add up to 5 competitor websites — AI will analyze their brand
          </p>
        </div>
        {competitors.length < 5 && (
          <Button variant="outline" size="sm" onClick={addCompetitor}>
            <Plus className="w-4 h-4 mr-1" />
            Add Competitor
          </Button>
        )}
      </div>

      {competitors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 border border-dashed border-border/50 rounded-xl"
        >
          <Building2 className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">
            No competitors added yet
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={addCompetitor}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add your first competitor
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {competitors.map((comp, index) => {
          const isAnalyzing = analyzingIds.has(comp.id);
          return (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.1 }}
              className="border border-border/50 rounded-xl p-6 space-y-4 bg-card/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Competitor {index + 1}
                    {comp.name && (
                      <span className="text-foreground ml-1.5">
                        — {comp.name}
                      </span>
                    )}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCompetitor(comp.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Website URL
                  </Label>
                  <Input
                    placeholder="https://competitor.com"
                    value={comp.website}
                    onChange={(e) =>
                      updateCompetitor(comp.id, { website: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && comp.website.trim()) {
                        handleAnalyze(comp.id, comp.website);
                      }
                    }}
                  />
                </div>
                <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAnalyze(comp.id, comp.website)}
                      disabled={isAnalyzing || !comp.website.trim()}
                      className="gap-1.5 border-primary/20 text-primary hover:bg-primary/10 h-9"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                      )}
                      {isAnalyzing ? "Analyzing..." : "Analyze"}
                    </Button>
                </div>
              </div>

              {/* AI Analysis Results */}
              {comp.analyzed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 pt-4 border-t border-border/30"
                >
                  {comp.description && (
                    <p className="text-sm text-muted-foreground">
                      {comp.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-green-400/80">
                        Strengths
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {comp.strengths}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-amber-400/80">
                        Weaknesses
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {comp.weaknesses}
                      </p>
                    </div>
                  </div>

                  {comp.visualStyle.length > 0 && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Visual Style</Label>
                      <div className="flex flex-wrap gap-1">
                        {comp.visualStyle.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-xs bg-muted/50 text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {comp.brand && (
                    <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/30">
                      <h5 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Brand Profile
                      </h5>

                      {comp.brand.colors.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="text-xs">Colors</Label>
                          <div className="flex gap-1.5">
                            {comp.brand.colors.map((color) => (
                              <div key={color} className="text-center">
                                <div
                                  className="w-8 h-8 rounded-md ring-1 ring-white/10"
                                  style={{ backgroundColor: color }}
                                />
                                <p className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">
                                  {color}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {comp.brand.fonts.length > 0 && (
                        <div className="space-y-1">
                          <Label className="text-xs">Fonts</Label>
                          <p className="text-xs text-muted-foreground">
                            {comp.brand.fonts.join(", ")}
                          </p>
                        </div>
                      )}

                      {comp.brand.positioning && (
                        <div className="space-y-1">
                          <Label className="text-xs">Positioning</Label>
                          <p className="text-xs text-muted-foreground">
                            {comp.brand.positioning}
                          </p>
                        </div>
                      )}

                      {comp.brand.imagery && (
                        <div className="space-y-1">
                          <Label className="text-xs">Imagery Style</Label>
                          <p className="text-xs text-muted-foreground">
                            {comp.brand.imagery}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

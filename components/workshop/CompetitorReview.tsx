"use client";

import { useState } from "react";
import { useBrandStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { analyzeCompetitor } from "@/lib/ai";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Building2,
  Globe,
  Loader2,
  Wand2,
  Type,
  Palette,
  Quote,
  Eye,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

const SOCIAL_ICONS: Record<string, { label: string; icon: React.ReactNode }> = {
  instagram: {
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  twitter: {
    label: "X / Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  tiktok: {
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.33-6.33V9.16a8.18 8.18 0 0 0 3.89.98V6.69z" />
      </svg>
    ),
  },
  youtube: {
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  facebook: {
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
};

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
                  {comp.analyzed && comp.website ? (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(comp.website.startsWith("http") ? comp.website : `https://${comp.website}`).hostname)}&sz=64`}
                      alt={`${comp.name || "Competitor"} favicon`}
                      className="w-8 h-8 rounded-md object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={cn(
                    "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center",
                    comp.analyzed && comp.website && "hidden"
                  )}>
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

                  {/* Brand Identity Section */}
                  {comp.brand && (
                    <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/30">
                      <h5 className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Eye className="w-3 h-3" /> Brand Identity
                      </h5>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Colors */}
                        {comp.brand.colors.length > 0 && (
                          <div className="space-y-1.5">
                            <Label className="text-xs flex items-center gap-1">
                              <Palette className="w-3 h-3" /> Colors
                            </Label>
                            <div className="flex gap-1.5">
                              {comp.brand.colors.map((color) => (
                                <div key={color} className="text-center">
                                  <div
                                    className="w-7 h-7 rounded-md ring-1 ring-white/10"
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

                        {/* Typography */}
                        <div className="space-y-1.5">
                          <Label className="text-xs flex items-center gap-1">
                            <Type className="w-3 h-3" /> Typography
                          </Label>
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            {comp.brand.headingFont && (
                              <p>
                                <span className="text-foreground/60">Heading:</span>{" "}
                                {comp.brand.headingFont.split(",")[0].trim()}
                              </p>
                            )}
                            {comp.brand.bodyFont && comp.brand.bodyFont !== comp.brand.headingFont && (
                              <p>
                                <span className="text-foreground/60">Body:</span>{" "}
                                {comp.brand.bodyFont.split(",")[0].trim()}
                              </p>
                            )}
                            {/* Fallback to legacy fonts array */}
                            {!comp.brand.headingFont &&
                              comp.brand.fonts?.length > 0 && (
                                <p>{comp.brand.fonts.map(f => f.split(",")[0].trim()).join(", ")}</p>
                              )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Brand Messaging Section */}
                  {comp.brand &&
                    (comp.brand.tagline ||
                      comp.brand.mission ||
                      comp.brand.vision ||
                      comp.brand.brandVoice) && (
                      <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/30">
                        <h5 className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <MessageSquare className="w-3 h-3" /> Brand Messaging
                        </h5>

                        {comp.brand.tagline && (
                          <div className="space-y-1">
                            <Label className="text-xs flex items-center gap-1">
                              <Quote className="w-3 h-3" /> Tagline
                            </Label>
                            <p className="text-xs text-muted-foreground italic">
                              &ldquo;{comp.brand.tagline}&rdquo;
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          {comp.brand.mission && (
                            <div className="space-y-1">
                              <Label className="text-xs">Mission</Label>
                              <p className="text-xs text-muted-foreground">
                                {comp.brand.mission}
                              </p>
                            </div>
                          )}
                          {comp.brand.vision && (
                            <div className="space-y-1">
                              <Label className="text-xs">Vision</Label>
                              <p className="text-xs text-muted-foreground">
                                {comp.brand.vision}
                              </p>
                            </div>
                          )}
                        </div>

                        {comp.brand.brandVoice && (
                          <div className="space-y-1">
                            <Label className="text-xs">Brand Voice</Label>
                            <p className="text-xs text-muted-foreground">
                              {comp.brand.brandVoice}
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
                      </div>
                    )}

                  {/* Strengths / Weaknesses */}
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

                  {/* Visual Style Tags */}
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

                  {/* Social Media Icons */}
                  {comp.brand?.socialMedia && (() => {
                    const sm = comp.brand!.socialMedia!;
                    const links = Object.entries(sm).filter(
                      ([, url]) => url && url !== "not found" && url !== "null",
                    );
                    if (links.length === 0) return null;
                    return (
                      <div className="flex items-center gap-2.5 pt-1">
                        <Label className="text-xs text-muted-foreground mr-1">
                          Social:
                        </Label>
                        {links.map(([key, url]) => {
                          const social = SOCIAL_ICONS[key];
                          if (!social || !url) return null;
                          return (
                            <a
                              key={key}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title={social.label}
                            >
                              {social.icon}
                            </a>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Imagery */}
                  {comp.brand?.imagery && (
                    <div className="space-y-1">
                      <Label className="text-xs">Imagery Style</Label>
                      <p className="text-xs text-muted-foreground">
                        {comp.brand.imagery}
                      </p>
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

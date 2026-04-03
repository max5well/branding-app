"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrandStore } from "@/lib/store";
import {
  ARCHETYPES,
  getArchetype,
  getArchetypeCombinationDescription,
} from "@/lib/archetypes";
import { generatePersonalitySummary } from "@/lib/ai";
import { Archetype } from "@/lib/types";
import PhaseHeader from "@/components/workshop/PhaseHeader";
import NavigationButtons from "@/components/workshop/NavigationButtons";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function BrandLogo({ domain, name }: { domain: string; name: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center text-[9px] font-medium text-muted-foreground">
        {name.slice(0, 2)}
      </div>
    );
  }

  return (
    <div className="relative w-8 h-8 rounded-md overflow-hidden bg-white flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={name}
        width={28}
        height={28}
        className="object-contain"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

export default function PersonalityPage() {
  const {
    getActiveProject,
    setPrimaryArchetype,
    setSecondaryArchetype,
    setPersonalitySummary,
  } = useBrandStore();
  const project = getActiveProject();
  const [generating, setGenerating] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"primary" | "secondary">(
    "primary",
  );
  const [expandedArchetype, setExpandedArchetype] = useState<string | null>(
    null,
  );

  const primary = project?.personality.primaryArchetype;
  const secondary = project?.personality.secondaryArchetype;
  const summary = project?.personality.personalitySummary;

  const handleSelect = useCallback(
    (id: Archetype) => {
      if (selectingFor === "primary") {
        if (id === secondary) return;
        setPrimaryArchetype(id);
        if (!secondary) setSelectingFor("secondary");
      } else {
        if (id === primary) return;
        setSecondaryArchetype(id);
      }
    },
    [
      selectingFor,
      primary,
      secondary,
      setPrimaryArchetype,
      setSecondaryArchetype,
    ],
  );

  const handleGenerateSummary = async () => {
    if (!project) return;
    setGenerating(true);
    try {
      const result = await generatePersonalitySummary(project);
      setPersonalitySummary(result);
    } catch (err) {
      console.error("Failed to generate summary:", err);
    } finally {
      setGenerating(false);
    }
  };

  if (!project) return null;

  const canProceed = !!primary && !!secondary;

  return (
    <div>
      <PhaseHeader
        phase={2}
        title="Brand Personality"
        description="Choose the archetypes that define your brand's character and voice."
      />

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectingFor("primary")}
          className={cn(
            "flex-1 p-3 rounded-lg border text-left transition-all",
            selectingFor === "primary"
              ? "border-primary bg-primary/5"
              : "border-border/50 hover:border-border",
          )}
        >
          <p className="text-xs text-muted-foreground mb-0.5">
            Primary Archetype
          </p>
          {primary ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{getArchetype(primary).icon}</span>
              <span className="font-semibold">
                {getArchetype(primary).name}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select below...</p>
          )}
        </button>
        <button
          onClick={() => setSelectingFor("secondary")}
          className={cn(
            "flex-1 p-3 rounded-lg border text-left transition-all",
            selectingFor === "secondary"
              ? "border-primary bg-primary/5"
              : "border-border/50 hover:border-border",
          )}
        >
          <p className="text-xs text-muted-foreground mb-0.5">
            Secondary Archetype
          </p>
          {secondary ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{getArchetype(secondary).icon}</span>
              <span className="font-semibold">
                {getArchetype(secondary).name}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select below...</p>
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {ARCHETYPES.map((archetype) => {
          const isPrimary = primary === archetype.id;
          const isSecondary = secondary === archetype.id;
          const isSelected = isPrimary || isSecondary;
          const isExpanded = expandedArchetype === archetype.id;
          const isDisabled =
            (selectingFor === "primary" && isSecondary) ||
            (selectingFor === "secondary" && isPrimary);

          return (
            <div
              key={archetype.id}
              className={cn(
                "relative rounded-xl border transition-all duration-200 overflow-hidden",
                isSelected
                  ? isPrimary
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-blue-500/50 bg-blue-500/10 ring-1 ring-blue-500/30"
                  : "border-border/50 bg-card/30 hover:bg-card/50 hover:border-border",
                isDisabled && "opacity-40",
                isExpanded && "col-span-3",
              )}
            >
              <button
                onClick={() => !isDisabled && handleSelect(archetype.id)}
                disabled={isDisabled}
                className={cn(
                  "w-full p-4 text-left",
                  isDisabled && "cursor-not-allowed",
                )}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                    {isPrimary ? "Primary" : "Secondary"}
                  </span>
                )}
                <div className="text-2xl mb-2">{archetype.icon}</div>
                <h3 className="font-semibold text-sm">{archetype.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 italic">
                  {archetype.tagline}
                </p>

                {/* Brand logos row */}
                {!isExpanded && (
                  <div className="flex items-center gap-1.5 mt-3">
                    {archetype.brandExamples.map((brand) => (
                      <BrandLogo
                        key={brand.domain}
                        domain={brand.domain}
                        name={brand.name}
                      />
                    ))}
                  </div>
                )}
              </button>

              {/* Expand toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedArchetype(isExpanded ? null : archetype.id);
                }}
                className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors border-t border-border/30"
              >
                {isExpanded ? (
                  <>
                    <X className="w-3 h-3" /> Close
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" /> Learn more
                  </>
                )}
              </button>

              {/* Expandable detail panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-3 border-t border-border/30">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            About
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {archetype.description}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-medium text-green-400/80 uppercase tracking-wider mb-1">
                              Strengths
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {archetype.strengths}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-amber-400/80 uppercase tracking-wider mb-1">
                              Shadow Side
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {archetype.shadow}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground/70 uppercase tracking-wider mb-3">
                            Brands with this archetype
                          </p>
                          <div className="space-y-2.5">
                            {archetype.brandExamples.map((brand) => (
                              <div
                                key={brand.domain}
                                className="flex items-center gap-2.5"
                              >
                                <BrandLogo
                                  domain={brand.domain}
                                  name={brand.name}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {brand.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {primary && secondary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-border/50 rounded-xl p-6 bg-card/30 mb-4 space-y-4"
          >
            <h3 className="font-semibold">Your Archetype Combination</h3>
            <p className="text-sm text-muted-foreground">
              {getArchetypeCombinationDescription(primary, secondary)}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[getArchetype(primary), getArchetype(secondary)].map((arch) => (
                <div key={arch.id} className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <span>{arch.icon}</span> {arch.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {arch.description}
                  </p>
                  <div>
                    <p className="text-xs text-green-400/80 mt-1">
                      <strong>Strengths:</strong> {arch.strengths}
                    </p>
                    <p className="text-xs text-amber-400/80 mt-1">
                      <strong>Shadow:</strong> {arch.shadow}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {arch.brandExamples.map((brand) => (
                      <BrandLogo
                        key={brand.domain}
                        domain={brand.domain}
                        name={brand.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSummary}
                  disabled={generating}
                  className="gap-2"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {generating
                    ? "Generating..."
                    : summary
                      ? "Regenerate AI Summary"
                      : "Generate AI Personality Summary"}
                </Button>
              </div>

            {summary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-primary/5 border border-primary/10"
              >
                <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI-Generated Summary
                </p>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {summary}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationButtons currentPhase={2} canProceed={canProceed} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBrandStore } from "@/lib/store";
import { generateBrandGuideline } from "@/lib/ai";
import PhaseHeader from "@/components/workshop/PhaseHeader";
import GuidelineDocument from "@/components/workshop/GuidelineDocument";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Download, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GuidelinesPage() {
  const { getActiveProject, setFinalGuideline } = useBrandStore();
  const project = getActiveProject();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!project) return null;

  const guideline = project.finalGuideline;

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateBrandGuideline(project);
      setFinalGuideline(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate guideline",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!guideline || !project) return;
    const { generatePDF } = await import("@/lib/pdf");
    await generatePDF(project, guideline);
  };

  return (
    <div>
      <PhaseHeader
        phase={6}
        title="Brand Guidelines"
        description="Your complete brand identity document, ready to share with your team."
      />

      {!guideline && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 border border-dashed border-border/50 rounded-2xl bg-card/20"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Generate Your Brand Guideline
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            We&apos;ll compile everything into a comprehensive, downloadable
            brand guideline document.
          </p>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            size="lg"
            className="gap-2"
          >
            {generating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {generating
              ? "Generating guideline..."
              : "Generate Brand Guideline"}
          </Button>
          {error && <p className="text-xs text-destructive mt-3">{error}</p>}
        </motion.div>
      )}

      {guideline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
              className="gap-2"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Regenerate
            </Button>
            <Button onClick={handleDownloadPDF} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>

          <GuidelineDocument project={project} guideline={guideline} />
        </motion.div>
      )}

      <div className="pt-8 mt-8 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={() => router.push("/workshop/refinement")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Refinement
        </Button>
      </div>
    </div>
  );
}

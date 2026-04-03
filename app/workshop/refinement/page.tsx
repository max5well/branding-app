"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBrandStore } from "@/lib/store";
import { generateRefinedDirection } from "@/lib/ai";
import PhaseHeader from "@/components/workshop/PhaseHeader";
import NavigationButtons from "@/components/workshop/NavigationButtons";
import MoodBoardCard from "@/components/workshop/MoodBoardCard";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export default function RefinementPage() {
  const { getActiveProject, updateFeedback, setRefinedDirection } =
    useBrandStore();
  const project = getActiveProject();
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!project) return null;

  const selectedBoards = project.moodBoards.filter((b) =>
    project.selectedMoodBoardIds.includes(b.id),
  );
  const feedback = project.feedback;
  const refined = project.refinedDirection;

  const handleRefine = async () => {
    setRefining(true);
    setError(null);
    try {
      const result = await generateRefinedDirection(project);
      setRefinedDirection(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refinement failed");
    } finally {
      setRefining(false);
    }
  };

  const canProceed = !!refined;

  return (
    <div>
      <PhaseHeader
        phase={5}
        title="Feedback & Refinement"
        description="Fine-tune your selected direction(s). Provide feedback to generate a polished brand direction."
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Selected Direction{selectedBoards.length > 1 ? "s" : ""}
          </h3>
          <div className="space-y-4">
            {selectedBoards.map((board) => (
              <div
                key={board.id}
                className="border border-border/50 rounded-xl p-5 bg-card/30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex gap-1.5 shrink-0">
                    {board.colors.map((c) => (
                      <div
                        key={c.hex}
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold">{board.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {board.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fonts: {board.primaryFont} / {board.secondaryFont}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border/50 rounded-xl p-6 bg-card/30 space-y-5">
          <h3 className="text-lg font-semibold">Your Feedback</h3>

          <div className="space-y-2">
            <Label>Typography Feedback</Label>
            <Textarea
              placeholder="Keep the fonts? Want something different? More modern? More classic?"
              value={feedback.typographyFeedback || ""}
              onChange={(e) =>
                updateFeedback({ typographyFeedback: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>General Style Feedback</Label>
            <Textarea
              placeholder="What would you change? What do you love? Any specific adjustments?"
              value={feedback.generalFeedback || ""}
              onChange={(e) =>
                updateFeedback({ generalFeedback: e.target.value })
              }
              rows={3}
            />
          </div>

          {selectedBoards.length > 1 && (
            <div className="space-y-2">
              <Label>Merge Strategy</Label>
              <Textarea
                placeholder={`How should we combine these? e.g. "Colors from ${selectedBoards[0]?.name}, typography from ${selectedBoards[1]?.name}"`}
                value={feedback.mergeStrategy || ""}
                onChange={(e) =>
                  updateFeedback({ mergeStrategy: e.target.value })
                }
                rows={2}
              />
            </div>
          )}

          <Button onClick={handleRefine} disabled={refining} className="gap-2">
            {refining ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {refining
              ? "Refining..."
              : refined
                ? "Regenerate Refined Direction"
                : "Generate Refined Direction"}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        {refined && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Refined Direction
            </h3>
            <MoodBoardCard
              board={refined}
              isSelected={true}
              onSelect={() => {}}
            />
          </motion.div>
        )}
      </div>

      <NavigationButtons
        currentPhase={5}
        canProceed={canProceed}
        nextLabel="Finalize Brand"
      />
    </div>
  );
}

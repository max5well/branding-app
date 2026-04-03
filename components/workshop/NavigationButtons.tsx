"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useBrandStore } from "@/lib/store";
import { PHASES } from "@/lib/constants";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  currentPhase: 1 | 2 | 3 | 4 | 5 | 6;
  canProceed?: boolean;
  onNext?: () => void | Promise<void>;
  onBack?: () => void;
  nextLabel?: string;
  skipPhaseNavigation?: boolean;
}

export default function NavigationButtons({
  currentPhase,
  canProceed = true,
  onNext,
  onBack,
  nextLabel,
  skipPhaseNavigation = false,
}: NavigationButtonsProps) {
  const router = useRouter();
  const { setCurrentPhase, getActiveProject } = useBrandStore();
  const project = getActiveProject();

  const prevPhase = PHASES.find((p) => p.number === currentPhase - 1);
  const nextPhase = PHASES.find((p) => p.number === currentPhase + 1);

  const handleNext = async () => {
    if (onNext) {
      await onNext();
      if (skipPhaseNavigation) return;
    }
    if (nextPhase) {
      const maxPhase = Math.max(
        project?.currentPhase ?? 1,
        nextPhase.number,
      ) as 1 | 2 | 3 | 4 | 5 | 6;
      setCurrentPhase(maxPhase);
      router.push(nextPhase.path);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (prevPhase) {
      router.push(prevPhase.path);
    }
  };

  const showBackButton = onBack || prevPhase;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex items-center justify-between pt-8 mt-8 border-t border-border/50"
    >
      {showBackButton ? (
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {onBack
            ? "Back"
            : prevPhase?.name}
        </Button>
      ) : (
        <div />
      )}

      {(nextPhase || skipPhaseNavigation) && (
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="gap-2"
          size="lg"
        >
          {nextLabel || `Continue to ${nextPhase?.name}`}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  );
}

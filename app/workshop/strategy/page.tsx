"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBrandStore } from "@/lib/store";
import PhaseHeader from "@/components/workshop/PhaseHeader";
import NavigationButtons from "@/components/workshop/NavigationButtons";
import BrandReview from "@/components/workshop/BrandReview";
import AudienceBuilder from "@/components/workshop/AudienceBuilder";
import CompetitorReview from "@/components/workshop/CompetitorReview";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "brand", label: "Brand Review", icon: "01" },
  { id: "audience", label: "Audience", icon: "02" },
  { id: "competitors", label: "Competitors", icon: "03" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function StrategyPage() {
  const [activeTab, setActiveTab] = useState<TabId>("brand");
  const { getActiveProject } = useBrandStore();
  const project = getActiveProject();
  if (!project) return null;

  const brand = project.strategy.brand;
  const canProceed =
    brand.name.trim().length > 0 &&
    brand.mission.trim().length > 0 &&
    brand.vision.trim().length > 0;

  const tabIndex = TABS.findIndex((t) => t.id === activeTab);
  const isLastTab = tabIndex === TABS.length - 1;
  const isFirstTab = tabIndex === 0;

  const handleNext = () => {
    if (!isLastTab) {
      setActiveTab(TABS[tabIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (!isFirstTab) {
      setActiveTab(TABS[tabIndex - 1].id);
    }
  };

  const nextTabLabel = !isLastTab
    ? `Continue to ${TABS[tabIndex + 1].label}`
    : undefined;

  return (
    <div>
      <PhaseHeader
        phase={1}
        title="Brand Strategy"
        description="Let's lay the foundation. Define who you are, who you serve, and who you're up against."
      />

      <div className="flex gap-1 p-1 rounded-lg bg-muted/30 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/80",
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="strategyTab"
                className="absolute inset-0 bg-card rounded-md shadow-sm"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="text-xs text-muted-foreground">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div key={activeTab}>
        {activeTab === "brand" && <BrandReview />}
        {activeTab === "audience" && <AudienceBuilder />}
        {activeTab === "competitors" && <CompetitorReview />}
      </div>

      <NavigationButtons
        currentPhase={1}
        canProceed={canProceed}
        onNext={!isLastTab ? handleNext : undefined}
        onBack={!isFirstTab ? handleBack : undefined}
        nextLabel={nextTabLabel}
        skipPhaseNavigation={!isLastTab}
      />
    </div>
  );
}

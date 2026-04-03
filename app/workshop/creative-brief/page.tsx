"use client";

import { useBrandStore } from "@/lib/store";
import {
  BRAND_TRAITS,
  BRAND_TONES,
  BRAND_EXPERIENCES,
  FAMOUS_FOR_EXAMPLES,
} from "@/lib/constants";
import PhaseHeader from "@/components/workshop/PhaseHeader";
import NavigationButtons from "@/components/workshop/NavigationButtons";
import ChipSelector from "@/components/workshop/ChipSelector";
import TagInput from "@/components/workshop/TagInput";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function CreativeBriefPage() {
  const { getActiveProject, updateCreativeBrief } = useBrandStore();
  const project = getActiveProject();
  if (!project) return null;

  const brief = project.creativeBrief;
  const canProceed =
    brief.traits.length === 3 &&
    brief.tone.length === 3 &&
    brief.experience.length === 3 &&
    brief.famousFor.trim().length > 0;

  return (
    <div>
      <PhaseHeader
        phase={3}
        title="Creative Brief"
        description="Define the creative direction for your brand. These choices shape everything visual and verbal."
      />

      <div className="space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="mb-3">
            <h3 className="text-lg font-semibold">Brand Traits</h3>
            <p className="text-sm text-muted-foreground">
              Pick 3 adjectives that describe how your brand should{" "}
              <strong>look</strong>
            </p>
          </div>
          <ChipSelector
            options={BRAND_TRAITS}
            selected={brief.traits}
            onChange={(traits) => updateCreativeBrief({ traits })}
            max={3}
            allowCustom
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-3">
            <h3 className="text-lg font-semibold">Brand Tone</h3>
            <p className="text-sm text-muted-foreground">
              Pick 3 words that describe how your brand should{" "}
              <strong>speak</strong>
            </p>
          </div>
          <ChipSelector
            options={BRAND_TONES}
            selected={brief.tone}
            onChange={(tone) => updateCreativeBrief({ tone })}
            max={3}
            allowCustom
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-3">
            <h3 className="text-lg font-semibold">Brand Experience</h3>
            <p className="text-sm text-muted-foreground">
              What 3 feelings should your brand <strong>evoke</strong>?
            </p>
          </div>
          <ChipSelector
            options={BRAND_EXPERIENCES}
            selected={brief.experience}
            onChange={(experience) => updateCreativeBrief({ experience })}
            max={3}
            allowCustom
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-3">
            <h3 className="text-lg font-semibold">Famous For</h3>
            <p className="text-sm text-muted-foreground">
              What is the ONE thing you want to be famous for?
            </p>
          </div>
          <Input
            value={brief.famousFor}
            onChange={(e) =>
              updateCreativeBrief({ famousFor: e.target.value.slice(0, 100) })
            }
            placeholder="e.g. Design simplicity, Environmental activism..."
            maxLength={100}
            className="text-lg"
          />
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-muted-foreground">
              {brief.famousFor.length}/100
            </span>
            <div className="flex gap-3 text-xs text-muted-foreground/60">
              {FAMOUS_FOR_EXAMPLES.map((ex) => (
                <span key={ex.brand}>
                  {ex.brand} = &quot;{ex.thing}&quot;
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-3">
            <h3 className="text-lg font-semibold">What You&apos;re NOT</h3>
            <p className="text-sm text-muted-foreground">
              What should your brand <strong>never</strong> be?
              Anti-descriptors, colors, vibes to avoid.
            </p>
          </div>
          <TagInput
            tags={brief.notThis}
            onChange={(notThis) => updateCreativeBrief({ notThis })}
            placeholder='e.g. "corporate", "boring", "neon colors"...'
            max={10}
            suggestions={[
              "corporate",
              "boring",
              "neon colors",
              "clip art",
              "stock photo look",
              "aggressive",
              "childish",
              "generic",
              "outdated",
              "cluttered",
            ]}
          />
        </motion.section>
      </div>

      <NavigationButtons currentPhase={3} canProceed={canProceed} />
    </div>
  );
}

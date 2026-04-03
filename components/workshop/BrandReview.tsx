"use client";

import { useBrandStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BUSINESS_MODELS, SALES_CHANNELS } from "@/lib/constants";
import { generateFieldContent } from "@/lib/ai";
import AiGenerateButton from "./AiGenerateButton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BrandReview() {
  const { getActiveProject, updateBrand } = useBrandStore();
  const project = getActiveProject();
  if (!project) return null;
  const brand = {
    ...project.strategy.brand,
    businessModels: project.strategy.brand.businessModels || [],
    salesChannels: project.strategy.brand.salesChannels || [],
  };

  const brandContext = `Brand name: ${brand.name}\nDescription: ${brand.description}\nBusiness models: ${brand.businessModels.join(", ")}\nSales channels: ${brand.salesChannels.join(", ")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="brandName">What is your brand?</Label>
        <Input
          id="brandName"
          placeholder="Brand name"
          value={brand.name}
          onChange={(e) => updateBrand({ name: e.target.value })}
          className="text-lg font-medium"
        />
        <div className="relative">
          <Textarea
            placeholder="Briefly describe what your brand does..."
            value={brand.description}
            onChange={(e) => updateBrand({ description: e.target.value })}
            rows={2}
          />
          <div className="absolute top-1.5 right-1.5">
            <AiGenerateButton
              tooltip="Generate description"
              onGenerate={() =>
                generateFieldContent(
                  "Brand Description",
                  `Brand name: ${brand.name}`,
                )
              }
              onResult={(result) => updateBrand({ description: result })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="mission">Mission Statement</Label>
            <p className="text-xs text-muted-foreground">
              Why does your brand exist? Start with &quot;We exist to...&quot;
            </p>
          </div>
          <AiGenerateButton
            tooltip="Generate mission"
            onGenerate={() =>
              generateFieldContent(
                "Mission Statement (start with 'We exist to...')",
                brandContext,
              )
            }
            onResult={(result) => updateBrand({ mission: result })}
          />
        </div>
        <Textarea
          id="mission"
          placeholder="We exist to..."
          value={brand.mission}
          onChange={(e) => updateBrand({ mission: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="vision">Vision Statement</Label>
            <p className="text-xs text-muted-foreground">
              What world are you building? &quot;We envision a world
              where...&quot;
            </p>
          </div>
          <AiGenerateButton
            tooltip="Generate vision"
            onGenerate={() =>
              generateFieldContent(
                "Vision Statement (start with 'We envision a world where...')",
                brandContext,
              )
            }
            onResult={(result) => updateBrand({ vision: result })}
          />
        </div>
        <Textarea
          id="vision"
          placeholder="We envision a world where..."
          value={brand.vision}
          onChange={(e) => updateBrand({ vision: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Business Model</Label>
          <p className="text-xs text-muted-foreground">Select all that apply</p>
          <div className="flex flex-wrap gap-1.5">
            {BUSINESS_MODELS.map((model) => {
              const isSelected = brand.businessModels.includes(model);
              return (
                <button
                  key={model}
                  onClick={() => {
                    const newModels = isSelected
                      ? brand.businessModels.filter((m) => m !== model)
                      : [...brand.businessModels, model];
                    updateBrand({ businessModels: newModels });
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                    isSelected
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-card border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {model}
                </button>
              );
            })}
          </div>
          {brand.businessModels.includes("Other") && (
            <Input
              placeholder="Describe your model..."
              value={brand.businessModelCustom || ""}
              onChange={(e) =>
                updateBrand({ businessModelCustom: e.target.value })
              }
            />
          )}
        </div>

        <div className="space-y-2">
          <Label>Sales Channels</Label>
          <p className="text-xs text-muted-foreground">Select all that apply</p>
          <div className="flex flex-wrap gap-1.5">
            {SALES_CHANNELS.map((channel) => {
              const isSelected = brand.salesChannels.includes(channel);
              return (
                <button
                  key={channel}
                  onClick={() => {
                    const newChannels = isSelected
                      ? brand.salesChannels.filter((c) => c !== channel)
                      : [...brand.salesChannels, channel];
                    updateBrand({ salesChannels: newChannels });
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                    isSelected
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-card border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {channel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Additional pricing notes</Label>
        <Textarea
          placeholder="Any other notes about your pricing or sales approach..."
          value={brand.pricingNotes || ""}
          onChange={(e) => updateBrand({ pricingNotes: e.target.value })}
          rows={2}
        />
      </div>
    </motion.div>
  );
}

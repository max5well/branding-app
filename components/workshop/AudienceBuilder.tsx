"use client";

import { useState } from "react";
import { useBrandStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AUDIENCE_CHANNELS } from "@/lib/constants";
import { generatePersona } from "@/lib/ai";
import TagInput from "./TagInput";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Trash2, User, Wand2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

export default function AudienceBuilder() {
  const { getActiveProject, addPersona, updatePersona, removePersona } =
    useBrandStore();
  const project = getActiveProject();
  const [generatingPersona, setGeneratingPersona] = useState(false);

  if (!project) return null;

  const personas = project.strategy.audience.personas;

  const handleGeneratePersona = async () => {
    if (!project) return;
    setGeneratingPersona(true);
    try {
      const result = await generatePersona(project);
      // Add a new persona and populate it
      addPersona();
      // Get the newly added persona (last one)
      const updated = useBrandStore.getState().getActiveProject();
      if (updated) {
        const newPersona =
          updated.strategy.audience.personas[
            updated.strategy.audience.personas.length - 1
          ];
        updatePersona(newPersona.id, {
          name: result.name,
          ageRange: result.ageRange,
          occupation: result.occupation,
          painPoints: result.painPoints,
          goals: result.goals,
          channels: result.channels,
        });
      }
    } catch (err) {
      console.error("Failed to generate persona:", err);
    } finally {
      setGeneratingPersona(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Who are your customers?</h3>
          <p className="text-sm text-muted-foreground">
            Build up to 3 customer personas
          </p>
        </div>
        <div className="flex items-center gap-2">
          {personas.length < 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePersona}
              disabled={generatingPersona}
              className="gap-1.5 border-primary/20 text-primary hover:bg-primary/10"
            >
              {generatingPersona ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              {generatingPersona ? "Generating..." : "AI Generate"}
            </Button>
          )}
          {personas.length < 3 && (
            <Button variant="outline" size="sm" onClick={addPersona}>
              <Plus className="w-4 h-4 mr-1" />
              Add Persona
            </Button>
          )}
        </div>
      </div>

      {personas.map((persona, index) => (
        <motion.div
          key={persona.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-border/50 rounded-xl p-6 space-y-4 bg-card/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Persona {index + 1}
              </span>
            </div>
            {personas.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePersona(persona.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Name / Label</Label>
              <Input
                placeholder='e.g. "Tech-savvy Sarah"'
                value={persona.name}
                onChange={(e) =>
                  updatePersona(persona.id, { name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Age Range</Label>
              <Select
                value={persona.ageRange}
                onValueChange={(v) =>
                  v && updatePersona(persona.id, { ageRange: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGE_RANGES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Occupation</Label>
              <Input
                placeholder="Role or job title"
                value={persona.occupation}
                onChange={(e) =>
                  updatePersona(persona.id, { occupation: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Pain Points</Label>
            <TagInput
              tags={persona.painPoints}
              onChange={(tags) =>
                updatePersona(persona.id, { painPoints: tags })
              }
              placeholder="Add pain points..."
              max={5}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Goals</Label>
            <TagInput
              tags={persona.goals}
              onChange={(tags) => updatePersona(persona.id, { goals: tags })}
              placeholder="Add goals..."
              max={5}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Where they hang out</Label>
            <div className="flex flex-wrap gap-1.5">
              {AUDIENCE_CHANNELS.map((channel) => {
                const isSelected = persona.channels.includes(channel);
                return (
                  <button
                    key={channel}
                    onClick={() => {
                      const channels = isSelected
                        ? persona.channels.filter((c) => c !== channel)
                        : [...persona.channels, channel];
                      updatePersona(persona.id, { channels });
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
        </motion.div>
      ))}
    </div>
  );
}

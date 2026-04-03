"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import {
  BrandProject,
  Archetype,
  MoodBoard,
  GeneratedMoodBoard,
  BrandGuideline,
  Persona,
  Competitor,
} from "./types";

function createEmptyProject(name: string): BrandProject {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    name,
    createdAt: now,
    updatedAt: now,
    currentPhase: 1,
    strategy: {
      brand: {
        name: "",
        description: "",
        mission: "",
        vision: "",
        businessModels: [],
        businessModelCustom: "",
        salesChannels: [],
        pricingNotes: "",
      },
      audience: {
        personas: [createEmptyPersona()],
      },
      competitors: [],
    },
    personality: {
      primaryArchetype: null,
      secondaryArchetype: null,
      personalitySummary: "",
    },
    creativeBrief: {
      traits: [],
      tone: [],
      experience: [],
      famousFor: "",
      notThis: [],
    },
    moodBoards: [],
    selectedMoodBoardIds: [],
    feedback: {},
    refinedDirection: undefined,
    finalGuideline: undefined,
  };
}

function createEmptyPersona(): Persona {
  return {
    id: uuid(),
    name: "",
    ageRange: "25-34",
    occupation: "",
    painPoints: [],
    goals: [],
    channels: [],
  };
}

function createEmptyCompetitor(): Competitor {
  return {
    id: uuid(),
    website: "",
    name: "",
    description: "",
    strengths: "",
    weaknesses: "",
    visualStyle: [],
  };
}

interface BrandStore {
  projects: BrandProject[];
  activeProjectId: string | null;
  apiKey: string;

  // Project management
  createProject: (name: string) => string;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string) => void;
  getActiveProject: () => BrandProject | null;

  // API key
  setApiKey: (key: string) => void;

  // Phase navigation
  setCurrentPhase: (phase: 1 | 2 | 3 | 4 | 5 | 6) => void;
  canAccessPhase: (phase: number) => boolean;

  // Phase 1: Strategy
  updateBrand: (data: Partial<BrandProject["strategy"]["brand"]>) => void;
  addPersona: () => void;
  updatePersona: (id: string, data: Partial<Persona>) => void;
  removePersona: (id: string) => void;
  addCompetitor: () => void;
  updateCompetitor: (id: string, data: Partial<Competitor>) => void;
  removeCompetitor: (id: string) => void;

  // Phase 2: Personality
  setPrimaryArchetype: (archetype: Archetype) => void;
  setSecondaryArchetype: (archetype: Archetype) => void;
  setPersonalitySummary: (summary: string) => void;

  // Phase 3: Creative Brief
  updateCreativeBrief: (data: Partial<BrandProject["creativeBrief"]>) => void;

  // Phase 4: Mood Boards
  setMoodBoards: (boards: MoodBoard[]) => void;
  setGeneratedMoodBoards: (boards: GeneratedMoodBoard[]) => void;
  selectGeneratedBoard: (id: string) => void;
  updateGeneratedBoard: (id: string, updates: Partial<GeneratedMoodBoard>) => void;
  toggleMoodBoardSelection: (id: string) => void;

  // Phase 5: Refinement
  updateFeedback: (data: Partial<BrandProject["feedback"]>) => void;
  setRefinedDirection: (board: MoodBoard) => void;

  // Phase 6: Guidelines
  setFinalGuideline: (guideline: BrandGuideline) => void;

  // Reset
  resetProject: () => void;
}

function updateProject(
  state: BrandStore,
  updater: (project: BrandProject) => Partial<BrandProject>,
) {
  const idx = state.projects.findIndex((p) => p.id === state.activeProjectId);
  if (idx === -1) return state;
  const updated = {
    ...state.projects[idx],
    ...updater(state.projects[idx]),
    updatedAt: new Date().toISOString(),
  };
  const projects = [...state.projects];
  projects[idx] = updated;
  return { projects };
}

export const useBrandStore = create<BrandStore>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      apiKey: "",

      createProject: (name: string) => {
        const project = createEmptyProject(name);
        set((s) => ({
          projects: [...s.projects, project],
          activeProjectId: project.id,
        }));
        return project.id;
      },

      deleteProject: (id: string) => {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
        }));
      },

      setActiveProject: (id: string) => set({ activeProjectId: id }),

      getActiveProject: () => {
        const state = get();
        return (
          state.projects.find((p) => p.id === state.activeProjectId) ?? null
        );
      },

      setApiKey: (key: string) => set({ apiKey: key }),

      setCurrentPhase: (phase) =>
        set((s) => updateProject(s, () => ({ currentPhase: phase }))),

      canAccessPhase: (phase: number) => {
        const project = get().getActiveProject();
        if (!project) return false;
        return phase <= project.currentPhase;
      },

      updateBrand: (data) =>
        set((s) =>
          updateProject(s, (p) => ({
            strategy: {
              ...p.strategy,
              brand: { ...p.strategy.brand, ...data },
            },
          })),
        ),

      addPersona: () =>
        set((s) =>
          updateProject(s, (p) => ({
            strategy: {
              ...p.strategy,
              audience: {
                personas: [
                  ...p.strategy.audience.personas,
                  createEmptyPersona(),
                ],
              },
            },
          })),
        ),

      updatePersona: (id, data) =>
        set((s) =>
          updateProject(s, (p) => ({
            strategy: {
              ...p.strategy,
              audience: {
                personas: p.strategy.audience.personas.map((per) =>
                  per.id === id ? { ...per, ...data } : per,
                ),
              },
            },
          })),
        ),

      removePersona: (id) =>
        set((s) =>
          updateProject(s, (p) => ({
            strategy: {
              ...p.strategy,
              audience: {
                personas: p.strategy.audience.personas.filter(
                  (per) => per.id !== id,
                ),
              },
            },
          })),
        ),

      addCompetitor: () =>
        set((s) =>
          updateProject(s, (p) => ({
            strategy: {
              ...p.strategy,
              competitors: [...p.strategy.competitors, createEmptyCompetitor()],
            },
          })),
        ),

      updateCompetitor: (id, data) =>
        set((s) =>
          updateProject(s, (p) => ({
            strategy: {
              ...p.strategy,
              competitors: p.strategy.competitors.map((c) =>
                c.id === id ? { ...c, ...data } : c,
              ),
            },
          })),
        ),

      removeCompetitor: (id) =>
        set((s) =>
          updateProject(s, (p) => ({
            strategy: {
              ...p.strategy,
              competitors: p.strategy.competitors.filter((c) => c.id !== id),
            },
          })),
        ),

      setPrimaryArchetype: (archetype) =>
        set((s) =>
          updateProject(s, (p) => ({
            personality: { ...p.personality, primaryArchetype: archetype },
          })),
        ),

      setSecondaryArchetype: (archetype) =>
        set((s) =>
          updateProject(s, (p) => ({
            personality: { ...p.personality, secondaryArchetype: archetype },
          })),
        ),

      setPersonalitySummary: (summary) =>
        set((s) =>
          updateProject(s, (p) => ({
            personality: { ...p.personality, personalitySummary: summary },
          })),
        ),

      updateCreativeBrief: (data) =>
        set((s) =>
          updateProject(s, (p) => ({
            creativeBrief: { ...p.creativeBrief, ...data },
          })),
        ),

      setMoodBoards: (boards) =>
        set((s) => updateProject(s, () => ({ moodBoards: boards }))),

      setGeneratedMoodBoards: (boards) =>
        set((s) => updateProject(s, () => ({ generatedMoodBoards: boards }))),

      selectGeneratedBoard: (id) =>
        set((s) => updateProject(s, () => ({ selectedGeneratedBoardId: id }))),

      updateGeneratedBoard: (id, updates) =>
        set((s) =>
          updateProject(s, (p) => ({
            generatedMoodBoards: (p.generatedMoodBoards || []).map((b) =>
              b.id === id ? { ...b, ...updates } : b,
            ),
          })),
        ),

      toggleMoodBoardSelection: (id) =>
        set((s) =>
          updateProject(s, (p) => {
            const selected = p.selectedMoodBoardIds.includes(id)
              ? p.selectedMoodBoardIds.filter((i) => i !== id)
              : p.selectedMoodBoardIds.length < 2
                ? [...p.selectedMoodBoardIds, id]
                : p.selectedMoodBoardIds;
            return { selectedMoodBoardIds: selected };
          }),
        ),

      updateFeedback: (data) =>
        set((s) =>
          updateProject(s, (p) => ({
            feedback: { ...p.feedback, ...data },
          })),
        ),

      setRefinedDirection: (board) =>
        set((s) => updateProject(s, () => ({ refinedDirection: board }))),

      setFinalGuideline: (guideline) =>
        set((s) => updateProject(s, () => ({ finalGuideline: guideline }))),

      resetProject: () => {
        const state = get();
        const project = state.getActiveProject();
        if (!project) return;
        const fresh = createEmptyProject(project.name);
        fresh.id = project.id;
        fresh.createdAt = project.createdAt;
        set((s) => ({
          projects: s.projects.map((p) => (p.id === project.id ? fresh : p)),
        }));
      },
    }),
    {
      name: "brandforge-storage",
    },
  ),
);

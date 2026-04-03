"use client";

import { BrandProject, BrandGuideline } from "@/lib/types";
import { getArchetype } from "@/lib/archetypes";

interface GuidelineDocumentProps {
  project: BrandProject;
  guideline: BrandGuideline;
}

export default function GuidelineDocument({
  project,
  guideline,
}: GuidelineDocumentProps) {
  const primaryArch = project.personality.primaryArchetype
    ? getArchetype(project.personality.primaryArchetype)
    : null;
  const secondaryArch = project.personality.secondaryArchetype
    ? getArchetype(project.personality.secondaryArchetype)
    : null;

  return (
    <div
      id="brand-guideline"
      className="space-y-10 bg-card rounded-2xl border border-border/50 overflow-hidden"
    >
      {/* Cover */}
      <div className="p-12 text-center border-b border-border/30 bg-gradient-to-b from-primary/5 to-transparent">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {project.strategy.brand.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          Brand Identity Guidelines
        </p>
      </div>

      {/* Overview */}
      <Section title="Brand Overview">
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {guideline.overview}
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-lg bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Mission
            </p>
            <p className="text-sm">{project.strategy.brand.mission}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/20">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Vision
            </p>
            <p className="text-sm">{project.strategy.brand.vision}</p>
          </div>
        </div>
      </Section>

      {/* Archetypes */}
      <Section title="Brand Archetypes">
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed mb-4">
          {guideline.archetypeDescription}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {primaryArch && (
            <div className="p-4 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground mb-1">Primary</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{primaryArch.icon}</span>
                <span className="font-semibold">{primaryArch.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {primaryArch.tagline}
              </p>
            </div>
          )}
          {secondaryArch && (
            <div className="p-4 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground mb-1">Secondary</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{secondaryArch.icon}</span>
                <span className="font-semibold">{secondaryArch.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {secondaryArch.tagline}
              </p>
            </div>
          )}
        </div>
      </Section>

      {/* Voice */}
      <Section title="Brand Voice">
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed mb-4">
          {guideline.voiceGuidelines.toneDescription}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10">
            <p className="text-xs font-medium text-green-400 mb-2">Do</p>
            <ul className="space-y-1.5">
              {guideline.voiceGuidelines.dos.map((d, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-green-400 mt-0.5">+</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
            <p className="text-xs font-medium text-red-400 mb-2">Don&apos;t</p>
            <ul className="space-y-1.5">
              {guideline.voiceGuidelines.donts.map((d, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-red-400 mt-0.5">-</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Colors */}
      <Section title="Color Palette">
        <div className="grid grid-cols-5 gap-3">
          {guideline.colorPalette.map((color) => (
            <div key={color.hex}>
              <div
                className="h-20 rounded-lg mb-2 ring-1 ring-white/10"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-sm font-medium">{color.name}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {color.hex}
              </p>
              <p className="text-xs text-muted-foreground">{color.usage}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground mb-2">
              Primary (Headings)
            </p>
            <p
              className="text-3xl font-bold"
              style={{
                fontFamily: `"${guideline.typography.primaryFont}", sans-serif`,
              }}
            >
              {guideline.typography.primaryFont}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk
            </p>
          </div>
          <div className="p-5 rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground mb-2">
              Secondary (Body)
            </p>
            <p
              className="text-3xl"
              style={{
                fontFamily: `"${guideline.typography.secondaryFont}", sans-serif`,
              }}
            >
              {guideline.typography.secondaryFont}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk
            </p>
          </div>
        </div>
        <div className="border border-border/30 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-muted/10">
                <th className="text-left p-3 font-medium text-muted-foreground">
                  Element
                </th>
                <th className="text-left p-3 font-medium text-muted-foreground">
                  Size
                </th>
                <th className="text-left p-3 font-medium text-muted-foreground">
                  Weight
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(guideline.typography.hierarchy).map(
                ([key, val]) => (
                  <tr key={key} className="border-b border-border/20">
                    <td className="p-3 font-medium uppercase text-xs">{key}</td>
                    <td className="p-3 text-muted-foreground font-mono">
                      {val.size}
                    </td>
                    <td className="p-3 text-muted-foreground">{val.weight}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Visual Style */}
      <Section title="Visual Style">
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {guideline.visualStyle}
        </p>
      </Section>

      {/* Logo */}
      <Section title="Logo Direction">
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {guideline.logoGuidance}
        </p>
      </Section>

      {/* Don'ts */}
      <Section title="Brand Don'ts">
        <div className="grid grid-cols-2 gap-2">
          {guideline.brandDonts.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/10"
            >
              <span className="text-red-400 text-sm">x</span>
              <span className="text-sm text-muted-foreground">{d}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-10 pb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border/30" />
        <span>{title}</span>
        <div className="h-px flex-1 bg-border/30" />
      </h2>
      {children}
    </div>
  );
}

"use client";

import jsPDF from "jspdf";
import { BrandProject, BrandGuideline } from "./types";
import { getArchetype } from "./archetypes";

export async function generatePDF(
  project: BrandProject,
  guideline: BrandGuideline,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 0;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const checkPageBreak = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      addPage();
    }
  };

  // Cover page
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.text(project.strategy.brand.name || "Brand", pageW / 2, 100, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.setTextColor(160, 160, 160);
  doc.text("Brand Identity Guidelines", pageW / 2, 115, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, pageW / 2, 130, {
    align: "center",
  });

  // Overview
  addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.text("Brand Overview", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const overviewLines = doc.splitTextToSize(guideline.overview, contentW);
  doc.text(overviewLines, margin, y);
  y += overviewLines.length * 5 + 10;

  checkPageBreak(30);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.text("Mission", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const missionLines = doc.splitTextToSize(
    project.strategy.brand.mission,
    contentW,
  );
  doc.text(missionLines, margin, y);
  y += missionLines.length * 5 + 8;

  checkPageBreak(30);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.text("Vision", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const visionLines = doc.splitTextToSize(
    project.strategy.brand.vision,
    contentW,
  );
  doc.text(visionLines, margin, y);
  y += visionLines.length * 5 + 10;

  // Archetypes
  checkPageBreak(50);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.text("Brand Archetypes", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const archLines = doc.splitTextToSize(
    guideline.archetypeDescription,
    contentW,
  );
  doc.text(archLines, margin, y);
  y += archLines.length * 5 + 8;

  const primary = project.personality.primaryArchetype
    ? getArchetype(project.personality.primaryArchetype)
    : null;
  const secondary = project.personality.secondaryArchetype
    ? getArchetype(project.personality.secondaryArchetype)
    : null;

  if (primary) {
    checkPageBreak(15);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.text(`Primary: ${primary.name} - ${primary.tagline}`, margin, y);
    y += 8;
  }
  if (secondary) {
    checkPageBreak(15);
    doc.text(`Secondary: ${secondary.name} - ${secondary.tagline}`, margin, y);
    y += 10;
  }

  // Voice
  addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.text("Brand Voice", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const toneLines = doc.splitTextToSize(
    guideline.voiceGuidelines.toneDescription,
    contentW,
  );
  doc.text(toneLines, margin, y);
  y += toneLines.length * 5 + 10;

  checkPageBreak(40);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.text("Do:", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  guideline.voiceGuidelines.dos.forEach((d) => {
    checkPageBreak(8);
    doc.text(`+ ${d}`, margin + 4, y);
    y += 5;
  });
  y += 5;

  checkPageBreak(40);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.text("Don't:", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  guideline.voiceGuidelines.donts.forEach((d) => {
    checkPageBreak(8);
    doc.text(`- ${d}`, margin + 4, y);
    y += 5;
  });

  // Color Palette
  addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.text("Color Palette", margin, y);
  y += 12;

  const swatchW = (contentW - 8) / Math.min(guideline.colorPalette.length, 5);
  guideline.colorPalette.forEach((color, i) => {
    const x = margin + (i % 5) * (swatchW + 2);
    if (i > 0 && i % 5 === 0) {
      y += 35;
      checkPageBreak(35);
    }

    const hex = color.hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    doc.setFillColor(r, g, b);
    doc.roundedRect(x, y, swatchW - 2, 18, 2, 2, "F");

    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(color.name, x, y + 22);
    doc.text(color.hex, x, y + 26);
    doc.text(color.usage, x, y + 30);
  });

  // Typography
  y += 40;
  checkPageBreak(60);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.text("Typography", margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(
    `Primary (Headings): ${guideline.typography.primaryFont}`,
    margin,
    y,
  );
  y += 7;
  doc.text(
    `Secondary (Body): ${guideline.typography.secondaryFont}`,
    margin,
    y,
  );
  y += 10;

  doc.setFontSize(10);
  Object.entries(guideline.typography.hierarchy).forEach(([key, val]) => {
    checkPageBreak(8);
    doc.setTextColor(80, 80, 80);
    doc.text(`${key.toUpperCase()}: ${val.size} / ${val.weight}`, margin, y);
    y += 5;
  });

  // Visual Style + Logo
  addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.text("Visual Style", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const vsLines = doc.splitTextToSize(guideline.visualStyle, contentW);
  doc.text(vsLines, margin, y);
  y += vsLines.length * 5 + 12;

  checkPageBreak(50);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.text("Logo Direction", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const logoLines = doc.splitTextToSize(guideline.logoGuidance, contentW);
  doc.text(logoLines, margin, y);
  y += logoLines.length * 5 + 12;

  // Don'ts
  checkPageBreak(50);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.text("Brand Don'ts", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  guideline.brandDonts.forEach((d) => {
    checkPageBreak(8);
    doc.text(`x  ${d}`, margin, y);
    y += 6;
  });

  doc.save(`${project.strategy.brand.name || "brand"}-guidelines.pdf`);
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBrandStore } from "@/lib/store";
import { PHASES } from "@/lib/constants";

export default function WorkshopPage() {
  const router = useRouter();
  const { getActiveProject } = useBrandStore();
  const project = getActiveProject();

  useEffect(() => {
    if (project) {
      const phase = PHASES.find((p) => p.number === project.currentPhase);
      if (phase) router.replace(phase.path);
    }
  }, [project, router]);

  return null;
}

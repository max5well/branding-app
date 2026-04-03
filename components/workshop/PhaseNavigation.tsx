"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PHASES } from "@/lib/constants";
import { useBrandStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check, Lock } from "lucide-react";

export default function PhaseNavigation() {
  const pathname = usePathname();
  const { canAccessPhase, getActiveProject } = useBrandStore();
  const project = getActiveProject();
  const currentPhase = project?.currentPhase ?? 1;

  return (
    <nav className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-sm p-6 flex flex-col gap-2 shrink-0">
      <Link href="/" className="mb-6 group">
        <h2 className="text-lg font-bold tracking-tight group-hover:text-primary/80 transition-colors">
          BrandForge
        </h2>
        <p className="text-xs text-muted-foreground">Brand Workshop</p>
      </Link>

      <div className="flex flex-col gap-1">
        {PHASES.map((phase) => {
          const isActive = pathname === phase.path;
          const isCompleted = currentPhase > phase.number;
          const isAccessible = canAccessPhase(phase.number);
          const isCurrent = currentPhase === phase.number;

          return (
            <Link
              key={phase.number}
              href={isAccessible ? phase.path : "#"}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : isAccessible
                    ? "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    : "text-muted-foreground/40 cursor-not-allowed",
              )}
              onClick={(e) => !isAccessible && e.preventDefault()}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium border transition-all duration-200 shrink-0",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                      ? "border-primary/50 bg-primary/20 text-primary"
                      : isCurrent
                        ? "border-primary/50 text-primary"
                        : "border-border text-muted-foreground/50",
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : !isAccessible ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  phase.number
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate">{phase.name}</span>
                <span className="text-[10px] text-muted-foreground/60 truncate">
                  {phase.description}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activePhase"
                  className="absolute inset-0 rounded-lg border border-primary/20 bg-primary/5"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentPhase - 1) / 5) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span>{Math.round(((currentPhase - 1) / 5) * 100)}%</span>
        </div>
      </div>
    </nav>
  );
}

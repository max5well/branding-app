"use client";

import { motion } from "framer-motion";

export default function PhaseHeader({
  phase,
  title,
  description,
}: {
  phase: number;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Phase {phase}
        </span>
        <div className="h-px flex-1 bg-border/50" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </motion.div>
  );
}

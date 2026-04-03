"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBrandStore } from "@/lib/store";
import PhaseNavigation from "@/components/workshop/PhaseNavigation";

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { activeProjectId } = useBrandStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !activeProjectId) {
      router.push("/");
    }
  }, [hydrated, activeProjectId, router]);

  if (!hydrated || !activeProjectId) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <PhaseNavigation />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}

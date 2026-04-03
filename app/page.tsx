"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBrandStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  ArrowRight,
  Trash2,
  Sparkles,
  Palette,
  Target,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const {
    projects,
    createProject,
    deleteProject,
    setActiveProject,
  } = useBrandStore();
  const [newProjectName, setNewProjectName] = useState("");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const id = createProject(newProjectName.trim());
    setActiveProject(id);
    setShowNewDialog(false);
    setNewProjectName("");
    router.push("/workshop/strategy");
  };

  const handleOpenProject = (id: string) => {
    setActiveProject(id);
    router.push("/workshop");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">BrandForge</h1>
            <p className="text-xs text-muted-foreground">
              Professional Brand Identity Workshop
            </p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <Sparkles className="w-3 h-3" />
              AI-Enhanced Branding Workshop
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Build your brand identity
              <br />
              <span className="text-muted-foreground">
                like a top-tier agency
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              A guided, step-by-step workshop that produces a complete brand
              guideline. Strategy, personality, creative direction, and visual
              identity — all in one place.
            </p>

            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
              <DialogTrigger
                render={<Button size="lg" className="gap-2 text-base px-8" />}
              >
                <Plus className="w-5 h-5" />
                Start New Project
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Brand Project</DialogTitle>
                  <DialogDescription>
                    Give your project a name to get started.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="My Brand"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                  autoFocus
                />
                <DialogFooter>
                  <Button
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim()}
                  >
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Brand Strategy",
              desc: "Define your mission, audience, and competitive landscape",
            },
            {
              icon: Palette,
              title: "Creative Direction",
              desc: "AI-generated mood boards with colors, typography, and visual style",
            },
            {
              icon: Layers,
              title: "Brand Guidelines",
              desc: "Export a complete, professional brand guideline document",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 rounded-xl border border-border/50 bg-card/30"
            >
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Existing Projects */}
      {projects.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Your Projects</h3>
            <div className="grid gap-3">
              <AnimatePresence>
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors group"
                  >
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="flex-1 text-left"
                    >
                      <h4 className="font-medium">
                        {project.name || "Untitled"}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>Phase {project.currentPhase}/6</span>
                        <span>
                          Updated{" "}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenProject(project.id)}
                        className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Continue
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>

                      <Dialog
                        open={deleteId === project.id}
                        onOpenChange={(open) =>
                          setDeleteId(open ? project.id : null)
                        }
                      >
                        <DialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Project</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete &quot;
                              {project.name}&quot;? This cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setDeleteId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                deleteProject(project.id);
                                setDeleteId(null);
                              }}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

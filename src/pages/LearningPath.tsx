import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLearner } from "@/contexts/LearnerContext";
import { DemoProfileSwitcher } from "@/components/common/DemoProfileSwitcher";
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  Target,
  Brain,
  AlertCircle,
  Play,
  Layers,
  ChevronDown,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export const LearningPath: React.FC = () => {
  const navigate = useNavigate();
  const { learningPath, profile, activeProfileId } = useLearner();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(learningPath[4]?.id || learningPath[0]?.id);

  const selectedNode = learningPath.find((n) => n.id === selectedNodeId) || learningPath[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed ✓</span>;
      case "current":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/20 text-primary border border-primary/30 animate-pulse">Current Focus ←</span>;
      case "adapted":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">⚡ AI Adapted</span>;
      case "recommended":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Up Next</span>;
      case "locked":
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Dynamically Generated Roadmap
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground font-mono">Tailored for {profile.goal}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            Personalized Learning Path
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            This roadmap continuously recalculates based on your quiz performance and concept mastery.
          </p>
        </div>

        <DemoProfileSwitcher />
      </div>

      {/* ── ADAPTIVE REASONING SUMMARY ──────────────────────────── */}
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed text-foreground/90">
            <strong>Tutor Rationale:</strong> {profile.whyThisPath}
          </div>
        </div>

        <Link
          to="/assessment"
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          Retake Assessment
        </Link>
      </div>

      {/* ── 2-COLUMN ROADMAP VIEW ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: VISUAL VERTICAL ROADMAP (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
            Sequential Skill Trajectory ({learningPath.length} Milestones)
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-4">
            {/* Vertical connector line */}
            <div className="absolute left-[23px] sm:left-[31px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-border" />

            {learningPath.map((node, index) => {
              const isSelected = selectedNode.id === node.id;
              const isCompleted = node.status === "completed";
              const isCurrent = node.status === "current";
              const isAdapted = node.status === "adapted";
              const isLocked = node.status === "locked";

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={cn(
                    "relative flex items-start gap-4 p-5 rounded-3xl border transition-all cursor-pointer group",
                    isSelected
                      ? "bg-card border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/40 scale-[1.01]"
                      : "bg-card/70 border-border hover:bg-card hover:border-primary/30"
                  )}
                >
                  {/* Node icon pill */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-transform group-hover:scale-110",
                      isCompleted && "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
                      isCurrent && "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20",
                      isAdapted && "bg-amber-500 text-black shadow-md shadow-amber-500/30",
                      node.status === "recommended" && "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                      isLocked && "bg-muted text-muted-foreground border border-border"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isAdapted ? (
                      <Zap className="w-5 h-5" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <span>{node.stepNumber}</span>
                    )}
                  </div>

                  {/* Node details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {node.category}
                      </span>
                      {getStatusBadge(node.status)}
                    </div>

                    <h3 className={cn("text-base font-bold truncate", isSelected ? "text-primary" : "text-foreground")}>
                      {node.title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>

                    {/* Adaptive Callout Note */}
                    {node.isAdaptedReason && (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
                        {node.isAdaptedReason}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {node.estimatedTime}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-foreground/80">{node.difficulty}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED NODE INSPECTION CARD (5 COLS STICKY) */}
        <div className="lg:col-span-5 sticky top-6 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-primary/30 shadow-2xl space-y-6 relative overflow-hidden bg-gradient-to-b from-primary/10 via-card to-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Milestone Details
              </span>
              {getStatusBadge(selectedNode.status)}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground">
                {selectedNode.title}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Target Skill */}
            <div className="p-4 rounded-2xl bg-background/70 border border-border space-y-2 text-xs">
              <div className="font-bold text-foreground">Core Competency Developed:</div>
              <div className="text-primary font-semibold flex items-center gap-1.5">
                <Target className="w-4 h-4 shrink-0" />
                <span>{selectedNode.skillDeveloped}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                <div className="text-muted-foreground font-semibold">Estimated Time</div>
                <div className="text-sm font-bold text-foreground mt-0.5">{selectedNode.estimatedTime}</div>
              </div>
              <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                <div className="text-muted-foreground font-semibold">Difficulty</div>
                <div className="text-sm font-bold text-foreground mt-0.5">{selectedNode.difficulty}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">Milestone Completion</span>
                <span className="text-primary font-mono">{selectedNode.completionPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${selectedNode.completionPercent}%` }}
                />
              </div>
            </div>

            {/* Action CTA */}
            <div className="space-y-3 pt-2">
              <Link
                to={`/learn/${selectedNode.lessonId}`}
                className="btn-primary w-full py-3.5 text-center font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/25"
              >
                <span>Launch Lesson & Interactive Tools</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/practice"
                className="w-full py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-center text-foreground block transition-colors"
              >
                Practice Questions on this Topic
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default LearningPath;

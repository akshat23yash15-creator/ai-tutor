import React from "react";
import { useLearner } from "@/contexts/LearnerContext";
import { Sparkles, UserCheck, ShieldAlert, GraduationCap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  className?: string;
  variant?: "pill" | "compact" | "badge";
}

export const DemoProfileSwitcher: React.FC<Props> = ({ className, variant = "pill" }) => {
  const { activeProfileId, switchDemoProfile, profile } = useLearner();

  const options: { id: "beginner" | "intermediate" | "advanced"; name: string; level: string; color: string; desc: string }[] = [
    {
      id: "beginner",
      name: "Alex",
      level: "Beginner",
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      desc: "Syntax fundamentals, zero jargon"
    },
    {
      id: "intermediate",
      name: "Akshat",
      level: "Intermediate",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      desc: "ML & Bias-Variance diagnostic"
    },
    {
      id: "advanced",
      name: "Elena",
      level: "Advanced",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      desc: "FlashAttention & LoRA Tuning"
    }
  ];

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-sm",
              profile.level === "Beginner" && "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
              profile.level === "Intermediate" && "bg-blue-500/10 border-blue-500/30 text-blue-400",
              profile.level === "Advanced" && "bg-purple-500/10 border-purple-500/30 text-purple-400",
              className
            )}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Demo: <strong className="font-bold">{profile.name}</strong> ({profile.level})</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-card/95 backdrop-blur-xl border-border p-2">
          <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Switch Demo Learner
          </DropdownMenuLabel>
          <p className="text-[11px] text-muted-foreground px-2 pb-2 leading-relaxed">
            Click to see the AI tutor dynamically re-generate the roadmap & dashboard:
          </p>
          <DropdownMenuSeparator />
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.id}
              onClick={() => switchDemoProfile(opt.id)}
              className={cn(
                "flex flex-col items-start gap-1 p-2.5 rounded-xl cursor-pointer transition-all",
                activeProfileId === opt.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  {opt.name}
                  {activeProfileId === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </span>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", opt.color)}>
                  {opt.level}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{opt.desc}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-1 p-1 bg-card/80 border border-border rounded-2xl shadow-sm backdrop-blur-md", className)}>
      <div className="flex items-center gap-1 px-2.5 py-1 text-xs text-muted-foreground font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">Demo Persona:</span>
      </div>
      {options.map((opt) => {
        const isActive = activeProfileId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => switchDemoProfile(opt.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            title={opt.desc}
          >
            <span>{opt.name}</span>
            <span className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-medium hidden md:inline",
              isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
            )}>
              {opt.level}
            </span>
          </button>
        );
      })}
    </div>
  );
};

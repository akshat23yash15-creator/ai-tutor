import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLearner } from "@/contexts/LearnerContext";
import { DemoProfileSwitcher } from "@/components/common/DemoProfileSwitcher";
import {
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  Zap,
  Target,
  BookOpen,
  Award,
  Layers,
  Bot,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Calendar,
  ChevronRight,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

export const DashBoard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, learningPath, toggleDailyPlanItem, adaptiveEvents } = useLearner();

  // Find current node in roadmap
  const currentNode = learningPath.find((n) => n.status === "current") || learningPath[4];
  const completedNodesCount = learningPath.filter((n) => n.status === "completed").length;

  // Determine time-appropriate greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 17) return "Good afternoon";
    return "Good evening";
  };

  const latestAdaptation = profile.recentAdaptiveDecision || {
    timestamp: "Today at 2:15 PM",
    trigger: "Recent quiz score on Bias vs Variance was 54% (below 60% threshold).",
    score: 54,
    action: "reduced" as const,
    description: "We noticed that you struggled with Bias vs Variance. Your next lesson has been adjusted.",
    beforePath: "Advanced Model Evaluation",
    afterPath: "Bias vs Variance → Overfitting & Regularization → Model Evaluation",
    adjustedTopic: "Bias vs Variance"
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20">

      {/* ── TOP HEADER & DEMO SWITCHER ──────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              AI Tutor Command Center
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground font-mono">Real-time Adaptation Active</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-foreground">
            {getGreeting()}, <span className="gradient-text">{profile.name}</span>.
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what your AI tutor has calibrated for your session today.
          </p>
        </div>

        {/* Demo switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <DemoProfileSwitcher />
        </div>
      </div>

      {/* ── SECTION 6: "YOUR TUTOR ADAPTED YOUR PATH" ALERT BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/15 via-card to-card p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 text-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  Adaptive Engine Triggered
                </span>
                <span className="text-xs text-muted-foreground font-mono">{latestAdaptation.timestamp}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-foreground">
                Your Tutor Adapted Your Path
              </h2>

              <p className="text-sm text-foreground/80 max-w-2xl leading-relaxed">
                {latestAdaptation.description}
              </p>

              {/* Before vs After Path comparison */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 font-mono text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-background/60 border border-border text-muted-foreground line-through">
                  Before: {latestAdaptation.beforePath}
                </div>
                <ChevronRight className="w-4 h-4 text-primary shrink-0 hidden sm:inline" />
                <div className="px-3 py-1.5 rounded-xl bg-primary/20 border border-primary/40 text-primary font-bold">
                  Now: {latestAdaptation.afterPath}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Link
              to={`/learn/${currentNode.lessonId}`}
              className="btn-primary flex items-center justify-center gap-2 px-6 py-3 font-bold text-sm shadow-xl shadow-primary/25"
            >
              <span>Review Adapted Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/learning-path"
              className="px-4 py-2 rounded-xl text-center border border-border bg-card/60 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Inspect Full Roadmap
            </Link>
          </div>
        </div>
      </div>

      {/* ── KEY METRICS STRIP (SECTION 12) ───────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Progress</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{profile.overallProgress}%</div>
          <div className="text-[11px] text-muted-foreground mt-1">{completedNodesCount} of {learningPath.length} milestones</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Weekly Time</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{profile.weeklyHoursSpent}h</div>
          <div className="text-[11px] text-muted-foreground mt-1">Goal: 5.0h/week</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Questions</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{profile.questionsSolved}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Adaptive practice</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Accuracy</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">{profile.accuracyRate}%</div>
          <div className="text-[11px] text-emerald-500 mt-1">+6% vs last week</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">{profile.streakDays} Days</div>
          <div className="text-[11px] text-muted-foreground mt-1">Active momentum</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Mastered</span>
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{profile.conceptsMastered}</div>
          <div className="text-[11px] text-muted-foreground mt-1">AI core concepts</div>
        </div>
      </div>

      {/* ── 2-COLUMN MAIN CONTENT: TODAY'S PLAN vs CURRENT ROADMAP NODE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: TODAY'S PERSONALIZED STUDY PLAN (SECTION 15) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Today's Personalized Plan</h3>
                  <p className="text-xs text-muted-foreground">
                    Target: {profile.dailyCommitmentMinutes} min • Calibrated for {profile.learningPace.toLowerCase()} pace
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                {profile.dailyPlan.filter((i) => i.completed).length} / {profile.dailyPlan.length} Done
              </span>
            </div>

            {/* Daily items */}
            <div className="space-y-3">
              {profile.dailyPlan.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => toggleDailyPlanItem(item.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all",
                    item.completed
                      ? "bg-muted/40 border-border/60 opacity-75"
                      : "bg-card border-border hover:border-primary/40 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0",
                        item.completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-muted-foreground/40 hover:border-primary"
                      )}
                    >
                      {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>

                    <div className="min-w-0">
                      <div className={cn("text-sm font-bold truncate", item.completed && "line-through text-muted-foreground")}>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground capitalize">
                        {item.type} module
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                      {item.durationMinutes} min
                    </span>
                    {item.lessonId && (
                      <Link
                        to={item.type === "practice" ? "/practice" : `/learn/${item.lessonId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors"
                        title="Launch activity"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Total planned: {profile.dailyPlan.reduce((acc, curr) => acc + curr.durationMinutes, 0)} min
              </span>

              <Link
                to={`/learn/${currentNode.lessonId}`}
                className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-1.5"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* AI TUTOR RECOMMENDATIONS (SECTION 14) */}
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">AI Tutor Recommendations</h3>
              </div>
              <span className="text-xs text-muted-foreground font-mono">Personalized for you</span>
            </div>

            <div className="space-y-3">
              {profile.weaknesses.map((w, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-sm font-bold text-foreground">{w.name}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-400">
                        {w.score}% Mastery
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground/80">Reason:</strong> {w.reason}
                    </p>
                  </div>

                  <Link
                    to={`/learn/${w.recommendedLessonId}`}
                    className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors shrink-0"
                  >
                    Review Concept
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CURRENT FOCUS MODULE & SKILL PULSE */}
        <div className="lg:col-span-5 space-y-6">

          {/* Current Active Roadmap Node Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-primary/30 shadow-xl space-y-5 relative overflow-hidden bg-gradient-to-b from-primary/5 via-card to-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Current Focus Module
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                Step {currentNode.stepNumber} of {learningPath.length}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-black text-foreground">
                {currentNode.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentNode.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-background/60 border border-border space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">Module Progress</span>
                <span className="text-primary font-mono">{currentNode.completionPercent}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${currentNode.completionPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>Estimated: {currentNode.estimatedTime}</span>
                <span className="text-primary font-semibold">{currentNode.difficulty} Difficulty</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                to={`/learn/${currentNode.lessonId}`}
                className="btn-primary w-full py-3 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                <span>Enter Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/practice"
                className="w-full py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-center text-foreground transition-colors"
              >
                Take Diagnostic Practice Quiz
              </Link>
            </div>
          </div>

          {/* AI Skill Map Snapshot */}
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold text-foreground">AI Skill Mastery Snapshot</h4>
              </div>
              <Link to="/progress" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <span>View Full Map</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {Object.entries(profile.skills).slice(0, 5).map(([skill, score]) => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground/90">{skill}</span>
                    <span className="font-mono text-muted-foreground">{score}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-blue-500" : "bg-amber-500"
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Tutor Help trigger */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-card to-primary/10 border border-border flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-foreground">Need quick clarification?</div>
              <div className="text-[11px] text-muted-foreground">Ask the AI tutor anything 24/7</div>
            </div>
            <Link
              to="/tutor"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask Tutor</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashBoard;

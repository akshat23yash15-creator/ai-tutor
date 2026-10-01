import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLearner } from "@/contexts/LearnerContext";
import { DemoProfileSwitcher } from "@/components/common/DemoProfileSwitcher";
import {
  Brain,
  TrendingUp,
  Target,
  Award,
  Clock,
  Flame,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers,
  ChevronRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

export const Progress: React.FC = () => {
  const { profile } = useLearner();
  const [chartView, setChartView] = useState<"radar" | "bars">("radar");

  // Prepare Radar data
  const radarData = Object.entries(profile.skills).map(([subject, score]) => ({
    subject,
    score,
    fullMark: 100
  }));

  // Categories
  const strongSkills = Object.entries(profile.skills).filter(([_, s]) => s >= 80);
  const improvingSkills = Object.entries(profile.skills).filter(([_, s]) => s >= 60 && s < 80);
  const needsPracticeSkills = Object.entries(profile.skills).filter(([_, s]) => s < 60);

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Continuous Assessment Analytics
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">Proof of Measurable Improvement</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            AI Skill Map & Progress
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Real-time breakdown of concepts mastered, accuracy acceleration over time, and automated weakness detection.
          </p>
        </div>

        <DemoProfileSwitcher />
      </div>

      {/* ── KEY METRICS SUMMARY STRIP (SECTION 12) ──────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Overall</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{profile.overallProgress}%</div>
          <div className="text-[11px] text-emerald-400 mt-1">Accelerated</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Weekly Study</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{profile.weeklyHoursSpent}h</div>
          <div className="text-[11px] text-muted-foreground mt-1">4h 35m total</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Solved</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{profile.questionsSolved}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Adaptive drills</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Accuracy</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">{profile.accuracyRate}%</div>
          <div className="text-[11px] text-emerald-500 mt-1">+26% over 4 weeks</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">{profile.streakDays} Days</div>
          <div className="text-[11px] text-muted-foreground mt-1">High retention</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase">Mastered</span>
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground mt-2">{profile.conceptsMastered}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Verified units</div>
        </div>
      </div>

      {/* ── 2-COLUMN SECTION: RADAR CHART (5 COLS) - IMPROVEMENT GRAPH (7 COLS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT: AI SKILL MAP RADAR / BARS (5 COLS) ────────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">AI Skill Map</h3>
                  <p className="text-xs text-muted-foreground">Domain Competency Radar</p>
                </div>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted border border-border text-xs">
                <button
                  onClick={() => setChartView("radar")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-bold transition-all",
                    chartView === "radar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Radar
                </button>
                <button
                  onClick={() => setChartView("bars")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-bold transition-all",
                    chartView === "bars" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Bars
                </button>
              </div>
            </div>

            {chartView === "radar" ? (
              <div className="h-[280px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5563" />
                    <Radar
                      name="Mastery"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.45}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#1e293b",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px"
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(profile.skills).map(([skill, score]) => (
                  <div key={skill} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{skill}</span>
                      <span className="font-mono text-primary">{score}%</span>
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
            )}

            {/* Categorized Skills Breakdown */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strong Competencies (&gt;80%):</span>
                </div>
                <p className="text-muted-foreground">
                  {strongSkills.map(([s]) => s).join(", ") || "Python syntax and basic scripting"}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                <div className="font-bold text-blue-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Improving Rapidly (60–80%):</span>
                </div>
                <p className="text-muted-foreground">
                  {improvingSkills.map(([s]) => s).join(", ") || "Machine Learning algorithms, Statistics"}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Needs Practice (&lt;60%):</span>
                </div>
                <p className="text-muted-foreground">
                  {needsPracticeSkills.map(([s]) => s).join(", ") || "Deep Learning, NLP & GenAI Architectures"}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── RIGHT: VISUAL PROOF OF IMPROVEMENT (7 COLS) ────── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Improvement Chart: 52% -> 61% -> 68% -> 78% */}
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Measurable Progress
                </span>
                <h3 className="text-xl font-black text-foreground">
                  Accuracy Acceleration Over Time
                </h3>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  Week 1 (52%) → Week 4 ({profile.accuracyRate}%)
                </span>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profile.weeklyAccuracyTrends}>
                  <defs>
                    <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                  <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} fontWeight={600} />
                  <YAxis domain={[40, 100]} stroke="#9ca3af" fontSize={11} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy Rate (%)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#accuracyGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Conclusion: Personalized repetition resolved prerequisite bottlenecks, boosting accuracy by <strong>+26%</strong>.
              </span>
              <span className="text-emerald-400 font-mono font-bold shrink-0">P &lt; 0.01</span>
            </div>
          </div>

          {/* SECTION 13: WEAKNESS DETECTION & RECOMMENDED REVISION */}
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-primary/30 shadow-xl space-y-5 relative overflow-hidden bg-gradient-to-b from-primary/5 via-card to-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-foreground">Concepts You Struggle With</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Weakness Detection Active
              </span>
            </div>

            <div className="space-y-3">
              {profile.weaknesses.map((w, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-background/80 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-sm font-bold text-foreground">
                        {i + 1}. {w.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.2 rounded-full">
                        Accuracy: {w.score}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong>AI Tutor Diagnostic:</strong> {w.reason}
                    </p>
                  </div>

                  <Link
                    to={`/learn/${w.recommendedLessonId}`}
                    className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors shrink-0"
                  >
                    Start Revision
                  </Link>
                </div>
              ))}
            </div>

            {/* Recommended Revision note */}
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground">Recommended Next Action:</div>
                <div className="text-muted-foreground">
                  Review these 3 concepts before advancing to Deep Learning & Transformer Architectures.
                </div>
              </div>

              <Link
                to="/learn/bias-variance"
                className="btn-primary px-5 py-2.5 font-bold text-xs shrink-0 flex items-center gap-1.5"
              >
                <span>Launch Priority Revision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Progress;

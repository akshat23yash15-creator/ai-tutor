import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Compass,
  Zap,
  TrendingUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Bot,
  Layers,
  ChevronRight,
  Flame,
  Award,
  BarChart3
} from "lucide-react";
import { DemoProfileSwitcher } from "@/components/common/DemoProfileSwitcher";
import { useLearner } from "@/contexts/LearnerContext";
import Footer from "@/components/layout/Footer";

const Home: React.FC = () => {
  const { profile } = useLearner();

  return (
    <div className="min-h-screen flex flex-col pt-6 px-4 md:px-8 max-w-7xl mx-auto space-y-16 animate-in fade-in pb-20">

      {/* ── TOP DEMO SWITCHER BAR ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-card/60 border border-border backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Interactive Hackathon Demo Mode Active
          </span>
        </div>
        <DemoProfileSwitcher />
      </div>

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-14 shadow-2xl border border-primary/20 bg-gradient-to-br from-card via-card/90 to-primary/10">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] bg-primary/15 pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full blur-[100px] bg-accent/15 pointer-events-none translate-y-1/2 -translate-x-1/4" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Personalized AI Tutor for Learning AI</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-foreground">
              Learn AI. <br />
              <span className="gradient-text">Your Way.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              An adaptive AI tutor that understands what you know, what you want to achieve, and how you learn best. No generic video dumps.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/assessment"
                className="btn-primary flex items-center gap-2.5 px-7 py-3.5 text-base font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Build My Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-foreground font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-primary" />
                <span>Explore Demo</span>
              </Link>
            </div>

            {/* Quick social proof / highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero static courses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Continuous adaptive difficulty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real-time weakness detection</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Personalized Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border bg-card/90 backdrop-blur-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    AI
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">Tutor Status</div>
                    <div className="text-sm font-bold text-foreground">Path Dynamically Calibrated</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/20">
                  {profile.level} Level
                </span>
              </div>

              {/* Tutor prompt bubble */}
              <div className="p-3.5 rounded-2xl bg-muted/60 border border-border text-xs leading-relaxed text-foreground/90">
                <span className="font-bold text-primary">Tutor Note:</span> "Akshat, we skipped basic Python loops because you already know them. We adjusted your next module to focus on <strong>Bias vs Variance</strong>."
              </div>

              {/* Progress mini bars */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Current Goal: {profile.goal}</span>
                  <span className="text-primary font-bold">{profile.overallProgress}% Complete</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${profile.overallProgress}%` }}
                  />
                </div>
              </div>

              {/* Roadmap preview pills */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Your AI Sequence Today:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/80 text-xs">
                    <span className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      NumPy & Pandas Foundations
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Mastered
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-primary/10 border border-primary/30 text-xs shadow-sm">
                    <span className="flex items-center gap-2 font-bold text-primary">
                      <Flame className="w-4 h-4 text-primary animate-pulse" />
                      Bias vs Variance & Regularization
                    </span>
                    <span className="text-[10px] text-primary font-bold bg-primary/20 px-2 py-0.5 rounded-full">
                      Focus Topic
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/50 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 opacity-40" />
                      Model Evaluation & ROC-AUC
                    </span>
                    <span className="text-[10px] text-muted-foreground">Up Next</span>
                  </div>
                </div>
              </div>

              <Link
                to="/dashboard"
                className="w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Personalized Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 17: BEFORE / AFTER PERSONALIZATION DEMO ──────── */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Zap className="w-3.5 h-3.5" />
            <span>The Core Innovation</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Traditional Platforms vs. Our AI Tutor
          </h2>
          <p className="text-muted-foreground text-sm">
            Why rigid courses fail modern learners, and how continuous adaptation changes everything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional One-Size-Fits-All */}
          <div className="p-8 rounded-3xl bg-card/60 border border-red-500/20 shadow-lg space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Traditional Online Courses</h3>
                <p className="text-xs text-muted-foreground">Rigid, static, linear</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15 text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Everyone gets the exact same curriculum:</p>
              <div className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
                <div className="p-1.5 rounded bg-background/50 border border-border">1. Introduction to Python (Forced even if you code daily)</div>
                <div className="p-1.5 rounded bg-background/50 border border-border">2. Basic Statistics (Static video lecture)</div>
                <div className="p-1.5 rounded bg-background/50 border border-border">3. Generic Machine Learning</div>
                <div className="p-1.5 rounded bg-background/50 border border-border">4. Deep Learning</div>
                <div className="p-1.5 rounded bg-background/50 border border-border">5. NLP & GenAI</div>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Beginners get overwhelmed and quit early.</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Experienced devs waste hours on beginner syntax.</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Failing a quiz just tells you "Try again" with zero path change.</span>
              </li>
            </ul>
          </div>

          {/* LearnAI Adaptive Tutor */}
          <div className="p-8 rounded-3xl bg-card border border-primary/40 shadow-xl space-y-6 relative overflow-hidden bg-gradient-to-b from-primary/5 via-card to-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">LearnAI Adaptive Tutor</h3>
                  <p className="text-xs text-primary font-medium">Customized specifically for you</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                100% Adaptive
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">Your Assessed Baseline:</span>
                <span className="text-emerald-400 font-mono">Python ✓ | Stats △ | ML ✗</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex justify-between">
                  <span>⚡ Skipped Beginner Python</span>
                  <span>Saved 8 hours</span>
                </div>
                <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 flex justify-between">
                  <span>▲ Strengthen Statistics Fundamentals</span>
                  <span>Targeted Review</span>
                </div>
                <div className="p-1.5 rounded bg-primary/20 border border-primary/30 text-primary font-bold flex justify-between">
                  <span>● Bias vs Variance & Diagnostic Sandbox</span>
                  <span>Current Focus</span>
                </div>
                <div className="p-1.5 rounded bg-background/50 border border-border text-muted-foreground flex justify-between">
                  <span>↓ Deep Learning & LLM Systems</span>
                  <span>Unlocked Next</span>
                </div>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-foreground/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Skips what you know, zero wasted time.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Detects your weaknesses and injects targeted revision.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Difficulty dynamically tunes based on quiz scores.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS: 5-STEP LOOP ────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Compass className="w-3.5 h-3.5" />
            <span>The Learning Loop</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground text-sm">
            A continuous feedback loop designed to prove measurable improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Assess",
              desc: "Tell us what you know, your background, and your target career goal.",
              icon: Target,
              color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
            },
            {
              step: "02",
              title: "Personalize",
              desc: "AI builds a custom learning path with prerequisites mapped to your pace.",
              icon: Brain,
              color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
            },
            {
              step: "03",
              title: "Practice",
              desc: "Learn by doing: interactive sandboxes, code checks, and conceptual problems.",
              icon: BookOpen,
              color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            },
            {
              step: "04",
              title: "Adapt",
              desc: "Your path and difficulty dynamically adjust based on every quiz score.",
              icon: Zap,
              color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
            },
            {
              step: "05",
              title: "Improve",
              desc: "See measurable skill growth on radar maps and weekly accuracy trends.",
              icon: TrendingUp,
              color: "text-primary bg-primary/10 border-primary/20"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between group hover:border-primary/40 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-black text-muted-foreground/60">{item.step}</span>
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE TUTOR CHAT PREVIEW ───────────────────────── */}
      <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-card via-card to-primary/10 border border-border shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Always At Your Side</span>
            <h2 className="text-3xl font-extrabold text-foreground">
              An AI Tutor That Knows Your Weaknesses
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stuck on mathematical notation? Click "Explain Simpler" or chat directly with the AI Tutor. It will give intuitive analogies, generate custom practice questions, and verify your comprehension before letting you proceed.
            </p>
            <div className="pt-2">
              <Link
                to="/tutor"
                className="btn-primary inline-flex items-center gap-2 text-sm font-bold py-3 px-6"
              >
                <Bot className="w-4 h-4" />
                <span>Chat with AI Tutor</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-background/80 border border-border rounded-2xl p-5 shadow-inner space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                You
              </div>
              <div className="p-3 rounded-2xl bg-muted text-xs text-foreground max-w-md">
                "Why does increasing model polynomial degree cause overfitting?"
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                AI
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border text-xs leading-relaxed space-y-2 text-foreground/90 max-w-lg shadow-sm">
                <p>
                  A high-degree polynomial has too much flexibility. Instead of learning the smooth underlying trend, it contorts itself to pass through every random noise point in your training data!
                </p>
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-primary font-medium">
                  💡 <strong>Quick Check:</strong> Would adding L2 (Ridge) Regularization increase or decrease this variance?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CALL TO ACTION ────────────────────────────────── */}
      <section className="text-center py-10 space-y-6">
        <h2 className="text-3xl md:text-5xl font-black text-foreground">
          Ready to experience truly personalized AI learning?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-base">
          Take the 2-minute assessment to unlock your custom AI roadmap.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/assessment" className="btn-primary text-base px-8 py-3.5 font-bold shadow-xl shadow-primary/25">
            Start Free Assessment
          </Link>
          <Link to="/practice" className="px-6 py-3.5 rounded-xl border border-border hover:bg-muted font-bold text-sm">
            Try Adaptive Practice
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

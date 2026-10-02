import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLearner, AssessmentData } from "@/contexts/LearnerContext";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Brain,
  Target,
  Clock,
  Zap,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Layers,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const EXPERIENCES = [
  { id: "Beginner", title: "Beginner", desc: "Little to no prior coding or math background" },
  { id: "Some programming", title: "Some programming experience", desc: "Written basic scripts, comfortable with loops & functions" },
  { id: "Intermediate", title: "Intermediate", desc: "2+ years building applications in Python, JS, or similar" },
  { id: "Advanced", title: "Advanced", desc: "Strong engineering or data science background, deep math fluency" }
];

const LANGUAGES = ["Python", "JavaScript", "C++", "Java", "None"];

const AI_TOPICS = [
  "Python for AI",
  "NumPy",
  "Pandas",
  "Statistics",
  "Linear Algebra",
  "Machine Learning",
  "Deep Learning",
  "Neural Networks",
  "NLP",
  "Computer Vision",
  "Generative AI",
  "LLMs"
];

const GOALS = [
  { id: "Become an ML Engineer", title: "Become an ML Engineer", desc: "Production models, pipeline deployment, scikit-learn & PyTorch" },
  { id: "Learn AI for projects", title: "Learn AI for projects", desc: "Integrate intelligent features and APIs into apps quickly" },
  { id: "Prepare for AI interviews", title: "Prepare for AI interviews", desc: "Master algorithms, theory, system design, and coding challenges" },
  { id: "Build GenAI applications", title: "Build GenAI applications", desc: "RAG architectures, LLM fine-tuning, and multi-agent agents" },
  { id: "Learn ML from scratch", title: "Learn Machine Learning from scratch", desc: "Intuitive foundation without getting lost in math jargon" },
  { id: "Research / advanced AI", title: "Research / advanced AI", desc: "Cutting-edge papers, custom architectures, and loss formulations" }
];

const PACES: ("Relaxed" | "Balanced" | "Intensive")[] = ["Relaxed", "Balanced", "Intensive"];

const TIMES = [
  { minutes: 15, label: "15 min", desc: "Quick daily bite-sized concepts" },
  { minutes: 30, label: "30 min", desc: "Steady, sustainable daily progress" },
  { minutes: 45, label: "45 min", desc: "Accelerated mastery (Recommended)" },
  { minutes: 90, label: "90+ min", desc: "Full immersion bootcamp speed" }
];

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { applyAssessment, profile } = useLearner();

  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  // Form states
  const [experience, setExperience] = useState<string>("Intermediate");
  const [languages, setLanguages] = useState<string[]>(["Python", "JavaScript"]);
  const [aiTopics, setAiTopics] = useState<string[]>(["Python for AI", "NumPy", "Pandas"]);
  const [goal, setGoal] = useState<string>("Become an ML Engineer");
  const [pace, setPace] = useState<"Relaxed" | "Balanced" | "Intensive">("Balanced");
  const [dailyMinutes, setDailyMinutes] = useState<number>(45);

  const toggleLanguage = (lang: string) => {
    if (lang === "None") {
      setLanguages(["None"]);
      return;
    }
    setLanguages((prev) => {
      const filtered = prev.filter((l) => l !== "None");
      return filtered.includes(lang) ? filtered.filter((l) => l !== lang) : [...filtered, lang];
    });
  };

  const toggleAiTopic = (topic: string) => {
    setAiTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleFinishAssessment = async () => {
    setIsGenerating(true);

    const data: AssessmentData = {
      experience,
      languages,
      aiTopics,
      goal,
      pace,
      dailyMinutes,
      name: "Learner"
    };

    try {
      await applyAssessment(data);
    } catch (err) {
      console.warn("Assessment execution error:", err);
    } finally {
      setIsGenerating(false);
      setShowResult(true);
    }
  };

  // ── GENERATING STATE ────────────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-card border border-primary/30 shadow-2xl text-center space-y-6 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <Brain className="w-8 h-8 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">Calibrating AI Tutor...</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Synthesizing your baseline knowledge, pruning prerequisite topics you've already mastered, and constructing your personalized path.
            </p>
          </div>
          <div className="space-y-2 text-left bg-muted/50 p-4 rounded-2xl text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Diagnosing programming baseline...</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Detecting knowledge gaps...</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generating adaptive sequence for {goal}...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN (SECTION 3) ───────────────────────────────────────────────
  if (showResult) {
    return (
      <div className="min-h-screen py-10 px-4 md:px-8 max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Diagnostic Complete</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground">
            Your AI Learning Profile
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            We analyzed your background and synthesized a personalized path designed for maximum retention.
          </p>
        </div>

        {/* Profile Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="text-xs font-bold text-muted-foreground uppercase">Assessed Level</div>
            <div className="text-2xl font-black text-foreground mt-1">{profile.level}</div>
            <div className="text-[11px] text-primary mt-1">Based on prior coding</div>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="text-xs font-bold text-muted-foreground uppercase">Target Goal</div>
            <div className="text-lg font-black text-foreground mt-1 truncate">{goal}</div>
            <div className="text-[11px] text-muted-foreground mt-1">Primary outcome</div>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="text-xs font-bold text-muted-foreground uppercase">Recommended Pace</div>
            <div className="text-2xl font-black text-foreground mt-1">{dailyMinutes} min/day</div>
            <div className="text-[11px] text-muted-foreground mt-1">{pace} tempo</div>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="text-xs font-bold text-muted-foreground uppercase">Estimated Path</div>
            <div className="text-2xl font-black text-primary mt-1">12 Weeks</div>
            <div className="text-[11px] text-emerald-400 mt-1">Accelerated path</div>
          </div>
        </div>

        {/* Strengths vs Attention */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-card border border-emerald-500/20 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Current Strengths (Skipping Basics)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {languages.filter(l => l !== "None").concat(aiTopics.slice(0, 2)).map((item, i) => (
                <span key={i} className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              You won't waste time on beginner syntax or introductory installation videos.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-amber-500/20 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Needs Attention (Priority Modules)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {["Applied Statistics", "Bias vs Variance", "Gradient Descent"].map((item, i) => (
                <span key={i} className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              We injected extra interactive practice problems for these concepts.
            </p>
          </div>
        </div>

        {/* WHY THIS PATH EXPLANATION CARD (MOST CRITICAL DEMO PIECE) */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/30 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">Why this path?</h3>
              <p className="text-xs text-primary font-medium">Tutor Reasoning Engine</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border text-sm leading-relaxed text-foreground/90 space-y-3">
            <p>
              You already know <strong>{languages.filter(l => l !== "None").join(", ") || "fundamental programming"}</strong>, so we are skipping beginner programming lessons entirely.
            </p>
            <p>
              Your assessment indicates that <strong>Applied Statistics</strong> and <strong>Machine Learning fundamentals</strong> (specifically Model Evaluation & Bias vs Variance) need more practice before diving into Deep Learning and LLMs.
            </p>
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center gap-2">
              <Compass className="w-4 h-4 shrink-0" />
              <span>Therefore, your path starts with: Statistics Foundations → Core ML → Bias vs Variance → Model Evaluation</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary w-full sm:w-auto px-8 py-3.5 font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/25"
            >
              <span>Launch My Personalized Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/learning-path")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-card hover:bg-muted font-bold text-sm text-foreground flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-primary" />
              <span>View Learning Roadmap</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ONBOARDING QUESTION STEPS ───────────────────────────────────────────────
  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-3xl mx-auto space-y-8 animate-in fade-in">
      {/* Header & Step progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Step {step} of 6
            </span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {Math.round((step / 6) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* ── STEP 1: Current Experience ────────────────────────── */}
      {step === 1 && (
        <div className="p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6 animate-in fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              What is your current experience level?
            </h2>
            <p className="text-sm text-muted-foreground">
              This helps us calibrate starting difficulty and avoid patronizing explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {EXPERIENCES.map((item) => (
              <button
                key={item.id}
                onClick={() => setExperience(item.id)}
                className={cn(
                  "flex items-start justify-between p-4 rounded-2xl border text-left transition-all",
                  experience === item.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:bg-muted/60"
                )}
              >
                <div>
                  <div className="font-bold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
                {experience === item.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 2: Programming Knowledge ─────────────────────── */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6 animate-in fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Which programming languages do you know?
            </h2>
            <p className="text-sm text-muted-foreground">
              Select all that apply. If you choose Python, we skip beginner syntax!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => {
              const isSelected = languages.includes(lang);
              return (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border font-bold text-sm transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted/60 text-foreground"
                  )}
                >
                  <span>{lang}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 3: AI Knowledge Checkboxes ──────────────────── */}
      {step === 3 && (
        <div className="p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6 animate-in fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Which AI concepts are you familiar with?
            </h2>
            <p className="text-sm text-muted-foreground">
              Check everything you have studied or applied before.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AI_TOPICS.map((topic) => {
              const isSelected = aiTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleAiTopic(topic)}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-2xl border text-xs font-semibold transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border hover:bg-muted/60 text-foreground"
                  )}
                >
                  <span className="truncate">{topic}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 4: Learning Goal ────────────────────────────── */}
      {step === 4 && (
        <div className="p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6 animate-in fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              What is your primary learning goal?
            </h2>
            <p className="text-sm text-muted-foreground">
              Your entire roadmap will be organized around this target milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {GOALS.map((item) => (
              <button
                key={item.id}
                onClick={() => setGoal(item.id)}
                className={cn(
                  "flex items-start justify-between p-4 rounded-2xl border text-left transition-all",
                  goal === item.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:bg-muted/60"
                )}
              >
                <div>
                  <div className="font-bold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
                {goal === item.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 5: Learning Pace ────────────────────────────── */}
      {step === 5 && (
        <div className="p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6 animate-in fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              What is your preferred learning pace?
            </h2>
            <p className="text-sm text-muted-foreground">
              We modulate repetition frequency and quiz intensity based on your tempo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: "Relaxed",
                title: "Relaxed",
                desc: "Gentle step-by-step walkthroughs with ample review time."
              },
              {
                id: "Balanced",
                title: "Balanced",
                desc: "Healthy mix of conceptual theory, interactive practice, and quizzes."
              },
              {
                id: "Intensive",
                title: "Intensive",
                desc: "High volume of coding challenges, fast-tracked theory, rigorous checkpoints."
              }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setPace(item.id as any)}
                className={cn(
                  "p-5 rounded-2xl border flex flex-col justify-between text-left transition-all",
                  pace === item.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:bg-muted/60"
                )}
              >
                <div>
                  <div className="font-bold text-foreground text-base mb-1">{item.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                </div>
                {pace === item.id && (
                  <span className="mt-4 text-xs font-bold text-primary flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Selected
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 6: Daily Learning Time ───────────────────────── */}
      {step === 6 && (
        <div className="p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6 animate-in fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              How much time can you commit daily?
            </h2>
            <p className="text-sm text-muted-foreground">
              We will structure your daily planner into manageable micro-sessions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIMES.map((item) => (
              <button
                key={item.minutes}
                onClick={() => setDailyMinutes(item.minutes)}
                className={cn(
                  "p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center",
                  dailyMinutes === item.minutes
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:bg-muted/60"
                )}
              >
                <Clock className={cn("w-6 h-6 mb-2", dailyMinutes === item.minutes ? "text-primary" : "text-muted-foreground")} />
                <div className="text-lg font-black text-foreground">{item.label}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted font-bold text-sm flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {step < 6 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="btn-primary px-7 py-3 font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinishAssessment}
            className="btn-primary px-8 py-3.5 font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/30 animate-bounce"
            style={{ animationIterationCount: 3 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate My AI Profile</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Assessment;

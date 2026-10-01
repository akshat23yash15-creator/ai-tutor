import React, { useState } from "react";
import { useLearner } from "@/contexts/LearnerContext";
import { MOCK_PRACTICE_QUESTIONS, PracticeQuestion } from "@/data/mockQuestions";
import { DemoProfileSwitcher } from "@/components/common/DemoProfileSwitcher";
import {
  PenTool,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  ArrowRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Target,
  Award,
  Filter,
  Check,
  Brain,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Python",
  "Statistics",
  "Machine Learning",
  "Deep Learning",
  "Generative AI",
  "LLMs"
];

const DIFFICULTIES = ["All", "Adaptive", "Easy", "Medium", "Hard"];

export const Practice: React.FC = () => {
  const { recordQuizScore, profile } = useLearner();

  const [activeCategory, setActiveCategory] = useState<string>("Machine Learning");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("Adaptive");

  // Filter questions
  const filteredQuestions = MOCK_PRACTICE_QUESTIONS.filter((q) => {
    const matchCategory = activeCategory === "All" || q.category === activeCategory;
    const matchDifficulty =
      activeDifficulty === "All" ||
      activeDifficulty === "Adaptive" ||
      q.difficulty.toLowerCase() === activeDifficulty.toLowerCase();
    return matchCategory && matchDifficulty;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [sessionResults, setSessionResults] = useState<{ questionId: string; isCorrect: boolean }[]>([]);
  const [adaptiveDecision, setAdaptiveDecision] = useState<any>(null);

  const currentQ: PracticeQuestion = filteredQuestions[currentIndex] || MOCK_PRACTICE_QUESTIONS[0];

  const handleOptionSelect = (idx: number) => {
    if (!isSubmitted) {
      setSelectedOption(idx);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    const newResults = [...sessionResults, { questionId: currentQ.id, isCorrect }];
    setSessionResults(newResults);

    // Calculate score percentage
    const totalAttempted = newResults.length;
    const totalCorrect = newResults.filter((r) => r.isCorrect).length;
    const scorePct = Math.round((totalCorrect / totalAttempted) * 100);

    // Call adaptive engine
    const event = recordQuizScore(currentQ.conceptTested, scorePct, 1, currentQ.category);
    setAdaptiveDecision(event);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleResetSession = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setSessionResults([]);
    setAdaptiveDecision(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Adaptive Practice Center
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">Real-time Difficulty Calibrator</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            Learn By Doing
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Submit answers to test your intuition. The AI tutor evaluates your response and tunes subsequent challenges.
          </p>
        </div>

        <DemoProfileSwitcher />
      </div>

      {/* ── FILTERS BAR ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Domain:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentIndex(0);
                setIsSubmitted(false);
                setSelectedOption(null);
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">Difficulty:</span>
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setActiveDifficulty(diff);
                setCurrentIndex(0);
                setIsSubmitted(false);
                setSelectedOption(null);
              }}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                activeDifficulty === diff
                  ? diff === "Adaptive"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black"
                    : "bg-card border border-primary text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {diff === "Adaptive" ? "⚡ Adaptive" : diff}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2-COLUMN LAYOUT: QUESTION (8 COLS) - ADAPTIVE DECISION (4 COLS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT: QUESTION & INTERACTIVE SUBMISSION (8 COLS) ── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">

            {/* Question Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {currentQ.category}
                </span>
                <span className="text-xs font-mono font-semibold text-muted-foreground">
                  Question {currentIndex + 1} of {filteredQuestions.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                    currentQ.difficulty === "Easy" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    currentQ.difficulty === "Medium" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    currentQ.difficulty === "Hard" && "bg-red-500/10 text-red-400 border-red-500/20"
                  )}
                >
                  {currentQ.difficulty} Difficulty
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Tested: <strong>{currentQ.conceptTested}</strong>
                </span>
              </div>
            </div>

            {/* Question Title & Prompt */}
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black text-foreground">
                {currentQ.title}
              </h2>
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-medium">
                {currentQ.question}
              </p>
            </div>

            {/* Optional code snippet */}
            {currentQ.codeSnippet && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-border font-mono text-xs text-slate-200 overflow-x-auto">
                <pre>{currentQ.codeSnippet}</pre>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let stateClass = "border-border hover:bg-muted/60 text-foreground";
                if (isSubmitted) {
                  if (isCorrect) {
                    stateClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
                  } else if (isSelected && !isCorrect) {
                    stateClass = "bg-red-500/20 border-red-500 text-red-400";
                  } else {
                    stateClass = "border-border/50 opacity-60";
                  }
                } else if (isSelected) {
                  stateClass = "bg-primary/10 border-primary text-primary font-bold ring-1 ring-primary/40";
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleOptionSelect(idx)}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-start gap-3",
                      stateClass
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-xl border flex items-center justify-center text-xs font-mono shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-muted-foreground/30 text-muted-foreground"
                      )}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {isSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint toggle before submit */}
            {!isSubmitted && (
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 italic">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Hint: {currentQ.hint}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={handleResetSession}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Session</span>
              </button>

              {!isSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="btn-primary px-8 py-3 text-sm font-bold shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="btn-primary px-8 py-3 text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* EXPLANATION PANEL (AFTER SUBMISSION) */}
            {isSubmitted && (
              <div
                className={cn(
                  "p-6 rounded-3xl border space-y-3 animate-in fade-in",
                  selectedOption === currentQ.correctIndex
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-sm">
                    {selectedOption === currentQ.correctIndex ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5" /> Correct Answer! Concept Verified.
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1.5">
                        <XCircle className="w-5 h-5" /> Incorrect. Diagnostic logged.
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    Correct: Option {String.fromCharCode(65 + currentQ.correctIndex)}
                  </span>
                </div>

                <div className="space-y-1 text-xs leading-relaxed text-foreground/90">
                  <div className="font-bold text-foreground">Why this is the answer:</div>
                  <p>{currentQ.explanation}</p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    to={`/learn/bias-variance`}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Read in-depth lesson on {currentQ.conceptTested}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── RIGHT: ADAPTIVE DECISION CARD (SECTION 9) (4 COLS) ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Real-Time Tutor Decision Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-primary/30 shadow-2xl space-y-5 relative overflow-hidden bg-gradient-to-b from-primary/10 via-card to-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary animate-pulse" />
                Adaptive Tutor Decision
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                Auto-Calibrating
              </span>
            </div>

            {adaptiveDecision ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-background/80 border border-border space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Current Accuracy</span>
                    <span className={cn(
                      "font-mono text-sm",
                      adaptiveDecision.score >= 85 ? "text-emerald-400" : adaptiveDecision.score >= 60 ? "text-blue-400" : "text-amber-400"
                    )}>
                      {adaptiveDecision.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        adaptiveDecision.score >= 85 ? "bg-emerald-500" : adaptiveDecision.score >= 60 ? "bg-blue-500" : "bg-amber-500"
                      )}
                      style={{ width: `${adaptiveDecision.score}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs leading-relaxed">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-primary" />
                    <span>Decision for: {adaptiveDecision.topic}</span>
                  </div>
                  <p className="text-muted-foreground">
                    {adaptiveDecision.recommendation}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-[11px] font-mono text-primary">
                  <strong>Trajectory Impact:</strong> {adaptiveDecision.pathAdjustment}
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>
                  Submit an answer above to trigger the <strong>Adaptive Engine</strong>.
                </p>
                <div className="p-3 rounded-2xl bg-muted/50 border border-border space-y-1.5 font-mono text-[11px]">
                  <div>• Score &lt; 60% → Eases difficulty & injects revision</div>
                  <div>• Score 60-84% → Maintains tempo & adds practice</div>
                  <div>• Score &gt;= 85% → Elevates difficulty & skips basics</div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-border">
              <Link
                to="/progress"
                className="w-full py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-center text-foreground flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Real-Time Skill Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Session Summary Card */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-3 text-xs">
            <h4 className="font-bold text-foreground">Session Performance</h4>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions Answered:</span>
              <span className="font-mono font-bold text-foreground">{sessionResults.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correct Answers:</span>
              <span className="font-mono font-bold text-emerald-400">
                {sessionResults.filter((r) => r.isCorrect).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Overall Learner Accuracy:</span>
              <span className="font-mono font-bold text-primary">{profile.accuracyRate}%</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Practice;

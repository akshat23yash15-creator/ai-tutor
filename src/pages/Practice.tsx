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
  ArrowLeft,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Target,
  Award,
  Filter,
  Check,
  Brain,
  ChevronRight,
  AlertTriangle,
  Layers,
  Bot
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

  // Filter questions based on category & difficulty
  const filteredQuestions = MOCK_PRACTICE_QUESTIONS.filter((q) => {
    const matchCategory = activeCategory === "All" || q.category === activeCategory;
    const matchDifficulty =
      activeDifficulty === "All" ||
      activeDifficulty === "Adaptive" ||
      q.difficulty.toLowerCase() === activeDifficulty.toLowerCase();
    return matchCategory && matchDifficulty;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [adaptiveDecision, setAdaptiveDecision] = useState<any>(null);

  const currentQ: PracticeQuestion = filteredQuestions[currentIndex] || MOCK_PRACTICE_QUESTIONS[0];
  const selectedOption = userAnswers[currentIndex] ?? null;

  const handleOptionSelect = (optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinishTest = () => {
    // Calculate final test scores
    let correctCount = 0;
    filteredQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const totalQuestions = filteredQuestions.length;
    const scorePct = Math.round((correctCount / totalQuestions) * 100);

    // Call adaptive engine
    const event = recordQuizScore(
      activeCategory === "All" ? "AI Concepts" : activeCategory,
      scorePct,
      totalQuestions,
      activeCategory === "All" ? "Machine Learning" : activeCategory
    );

    setAdaptiveDecision(event);
    setIsTestCompleted(true);
  };

  const handleRestartTest = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsTestCompleted(false);
    setAdaptiveDecision(null);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setUserAnswers({});
    setCurrentIndex(0);
    setIsTestCompleted(false);
    setAdaptiveDecision(null);
  };

  // Evaluation calculations
  const totalQuestions = filteredQuestions.length;
  const answeredCount = Object.keys(userAnswers).filter((k) => userAnswers[Number(k)] !== null).length;
  const correctCount = filteredQuestions.filter((q, idx) => userAnswers[idx] === q.correctIndex).length;
  const incorrectCount = filteredQuestions.filter(
    (q, idx) => userAnswers[idx] !== null && userAnswers[idx] !== undefined && userAnswers[idx] !== q.correctIndex
  ).length;
  const skippedCount = totalQuestions - (correctCount + incorrectCount);
  const finalScorePercent = Math.round((correctCount / totalQuestions) * 100);

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
            <span className="text-xs text-muted-foreground font-mono">Test & Evaluation Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            Learn By Doing
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Complete the questions and evaluate your test. Your performance immediately recalibrates the AI Tutor roadmap.
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
              onClick={() => handleCategoryChange(cat)}
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
                setUserAnswers({});
                setCurrentIndex(0);
                setIsTestCompleted(false);
                setAdaptiveDecision(null);
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

      {/* ── CONDITIONAL RENDER: ACTIVE TEST VS EVALUATION REPORT ─── */}
      {!isTestCompleted ? (
        /* ════════════════════════════════════════════════════════════════
           ACTIVE TEST MODE (Participant answering questions)
           ════════════════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LEFT: QUESTION VIEWER (8 COLS) ──────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">

              {/* Question Header & Progress Bar */}
              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
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

                {/* Progress bar */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                  />
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

              {/* Options List (Clean selection without answer reveals) */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-start gap-3.5",
                        isSelected
                          ? "bg-primary/10 border-primary text-primary font-bold shadow-md shadow-primary/10 ring-1 ring-primary/40 scale-[1.01]"
                          : "border-border hover:bg-muted/60 text-foreground"
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
                    </button>
                  );
                })}
              </div>

              {/* Hint note */}
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 italic">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Hint: {currentQ.hint}</span>
              </div>

              {/* Navigation & Submission Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  disabled={currentIndex === 0}
                  onClick={handlePrevious}
                  className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentIndex < filteredQuestions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="btn-primary px-7 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishTest}
                    className="btn-primary px-8 py-3 text-xs font-black flex items-center gap-2 shadow-xl shadow-primary/30 bg-gradient-to-r from-primary to-accent hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit & Evaluate Test</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* ── RIGHT: QUESTION NAVIGATOR SIDEBAR (4 COLS) ──────── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">Test Navigation</h3>
                <span className="text-xs font-mono text-muted-foreground">
                  {answeredCount} of {totalQuestions} Answered
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {filteredQuestions.map((_, idx) => {
                  const isAnswered = userAnswers[idx] !== null && userAnswers[idx] !== undefined;
                  const isCurrent = currentIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        "p-3 rounded-2xl text-xs font-bold flex flex-col items-center justify-center transition-all",
                        isCurrent
                          ? "bg-primary text-primary-foreground ring-2 ring-primary/40 shadow-md"
                          : isAnswered
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black"
                          : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                      )}
                    >
                      <span>Q{idx + 1}</span>
                      <span className="text-[10px] opacity-75 font-normal mt-0.5">
                        {isAnswered ? "✓" : "○"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground space-y-2">
                <div className="font-bold text-foreground">Test Rules:</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Answers are saved automatically as you select them.</li>
                  <li>You can navigate back and forth to review choices.</li>
                  <li>Full answers, scores, and explanations appear upon test submission.</li>
                </ul>
              </div>

              {answeredCount === totalQuestions && (
                <button
                  onClick={handleFinishTest}
                  className="w-full btn-primary py-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ready to Evaluate Test ({totalQuestions}/{totalQuestions})</span>
                </button>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* ════════════════════════════════════════════════════════════════
           EVALUATION MODE (Post-test complete score & question evaluation)
           ════════════════════════════════════════════════════════════════ */
        <div className="space-y-8 animate-in fade-in zoom-in-95">

          {/* ── TOP SCORE & PERFORMANCE EVALUATION BANNER ─────────── */}
          <div className="p-8 rounded-3xl bg-card border border-primary/40 shadow-2xl space-y-6 relative overflow-hidden bg-gradient-to-br from-primary/10 via-card to-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Practice Session Evaluated</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground">
                  Test Results & Evaluation Report
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review what you got correct, analyze mistakes, and see how your AI tutor adapted your curriculum.
                </p>
              </div>

              {/* Big Score Card */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-background/80 border border-border shadow-inner shrink-0">
                <div className="text-center">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Score</div>
                  <div className="text-4xl font-black text-primary font-mono mt-1">
                    {finalScorePercent}%
                  </div>
                  <div className="text-xs font-bold text-muted-foreground mt-0.5">
                    {correctCount} / {totalQuestions} Correct
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between">
                <div>
                  <div className="text-[11px] opacity-80">Correct Answers</div>
                  <div className="text-xl font-bold font-mono mt-0.5">{correctCount}</div>
                </div>
                <CheckCircle2 className="w-6 h-6 shrink-0 opacity-80" />
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between">
                <div>
                  <div className="text-[11px] opacity-80">Incorrect Answers</div>
                  <div className="text-xl font-bold font-mono mt-0.5">{incorrectCount}</div>
                </div>
                <XCircle className="w-6 h-6 shrink-0 opacity-80" />
              </div>

              <div className="p-4 rounded-2xl bg-muted/60 border border-border text-muted-foreground flex items-center justify-between">
                <div>
                  <div className="text-[11px] opacity-80">Skipped</div>
                  <div className="text-xl font-bold font-mono mt-0.5">{skippedCount}</div>
                </div>
                <HelpCircle className="w-6 h-6 shrink-0 opacity-80" />
              </div>

              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-between">
                <div>
                  <div className="text-[11px] opacity-80">Overall Accuracy</div>
                  <div className="text-xl font-bold font-mono mt-0.5">{profile.accuracyRate}%</div>
                </div>
                <Target className="w-6 h-6 shrink-0 opacity-80" />
              </div>
            </div>

            {/* ADAPTIVE TUTOR DECISION (TRIGGERED BY THIS TEST) */}
            {adaptiveDecision && (
              <div className="p-5 rounded-2xl bg-primary/15 border border-primary/40 space-y-2">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span>Real-Time AI Tutor Decision Generated</span>
                </div>
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {adaptiveDecision.reason} {adaptiveDecision.recommendation}
                </p>
                <div className="text-xs font-mono text-primary pt-1">
                  <strong>Roadmap Impact:</strong> {adaptiveDecision.pathAdjustment}
                </div>
              </div>
            )}

            {/* Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleRestartTest}
                className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>

              <div className="flex items-center gap-3">
                <Link
                  to="/learning-path"
                  className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span>View Updated Roadmap</span>
                </Link>

                <Link
                  to="/tutor"
                  className="px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-xs font-bold text-primary flex items-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask Tutor About These Questions</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ── QUESTION-BY-QUESTION IN-DEPTH EVALUATION ──────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                <PenTool className="w-5 h-5 text-primary" />
                <span>Question Evaluation ({totalQuestions} Questions Analyzed)</span>
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Click any question to view step-by-step reasoning
              </span>
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((q, qIdx) => {
                const userChoice = userAnswers[qIdx];
                const isCorrect = userChoice === q.correctIndex;
                const isSkipped = userChoice === null || userChoice === undefined;

                return (
                  <div
                    key={q.id}
                    className={cn(
                      "p-6 rounded-3xl border transition-all space-y-4",
                      isCorrect
                        ? "bg-card border-emerald-500/30 shadow-md shadow-emerald-500/5"
                        : isSkipped
                        ? "bg-card border-amber-500/30"
                        : "bg-card border-red-500/30 shadow-md shadow-red-500/5"
                    )}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-black text-muted-foreground">
                          Question {qIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-foreground">{q.title}</span>
                      </div>

                      {/* Status Badge */}
                      {isCorrect ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                        </span>
                      ) : isSkipped ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4" /> Skipped (0)
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" /> Incorrect (0)
                        </span>
                      )}
                    </div>

                    {/* Question Prompt */}
                    <p className="text-sm font-semibold text-foreground/90 leading-relaxed">
                      {q.question}
                    </p>

                    {/* Code Snippet if present */}
                    {q.codeSnippet && (
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-border font-mono text-xs text-slate-200 overflow-x-auto">
                        <pre>{q.codeSnippet}</pre>
                      </div>
                    )}

                    {/* Options Breakdown with answers highlighted */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isUserChoice = userChoice === oIdx;
                        const isCorrectOption = oIdx === q.correctIndex;

                        return (
                          <div
                            key={oIdx}
                            className={cn(
                              "p-3 rounded-2xl border text-xs font-medium flex items-start gap-3",
                              isCorrectOption && "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-bold",
                              isUserChoice && !isCorrectOption && "bg-red-500/15 border-red-500/50 text-red-400 font-bold",
                              !isUserChoice && !isCorrectOption && "border-border/50 text-muted-foreground opacity-60"
                            )}
                          >
                            <span className="w-5 h-5 rounded-lg border flex items-center justify-center font-mono shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt}</span>

                            {isCorrectOption && (
                              <span className="text-[11px] font-bold text-emerald-400 shrink-0">
                                Correct Option
                              </span>
                            )}
                            {isUserChoice && !isCorrectOption && (
                              <span className="text-[11px] font-bold text-red-400 shrink-0">
                                Your Selection
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* In-Depth Explanation Box */}
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border text-xs leading-relaxed space-y-1.5">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-primary" />
                        <span>AI Tutor In-Depth Explanation:</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
                    </div>

                    {/* Footer tags */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Concept Tested: <strong className="text-foreground">{q.conceptTested}</strong></span>
                      <Link
                        to="/learn/bias-variance"
                        className="text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Study concept lesson</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Practice;

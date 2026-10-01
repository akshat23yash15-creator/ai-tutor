import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLearner } from "@/contexts/LearnerContext";
import { MOCK_LESSONS, Lesson } from "@/data/mockLessons";
import { getTutorReply } from "@/data/mockTutorResponses";
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Bot,
  Send,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Code2,
  Zap,
  Check,
  RotateCcw,
  Lightbulb,
  ExternalLink,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export const Learn: React.FC = () => {
  const { lessonId = "bias-variance" } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const { completedLessons, markLessonComplete, learningPath } = useLearner();

  // Current lesson or fallback
  const lesson: Lesson = MOCK_LESSONS[lessonId] || MOCK_LESSONS["bias-variance"];

  // Interactive modes
  const [activeTab, setActiveTab] = useState<"standard" | "simpler" | "example" | "quiz">("standard");
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Side tutor chat state
  const [tutorMessages, setTutorMessages] = useState<{ role: "user" | "tutor"; text: string; time: string }[]>([
    {
      role: "tutor",
      text: `Hello! I'm your AI lesson assistant. How can I clarify **${lesson.title}** for you today?`,
      time: "Just now"
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const isCompleted = completedLessons.includes(lesson.id);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userEntry = { role: "user" as const, text: query, time: "Just now" };
    setTutorMessages((prev) => [...prev, userEntry]);
    if (!textToSend) setInputMessage("");

    setTimeout(() => {
      const response = getTutorReply(query);
      const tutorEntry = { role: "tutor" as const, text: response.reply, time: "Just now" };
      setTutorMessages((prev) => [...prev, tutorEntry]);
    }, 400);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const handleMarkUnderstood = () => {
    markLessonComplete(lesson.id);
  };

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto space-y-6 animate-in fade-in pb-20">

      {/* ── TOP BREADCRUMB STRIP ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Link to="/learning-path" className="hover:text-primary transition-colors">
            Roadmap
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{lesson.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-bold">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
            {lesson.difficulty}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {lesson.estimatedMinutes} min read
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
            </span>
          )}
        </div>
      </div>

      {/* ── 3-COLUMN WORKSPACE: NAV (2) - CONTENT (7) - TUTOR (3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: LESSONS NAVIGATION (3 COLS) ────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-3xl bg-card border border-border shadow-md space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Module Lessons
            </div>

            <div className="space-y-1.5">
              {Object.values(MOCK_LESSONS).map((item) => {
                const isActive = item.id === lesson.id;
                const isDone = completedLessons.includes(item.id);

                return (
                  <Link
                    key={item.id}
                    to={`/learn/${item.id}`}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isDone ? (
                        <CheckCircle2 className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-emerald-400")} />
                      ) : (
                        <BookOpen className="w-4 h-4 shrink-0 opacity-70" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </div>

                    <span className="text-[10px] opacity-75 font-mono shrink-0 ml-1">
                      {item.estimatedMinutes}m
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-border">
              <Link
                to="/learning-path"
                className="w-full py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-center text-foreground flex items-center justify-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View Full Roadmap</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── CENTER: LESSON CONTENT (6 COLS) ──────────────────── */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto pr-3 scrollbar-thin">

            {/* Title & summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Learning Unit</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground">
                {lesson.title}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lesson.summary}
              </p>
            </div>

            {/* INTERACTIVE CONTROLS ROW (REQUIRED SECTION 8) */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border">
              <button
                onClick={() => setActiveTab("standard")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                  activeTab === "standard"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Standard Lesson
              </button>

              <button
                onClick={() => setActiveTab("simpler")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                  activeTab === "simpler"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Explain Simpler (ELI5)</span>
              </button>

              <button
                onClick={() => setActiveTab("example")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                  activeTab === "example"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Give Me An Example</span>
              </button>

              <button
                onClick={() => setActiveTab("quiz")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                  activeTab === "quiz"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Test Me</span>
              </button>
            </div>

            {/* TAB CONTENT: EXPLAIN SIMPLER */}
            {activeTab === "simpler" && (
              <div className="p-6 rounded-3xl bg-primary/10 border border-primary/30 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>Simplified Intuition (No Jargon)</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                  {lesson.simpleExplanation}
                </p>
                <button
                  onClick={() => setActiveTab("standard")}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  ← Return to technical details
                </button>
              </div>
            )}

            {/* TAB CONTENT: REAL WORLD EXAMPLE */}
            {activeTab === "example" && (
              <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Real-World Engineering Case Study</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {lesson.realWorldExample}
                </p>
                <button
                  onClick={() => setActiveTab("standard")}
                  className="text-xs font-bold text-blue-400 hover:underline"
                >
                  ← Return to lesson
                </button>
              </div>
            )}

            {/* TAB CONTENT: CHECKPOINT QUIZ */}
            {activeTab === "quiz" && (
              <div className="p-6 rounded-3xl bg-card border border-primary/30 space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-primary">
                    Instant Comprehension Check
                  </span>
                  <span className="text-xs text-muted-foreground">1 Question</span>
                </div>

                <div className="text-sm font-bold text-foreground">
                  {lesson.checkpointQuiz.question}
                </div>

                <div className="space-y-2">
                  {lesson.checkpointQuiz.options.map((opt, idx) => {
                    const isSelected = quizSelectedOption === idx;
                    const isCorrect = idx === lesson.checkpointQuiz.correctIndex;

                    return (
                      <button
                        key={idx}
                        disabled={quizSubmitted}
                        onClick={() => setQuizSelectedOption(idx)}
                        className={cn(
                          "w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all",
                          quizSubmitted && isCorrect && "bg-emerald-500/20 border-emerald-500 text-emerald-400",
                          quizSubmitted && isSelected && !isCorrect && "bg-red-500/20 border-red-500 text-red-400",
                          !quizSubmitted && isSelected && "bg-primary/10 border-primary text-primary",
                          !quizSubmitted && !isSelected && "border-border hover:bg-muted/60"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    disabled={quizSelectedOption === null}
                    onClick={handleQuizSubmit}
                    className="btn-primary w-full py-2.5 text-xs font-bold"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-muted/60 border border-border text-xs space-y-2 animate-in fade-in">
                    <div className="font-bold text-foreground">
                      {quizSelectedOption === lesson.checkpointQuiz.correctIndex
                        ? "🎉 Correct! Strong comprehension."
                        : "⚠️ Incorrect. Review the explanation below:"}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {lesson.checkpointQuiz.explanation}
                    </p>
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizSelectedOption(null);
                        setActiveTab("standard");
                      }}
                      className="text-xs font-bold text-primary hover:underline pt-1 block"
                    >
                      Continue Reading
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: STANDARD TECHNICAL MARKDOWN */}
            <div className="prose dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed space-y-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {lesson.content}
              </ReactMarkdown>
            </div>

            {/* CODE DEMONSTRATION SNIPPET */}
            {lesson.codeExample && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-primary" />
                    <span>Hands-On Implementation ({lesson.codeExample.language})</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">Local Simulation</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-border font-mono text-xs text-slate-200 overflow-x-auto">
                  <pre>{lesson.codeExample.code}</pre>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  💡 {lesson.codeExample.explanation}
                </p>
              </div>
            )}

            {/* KEY TAKEAWAYS CARD */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                Key Takeaways
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {lesson.keyTakeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* BOTTOM COMPLETION & NEXT ACTION BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
              <button
                onClick={handleMarkUnderstood}
                className={cn(
                  "w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md",
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                )}
              >
                <Check className="w-4 h-4" />
                <span>{isCompleted ? "Concept Mastered ✓" : "I Understand — Mark Completed"}</span>
              </button>

              <Link
                to="/practice"
                className="btn-primary w-full sm:w-auto px-6 py-3 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                <span>Test With Practice Questions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

        {/* ── RIGHT: IN-LESSON AI TUTOR ASSISTANT (3 COLS) ──────── */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-3xl bg-card border border-border shadow-xl space-y-4 flex flex-col h-[580px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">AI Lesson Tutor</h4>
                  <div className="text-[10px] text-emerald-400 font-mono">Live Guidance</div>
                </div>
              </div>
              <Link to="/tutor" title="Open full chat" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {tutorMessages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-3 rounded-2xl max-w-[90%] leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground font-medium"
                      : "mr-auto bg-muted/60 border border-border text-foreground/90"
                  )}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap gap-1.5 shrink-0 pt-1">
              {[
                "Why high variance?",
                "Give me a formula",
                "Explain like I'm 10"
              ].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(pill)}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-muted hover:bg-primary/10 hover:text-primary transition-colors border border-border font-medium"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5 pt-2 border-t border-border shrink-0"
            >
              <input
                type="text"
                placeholder="Ask about this lesson..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Learn;

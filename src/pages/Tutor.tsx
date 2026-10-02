import React, { useState, useRef, useEffect } from "react";
import { useLearner } from "@/contexts/LearnerContext";
import { getTutorReply } from "@/data/mockTutorResponses";
import { DemoProfileSwitcher } from "@/components/common/DemoProfileSwitcher";
import { tutorChat } from "@/services/api";
import { mapBackendTutorResponseToUI } from "@/services/adapters";
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  MessageSquare,
  Trash2,
  Code2,
  Lightbulb,
  HelpCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  timestamp: string;
  followUps?: string[];
  mode?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const Tutor: React.FC = () => {
  const { profile, backendLearnerId, isOnline } = useLearner();
  const conversationIdRef = useRef<string | undefined>(undefined);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "tutor",
      text: `Hello **${profile.name}**! I'm your dedicated AI Tutor. 

I'm calibrated for your goal of **${profile.goal}**, assessed at **${profile.level}** level, with active focus on **Bias vs Variance & Optimization**.

Ask me any concept question, request intuitive analogies, or ask for practice drills!`,
      timestamp: "Just now",
      followUps: [
        "Explain overfitting and why it happens",
        "Explain gradient descent intuition",
        "Explain this like I'm a beginner",
        "Give me a practice question"
      ]
    }
  ]);

  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeConversation, setActiveConversation] = useState<string>("Overfitting & Gradient Descent");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Reset conversation if learner changes
  useEffect(() => {
    conversationIdRef.current = undefined;
  }, [backendLearnerId]);

  const handleSendMessage = async (textToSend?: string, specificMode?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // Detect mode from text or explicit argument
    let mode: string = specificMode || "explanation";
    const lower = query.toLowerCase();
    if (specificMode) {
      mode = specificMode;
    } else if (lower.includes("simpler") || lower.includes("like i'm a beginner") || lower.includes("eli5")) {
      mode = "simplify";
    } else if (lower.includes("example") || lower.includes("real world")) {
      mode = "example";
    } else if (lower.includes("code") || lower.includes("python") || lower.includes("implementation")) {
      mode = "code";
    } else if (lower.includes("hint") || lower.includes("stuck")) {
      mode = "hint";
    } else if (lower.includes("why am i learning this") || lower.includes("why this next")) {
      mode = "path";
    }

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    let replyHandled = false;

    // Call live ML backend if online
    if (isOnline) {
      try {
        const res = await tutorChat(backendLearnerId, {
          message: query,
          conversation_id: conversationIdRef.current,
          mode,
          current_topic: activeConversation
        });

        if (res.success && res.data) {
          // Persist conversation ID for continuous multi-turn dialogue
          if (res.data.conversationId) {
            conversationIdRef.current = res.data.conversationId;
          }

          const uiData = mapBackendTutorResponseToUI(res.data);
          const tutorMessage: ChatMessage = {
            id: `tut-${Date.now()}`,
            sender: "tutor",
            text: uiData.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            followUps: uiData.followUps,
            quiz: uiData.quiz,
            mode: res.data.mode
          };

          setMessages((prev) => [...prev, tutorMessage]);
          replyHandled = true;
        } else if (res.fallback_data && res.fallback_data.message) {
          // Usable fallback data provided by backend
          const tutorMessage: ChatMessage = {
            id: `tut-${Date.now()}`,
            sender: "tutor",
            text: res.fallback_data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            followUps: res.fallback_data.followUpSuggestions || [],
            quiz: res.fallback_data.checkpointQuestion
          };
          setMessages((prev) => [...prev, tutorMessage]);
          replyHandled = true;
        } else if (res.error?.code === "RATE_LIMITED" || res.error?.code === "MODEL_RATE_LIMIT") {
          toast.warning("Please wait a moment before trying again.", {
            description: res.error.message || "Tutor engine rate limit reached."
          });
        }
      } catch (err) {
        console.warn("Live tutor request failed, using mock fallback:", err);
      }
    }

    // Fallback to local mock response if backend was unavailable or failed
    if (!replyHandled) {
      setTimeout(() => {
        const result = getTutorReply(query);
        const tutorMessage: ChatMessage = {
          id: `tut-${Date.now()}`,
          sender: "tutor",
          text: result.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          followUps: result.followUps,
          quiz: result.quiz
        };
        setMessages((prev) => [...prev, tutorMessage]);
        setIsTyping(false);
      }, 350);
      return;
    }

    setIsTyping(false);
  };

  const handleStartNewChat = () => {
    conversationIdRef.current = undefined;
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: "tutor",
        text: `New conversation started! What AI topic would you like to explore next?`,
        timestamp: "Just now",
        followUps: [
          "Explain Transformers & Self-Attention",
          "What is RAG vs Fine-Tuning?",
          "How does backpropagation work?",
          "Test my knowledge on Machine Learning"
        ]
      }
    ]);
    setActiveConversation("New Topic Session");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] py-6 px-4 md:px-8 max-w-7xl mx-auto flex flex-col space-y-6 animate-in fade-in pb-16">

      {/* ── TOP HEADER & DEMO SWITCHER ──────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-card border border-border shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-foreground">
                LearnAI Personal Tutor
              </h1>
              <span className={cn(
                "w-2 h-2 rounded-full",
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              )} />
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {isOnline ? "Live ML Engine Active" : "Local Tutor Fallback"} • Calibrated for {profile.level} ({profile.name})
            </p>
          </div>
        </div>

        <DemoProfileSwitcher />
      </div>

      {/* ── 2-COLUMN CHAT INTERFACE: SIDEBAR (3 COLS) - MAIN CHAT (9 COLS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">

        {/* ── LEFT: CONVERSATIONS & PROMPTS (3 COLS) ──────────── */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-3xl bg-card border border-border shadow-md space-y-4">
            <button
              onClick={handleStartNewChat}
              className="btn-primary w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>

            {/* Quick Pedagogical Modes */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-0.5">
                Tutor Pedagogical Modes
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleSendMessage("Explain this like I'm a beginner with intuitive analogies.", "simplify")}
                  className="p-2 rounded-xl text-[11px] font-semibold text-left border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">Explain Simpler</span>
                </button>
                <button
                  onClick={() => handleSendMessage("Give me a real-world production example of this concept.", "example")}
                  className="p-2 rounded-xl text-[11px] font-semibold text-left border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">Give Example</span>
                </button>
                <button
                  onClick={() => handleSendMessage("Show me a clean Python implementation with comments.", "code")}
                  className="p-2 rounded-xl text-[11px] font-semibold text-left border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center gap-1.5"
                >
                  <Code2 className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="truncate">Show Code</span>
                </button>
                <button
                  onClick={() => handleSendMessage("Give me a hint on my current topic without spoiling the answer.", "hint")}
                  className="p-2 rounded-xl text-[11px] font-semibold text-left border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">Give Hint</span>
                </button>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-border">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1">
                Recent Sessions
              </div>

              {[
                "Overfitting & Gradient Descent",
                "NumPy Vectorization Speedups",
                "Model Evaluation Metrics",
                "RAG Semantic Embeddings"
              ].map((topic, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveConversation(topic);
                    conversationIdRef.current = undefined;
                  }}
                  className={cn(
                    "w-full p-2.5 rounded-xl text-xs font-semibold text-left flex items-center gap-2 transition-all truncate",
                    activeConversation === topic
                      ? "bg-primary/10 text-primary border border-primary/20 font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{topic}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-border space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                Quick Prompts
              </div>

              {[
                "Explain gradient descent",
                "Why does overfitting happen?",
                "Give me a practice question",
                "Why am I learning this next?"
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full p-2 rounded-xl text-[11px] text-left text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/60 transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: MAIN CHAT STREAM (9 COLS) ────────────────── */}
        <div className="lg:col-span-9 flex flex-col h-[700px] rounded-3xl bg-card border border-border shadow-xl overflow-hidden">

          {/* Chat Stream Header */}
          <div className="px-6 py-4 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="text-sm font-bold text-foreground">{activeConversation}</div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  Context: {profile.name} • {profile.goal}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                conversationIdRef.current = undefined;
                setMessages([]);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Clear transcript"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3.5 max-w-[85%]",
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/20 text-primary border border-primary/30"
                  )}
                >
                  {msg.sender === "user" ? "You" : <Bot className="w-5 h-5" />}
                </div>

                <div className="space-y-2.5">
                  <div
                    className={cn(
                      "p-4 rounded-3xl leading-relaxed text-sm shadow-sm",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-sm"
                        : "bg-muted/70 border border-border text-foreground/95 rounded-tl-sm"
                    )}
                  >
                    <div className="prose dark:prose-invert max-w-none text-sm space-y-2">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>

                    <div
                      className={cn(
                        "text-[10px] font-mono mt-2 text-right opacity-60 flex items-center justify-end gap-2",
                        msg.sender === "user" ? "text-white" : "text-muted-foreground"
                      )}
                    >
                      {msg.mode && (
                        <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-background/50 border border-border">
                          mode: {msg.mode}
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Interactive Checkpoint Quiz inside message if returned by backend */}
                  {msg.quiz && (
                    <div className="p-4 rounded-2xl bg-card border border-primary/30 shadow-md space-y-3 animate-in fade-in">
                      <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Tutor Comprehension Check</span>
                      </div>
                      <p className="text-xs font-bold text-foreground">{msg.quiz.question}</p>
                      <div className="space-y-1.5">
                        {msg.quiz.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleSendMessage(opt)}
                            className="w-full p-2.5 rounded-xl border border-border text-left text-xs hover:border-primary hover:bg-primary/5 transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-Ups Pills */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.followUps.map((fu, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSendMessage(fu)}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-background hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition-colors shadow-sm text-left"
                        >
                          {fu} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3 text-muted-foreground text-xs font-mono animate-pulse">
                <div className="w-8 h-8 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span>AI Tutor is formulating calibrated explanation...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 border-t border-border bg-card/60 backdrop-blur-md flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about AI concepts, formulas, or code..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-muted/70 border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="btn-primary p-3 rounded-2xl font-bold flex items-center justify-center shadow-md shadow-primary/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default Tutor;

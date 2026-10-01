import React, { useState, useRef, useEffect } from "react";
import { useLearner } from "@/contexts/LearnerContext";
import { getTutorReply } from "@/data/mockTutorResponses";
import { DemoProfileSwitcher } from "@/components/common/DemoProfileSwitcher";
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  MessageSquare,
  Trash2,
  HelpCircle,
  Code2,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Flame,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  timestamp: string;
  followUps?: string[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const Tutor: React.FC = () => {
  const { profile } = useLearner();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "tutor",
      text: `Hello **${profile.name}**! I'm your dedicated AI Tutor. 

I'm aware that your current goal is **${profile.goal}**, your assessed level is **${profile.level}**, and your active focus module is **Bias vs Variance & Regularization**.

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

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Simulate smart local response
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
    }, 450);
  };

  const handleStartNewChat = () => {
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
            <h1 className="text-xl md:text-2xl font-black text-foreground">
              LearnAI Personal Tutor
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Context-Aware • Calibrated for {profile.level} ({profile.name})
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

            <div className="space-y-1">
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
                  onClick={() => setActiveConversation(topic)}
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
                "Explain this like I'm a beginner"
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
                  Active Knowledge Focus: Bias-Variance & Optimization
                </div>
              </div>
            </div>

            <button
              onClick={() => setMessages([])}
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
                        "text-[10px] font-mono mt-2 text-right opacity-60",
                        msg.sender === "user" ? "text-white" : "text-muted-foreground"
                      )}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Optional Interactive Follow-Up Quiz inside message */}
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
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-background hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition-colors shadow-sm"
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
                <span>AI Tutor is formulating explanation...</span>
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

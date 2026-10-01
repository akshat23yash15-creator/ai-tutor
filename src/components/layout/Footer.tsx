import { Link } from "react-router-dom";
import { Brain, Mail, Twitter, Linkedin, Github, ArrowRight, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-background text-foreground pt-16 pb-12 border-t border-border/50">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Mission (Takes 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                Learn<span className="text-primary">AI</span>
              </span>
            </Link>
            
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              An adaptive AI tutor that understands what you know, detects your weaknesses, and continuously calibrates your learning path. Learn AI your way.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized AI Learning Platform</span>
            </div>
          </div>

          {/* LearnAI Core Navigation (Takes 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-bold text-sm tracking-wider uppercase text-foreground">AI Tutor Flow</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "AI Assessment", href: "/assessment" },
                { label: "Tutor Dashboard", href: "/dashboard" },
                { label: "Personalized Roadmap", href: "/learning-path" },
                { label: "Interactive Lessons", href: "/learn/bias-variance" },
                { label: "Adaptive Practice", href: "/practice" },
                { label: "AI Tutor Chat", href: "/tutor" },
                { label: "Skill Map & Progress", href: "/progress" }
              ].map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="text-muted-foreground hover:text-primary text-xs font-medium transition-all hover:translate-x-1"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Key Capabilities (Takes 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-bold text-sm tracking-wider uppercase text-foreground">Adaptive Intelligence</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unlike static course platforms, LearnAI tracks your accuracy on every quiz, identifies prerequisite gaps, and automatically reorganizes your learning path.
            </p>
            <div className="p-3.5 rounded-2xl bg-card border border-border text-xs text-muted-foreground space-y-1">
              <div className="font-bold text-foreground">Hackathon Demonstration Mode:</div>
              <div>Supports instant persona switching between Beginner, Intermediate, and Advanced profiles.</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LearnAI. Built for Personalized AI Tutoring.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Academic Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

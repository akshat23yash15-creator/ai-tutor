import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  Home,
  LayoutDashboard,
  Layers,
  BookOpen,
  PenTool,
  Bot,
  TrendingUp,
  Target,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Palette,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./AppLayout";
import { useTheme, THEMES, ThemeId } from "@/contexts/ThemeContext";
import { useLearner } from "@/contexts/LearnerContext";

interface NavItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
}

const navLinks: NavItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, badge: "AI" },
  { name: "Learning Path", path: "/learning-path", icon: Layers, badge: "Adapted" },
  { name: "Learn", path: "/learn/bias-variance", icon: BookOpen },
  { name: "Practice", path: "/practice", icon: PenTool, badge: "Quiz" },
  { name: "AI Tutor", path: "/tutor", icon: Bot, badge: "Chat" },
  { name: "Skill Map", path: "/progress", icon: TrendingUp },
  { name: "Assessment", path: "/assessment", icon: Target },
];

export const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const { themeId, isDark, setTheme, toggleDark } = useTheme();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { profile } = useLearner();

  return (
    <>
      {/* ── Sidebar panel ───────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 flex flex-col",
          "border-r border-sidebar-border shadow-2xl",
          "transition-all duration-300 ease-in-out",
          isMobileOpen ? "z-50" : "z-30",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          width: isMobileOpen ? "280px" : isCollapsed ? "72px" : "260px",
          background: "hsl(var(--sidebar-background) / 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-6 h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-background shadow-md hover:bg-sidebar-accent transition-colors z-50"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-sidebar-foreground" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute right-4 top-4 p-2 text-sidebar-foreground/50 hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Brand / Logo */}
        <div
          className={cn(
            "flex h-[68px] items-center border-b border-sidebar-border flex-shrink-0",
            isCollapsed && !isMobileOpen ? "justify-center px-0" : "px-4"
          )}
        >
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 overflow-hidden min-w-0"
          >
            <div className="w-10 h-10 min-w-[40px] rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div
              className={cn(
                "flex flex-col overflow-hidden transition-all duration-300",
                isCollapsed && !isMobileOpen ? "w-0 opacity-0 pointer-events-none" : "w-auto opacity-100"
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-sidebar-foreground tracking-tight">
                  Learn<span className="text-primary">AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                  TUTOR
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium truncate">
                Personalized AI Learning
              </span>
            </div>
          </Link>
        </div>

        {/* Active Demo Profile Badge in Sidebar */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="mx-3 mt-3 p-2.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs shrink-0">
                {profile.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="font-bold text-foreground truncate">{profile.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono">{profile.level}</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/" && location.pathname.startsWith(link.path));

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? link.name : undefined}
                className={cn(
                  "group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none",
                  isActive
                    ? "bg-primary/15 text-primary font-bold shadow-sm"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  isCollapsed && !isMobileOpen && "lg:justify-center lg:px-0"
                )}
              >
                {/* Active bar */}
                {isActive && (!isCollapsed || isMobileOpen) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full" />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    (!isCollapsed || isMobileOpen) && "mr-3",
                    isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                  )}
                />

                <span
                  className={cn(
                    "truncate transition-all duration-300",
                    isCollapsed && !isMobileOpen ? "lg:w-0 lg:opacity-0 lg:overflow-hidden" : "w-auto opacity-100"
                  )}
                >
                  {link.name}
                </span>

                {/* Optional mini badge */}
                {link.badge && (!isCollapsed || isMobileOpen) && (
                  <span
                    className={cn(
                      "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-sidebar-border space-y-1 flex-shrink-0">
          {/* Theme Palette button */}
          <button
            onClick={() => setShowThemePicker((v) => !v)}
            title={isCollapsed ? "Change Theme" : undefined}
            className={cn(
              "flex w-full items-center rounded-xl p-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
              isCollapsed && !isMobileOpen ? "justify-center" : "gap-3"
            )}
          >
            <Palette className="h-5 w-5 flex-shrink-0" />
            <span
              className={cn(
                "transition-all duration-300 whitespace-nowrap",
                isCollapsed && !isMobileOpen ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}
            >
              Theme
            </span>
            {(!isCollapsed || isMobileOpen) && (
              <span
                className="ml-auto w-4 h-4 rounded-full border-2 border-sidebar-border flex-shrink-0"
                style={{ background: `hsl(var(--primary))` }}
              />
            )}
          </button>

          {/* Dark/Light toggle */}
          <button
            onClick={toggleDark}
            title={isCollapsed ? "Toggle theme" : undefined}
            className={cn(
              "flex w-full items-center rounded-xl p-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
              isCollapsed && !isMobileOpen ? "justify-center" : "gap-3"
            )}
          >
            {isDark ? <Sun className="h-5 w-5 flex-shrink-0" /> : <Moon className="h-5 w-5 flex-shrink-0" />}
            <span
              className={cn(
                "transition-all duration-300 whitespace-nowrap",
                isCollapsed && !isMobileOpen ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </aside>

      {/* ── Theme Picker Panel ── */}
      {showThemePicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowThemePicker(false)} />
          <div
            className="fixed bottom-0 z-50 bg-sidebar-background border border-sidebar-border rounded-2xl shadow-2xl p-4 animate-scale-in"
            style={{
              left: isCollapsed ? "80px" : "268px",
              bottom: "80px",
              width: "220px",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Pick a Theme
              </p>
              <button
                onClick={() => setShowThemePicker(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as ThemeId);
                    setShowThemePicker(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    themeId === t.id
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <div className="flex gap-1 flex-shrink-0">
                    <span className="w-4 h-4 rounded-full border border-border" style={{ background: t.light }} />
                    <span className="w-4 h-4 rounded-full border border-border" style={{ background: t.dark }} />
                  </div>
                  <span>{t.name}</span>
                  {themeId === t.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

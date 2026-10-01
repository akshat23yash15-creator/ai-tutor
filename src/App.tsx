import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LearnerProvider } from "@/contexts/LearnerContext";

// LearnAI Core Pages
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import DashBoard from "./pages/DashBoard";
import LearningPath from "./pages/LearningPath";
import Learn from "./pages/Learn";
import Practice from "./pages/Practice";
import Tutor from "./pages/Tutor";
import Progress from "./pages/Progress";

// Other Supporting Pages
import About from "./pages/About";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Playground from "./pages/Playground";
import Solve from "./pages/Solve";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LearnerProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* ── LearnAI Primary Routes (Completely Open / No Login) ── */}
              <Route path="/" element={<Home />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="/learn" element={<Navigate to="/learn/bias-variance" replace />} />
              <Route path="/learn/:lessonId" element={<Learn />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/tutor" element={<Tutor />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/skills" element={<Progress />} />

              {/* ── Supporting / Supplementary Routes ── */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/solve/:slug" element={<Solve />} />

              {/* ── Optional Guest Pages (Never Block Main App) ── */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* ── 404 Fallback ── */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LearnerProvider>
  </QueryClientProvider>
);

export default App;

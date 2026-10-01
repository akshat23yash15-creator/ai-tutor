import React, { createContext, useContext, useState, useEffect } from "react";
import { LearnerProfile, DEMO_PROFILES } from "@/data/mockLearner";
import { PathNode, INTERMEDIATE_LEARNING_PATH, BEGINNER_LEARNING_PATH, ADVANCED_LEARNING_PATH } from "@/data/mockLearningPath";
import { toast } from "sonner";

export interface AdaptiveEvent {
  id: string;
  timestamp: string;
  topic: string;
  score: number;
  action: "reduced" | "maintained" | "increased";
  reason: string;
  recommendation: string;
  pathAdjustment: string;
}

export interface AssessmentData {
  experience: string;
  languages: string[];
  aiTopics: string[];
  goal: string;
  pace: "Relaxed" | "Balanced" | "Intensive";
  dailyMinutes: number;
}

interface LearnerContextType {
  profile: LearnerProfile;
  activeProfileId: string;
  learningPath: PathNode[];
  adaptiveEvents: AdaptiveEvent[];
  completedLessons: string[];
  switchDemoProfile: (id: "beginner" | "intermediate" | "advanced") => void;
  markLessonComplete: (lessonId: string) => void;
  recordQuizScore: (topic: string, scorePercent: number, totalQuestions: number, category?: string) => AdaptiveEvent;
  applyAssessment: (data: AssessmentData) => void;
  toggleDailyPlanItem: (planId: string) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = "learnai_state_v2";

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export const LearnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfileId, setActiveProfileId] = useState<string>("intermediate");
  const [profile, setProfile] = useState<LearnerProfile>(DEMO_PROFILES.intermediate);
  const [learningPath, setLearningPath] = useState<PathNode[]>(INTERMEDIATE_LEARNING_PATH);
  const [completedLessons, setCompletedLessons] = useState<string[]>(["python-basics", "numpy-pandas", "statistics-intro", "ml-fundamentals"]);
  const [adaptiveEvents, setAdaptiveEvents] = useState<AdaptiveEvent[]>([
    {
      id: "init-adapt-1",
      timestamp: "Today at 2:15 PM",
      topic: "Bias vs Variance",
      score: 54,
      action: "reduced",
      reason: "Scored 54% on recent diagnostic test (below 60% mastery threshold).",
      recommendation: "Reviewing Bias vs Variance & Regularization before progressing to Neural Networks.",
      pathAdjustment: "Injected targeted diagnostic sandbox into Step 5."
    }
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeProfileId && DEMO_PROFILES[parsed.activeProfileId]) {
          setActiveProfileId(parsed.activeProfileId);
          setProfile(parsed.profile || DEMO_PROFILES[parsed.activeProfileId]);
          setLearningPath(parsed.learningPath || INTERMEDIATE_LEARNING_PATH);
          setCompletedLessons(parsed.completedLessons || []);
          if (parsed.adaptiveEvents) setAdaptiveEvents(parsed.adaptiveEvents);
        }
      }
    } catch (e) {
      console.error("Failed to load learner state:", e);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeProfileId,
          profile,
          learningPath,
          completedLessons,
          adaptiveEvents
        })
      );
    } catch (e) {
      console.error("Failed to save learner state:", e);
    }
  }, [activeProfileId, profile, learningPath, completedLessons, adaptiveEvents]);

  // Switch demo profiles
  const switchDemoProfile = (id: "beginner" | "intermediate" | "advanced") => {
    setActiveProfileId(id);
    const selectedProfile = DEMO_PROFILES[id] || DEMO_PROFILES.intermediate;
    setProfile(selectedProfile);

    let newPath = INTERMEDIATE_LEARNING_PATH;
    let initialCompleted = ["python-basics", "numpy-pandas"];

    if (id === "beginner") {
      newPath = BEGINNER_LEARNING_PATH;
      initialCompleted = [];
    } else if (id === "advanced") {
      newPath = ADVANCED_LEARNING_PATH;
      initialCompleted = ["node-a1"];
    }

    setLearningPath(newPath);
    setCompletedLessons(initialCompleted);

    toast.success(`Switched to Demo Learner: ${selectedProfile.name} (${selectedProfile.level})`, {
      description: `Path adapted for: ${selectedProfile.goal}`
    });
  };

  // Mark lesson as complete
  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const updatedCompleted = [...completedLessons, lessonId];
      setCompletedLessons(updatedCompleted);

      // Update node in learning path
      setLearningPath((prev) =>
        prev.map((node) => {
          if (node.lessonId === lessonId) {
            return { ...node, status: "completed", completionPercent: 100 };
          }
          return node;
        })
      );

      // Update profile progress & concepts mastered
      setProfile((prev) => ({
        ...prev,
        conceptsMastered: prev.conceptsMastered + 1,
        overallProgress: Math.min(100, prev.overallProgress + 4)
      }));

      toast.success("Concept Mastered!", {
        description: "Your progress and skill map have been updated."
      });
    }
  };

  // Adaptive engine logic when a quiz is submitted
  const recordQuizScore = (topic: string, scorePercent: number, totalQuestions: number, category = "Machine Learning") => {
    let action: "reduced" | "maintained" | "increased" = "maintained";
    let reason = "";
    let recommendation = "";
    let pathAdjustment = "";

    if (scorePercent < 60) {
      action = "reduced";
      reason = `Your score of ${scorePercent}% indicates difficulty with ${topic}.`;
      recommendation = `We reduced question difficulty to reinforce foundational concepts and added a 15-minute revision module on "${topic}".`;
      pathAdjustment = `Adjusted roadmap: Added prerequisite refresher before advanced evaluations.`;

      // Update path node status to 'adapted'
      setLearningPath((prev) =>
        prev.map((node) => {
          if (node.title.toLowerCase().includes(topic.toLowerCase()) || node.lessonId.includes("bias")) {
            return {
              ...node,
              status: "adapted",
              isAdaptedReason: `AI Tutor Alert: Difficulty adjusted to focus on core intuition following ${scorePercent}% quiz score.`
            };
          }
          return node;
        })
      );
    } else if (scorePercent >= 85) {
      action = "increased";
      reason = `Strong performance! You scored ${scorePercent}% on ${topic}.`;
      recommendation = `Basic drills skipped. We increased question complexity and unlocked next-level challenges.`;
      pathAdjustment = `Roadmap accelerated: Advanced modules unlocked early.`;

      // Advance nodes
      setLearningPath((prev) =>
        prev.map((node, idx) => {
          if (node.status === "recommended" && idx <= 6) {
            return { ...node, status: "current" };
          }
          return node;
        })
      );
    } else {
      action = "maintained";
      reason = `Solid progress with ${scorePercent}% accuracy on ${topic}.`;
      recommendation = `Continuing standard learning pace with 2 targeted practice exercises.`;
      pathAdjustment = `Roadmap maintained at balanced pace.`;
    }

    const newEvent: AdaptiveEvent = {
      id: `adapt-${Date.now()}`,
      timestamp: "Just now",
      topic,
      score: scorePercent,
      action,
      reason,
      recommendation,
      pathAdjustment
    };

    setAdaptiveEvents((prev) => [newEvent, ...prev]);

    // Update profile metrics
    setProfile((prev) => {
      const currentCategoryScore = prev.skills[category] || 60;
      const updatedCategoryScore = Math.max(10, Math.min(100, Math.round(currentCategoryScore * 0.7 + scorePercent * 0.3)));
      
      const newSkills = {
        ...prev.skills,
        [category]: updatedCategoryScore
      };

      // Recalculate accuracy rate
      const newAccuracy = Math.round((prev.accuracyRate * prev.questionsSolved + scorePercent * totalQuestions) / (prev.questionsSolved + totalQuestions));

      return {
        ...prev,
        questionsSolved: prev.questionsSolved + totalQuestions,
        accuracyRate: newAccuracy,
        skills: newSkills,
        recentAdaptiveDecision: {
          timestamp: "Just now",
          trigger: `Quiz score on ${topic}: ${scorePercent}%`,
          score: scorePercent,
          action,
          description: recommendation,
          beforePath: "Standard Linear Sequence",
          afterPath: pathAdjustment,
          adjustedTopic: topic
        }
      };
    });

    return newEvent;
  };

  // Process assessment questionnaire
  const applyAssessment = (data: AssessmentData) => {
    let level: "Beginner" | "Intermediate" | "Advanced" = "Intermediate";
    if (data.experience === "Beginner" || data.knownTopics?.length <= 1) {
      level = "Beginner";
    } else if (data.experience === "Advanced" || data.aiTopics?.length >= 6) {
      level = "Advanced";
    }

    const strengths: { name: string; score: number; description: string }[] = [];
    if (data.languages.includes("Python")) {
      strengths.push({ name: "Python Programming", score: 85, description: "Strong baseline for scientific scripting." });
    }
    if (data.aiTopics.includes("NumPy") || data.aiTopics.includes("Pandas")) {
      strengths.push({ name: "Data Manipulation", score: 80, description: "Comfortable with matrix indexing and datasets." });
    }
    if (strengths.length === 0) {
      strengths.push({ name: "Eagerness to Learn", score: 90, description: "Fresh perspective without bad habits." });
    }

    const weaknesses: { name: string; score: number; reason: string; recommendedLessonId: string }[] = [];
    if (!data.aiTopics.includes("Statistics")) {
      weaknesses.push({ name: "Applied Statistics", score: 50, reason: "Needs intuition on distributions and hypothesis tests.", recommendedLessonId: "statistics-intro" });
    }
    if (!data.aiTopics.includes("Machine Learning")) {
      weaknesses.push({ name: "Bias vs Variance", score: 55, reason: "Core conceptual gap in model tuning.", recommendedLessonId: "bias-variance" });
    }

    const whyThisPath = `Based on your ${data.experience.toLowerCase()} background and goal of "${data.goal}", we designed a custom path. We skipped introductory programming modules because of your knowledge in ${data.languages.join(", ") || "software fundamentals"}. Instead, we prioritized ${weaknesses.map(w => w.name).join(" and ") || "core ML architectures"} to accelerate your progress toward ${data.goal}.`;

    const customProfile: LearnerProfile = {
      ...DEMO_PROFILES.intermediate,
      name: "Akshat",
      level,
      goal: data.goal,
      experience: data.experience,
      knownLanguages: data.languages,
      knownTopics: data.aiTopics,
      learningPace: data.pace,
      dailyCommitmentMinutes: data.dailyMinutes,
      whyThisPath,
      strengths,
      weaknesses: weaknesses.length > 0 ? weaknesses : DEMO_PROFILES.intermediate.weaknesses
    };

    setProfile(customProfile);
    toast.success("Personalized AI Learning Profile Generated!", {
      description: "Your personalized roadmap is ready."
    });
  };

  const toggleDailyPlanItem = (planId: string) => {
    setProfile((prev) => ({
      ...prev,
      dailyPlan: prev.dailyPlan.map((item) =>
        item.id === planId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setActiveProfileId("intermediate");
    setProfile(DEMO_PROFILES.intermediate);
    setLearningPath(INTERMEDIATE_LEARNING_PATH);
    setCompletedLessons(["python-basics", "numpy-pandas", "statistics-intro", "ml-fundamentals"]);
    toast.info("Reset to default demonstration profile.");
  };

  return (
    <LearnerContext.Provider
      value={{
        profile,
        activeProfileId,
        learningPath,
        adaptiveEvents,
        completedLessons,
        switchDemoProfile,
        markLessonComplete,
        recordQuizScore,
        applyAssessment,
        toggleDailyPlanItem,
        resetToDefault
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
};

export const useLearner = () => {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error("useLearner must be used within a LearnerProvider");
  }
  return context;
};

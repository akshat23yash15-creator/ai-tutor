import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { LearnerProfile, DEMO_PROFILES } from "@/data/mockLearner";
import { PathNode, INTERMEDIATE_LEARNING_PATH, BEGINNER_LEARNING_PATH, ADVANCED_LEARNING_PATH } from "@/data/mockLearningPath";
import { toast } from "sonner";
import {
  getProfile,
  getLearningPath,
  resetLearner,
  submitAssessment,
  evaluateQuiz,
  checkHealth
} from "@/services/api";
import {
  mapBackendProfileToLearner,
  mapBackendPathToPathNodes,
  mapBackendAdaptiveDecisionToEvent
} from "@/services/adapters";
import { BackendAdaptiveDecision } from "@/services/backendTypes";

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
  name?: string;
}

export interface LearnerContextType {
  profile: LearnerProfile;
  activeProfileId: string;
  backendLearnerId: string;
  learningPath: PathNode[];
  adaptiveEvents: AdaptiveEvent[];
  completedLessons: string[];
  isOnline: boolean;
  isLoading: boolean;
  isWakingUp: boolean;
  activeLearningTopic: string | null;
  setActiveLearningTopic: (topic: string | null) => void;
  switchDemoProfile: (id: "beginner" | "intermediate" | "advanced") => void;
  markLessonComplete: (lessonId: string) => void;
  recordQuizScore: (
    topic: string,
    scorePercent: number,
    totalQuestions: number,
    category?: string,
    rawAnswers?: Array<{
      question_id: string;
      concept_tested?: string;
      difficulty?: string;
      selected_option_index: number;
      correct_index?: number;
      is_correct?: boolean;
      time_taken_seconds?: number;
    }>
  ) => Promise<AdaptiveEvent> | AdaptiveEvent;
  applyAssessment: (data: AssessmentData) => Promise<void> | void;
  toggleDailyPlanItem: (planId: string) => void;
  resetToDefault: () => Promise<void> | void;
  refreshProfile: () => Promise<void>;
}

const STORAGE_KEY = "learnai_state_v3";

export function toBackendLearnerId(id: string): string {
  if (id === "beginner" || id === "alex-beginner") return "alex-beginner";
  if (id === "advanced" || id === "elena-advanced") return "elena-advanced";
  if (id === "intermediate" || id === "akshat-intermediate") return "akshat-intermediate";
  return id;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export const LearnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfileId, setActiveProfileId] = useState<string>("intermediate");
  const [profile, setProfile] = useState<LearnerProfile>(DEMO_PROFILES.intermediate);
  const [learningPath, setLearningPath] = useState<PathNode[]>(INTERMEDIATE_LEARNING_PATH);
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    "python-basics",
    "numpy-pandas",
    "statistics-intro",
    "ml-fundamentals"
  ]);
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

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWakingUp, setIsWakingUp] = useState<boolean>(false);
  const [activeLearningTopic, setActiveLearningTopic] = useState<string | null>(null);

  // Guard to ensure fallback toast is shown only once per session
  const fallbackToastShown = useRef<boolean>(false);

  const notifyFallback = useCallback(() => {
    if (!fallbackToastShown.current) {
      fallbackToastShown.current = true;
      toast.info("AI service momentarily unreachable. Running in local tutor mode.", {
        description: "Your learning session will continue without interruption."
      });
    }
    setIsOnline(false);
  }, []);

  const backendLearnerId = toBackendLearnerId(activeProfileId);

  // Load backend profile & learning path for a given learner ID
  const fetchLearnerFromBackend = useCallback(async (bId: string, showToast = false) => {
    setIsLoading(true);
    try {
      const [profileRes, pathRes] = await Promise.all([
        getProfile(bId),
        getLearningPath(bId)
      ]);

      if (profileRes.success && profileRes.data?.profile) {
        setIsOnline(true);
        const mappedProfile = mapBackendProfileToLearner(
          profileRes.data.profile,
          pathRes.success ? pathRes.data : null
        );

        setProfile(mappedProfile);

        if (pathRes.success && pathRes.data?.nodes && pathRes.data.nodes.length > 0) {
          const mappedNodes = mapBackendPathToPathNodes(pathRes.data.nodes);
          setLearningPath(mappedNodes);

          // Synchronize completed lessons from nodes
          const completedFromPath = mappedNodes
            .filter((n) => n.status === "completed")
            .map((n) => n.lessonId);
          if (completedFromPath.length > 0) {
            setCompletedLessons((prev) => Array.from(new Set([...prev, ...completedFromPath])));
          }
        }

        // Sync adaptive events if present in backend profile
        if (profileRes.data.profile.recentAdaptiveEvents?.length > 0) {
          const mappedEvents = profileRes.data.profile.recentAdaptiveEvents.map(mapBackendAdaptiveDecisionToEvent);
          setAdaptiveEvents(mappedEvents);
        }

        if (showToast) {
          toast.success(`Switched to Demo Learner: ${mappedProfile.name} (${mappedProfile.level})`, {
            description: `Live AI path adapted for: ${mappedProfile.goal}`
          });
        }
      } else {
        notifyFallback();
      }
    } catch (err) {
      console.warn("Backend fetch failed, falling back to mock:", err);
      notifyFallback();
    } finally {
      setIsLoading(false);
      setIsWakingUp(false);
    }
  }, [notifyFallback]);

  // Load from localStorage on mount & probe backend
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeProfileId) {
          setActiveProfileId(parsed.activeProfileId);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.learningPath) setLearningPath(parsed.learningPath);
          if (parsed.completedLessons) setCompletedLessons(parsed.completedLessons);
          if (parsed.adaptiveEvents) setAdaptiveEvents(parsed.adaptiveEvents);
        }
      }
    } catch (e) {
      console.error("Failed to load local learner state:", e);
    }

    // Health check on background startup
    const checkAndSync = async () => {
      const healthTimer = setTimeout(() => {
        setIsWakingUp(true);
      }, 2500);

      try {
        const health = await checkHealth();
        clearTimeout(healthTimer);
        if (health.success) {
          setIsOnline(true);
          setIsWakingUp(false);
          // Initial background sync with backend
          const initialId = toBackendLearnerId(activeProfileId || "intermediate");
          fetchLearnerFromBackend(initialId, false);
        } else {
          setIsWakingUp(false);
        }
      } catch {
        clearTimeout(healthTimer);
        setIsWakingUp(false);
      }
    };

    checkAndSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setActiveLearningTopic(null);

    // Instant optimistic update with mock data
    const localFallback = DEMO_PROFILES[id] || DEMO_PROFILES.intermediate;
    setProfile(localFallback);

    let initialPath = INTERMEDIATE_LEARNING_PATH;
    let initialCompleted = ["python-basics", "numpy-pandas"];

    if (id === "beginner") {
      initialPath = BEGINNER_LEARNING_PATH;
      initialCompleted = [];
    } else if (id === "advanced") {
      initialPath = ADVANCED_LEARNING_PATH;
      initialCompleted = ["node-a1"];
    }

    setLearningPath(initialPath);
    setCompletedLessons(initialCompleted);

    // Call backend to get real learner state
    const bId = toBackendLearnerId(id);
    fetchLearnerFromBackend(bId, true);
  };

  // Mark lesson as complete
  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const updatedCompleted = [...completedLessons, lessonId];
      setCompletedLessons(updatedCompleted);

      // Update node in learning path
      setLearningPath((prev) =>
        prev.map((node) => {
          if (node.lessonId === lessonId || node.id === lessonId) {
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
  const recordQuizScore = async (
    topic: string,
    scorePercent: number,
    totalQuestions: number,
    category = "Machine Learning",
    rawAnswers?: Array<{
      question_id: string;
      concept_tested?: string;
      difficulty?: string;
      selected_option_index: number;
      correct_index?: number;
      is_correct?: boolean;
      time_taken_seconds?: number;
    }>
  ): Promise<AdaptiveEvent> => {
    // If online, call backend evaluate
    if (isOnline) {
      try {
        const answersPayload = rawAnswers && rawAnswers.length > 0
          ? rawAnswers
          : [
              {
                question_id: `q-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
                concept_tested: topic,
                difficulty: scorePercent < 60 ? "Easy" : scorePercent >= 85 ? "Hard" : "Medium",
                selected_option_index: scorePercent >= 50 ? 1 : 0,
                correct_index: 1,
                is_correct: scorePercent >= 70,
                time_taken_seconds: 35
              }
            ];

        const evalRes = await evaluateQuiz(backendLearnerId, {
          topic,
          category,
          answers: answersPayload
        });

        if (evalRes.success && evalRes.data?.adaptive_decision) {
          const decision: BackendAdaptiveDecision = evalRes.data.adaptive_decision;
          const mappedEvent = mapBackendAdaptiveDecisionToEvent(decision);

          // Prepend event
          setAdaptiveEvents((prev) => [mappedEvent, ...prev]);

          // Update recent adaptive decision in profile
          setProfile((prev) => ({
            ...prev,
            questionsSolved: prev.questionsSolved + totalQuestions,
            accuracyRate: Math.round(
              (prev.accuracyRate * prev.questionsSolved + scorePercent * totalQuestions) /
                (prev.questionsSolved + totalQuestions)
            ),
            recentAdaptiveDecision: {
              timestamp: decision.timestamp || "Just now",
              trigger: decision.reason,
              score: decision.score,
              action: decision.action,
              description: decision.recommendation,
              beforePath: "Standard Linear Sequence",
              afterPath: decision.pathAdjustment,
              adjustedTopic: decision.topic || topic
            }
          }));

          // Trigger asynchronous refresh of profile and path from backend
          fetchLearnerFromBackend(backendLearnerId, false);

          return mappedEvent;
        }
      } catch (err) {
        console.warn("Backend quiz evaluation failed, using local adaptive engine:", err);
      }
    }

    // Local deterministic adaptive fallback logic
    let action: "reduced" | "maintained" | "increased" = "maintained";
    let reason = "";
    let recommendation = "";
    let pathAdjustment = "";

    if (scorePercent < 60) {
      action = "reduced";
      reason = `Your score of ${scorePercent}% indicates difficulty with ${topic}.`;
      recommendation = `We reduced question difficulty to reinforce foundational concepts and added a 15-minute revision module on "${topic}".`;
      pathAdjustment = `Adjusted roadmap: Added prerequisite refresher before advanced evaluations.`;

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

    const fallbackEvent: AdaptiveEvent = {
      id: `adapt-${Date.now()}`,
      timestamp: "Just now",
      topic,
      score: scorePercent,
      action,
      reason,
      recommendation,
      pathAdjustment
    };

    setAdaptiveEvents((prev) => [fallbackEvent, ...prev]);

    setProfile((prev) => {
      const currentCategoryScore = prev.skills[category] || 60;
      const updatedCategoryScore = Math.max(10, Math.min(100, Math.round(currentCategoryScore * 0.7 + scorePercent * 0.3)));
      const newSkills = { ...prev.skills, [category]: updatedCategoryScore };
      const newAccuracy = Math.round(
        (prev.accuracyRate * prev.questionsSolved + scorePercent * totalQuestions) /
          (prev.questionsSolved + totalQuestions)
      );

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

    return fallbackEvent;
  };

  // Process assessment questionnaire
  const applyAssessment = async (data: AssessmentData) => {
    setIsLoading(true);

    // Call backend assessment API if online
    if (isOnline) {
      try {
        const customId = `learner-${Date.now()}`;
        const res = await submitAssessment(customId, {
          name: data.name || "Learner",
          experience_level: data.experience,
          languages: data.languages,
          topics_known: data.aiTopics,
          goal: data.goal,
          pace: data.pace,
          daily_minutes: data.dailyMinutes,
          overwrite: true
        });

        if (res.success && res.data?.profile) {
          const mappedProfile = mapBackendProfileToLearner(
            res.data.profile,
            res.data.path
          );
          setProfile(mappedProfile);
          setActiveProfileId(customId);

          if (res.data.path?.nodes) {
            setLearningPath(mapBackendPathToPathNodes(res.data.path.nodes));
          }

          toast.success("Personalized AI Learning Profile Generated!", {
            description: "Your personalized roadmap is ready from live AI engine."
          });
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Backend assessment call failed, using local adapter:", err);
      }
    }

    // Local fallback assessment synthesis
    let level: "Beginner" | "Intermediate" | "Advanced" = "Intermediate";
    if (data.experience === "Beginner" || data.aiTopics?.length <= 1) {
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
      name: data.name || "Akshat",
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
    setIsLoading(false);
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

  const resetToDefault = async () => {
    setIsLoading(true);
    setActiveLearningTopic(null);
    if (isOnline) {
      try {
        const res = await resetLearner(backendLearnerId);
        if (res.success) {
          await fetchLearnerFromBackend(backendLearnerId, false);
          toast.info(`Reset demo learner (${profile.name}) to original seeded state.`);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Backend reset failed:", err);
      }
    }

    localStorage.removeItem(STORAGE_KEY);
    setActiveProfileId("intermediate");
    setProfile(DEMO_PROFILES.intermediate);
    setLearningPath(INTERMEDIATE_LEARNING_PATH);
    setCompletedLessons(["python-basics", "numpy-pandas", "statistics-intro", "ml-fundamentals"]);
    toast.info("Reset to default demonstration profile.");
    setIsLoading(false);
  };

  const refreshProfile = async () => {
    await fetchLearnerFromBackend(backendLearnerId, false);
  };

  return (
    <LearnerContext.Provider
      value={{
        profile,
        activeProfileId,
        backendLearnerId,
        learningPath,
        adaptiveEvents,
        completedLessons,
        isOnline,
        isLoading,
        isWakingUp,
        activeLearningTopic,
        setActiveLearningTopic,
        switchDemoProfile,
        markLessonComplete,
        recordQuizScore,
        applyAssessment,
        toggleDailyPlanItem,
        resetToDefault,
        refreshProfile
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

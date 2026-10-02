import {
  BackendLearnerProfile,
  BackendPathData,
  BackendPathNode,
  BackendPracticeQuestion,
  BackendTutorData,
  BackendAdaptiveDecision,
  BackendDailyTask
} from "./backendTypes";
import { LearnerProfile } from "@/data/mockLearner";
import { PathNode } from "@/data/mockLearningPath";
import { PracticeQuestion } from "@/data/mockQuestions";
import { AdaptiveEvent } from "@/contexts/LearnerContext";

const DEFAULT_AVATARS: Record<string, string> = {
  "akshat-intermediate": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "alex-beginner": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "elena-advanced": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
};

/**
 * Maps Backend category to PathNode category
 */
function normalizeCategory(cat: string): "Foundations" | "Core ML" | "Deep Learning" | "Generative AI" | "Capstone" {
  const lower = cat.toLowerCase();
  if (lower.includes("python") || lower.includes("foundations") || lower.includes("math") || lower.includes("stat")) {
    return "Foundations";
  }
  if (lower.includes("machine learning") || lower.includes("core ml") || lower.includes("evaluation") || lower.includes("model")) {
    return "Core ML";
  }
  if (lower.includes("deep") || lower.includes("neural") || lower.includes("vision") || lower.includes("cnn")) {
    return "Deep Learning";
  }
  if (lower.includes("gen") || lower.includes("llm") || lower.includes("rag") || lower.includes("transformer") || lower.includes("nlp")) {
    return "Generative AI";
  }
  return "Foundations";
}

/**
 * Maps Backend daily tasks to frontend DailyPlan items
 */
function mapDailyTasks(tasks: BackendDailyTask[] = []) {
  return tasks.map((t, idx) => {
    let type: "review" | "learn" | "practice" | "checkpoint" = "learn";
    if (t.type === "review" || t.type === "revision") type = "review";
    else if (t.type === "practice") type = "practice";
    else if (t.type === "checkpoint") type = "checkpoint";
    else type = "learn";

    return {
      id: t.id || `dp-${idx}`,
      title: t.title,
      type,
      durationMinutes: t.durationMinutes || 15,
      completed: !!t.completed,
      lessonId: t.conceptId ? t.conceptId.replace(/_/g, "-") : undefined
    };
  });
}

/**
 * Maps BackendProfile (+ optional PathData) to Frontend LearnerProfile
 */
export function mapBackendProfileToLearner(
  backendProfile: BackendLearnerProfile,
  pathData?: BackendPathData | null
): LearnerProfile {
  // Calculate overall progress from completed path nodes if available
  let overallProgress = 50;
  if (pathData?.nodes && pathData.nodes.length > 0) {
    const completedCount = pathData.nodes.filter((n) => n.status === "completed").length;
    overallProgress = Math.round((completedCount / pathData.nodes.length) * 100);
  } else if (backendProfile.accuracyRate) {
    overallProgress = Math.min(95, Math.round(backendProfile.accuracyRate * 0.8));
  }

  // Calculate estimated study hours
  const weeklyHours = Math.round(((backendProfile.dailyCommitmentMinutes * 5) / 60) * 10) / 10;

  // Build weekly accuracy trends dynamically around current accuracy
  const acc = backendProfile.accuracyRate || 75;
  const weeklyTrends = [
    { week: "Week 1", accuracy: Math.max(35, acc - 22), studyHours: Math.max(1.5, Math.round((weeklyHours - 1.2) * 10) / 10) },
    { week: "Week 2", accuracy: Math.max(45, acc - 14), studyHours: Math.max(2.0, Math.round((weeklyHours - 0.7) * 10) / 10) },
    { week: "Week 3", accuracy: Math.max(55, acc - 6), studyHours: Math.max(2.5, Math.round((weeklyHours - 0.2) * 10) / 10) },
    { week: "Week 4", accuracy: acc, studyHours: weeklyHours }
  ];

  // Map daily plan from path data or synthesize default items
  let dailyPlan = pathData?.dailyPlan ? mapDailyTasks(pathData.dailyPlan) : [];
  if (dailyPlan.length === 0) {
    dailyPlan = [
      { id: "dp-1", title: `Review: ${backendProfile.knownTopics[0] || "Python Foundations"}`, type: "review", durationMinutes: 10, completed: true },
      { id: "dp-2", title: `Learn: ${backendProfile.weaknesses[0]?.name || "Core ML Optimization"}`, type: "learn", durationMinutes: 20, completed: false, lessonId: backendProfile.weaknesses[0]?.recommendedLessonId || "bias-variance" },
      { id: "dp-3", title: "Practice: 3 Adaptive Diagnostic Questions", type: "practice", durationMinutes: 15, completed: false }
    ];
  }

  // Map recent adaptive decision
  let recentAdaptiveDecision: LearnerProfile["recentAdaptiveDecision"] = undefined;
  const latestEvent = backendProfile.recentAdaptiveEvents?.[0];
  if (latestEvent) {
    recentAdaptiveDecision = {
      timestamp: latestEvent.timestamp || "Recently",
      trigger: latestEvent.reason,
      score: latestEvent.score,
      action: latestEvent.action,
      description: latestEvent.recommendation,
      beforePath: "Standard Linear Sequence",
      afterPath: latestEvent.pathAdjustment || "Adapted Roadmap Focus",
      adjustedTopic: latestEvent.topic
    };
  }

  // Why this path summary
  const whyThisPath = pathData?.whyThisPath ||
    `Tailored for your goal of "${backendProfile.goal}". Accelerating through ${backendProfile.knownTopics.slice(0, 3).join(", ") || "prior knowledge"} while reinforcing priority topics like ${backendProfile.weaknesses.map(w => w.name).join(", ") || "core ML mechanics"}.`;

  return {
    id: backendProfile.id,
    name: backendProfile.name,
    avatar: DEFAULT_AVATARS[backendProfile.id] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    level: backendProfile.level,
    role: backendProfile.role,
    goal: backendProfile.goal,
    targetRole: backendProfile.targetRole,
    experience: backendProfile.experience,
    knownLanguages: backendProfile.knownLanguages || [],
    knownTopics: backendProfile.knownTopics || [],
    targetTopics: backendProfile.targetTopics || [],
    learningPace: backendProfile.learningPace || "Balanced",
    dailyCommitmentMinutes: backendProfile.dailyCommitmentMinutes || 45,
    streakDays: backendProfile.streakDays || 1,
    overallProgress,
    accuracyRate: backendProfile.accuracyRate || 75,
    questionsSolved: backendProfile.questionsSolved || 0,
    conceptsMastered: backendProfile.conceptsMastered || 0,
    weeklyHoursSpent: weeklyHours,
    estimatedWeeksRemaining: pathData?.estimatedWeeksRemaining || 6,
    whyThisPath,
    strengths: (backendProfile.strengths || []).map((s) => ({
      name: s.name,
      score: s.score,
      description: s.description
    })),
    weaknesses: (backendProfile.weaknesses || []).map((w) => ({
      name: w.name,
      score: w.score,
      reason: w.reason,
      recommendedLessonId: w.recommendedLessonId || w.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    })),
    skills: backendProfile.skills || {
      Python: 80,
      Statistics: 60,
      "Machine Learning": 70,
      "Deep Learning": 30,
      NLP: 20,
      "Generative AI": 20
    },
    weeklyAccuracyTrends: weeklyTrends,
    dailyPlan,
    recentAdaptiveDecision
  };
}

/**
 * Maps BackendPathNode array to Frontend PathNode array
 */
export function mapBackendPathToPathNodes(backendNodes: BackendPathNode[] = []): PathNode[] {
  return backendNodes.map((n, idx) => {
    // Determine mapped lesson ID
    const lessonId = n.conceptId
      ? n.conceptId.replace(/_/g, "-")
      : n.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const estimatedTime = n.estimatedMinutes > 60
      ? `${Math.round(n.estimatedMinutes / 60)} hours`
      : `${n.estimatedMinutes || 20} min`;

    let status: PathNode["status"] = n.status as PathNode["status"];
    if (n.status === "adapted") status = "adapted";

    return {
      id: n.id || `node-${idx + 1}`,
      stepNumber: n.order || idx + 1,
      title: n.title,
      category: normalizeCategory(n.category),
      status,
      difficulty: n.mastery >= 75 ? "Advanced" : n.mastery >= 50 ? "Intermediate" : "Beginner",
      estimatedTime,
      completionPercent: n.progress,
      skillDeveloped: n.title,
      description: n.reason || `Target concept: ${n.title}`,
      lessonId,
      quizId: `quiz-${lessonId}`,
      isAdaptedReason: n.status === "adapted" ? n.reason : undefined,
      prerequisites: n.prerequisites || []
    };
  });
}

/**
 * Maps BackendPracticeQuestion to Frontend PracticeQuestion
 */
export function mapBackendQuestionToQuestion(q: BackendPracticeQuestion): PracticeQuestion {
  let difficulty: "Easy" | "Medium" | "Hard" = "Medium";
  if (q.difficulty === "Easy") difficulty = "Easy";
  else if (q.difficulty === "Hard") difficulty = "Hard";

  return {
    id: q.id,
    category: (q.category as PracticeQuestion["category"]) || "Machine Learning",
    difficulty,
    conceptTested: q.conceptTested || q.conceptId,
    title: q.title,
    question: q.question,
    codeSnippet: q.codeSnippet || undefined,
    options: q.options || [],
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    hint: q.hint || "Analyze the core concept and check for trade-offs.",
    whyThisQuestion: q.whyThisQuestion || undefined
  };
}

/**
 * Maps Backend AdaptiveDecision to Frontend AdaptiveEvent
 */
export function mapBackendAdaptiveDecisionToEvent(decision: BackendAdaptiveDecision | any): AdaptiveEvent {
  return {
    id: decision.id || `adapt-${Date.now()}`,
    timestamp: decision.timestamp || "Just now",
    topic: decision.topic || decision.concept || "AI Concept",
    score: typeof decision.score === "number" ? decision.score : 0,
    action: decision.action || "maintained",
    reason: decision.reason || "Quiz submitted and evaluated by AI Engine.",
    recommendation: decision.recommendation || "Proceeding to next recommended challenge.",
    pathAdjustment: decision.pathAdjustment || "Roadmap calibrated for current mastery."
  };
}

/**
 * Maps Backend TutorData to chat UI response structure
 */
export function mapBackendTutorResponseToUI(tutorData: BackendTutorData): {
  reply: string;
  followUps: string[];
  quiz?: any;
  conversationId: string;
  adaptiveDecision?: BackendAdaptiveDecision | null;
} {
  let quiz: any = undefined;
  if (tutorData.checkpointQuestion && tutorData.checkpointQuestion.question) {
    quiz = {
      question: tutorData.checkpointQuestion.question,
      options: tutorData.checkpointQuestion.options || [],
      correctIndex: tutorData.checkpointQuestion.correctIndex ?? 0,
      explanation: tutorData.checkpointQuestion.explanation || ""
    };
  }

  return {
    reply: tutorData.message,
    followUps: tutorData.followUpSuggestions || [],
    quiz,
    conversationId: tutorData.conversationId,
    adaptiveDecision: tutorData.adaptiveDecision
  };
}

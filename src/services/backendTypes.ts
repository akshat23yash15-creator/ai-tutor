/**
 * LearnAI — Backend API Types
 * Strictly aligned with FastAPI OpenAPI specifications from https://learnai-ml-backend.onrender.com/openapi.json
 */

export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
}

export interface BackendResponse<T = any> {
  success: boolean;
  action: string;
  data: T | null;
  error: ErrorInfo | null;
  fallback_data: any | null;
}

export interface BackendStrength {
  name: string;
  score: number;
  description: string;
}

export interface BackendWeakness {
  name: string;
  score: number;
  reason: string;
  recommendedLessonId: string;
}

export interface BackendConceptState {
  concept: string;
  mastery: number;
  attempts: number;
  correct: number;
  recentAccuracy: number | null;
  confidence: number;
  trend: "improving" | "declining" | "stable" | string;
}

export interface BackendAdaptiveDecision {
  id: string;
  timestamp: string;
  createdAt?: string;
  topic: string;
  score: number;
  action: "reduced" | "maintained" | "increased";
  reason: string;
  recommendation: string;
  pathAdjustment: string;
  concept?: string;
  overridden?: boolean;
  thresholdAction?: string;
}

export interface BackendWeaknessEntry {
  concept: string;
  name: string;
  category: string;
  mastery: number;
  attempts: number;
  classification: string;
  priority: number;
  label: string;
  reason: string;
  tutor_alert: any;
  recommended_revision?: {
    concept: string;
    name: string;
    mastery: number;
    is_prerequisite?: boolean;
  };
}

export interface BackendWeaknessReport {
  strong: BackendWeaknessEntry[];
  average: BackendWeaknessEntry[];
  weak: BackendWeaknessEntry[];
  untried: string[];
}

export interface BackendLearnerProfile {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  role: string;
  goal: string;
  targetRole: string;
  experience: string;
  knownLanguages: string[];
  knownTopics: string[];
  targetTopics: string[];
  learningPace: "Relaxed" | "Balanced" | "Intensive";
  dailyCommitmentMinutes: number;
  streakDays: number;
  questionsSolved: number;
  accuracyRate: number;
  conceptsMastered: number;
  skills: Record<string, number>;
  strengths: BackendStrength[];
  weaknesses: BackendWeakness[];
  conceptStates: BackendConceptState[];
  recentAdaptiveEvents: BackendAdaptiveDecision[];
}

export interface BackendProfileData {
  profile: BackendLearnerProfile;
  weakness_report: BackendWeaknessReport;
}

export interface BackendPathNode {
  id: string;
  conceptId: string;
  title: string;
  category: "Foundations" | "Core ML" | "Deep Learning" | "Generative AI" | "Capstone" | string;
  status: "completed" | "current" | "recommended" | "adapted" | "locked";
  progress: number;
  mastery: number;
  estimatedMinutes: number;
  reason: string;
  isRevision: boolean;
  skipped: boolean;
  prerequisites: string[];
  foundationFor: string | null;
  order: number;
}

export interface BackendDailyTask {
  id: string;
  title: string;
  type: "review" | "learn" | "practice" | "checkpoint" | "lesson" | "revision" | string;
  durationMinutes: number;
  completed: boolean;
  conceptId?: string;
  difficulty?: string;
}

export interface BackendPathData {
  goal: string;
  goalLabel: string;
  targets: string[];
  nodes: BackendPathNode[];
  milestones: any[];
  currentNode: any;
  nextNodes: string[];
  changes: any[];
  changedNow: boolean;
  beforeAfter: string;
  whyThisPath: string;
  whySource: string;
  estimatedWeeksRemaining: number;
  totalEstimatedMinutes: number;
  dailyPlan: BackendDailyTask[];
  pathHash: string;
  preview: boolean;
}

export interface BackendPracticeQuestion {
  id: string;
  category: "Python" | "Statistics" | "Machine Learning" | "Deep Learning" | "NLP" | "Computer Vision" | "Generative AI" | "LLMs" | string;
  difficulty: "Easy" | "Medium" | "Hard" | "Adaptive" | string;
  conceptId: string;
  conceptTested: string;
  title: string;
  question: string;
  codeSnippet?: string | null;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  whyThisQuestion: string;
  recommendedNextDifficulty?: string;
  scenarioDomain?: string;
  questionAngle?: string;
  source?: string;
  verified?: boolean;
  poolTier?: string;
}

export interface BackendQuestionsData {
  count: number;
  requested_count: number;
  concept: string;
  concept_name: string;
  selection_reason: string;
  difficulty: string;
  difficulty_reason: string;
  questions: BackendPracticeQuestion[];
  sources?: any;
  generation?: any;
}

export interface BackendCheckpointQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BackendTutorData {
  conversationId: string;
  message: string;
  mode: string;
  modeSource: string;
  concept: string | null;
  conceptName: string | null;
  difficultyLevel: string;
  followUpSuggestions: string[];
  checkpointQuestion?: BackendCheckpointQuestion | null;
  recommendedNextAction?: {
    type: string;
    targetTopic?: string;
    reason?: string;
  } | null;
  evaluation?: any;
  masteryUpdate?: any;
  adaptiveDecision?: BackendAdaptiveDecision | null;
  promptVersion?: string;
  guardrails?: any;
  generation?: any;
}

export interface BackendMasteryUpdate {
  concept: string;
  concept_name: string;
  previous_score: number;
  new_score: number;
  category: string;
  previous_category_score: number;
  new_category_score: number;
  trend: string;
  confidence: number;
}

export interface BackendEvaluateResult {
  question_id: string;
  is_correct: boolean;
  correct_index: number;
  concept: string;
}

export interface BackendEvaluateData {
  results: BackendEvaluateResult[];
  score: number;
  mastery_updates: BackendMasteryUpdate[];
  weakness_report: BackendWeaknessReport;
  next_difficulty: {
    concept: string;
    difficulty: string;
    reason: string;
    rule_id: string;
  };
  adaptive_decision: BackendAdaptiveDecision;
}

export interface BackendAssessmentData {
  profile: BackendLearnerProfile;
  weakness_report: BackendWeaknessReport;
  path: BackendPathData;
  level: string;
  goal: string;
  firstStep: any;
}

export interface BackendResetData {
  profile: BackendLearnerProfile;
  weakness_report: BackendWeaknessReport;
  reset: boolean;
}

export interface BackendHealthData {
  status: string;
  db: string;
  llm_configured: boolean;
  pool_size: number;
}

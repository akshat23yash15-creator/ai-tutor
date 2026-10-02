import axios from "axios";
import {
  BackendResponse,
  BackendProfileData,
  BackendResetData,
  BackendEvaluateData,
  BackendQuestionsData,
  BackendTutorData,
  BackendPathData,
  BackendAssessmentData,
  BackendHealthData
} from "./backendTypes";

// Base URL for LearnAI ML Backend
const ML_API_BASE = import.meta.env.VITE_ML_API_URL || "https://learnai-ml-backend.onrender.com";
const TIMEOUT_MS = 45000; // 45 seconds tolerance for Render cold starts

export function getMlApiUrl(): string {
  return ML_API_BASE;
}

/**
 * Single universal API caller for POST /api/v1/learnai
 */
export async function callLearnAI<T = any>(
  action: string,
  learnerId: string,
  payload: Record<string, any> = {}
): Promise<BackendResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const endpoint = `${ML_API_BASE.replace(/\/+$/, "")}/api/v1/learnai`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action,
        learner_id: learnerId,
        payload
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Backend can return 200 even on action failure, or 4xx/5xx
    const data = await response.json();

    // Check data.success explicitly (never rely solely on HTTP status)
    if (!data || typeof data.success !== "boolean") {
      return {
        success: false,
        action,
        data: null,
        error: {
          code: "INVALID_RESPONSE_FORMAT",
          message: "Backend returned an unexpected payload structure."
        },
        fallback_data: null
      };
    }

    return data as BackendResponse<T>;
  } catch (error: any) {
    clearTimeout(timeoutId);

    const isTimeout = error.name === "AbortError";
    const errorMessage = isTimeout
      ? "AI service request timed out (45s). The service may be waking up."
      : error.message || "Failed to communicate with AI backend.";

    return {
      success: false,
      action,
      data: null,
      error: {
        code: isTimeout ? "MODEL_TIMEOUT" : "NETWORK_ERROR",
        message: errorMessage,
        details: error
      },
      fallback_data: null
    };
  }
}

/**
 * Health check on backend startup (GET /health)
 */
export async function checkHealth(): Promise<BackendResponse<BackendHealthData>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s health check
  const endpoint = `${ML_API_BASE.replace(/\/+$/, "")}/health`;

  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      return {
        success: false,
        action: "health",
        data: null,
        error: { code: `HTTP_${response.status}`, message: "Health check returned non-200" },
        fallback_data: null
      };
    }
    const data = await response.json();
    return {
      success: true,
      action: "health",
      data,
      error: null,
      fallback_data: null
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      success: false,
      action: "health",
      data: null,
      error: { code: "HEALTH_CHECK_FAILED", message: err.message },
      fallback_data: null
    };
  }
}

/**
 * 1. GET PROFILE
 */
export async function getProfile(learnerId: string): Promise<BackendResponse<BackendProfileData>> {
  return callLearnAI<BackendProfileData>("get_profile", learnerId, {});
}

/**
 * 2. RESET LEARNER
 */
export async function resetLearner(learnerId: string): Promise<BackendResponse<BackendResetData>> {
  return callLearnAI<BackendResetData>("reset_learner", learnerId, {});
}

/**
 * 3. GET LEARNING PATH
 */
export async function getLearningPath(learnerId: string, params: { goal?: string } = {}): Promise<BackendResponse<BackendPathData>> {
  return callLearnAI<BackendPathData>("get_path", learnerId, params);
}

/**
 * 4. GENERATE QUESTIONS
 */
export async function generateQuestions(
  learnerId: string,
  params: {
    category?: string;
    target_concept?: string;
    difficulty?: "Adaptive" | "Easy" | "Medium" | "Hard" | string;
    count?: number;
  } = {}
): Promise<BackendResponse<BackendQuestionsData>> {
  return callLearnAI<BackendQuestionsData>("generate_questions", learnerId, params);
}

/**
 * 5. TUTOR CHAT
 */
export async function tutorChat(
  learnerId: string,
  params: {
    message: string;
    conversation_id?: string;
    mode?: "explanation" | "simplify" | "example" | "code" | "practice" | "hint" | "evaluate" | "revision" | "path" | string;
    current_topic?: string;
    question_id?: string;
    student_answer?: string;
  }
): Promise<BackendResponse<BackendTutorData>> {
  return callLearnAI<BackendTutorData>("tutor_chat", learnerId, params);
}

/**
 * 6. EVALUATE SINGLE ANSWER
 */
export async function evaluateAnswer(
  learnerId: string,
  params: {
    question_id: string;
    selected_option_index: number;
    time_taken_seconds?: number;
    concept_tested?: string;
    category?: string;
    difficulty?: string;
  }
): Promise<BackendResponse<BackendEvaluateData>> {
  return callLearnAI<BackendEvaluateData>("evaluate", learnerId, params);
}

/**
 * 7. EVALUATE QUIZ BATCH
 */
export async function evaluateQuiz(
  learnerId: string,
  params: {
    topic: string;
    category: string;
    answers: Array<{
      question_id: string;
      concept_tested?: string;
      difficulty?: string;
      selected_option_index: number;
      correct_index?: number;
      is_correct?: boolean;
      time_taken_seconds?: number;
    }>;
  }
): Promise<BackendResponse<BackendEvaluateData>> {
  return callLearnAI<BackendEvaluateData>("evaluate", learnerId, {
    quiz: true,
    topic: params.topic,
    category: params.category,
    answers: params.answers
  });
}

/**
 * 8. SUBMIT ASSESSMENT
 */
export async function submitAssessment(
  learnerId: string,
  params: {
    name?: string;
    experience_level: string;
    languages: string[];
    topics_known: string[];
    goal: string;
    pace: "Relaxed" | "Balanced" | "Intensive" | string;
    daily_minutes: number;
    overwrite?: boolean;
  }
): Promise<BackendResponse<BackendAssessmentData>> {
  return callLearnAI<BackendAssessmentData>("assessment", learnerId, params);
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy Axios instance export preserved for any existing services
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const legacyApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

legacyApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      (error.response?.status === 401 ||
        (error.response?.status === 500 && error.response?.data?.message === "jwt expired"))
    ) {
      localStorage.removeItem("user");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default legacyApi;

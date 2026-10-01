export interface LearnerProfile {
  id: string;
  name: string;
  avatar: string;
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
  overallProgress: number; // 0-100
  accuracyRate: number; // 0-100
  questionsSolved: number;
  conceptsMastered: number;
  weeklyHoursSpent: number; // e.g. 4.6
  estimatedWeeksRemaining: number;
  whyThisPath: string;
  strengths: { name: string; score: number; description: string }[];
  weaknesses: { name: string; score: number; reason: string; recommendedLessonId: string }[];
  skills: { [category: string]: number }; // percentage
  weeklyAccuracyTrends: { week: string; accuracy: number; studyHours: number }[];
  dailyPlan: {
    id: string;
    title: string;
    type: "review" | "learn" | "practice" | "checkpoint";
    durationMinutes: number;
    completed: boolean;
    lessonId?: string;
  }[];
  recentAdaptiveDecision?: {
    timestamp: string;
    trigger: string;
    score: number;
    action: "reduced" | "increased" | "maintained";
    description: string;
    beforePath: string;
    afterPath: string;
    adjustedTopic: string;
  };
}

export const DEMO_PROFILES: Record<string, LearnerProfile> = {
  intermediate: {
    id: "intermediate",
    name: "Akshat",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    level: "Intermediate",
    role: "Software Developer",
    goal: "Become an ML Engineer",
    targetRole: "Machine Learning Engineer",
    experience: "Intermediate (2+ years programming)",
    knownLanguages: ["Python", "JavaScript", "SQL"],
    knownTopics: ["Python for AI", "NumPy", "Pandas", "Basic Linear Algebra"],
    targetTopics: ["Machine Learning", "Deep Learning", "Generative AI", "LLM Applications"],
    learningPace: "Balanced",
    dailyCommitmentMinutes: 45,
    streakDays: 6,
    overallProgress: 64,
    accuracyRate: 78,
    questionsSolved: 87,
    conceptsMastered: 24,
    weeklyHoursSpent: 4.6,
    estimatedWeeksRemaining: 12,
    whyThisPath:
      "You already have solid proficiency in Python and data manipulation (NumPy/Pandas), so we skipped beginner syntax. Your diagnostic indicates that Statistics and Model Evaluation (especially the Bias-Variance tradeoff) require reinforcement before scaling into Deep Learning and LLM systems.",
    strengths: [
      { name: "Python for AI", score: 88, description: "Strong vector operations, list comprehensions, and data structures." },
      { name: "NumPy & Pandas", score: 84, description: "Fast dataframe operations, indexing, and vectorization." },
      { name: "Supervised Classification", score: 76, description: "Good intuition on decision trees and logistic regression." }
    ],
    weaknesses: [
      {
        name: "Bias vs Variance Tradeoff",
        score: 54,
        reason: "Missed 3 consecutive questions on high variance diagnostics and regularization techniques.",
        recommendedLessonId: "bias-variance"
      },
      {
        name: "Gradient Descent Optimization",
        score: 61,
        reason: "Struggled with learning rate decay schedules and momentum formulations.",
        recommendedLessonId: "gradient-descent"
      },
      {
        name: "Confusion Matrix & ROC-AUC",
        score: 63,
        reason: "Confusion between Precision vs Recall tradeoffs on imbalanced datasets.",
        recommendedLessonId: "model-evaluation"
      }
    ],
    skills: {
      "Python": 88,
      "Statistics": 62,
      "Machine Learning": 71,
      "Deep Learning": 35,
      "NLP": 20,
      "Generative AI": 15
    },
    weeklyAccuracyTrends: [
      { week: "Week 1", accuracy: 52, studyHours: 3.5 },
      { week: "Week 2", accuracy: 61, studyHours: 4.1 },
      { week: "Week 3", accuracy: 68, studyHours: 4.4 },
      { week: "Week 4", accuracy: 78, studyHours: 4.6 }
    ],
    dailyPlan: [
      { id: "dp-1", title: "Review: NumPy Matrix Operations", type: "review", durationMinutes: 10, completed: true, lessonId: "numpy-basics" },
      { id: "dp-2", title: "Learn: Bias vs Variance Tradeoff", type: "learn", durationMinutes: 20, completed: false, lessonId: "bias-variance" },
      { id: "dp-3", title: "Practice: 5 Adaptive ML Questions", type: "practice", durationMinutes: 15, completed: false, lessonId: "practice-ml" },
      { id: "dp-4", title: "Mini Checkpoint: Overfitting Diagnostics", type: "checkpoint", durationMinutes: 5, completed: false, lessonId: "quiz-overfit" }
    ],
    recentAdaptiveDecision: {
      timestamp: "Today at 2:15 PM",
      trigger: "Recent quiz score on Bias vs Variance was 54% (below 60% threshold).",
      score: 54,
      action: "reduced",
      description: "We noticed that you struggled with Bias vs Variance. Your next lesson has been adjusted.",
      beforePath: "Advanced Model Evaluation → Deep Neural Networks",
      afterPath: "Bias vs Variance → Overfitting & Regularization → Model Evaluation",
      adjustedTopic: "Bias vs Variance"
    }
  },

  beginner: {
    id: "beginner",
    name: "Alex",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    level: "Beginner",
    role: "Aspiring Tech Learner",
    goal: "Learn Machine Learning from Scratch",
    targetRole: "Junior ML Practitioner",
    experience: "Beginner (Basic programming knowledge)",
    knownLanguages: ["Python"],
    knownTopics: ["Basic Variables", "Loops"],
    targetTopics: ["Python for AI", "NumPy", "Statistics", "Machine Learning Basics"],
    learningPace: "Relaxed",
    dailyCommitmentMinutes: 30,
    streakDays: 3,
    overallProgress: 28,
    accuracyRate: 64,
    questionsSolved: 32,
    conceptsMastered: 8,
    weeklyHoursSpent: 2.8,
    estimatedWeeksRemaining: 18,
    whyThisPath:
      "Starting with core Python foundations, mathematical intuition, and data visualization. We focus on zero-jargon explanations, bite-sized quizzes, and visual experiments before touching complex mathematical algorithms.",
    strengths: [
      { name: "Python Syntax", score: 78, description: "Understands fundamental control flow and functions." },
      { name: "Curiosity & Consistency", score: 85, description: "Consistent daily log-ins and lesson reviews." }
    ],
    weaknesses: [
      {
        name: "Matrix Multiplication & Shapes",
        score: 42,
        reason: "Confused by multi-dimensional array dimensions and dot products.",
        recommendedLessonId: "numpy-basics"
      },
      {
        name: "Standard Deviation & Variance",
        score: 50,
        reason: "Needs intuitive visual analogies for spread and normal distributions.",
        recommendedLessonId: "statistics-intro"
      }
    ],
    skills: {
      "Python": 65,
      "Statistics": 38,
      "Machine Learning": 25,
      "Deep Learning": 10,
      "NLP": 5,
      "Generative AI": 10
    },
    weeklyAccuracyTrends: [
      { week: "Week 1", accuracy: 48, studyHours: 2.0 },
      { week: "Week 2", accuracy: 55, studyHours: 2.5 },
      { week: "Week 3", accuracy: 60, studyHours: 2.6 },
      { week: "Week 4", accuracy: 64, studyHours: 2.8 }
    ],
    dailyPlan: [
      { id: "dp-b1", title: "Review: Python Lists vs Arrays", type: "review", durationMinutes: 10, completed: true, lessonId: "numpy-basics" },
      { id: "dp-b2", title: "Learn: Introduction to NumPy", type: "learn", durationMinutes: 15, completed: false, lessonId: "numpy-basics" },
      { id: "dp-b3", title: "Practice: 3 Beginner Array Exercises", type: "practice", durationMinutes: 10, completed: false, lessonId: "practice-py" }
    ],
    recentAdaptiveDecision: {
      timestamp: "Yesterday",
      trigger: "Completed Python basics with 80% accuracy.",
      score: 80,
      action: "maintained",
      description: "Pacing is balanced. Tutor added visual matrix sandbox to clarify 2D array indexing.",
      beforePath: "NumPy Intro → Hard Linear Algebra",
      afterPath: "NumPy Intro → Visual Array Indexing → Statistics Intro",
      adjustedTopic: "NumPy Arrays"
    }
  },

  advanced: {
    id: "advanced",
    name: "Elena",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    level: "Advanced",
    role: "Senior Data Scientist",
    goal: "Build GenAI Applications & Fine-tune LLMs",
    targetRole: "AI Architect / GenAI Lead",
    experience: "Advanced (4+ years in ML/Data Science)",
    knownLanguages: ["Python", "C++", "R", "SQL"],
    knownTopics: ["Machine Learning", "Deep Learning", "CNNs", "Transformers", "PyTorch"],
    targetTopics: ["LLM Fine-Tuning", "RAG Architecture", "Agentic Systems", "RLHF"],
    learningPace: "Intensive",
    dailyCommitmentMinutes: 60,
    streakDays: 14,
    overallProgress: 88,
    accuracyRate: 91,
    questionsSolved: 215,
    conceptsMastered: 62,
    weeklyHoursSpent: 7.2,
    estimatedWeeksRemaining: 4,
    whyThisPath:
      "All standard ML and deep learning foundations were bypassed. You are accelerated directly into transformer architectures, LoRA/PEFT fine-tuning, RAG indexing mechanisms, and autonomous multi-agent tool calling.",
    strengths: [
      { name: "Deep Learning Architectures", score: 95, description: "Mastery of attention mechanisms, backprop, and PyTorch tensors." },
      { name: "Model Evaluation", score: 92, description: "Strong metric selection for high-stakes deployment." },
      { name: "Transformer Attention", score: 90, description: "Deep understanding of self-attention and cross-attention matrices." }
    ],
    weaknesses: [
      {
        name: "Vector DB Embedding Chunking",
        score: 68,
        reason: "Sub-optimal chunk overlap leading to semantic drift in retrieval pipelines.",
        recommendedLessonId: "rag-systems"
      }
    ],
    skills: {
      "Python": 98,
      "Statistics": 94,
      "Machine Learning": 92,
      "Deep Learning": 88,
      "NLP": 85,
      "Generative AI": 74
    },
    weeklyAccuracyTrends: [
      { week: "Week 1", accuracy: 82, studyHours: 5.5 },
      { week: "Week 2", accuracy: 86, studyHours: 6.2 },
      { week: "Week 3", accuracy: 89, studyHours: 6.8 },
      { week: "Week 4", accuracy: 91, studyHours: 7.2 }
    ],
    dailyPlan: [
      { id: "dp-a1", title: "Review: Self-Attention Mathematics", type: "review", durationMinutes: 15, completed: true, lessonId: "transformer-attention" },
      { id: "dp-a2", title: "Learn: Advanced RAG with Re-Ranking", type: "learn", durationMinutes: 25, completed: false, lessonId: "rag-systems" },
      { id: "dp-a3", title: "Practice: Hard Context Window Stress Test", type: "practice", durationMinutes: 20, completed: false, lessonId: "practice-genai" }
    ],
    recentAdaptiveDecision: {
      timestamp: "Today at 10:45 AM",
      trigger: "Scored 94% on Transformer Architecture quiz.",
      score: 94,
      action: "increased",
      description: "You scored 94% on Transformer mechanics. We fast-tracked you directly into LoRA parameter-efficient fine-tuning.",
      beforePath: "Standard Transformer Tuning → Basic Prompt Engineering",
      afterPath: "FlashAttention & LoRA Tuning → Production RAG Deployment",
      adjustedTopic: "Advanced LLM Fine-Tuning"
    }
  }
};

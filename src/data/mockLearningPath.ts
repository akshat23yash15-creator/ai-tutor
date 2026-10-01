export interface PathNode {
  id: string;
  stepNumber: number;
  title: string;
  category: "Foundations" | "Core ML" | "Deep Learning" | "Generative AI" | "Capstone";
  status: "completed" | "current" | "recommended" | "locked" | "adapted";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  completionPercent: number;
  skillDeveloped: string;
  description: string;
  lessonId: string;
  quizId?: string;
  isAdaptedReason?: string;
  prerequisites: string[];
}

export const INTERMEDIATE_LEARNING_PATH: PathNode[] = [
  {
    id: "node-1",
    stepNumber: 1,
    title: "Python Foundations for AI",
    category: "Foundations",
    status: "completed",
    difficulty: "Beginner",
    estimatedTime: "2 hours",
    completionPercent: 100,
    skillDeveloped: "Python Syntax, Data Structures & Comprehensions",
    description: "Core syntax, generators, lambda functions, and object-oriented modeling for ML workflows.",
    lessonId: "python-basics",
    prerequisites: []
  },
  {
    id: "node-2",
    stepNumber: 2,
    title: "NumPy & Pandas Vectorization",
    category: "Foundations",
    status: "completed",
    difficulty: "Beginner",
    estimatedTime: "3.5 hours",
    completionPercent: 100,
    skillDeveloped: "Matrix Operations & Data Wrangling",
    description: "High-performance vector operations, broadcasting, DataFrame cleansing, and feature prep.",
    lessonId: "numpy-pandas",
    prerequisites: ["node-1"]
  },
  {
    id: "node-3",
    stepNumber: 3,
    title: "Applied Statistics & Probability",
    category: "Foundations",
    status: "completed",
    difficulty: "Intermediate",
    estimatedTime: "4 hours",
    completionPercent: 100,
    skillDeveloped: "Distributions, Hypothesis Testing & Bayes Theorem",
    description: "Probability distributions, central limit theorem, p-values, and Bayesian updating in ML.",
    lessonId: "statistics-intro",
    prerequisites: ["node-2"]
  },
  {
    id: "node-4",
    stepNumber: 4,
    title: "Machine Learning Fundamentals",
    category: "Core ML",
    status: "completed",
    difficulty: "Intermediate",
    estimatedTime: "4.5 hours",
    completionPercent: 100,
    skillDeveloped: "Loss Functions & Optimization",
    description: "Supervised vs unsupervised paradigms, cost functions, gradient descent intuition, and regression.",
    lessonId: "ml-fundamentals",
    prerequisites: ["node-3"]
  },
  {
    id: "node-5",
    stepNumber: 5,
    title: "Bias vs Variance & Regularization",
    category: "Core ML",
    status: "current",
    difficulty: "Intermediate",
    estimatedTime: "2.5 hours",
    completionPercent: 45,
    skillDeveloped: "Overfitting Diagnostics & L1/L2 Penalties",
    description: "Deconstructing generalization error, learning curves, L1 (Lasso) / L2 (Ridge) penalties, and dropout intuition.",
    lessonId: "bias-variance",
    quizId: "quiz-bias-variance",
    isAdaptedReason: "AI Tutor Flag: Accuracy dropped to 54% on recent mini-quiz. Revision nodes and diagnostic sandbox injected.",
    prerequisites: ["node-4"]
  },
  {
    id: "node-6",
    stepNumber: 6,
    title: "Model Evaluation & Validation Strategies",
    category: "Core ML",
    status: "recommended",
    difficulty: "Intermediate",
    estimatedTime: "3 hours",
    completionPercent: 0,
    skillDeveloped: "Cross-Validation, ROC-AUC & F1 Diagnostics",
    description: "Stratified K-Fold validation, confusion matrix deep dive, precision-recall curve analysis under severe class imbalance.",
    lessonId: "model-evaluation",
    prerequisites: ["node-5"]
  },
  {
    id: "node-7",
    stepNumber: 7,
    title: "Deep Learning & Neural Networks",
    category: "Deep Learning",
    status: "locked",
    difficulty: "Advanced",
    estimatedTime: "6 hours",
    completionPercent: 0,
    skillDeveloped: "Backpropagation, PyTorch Tensors & Activation Functions",
    description: "Building multi-layer perceptrons from scratch, matrix derivations of backprop, and modern optimizers (AdamW).",
    lessonId: "deep-learning-intro",
    prerequisites: ["node-6"]
  },
  {
    id: "node-8",
    stepNumber: 8,
    title: "Generative AI & Transformer Architectures",
    category: "Generative AI",
    status: "locked",
    difficulty: "Advanced",
    estimatedTime: "5 hours",
    completionPercent: 0,
    skillDeveloped: "Self-Attention, Positional Encodings & LLM Pretraining",
    description: "The 'Attention is All You Need' blueprint, transformer blocks, encoder-decoder models, and tokenizer nuances.",
    lessonId: "transformers-genai",
    prerequisites: ["node-7"]
  },
  {
    id: "node-9",
    stepNumber: 9,
    title: "Production LLM Apps & RAG Architectures",
    category: "Generative AI",
    status: "locked",
    difficulty: "Advanced",
    estimatedTime: "4.5 hours",
    completionPercent: 0,
    skillDeveloped: "Vector DBs, Semantic Chunking & Re-ranking",
    description: "Production Retrieval-Augmented Generation, hybrid lexical-dense retrieval, evaluation harnesses, and latency caching.",
    lessonId: "rag-systems",
    prerequisites: ["node-8"]
  },
  {
    id: "node-10",
    stepNumber: 10,
    title: "Autonomous AI Agent Project",
    category: "Capstone",
    status: "locked",
    difficulty: "Advanced",
    estimatedTime: "8 hours",
    completionPercent: 0,
    skillDeveloped: "Full-Stack AI Architecture & Tool Calling",
    description: "End-to-end multi-agent framework with memory stores, live execution sandbox, and automated evaluation.",
    lessonId: "capstone-agent",
    prerequisites: ["node-9"]
  }
];

export const BEGINNER_LEARNING_PATH: PathNode[] = [
  {
    id: "node-b1",
    stepNumber: 1,
    title: "Python Foundations for AI",
    category: "Foundations",
    status: "current",
    difficulty: "Beginner",
    estimatedTime: "3 hours",
    completionPercent: 60,
    skillDeveloped: "Basic Syntax, Variables, Lists & Functions",
    description: "Learn Python through friendly interactive exercises focused on data and simple mathematical formulas.",
    lessonId: "python-basics",
    prerequisites: []
  },
  {
    id: "node-b2",
    stepNumber: 2,
    title: "NumPy & Visual Data Arrays",
    category: "Foundations",
    status: "recommended",
    difficulty: "Beginner",
    estimatedTime: "3 hours",
    completionPercent: 0,
    skillDeveloped: "Visualizing 1D and 2D numerical grids",
    description: "Hands-on matrix indexing, slicing, and reshaping with visual interactive heatmaps.",
    lessonId: "numpy-pandas",
    prerequisites: ["node-b1"]
  },
  {
    id: "node-b3",
    stepNumber: 3,
    title: "Intuitive Statistics & Data Distributions",
    category: "Foundations",
    status: "locked",
    difficulty: "Beginner",
    estimatedTime: "3.5 hours",
    completionPercent: 0,
    skillDeveloped: "Mean, Median, Spread & Bell Curves",
    description: "Understand data behavior without dry math textbooks. Interactive sliders for variance and standard deviation.",
    lessonId: "statistics-intro",
    prerequisites: ["node-b2"]
  },
  {
    id: "node-b4",
    stepNumber: 4,
    title: "What is Machine Learning?",
    category: "Core ML",
    status: "locked",
    difficulty: "Beginner",
    estimatedTime: "4 hours",
    completionPercent: 0,
    skillDeveloped: "Linear Regression & Classification Intuition",
    description: "Teaching a computer to predict prices and classify images through examples.",
    lessonId: "ml-fundamentals",
    prerequisites: ["node-b3"]
  },
  {
    id: "node-b5",
    stepNumber: 5,
    title: "Your First Neural Network",
    category: "Deep Learning",
    status: "locked",
    difficulty: "Intermediate",
    estimatedTime: "5 hours",
    completionPercent: 0,
    skillDeveloped: "Neurons, Weights & Biases",
    description: "Demystifying deep learning by building a single perceptron that learns to recognize numbers.",
    lessonId: "deep-learning-intro",
    prerequisites: ["node-b4"]
  }
];

export const ADVANCED_LEARNING_PATH: PathNode[] = [
  {
    id: "node-a1",
    stepNumber: 1,
    title: "Transformer Attention Mathematics",
    category: "Deep Learning",
    status: "completed",
    difficulty: "Advanced",
    estimatedTime: "3 hours",
    completionPercent: 100,
    skillDeveloped: "Scaled Dot-Product & Multi-Head Projections",
    description: "Mathematical proof and PyTorch implementation of FlashAttention and causal masking.",
    lessonId: "transformers-genai",
    prerequisites: []
  },
  {
    id: "node-a2",
    stepNumber: 2,
    title: "PEFT & LoRA Parameter Fine-Tuning",
    category: "Generative AI",
    status: "current",
    difficulty: "Advanced",
    estimatedTime: "4 hours",
    completionPercent: 70,
    skillDeveloped: "Low-Rank Adaptation & QLoRA Quantization",
    description: "Fine-tune 7B/70B parameter models on single GPUs using 4-bit NormalFloat quantization and rank decomposition.",
    lessonId: "lora-fine-tuning",
    prerequisites: ["node-a1"]
  },
  {
    id: "node-a3",
    stepNumber: 3,
    title: "Enterprise Multi-Modal RAG Architecture",
    category: "Generative AI",
    status: "recommended",
    difficulty: "Advanced",
    estimatedTime: "5 hours",
    completionPercent: 0,
    skillDeveloped: "ColBERT Late Interaction & GraphRAG",
    description: "Combining dense vector search with knowledge graphs and cross-encoder re-rankers for zero hallucination.",
    lessonId: "rag-systems",
    prerequisites: ["node-a2"]
  },
  {
    id: "node-a4",
    stepNumber: 4,
    title: "Multi-Agent Swarm Orchestration",
    category: "Capstone",
    status: "locked",
    difficulty: "Advanced",
    estimatedTime: "7 hours",
    completionPercent: 0,
    skillDeveloped: "Consensus Protocols, Tool Execution & Sandboxing",
    description: "Building autonomous agent collectives with self-correction, reflection, and human-in-the-loop triggers.",
    lessonId: "capstone-agent",
    prerequisites: ["node-a3"]
  }
];

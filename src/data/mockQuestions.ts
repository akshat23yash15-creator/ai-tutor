export interface PracticeQuestion {
  id: string;
  category: "Python" | "Statistics" | "Machine Learning" | "Deep Learning" | "NLP" | "Computer Vision" | "Generative AI" | "LLMs";
  difficulty: "Easy" | "Medium" | "Hard";
  conceptTested: string;
  title: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export const MOCK_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // ── Machine Learning ──
  {
    id: "ml-q1",
    category: "Machine Learning",
    difficulty: "Medium",
    conceptTested: "Bias vs Variance",
    title: "Identifying Model Behavior from Learning Curves",
    question: "You observe that both the training error and validation error are high and virtually identical as the number of training samples increases. What is the diagnosis?",
    options: [
      "High Variance (Overfitting) — need more regularisation",
      "High Bias (Underfitting) — model is too simple for the underlying pattern",
      "Data leakage between training and validation sets",
      "The dataset has zero irreducible error"
    ],
    correctIndex: 1,
    explanation: "When both training error and validation error plateau at high levels, the model is unable to capture the underlying structure of the data regardless of dataset size. This signifies High Bias (Underfitting). Adding more features or using a more complex hypothesis class is required.",
    hint: "Notice that the model is performing poorly even on the data it was trained on."
  },
  {
    id: "ml-q2",
    category: "Machine Learning",
    difficulty: "Medium",
    conceptTested: "Regularization (L1 vs L2)",
    title: "Sparsity Properties of L1 Regularization",
    question: "Why does L1 regularization (Lasso) tend to produce sparse weight vectors (setting weights exactly to 0), whereas L2 regularization (Ridge) only shrinks weights toward 0?",
    options: [
      "L1 regularization uses a quadratic penalty term that rounds down to zero",
      "The diamond-shaped contour of the L1 norm has sharp corners on the coordinate axes where the loss function contour often intersects",
      "L1 regularization eliminates gradient calculations altogether",
      "L2 regularization is non-differentiable everywhere"
    ],
    correctIndex: 1,
    explanation: "Geometrically, the constraint region for L1 regularization is a hyper-rhombus (diamond) with vertices lying on the axes. The ellipsoidal contours of the squared loss function will most frequently intersect the L1 boundary at these axis corners, causing coordinate coefficients to become exactly zero.",
    hint: "Think about the shape of the unit ball in L1 space versus L2 space."
  },
  {
    id: "ml-q3",
    category: "Machine Learning",
    difficulty: "Hard",
    conceptTested: "Bias-Variance Decomposition",
    title: "Expected Test Error Decomposition",
    question: "If you increase the complexity of a machine learning model (e.g., polynomial degree from 1 to 12), what typically happens to the Bias and Variance components of test error?",
    options: [
      "Bias increases, Variance decreases",
      "Bias decreases, Variance increases",
      "Both Bias and Variance decrease indefinitely",
      "Both Bias and Variance increase simultaneously"
    ],
    correctIndex: 1,
    explanation: "Higher model complexity allows the hypothesis class to fit intricate non-linear patterns, thereby reducing Bias (underfitting). However, it becomes far more susceptible to fitting noise in the particular training sample, which increases Variance (overfitting).",
    hint: "More parameters allow the model to bend more, fitting training points closer."
  },
  {
    id: "ml-q4",
    category: "Machine Learning",
    difficulty: "Easy",
    conceptTested: "Model Evaluation",
    title: "Precision vs Recall Tradeoff",
    question: "In a spam email filter where users hate having important work emails falsely sent to the Spam folder, which metric should be prioritized?",
    options: [
      "Recall (ensure 100% of all spam is caught)",
      "Precision (ensure that whatever is marked as spam is truly spam)",
      "Mean Absolute Error",
      "Log-Loss only"
    ],
    correctIndex: 1,
    explanation: "Precision measures how many of the items flagged as positive were truly positive. A false positive in spam filtering means a legitimate important email goes to spam. Prioritizing Precision ensures minimal false alarms.",
    hint: "False positive: Normal email marked as spam."
  },

  // ── Statistics ──
  {
    id: "stat-q1",
    category: "Statistics",
    difficulty: "Easy",
    conceptTested: "Central Limit Theorem",
    title: "Distribution of Sample Means",
    question: "According to the Central Limit Theorem (CLT), what happens to the distribution of sample means as the sample size (n) increases, regardless of the underlying population distribution?",
    options: [
      "It becomes uniform across all values",
      "It approaches a normal (Gaussian) distribution with mean μ and variance σ²/n",
      "It mimics the exact shape of the skewed population",
      "The sample mean standard error expands to infinity"
    ],
    correctIndex: 1,
    explanation: "The CLT guarantees that the sum or mean of a sufficiently large number of independent and identically distributed (i.i.d.) random variables will be approximately normally distributed, even if the underlying variable itself is heavily skewed.",
    hint: "Think about the famous bell curve shape."
  },
  {
    id: "stat-q2",
    category: "Statistics",
    difficulty: "Medium",
    conceptTested: "Hypothesis Testing",
    title: "Type I vs Type II Errors",
    question: "What is a Type I error in statistical hypothesis testing?",
    options: [
      "Failing to reject a false null hypothesis (False Negative)",
      "Rejecting a true null hypothesis (False Positive)",
      "Calculating a p-value strictly greater than 1.0",
      "Selecting an unrepresentative sample size"
    ],
    correctIndex: 1,
    explanation: "A Type I error (denoted by significance level α) occurs when you reject the null hypothesis H0 when it was actually true. In criminal trials, this is equivalent to convicting an innocent person (False Positive).",
    hint: "Think of crying wolf when there is no wolf."
  },

  // ── Deep Learning ──
  {
    id: "dl-q1",
    category: "Deep Learning",
    difficulty: "Medium",
    conceptTested: "Activation Functions",
    title: "Vanishing Gradient Problem in Deep Networks",
    question: "Why does the ReLU (Rectified Linear Unit) activation function alleviate the vanishing gradient problem in deep networks compared to the Sigmoid function?",
    options: [
      "ReLU has a derivative of 1 for all positive inputs, preventing the gradient from decaying exponentially across layers",
      "ReLU is completely differentiable at x = 0",
      "ReLU outputs negative probabilities for inactive neurons",
      "ReLU automatically normalizes layer activations to unit variance"
    ],
    correctIndex: 0,
    explanation: "The derivative of Sigmoid saturates at 0 for large positive or negative values, maxing out at only 0.25. Multiplying numbers ≤ 0.25 through 50 layers causes gradients to vanish to 0. ReLU's derivative is a constant 1 for all positive activations, allowing gradient signal to flow backwards unattenuated.",
    hint: "What is the slope of f(x) = max(0, x) when x > 0?"
  },
  {
    id: "dl-q2",
    category: "Deep Learning",
    difficulty: "Hard",
    conceptTested: "Backpropagation & Optimizers",
    title: "Adam Optimizer Mechanics",
    question: "What two statistical moments does the Adam (Adaptive Moment Estimation) optimizer maintain for each weight parameter?",
    options: [
      "Skewness and Kurtosis",
      "First moment (mean of gradients / momentum) and uncentered second moment (variance of gradients / RMSprop)",
      "Standard error and covariance with output labels",
      "Hessian diagonal and gradient norm"
    ],
    correctIndex: 1,
    explanation: "Adam keeps an exponentially decaying average of past gradients (first moment, simulating momentum) and past squared gradients (second moment, scaling learning rates inversely by variance).",
    hint: "Combines Momentum with RMSprop."
  },

  // ── Generative AI & LLMs ──
  {
    id: "genai-q1",
    category: "Generative AI",
    difficulty: "Medium",
    conceptTested: "Transformer Self-Attention",
    title: "Computational Complexity of Self-Attention",
    question: "In the standard Vanilla Transformer architecture, what is the computational and memory complexity of the self-attention mechanism with respect to sequence length N?",
    options: [
      "O(N) linear complexity",
      "O(N log N) quasilinear complexity",
      "O(N²) quadratic complexity",
      "O(2^N) exponential complexity"
    ],
    correctIndex: 2,
    explanation: "Computing the attention score matrix requires multiplying the Query matrix (N x d) by the Key matrix transposed (d x N), resulting in an N x N attention matrix. Every token attends to every other token, causing O(N²) time and space complexity.",
    hint: "Every token computes a dot product with every other token."
  },
  {
    id: "genai-q2",
    category: "LLMs",
    difficulty: "Hard",
    conceptTested: "RAG vs Fine-Tuning",
    title: "Architectural Decision: RAG vs Fine-Tuning",
    question: "A company needs an internal assistant to answer questions about proprietary internal financial policies that change every two weeks. Which architectural approach is best suited?",
    options: [
      "Pretrain a 70B parameter model from scratch every fortnight",
      "Fine-tune an open-source LLM using full-rank backprop weekly",
      "Retrieval-Augmented Generation (RAG) connected to the dynamic knowledge repository",
      "Zero-shot prompting with no external context"
    ],
    correctIndex: 2,
    explanation: "Fine-tuning modifies parametric memory (weights) and is slow, expensive, and susceptible to hallucinating outdated facts. RAG decouples knowledge from weights: when documents change, you simply update the vector index in minutes while the base model remains fixed.",
    hint: "Knowledge updates frequently with zero-tolerance for hallucination."
  },

  // ── Python ──
  {
    id: "py-q1",
    category: "Python",
    difficulty: "Easy",
    conceptTested: "NumPy Vectorization",
    title: "Vectorized Operations vs Python For-Loops",
    question: "Why is a vectorized NumPy operation like `a + b` typically 50x-100x faster than writing an equivalent Python `for` loop?",
    options: [
      "Python loops run on the GPU by default",
      "NumPy delegates contiguous C-level arrays directly to SIMD CPU vector instructions, bypassing Python interpreter overhead",
      "NumPy converts floats into integers behind the scenes",
      "Python loops require an internet connection to evaluate"
    ],
    correctIndex: 1,
    explanation: "Python for-loops incur dynamic type-checking, reference counting, and interpreter overhead on every iteration. NumPy arrays store contiguous C-level data in memory and execute compiled C loops utilizing CPU SIMD (Single Instruction Multiple Data) registers.",
    hint: "Contiguous memory and compiled C loops."
  }
];

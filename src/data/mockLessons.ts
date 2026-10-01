export interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  breadcrumbs: string[];
  summary: string;
  keyTakeaways: string[];
  content: string; // Markdown supported
  codeExample?: {
    language: string;
    code: string;
    explanation: string;
  };
  simpleExplanation: string; // "Explain simpler"
  realWorldExample: string;  // "Give me an example"
  checkpointQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  adaptiveActionNote?: string;
}

export const MOCK_LESSONS: Record<string, Lesson> = {
  "bias-variance": {
    id: "bias-variance",
    title: "Bias vs Variance & Regularization",
    category: "Machine Learning",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    breadcrumbs: ["Machine Learning", "Model Evaluation", "Bias vs Variance"],
    summary:
      "Understanding the fundamental tradeoff between underfitting (high bias) and overfitting (high variance), and how to tune model complexity.",
    keyTakeaways: [
      "High Bias causes underfitting: the model is too simplistic to capture the underlying pattern.",
      "High Variance causes overfitting: the model captures noise in the training set and fails to generalize.",
      "Total Error = Bias² + Variance + Irreducible Error.",
      "Regularization (L1/L2) penalizes excessive parameter magnitudes to curb variance."
    ],
    simpleExplanation:
      "Imagine you're studying for an exam. High Bias is like memorizing only the first page and guessing the rest—you miss the real concepts (underfitting). High Variance is like memorizing every comma and page number of your textbook word-for-word—if the exam phrases a question slightly differently, your mind goes blank (overfitting). You want the sweet spot: understanding the core concepts so you pass any exam!",
    realWorldExample:
      "Autonomous Driving Lane Detection: If the car's vision model has high bias, it might only assume all lanes are straight lines, crashing on sharp turns. If it has high variance, it might memorize every crack in the pavement or shadow of a tree as a lane boundary, steering erratically on sunny days. Regularization keeps the steering smooth and resilient.",
    codeExample: {
      language: "python",
      code: `import numpy as np
from sklearn.linear_model import Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

# Synthetic non-linear data with noise
X = np.linspace(-3, 3, 50).reshape(-1, 1)
y = np.sin(X).ravel() + np.random.normal(0, 0.2, 50)

# High Variance (Degree 15 polynomial without regularization)
overfit_model = make_pipeline(PolynomialFeatures(15), Ridge(alpha=0.0))
overfit_model.fit(X, y)

# Balanced (L2 Regularization / Ridge shrinks weights)
regularized_model = make_pipeline(PolynomialFeatures(15), Ridge(alpha=1.0))
regularized_model.fit(X, y)

print("Overfit train score:", overfit_model.score(X, y))
print("Regularized train score:", regularized_model.score(X, y))`,
      explanation:
        "Increasing the penalty alpha shrinks bloated coefficients, reducing variance and smoothing out the decision boundary."
    },
    checkpointQuiz: {
      question: "Your training set accuracy is 99.4%, but your validation set accuracy is only 63.1%. What is the primary diagnosis?",
      options: [
        "High Bias (Underfitting)",
        "High Variance (Overfitting)",
        "High Irreducible Error",
        "The learning rate is too low"
      ],
      correctIndex: 1,
      explanation:
        "A huge gap between high training performance and poor validation performance is the textbook definition of High Variance (Overfitting). The model memorized training artifacts instead of generalizable representations."
    },
    content: `
### 1. Deconstructing the Tradeoff

In supervised machine learning, the goal is to estimate an unknown function $f(x)$ from a finite training set. Every model prediction error breaks down into three distinct components:

$$\\text{Total Expected Error} = \\text{Bias}^2 + \\text{Variance} + \\sigma^2$$

- **Bias:** Error introduced by approximating a real-world problem with an overly simplified model.
- **Variance:** Sensitivity of the model to small fluctuations in the training set.
- **Irreducible Error ($\\sigma^2$):** Noise inherent in the data collection process that no model can eliminate.

---

### 2. Diagnostic Symptoms in Practice

| Metric | High Bias (Underfitting) | High Variance (Overfitting) | Optimal Balance |
| :--- | :--- | :--- | :--- |
| **Training Error** | High ($>25\\%$) | Extremely Low ($<2\\%$) | Low ($3-7\\%$) |
| **Validation Error** | High ($>28\\%$) | High ($>25\\%$) | Low ($4-8\\%$) |
| **Train/Val Gap** | Small | Large | Small & Consistent |
| **Complexity** | Too Low (e.g. Linear on quadratic) | Too High (e.g. 20-degree polynomial) | Calibrated |

---

### 3. How to Counter High Variance

1. **Add L1 (Lasso) or L2 (Ridge) Regularization:** Penalizes large weight coefficients.
2. **Collect More Training Data:** Exposes the model to a wider distribution of real-world variability.
3. **Feature Selection:** Prune collinear or uninformative noisy features.
4. **Ensembling (Bagging / Random Forests):** Averages predictions from multiple high-variance estimators to drive variance down.
5. **Early Stopping / Dropout:** Halts training before the weights latch onto training noise.
`
  },

  "gradient-descent": {
    id: "gradient-descent",
    title: "Gradient Descent & Optimization",
    category: "Machine Learning",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    breadcrumbs: ["Machine Learning", "Optimization", "Gradient Descent"],
    summary:
      "The engine powering modern machine learning: how models navigate high-dimensional loss landscapes to find optimal parameters.",
    keyTakeaways: [
      "The gradient points in the direction of steepest ascent; we step in the opposite direction (-∇J).",
      "Learning rate (η) determines step size: too large causes divergence, too small causes glacial convergence.",
      "Mini-batch SGD balances computational efficiency with stochastic noise that helps escape local minima.",
      "Momentum and Adam adapt learning rates per parameter based on past gradients."
    ],
    simpleExplanation:
      "Imagine you're blindfolded on top of a foggy mountain with a walking stick. Your goal is to reach the lowest lake in the valley. You tap the ground in every direction to feel where it slopes downward the most, then take a step in that direction. Repeat this until every step goes uphill—you've reached the bottom!",
    realWorldExample:
      "Predicting Housing Prices: If your model predicts a house costs $1,000,000 when it actually sold for $400,000, the error is huge. Gradient descent calculates exactly how much to adjust the 'price per square foot' parameter versus the 'number of bedrooms' parameter to make tomorrow's prediction closer to reality.",
    codeExample: {
      language: "python",
      code: `import numpy as np

# Single variable gradient descent for f(w) = w^2
w = 10.0          # Initial guess
learning_rate = 0.1
epochs = 25

print(f"Initial weight: {w}")
for epoch in range(epochs):
    gradient = 2 * w  # Derivative d/dw [w^2]
    w = w - learning_rate * gradient
    if (epoch + 1) % 5 == 0:
        print(f"Epoch {epoch+1}: w = {w:.5f}, Loss = {w**2:.5f}")`,
      explanation:
        "With each step, w shrinks closer to 0, which is the global minimum of the parabola w^2."
    },
    checkpointQuiz: {
      question: "What happens during gradient descent if the learning rate is set drastically too high?",
      options: [
        "The model converges to the global minimum faster",
        "The model oscillates violently and the loss function diverges (explodes)",
        "The weights remain completely static at zero",
        "The gradient becomes zero instantly"
      ],
      correctIndex: 1,
      explanation:
        "When the learning rate is too large, the optimizer overshoots the valley floor and steps higher up on the opposite hill, causing loss to oscillate and blow up toward infinity."
    },
    content: `
### The Mathematics of Gradient Descent

Given a parameterized loss function $J(\\theta)$, gradient descent iteratively updates the parameters $\\theta$:

$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta J(\\theta_t)$$

Where:
- $\\eta > 0$ is the **learning rate**.
- $\\nabla_\\theta J(\\theta_t)$ is the vector of partial derivatives with respect to each parameter.

### Three Primary Variants:
1. **Batch Gradient Descent:** Computes gradient over the entire dataset at every step. Stable but memory-prohibitive for large datasets.
2. **Stochastic Gradient Descent (SGD):** Updates parameters per single training sample. Extremely fast, but noisy trajectory.
3. **Mini-Batch SGD:** Updates parameters per batch (e.g. 32, 64, 128 samples). The industry gold standard in deep learning.
`
  },

  "model-evaluation": {
    id: "model-evaluation",
    title: "Model Evaluation & Confusion Matrix",
    category: "Machine Learning",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    breadcrumbs: ["Machine Learning", "Model Evaluation", "Metrics"],
    summary:
      "Beyond naive accuracy: mastering precision, recall, F1-score, and ROC-AUC for imbalanced real-world datasets.",
    keyTakeaways: [
      "Accuracy is deceptive on imbalanced datasets (e.g. 99% accuracy on cancer detection by guessing 'healthy' every time).",
      "Precision = True Positives / (True Positives + False Positives). Low false alarms.",
      "Recall = True Positives / (True Positives + False Negatives). Low misses.",
      "F1-Score is the harmonic mean of Precision and Recall."
    ],
    simpleExplanation:
      "Think of airport security metal detectors. If the detector beeps at every person with a wristwatch, its Recall is 100% (it never misses a weapon), but its Precision is terrible (endless false alarms). If it only beeps when it sees an actual rocket launcher, Precision is high, but Recall is dangerous. You must calibrate the detector based on what penalty you're willing to pay!",
    realWorldExample:
      "Credit Card Fraud Detection: Only 0.1% of transactions are fraudulent. A dummy model that predicts 'Not Fraud' 100% of the time gets 99.9% accuracy, but banks lose billions. Using Recall ensures we catch 98%+ of actual fraud attempts.",
    codeExample: {
      language: "python",
      code: `from sklearn.metrics import confusion_matrix, classification_report

y_true = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0]  # 4 frauds, 6 clean
y_pred = [1, 0, 1, 1, 0, 0, 0, 0, 1, 0]  # 1 false alarm, 1 missed fraud

cm = confusion_matrix(y_true, y_pred)
print("Confusion Matrix:")
print("TN:", cm[0,0], "FP:", cm[0,1])
print("FN:", cm[1,0], "TP:", cm[1,1])
print(classification_report(y_true, y_pred, target_names=["Clean", "Fraud"]))`,
      explanation:
        "The classification report gives an instant view of precision, recall, and harmonic F1 score."
    },
    checkpointQuiz: {
      question: "In a medical diagnostic system where missing a malignant tumor has fatal consequences, which metric should be prioritized?",
      options: [
        "Precision (minimize false alarms)",
        "Recall (minimize false negatives)",
        "Overall Accuracy",
        "Specificity"
      ],
      correctIndex: 1,
      explanation:
        "When the cost of a False Negative (missing a tumor) is catastrophic, you maximize Recall so virtually all positive cases are flagged for follow-up testing."
    },
    content: `
### The Confusion Matrix Matrix Breakdown

$$\\begin{bmatrix} \\text{True Negatives (TN)} & \\text{False Positives (FP)} \\\\ \\text{False Negatives (FN)} & \\text{True Positives (TP)} \\end{bmatrix}$$

- **Precision:** $\\frac{TP}{TP + FP}$
- **Recall (Sensitivity):** $\\frac{TP}{TP + FN}$
- **Specificity:** $\\frac{TN}{TN + FP}$
- **F1 Score:** $2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$
`
  },

  "rag-systems": {
    id: "rag-systems",
    title: "Production RAG Architectures & Vector Search",
    category: "Generative AI",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    breadcrumbs: ["Generative AI", "LLM Applications", "RAG Systems"],
    summary:
      "Grounding Large Language Models on proprietary enterprise data through vector embeddings, semantic retrieval, and re-ranking.",
    keyTakeaways: [
      "RAG bridges private internal documents with LLM reasoning without expensive model retraining.",
      "Chunk size and overlap determine retrieval context density.",
      "Dense embeddings capture conceptual meaning; lexical BM25 catches exact keyword/code matches.",
      "Cross-encoder re-ranking drastically improves top-k context relevance."
    ],
    simpleExplanation:
      "Imagine taking an open-book exam. Instead of trying to memorize a 2,000-page medical encyclopedia in your head (fine-tuning), you have a lightning-fast research assistant who flips directly to the exact 3 relevant paragraphs you need when a question is asked (RAG). The LLM reads those 3 paragraphs and writes the perfect answer.",
    realWorldExample:
      "Internal Company IT Support Bot: Employees ask 'How do I submit travel expense receipts in Berlin?'. RAG searches the company Notion/Confluence docs, retrieves the 2026 German per-diem policy, and feeds it into Claude or GPT-4o to provide an accurate, policy-compliant response with citations.",
    codeExample: {
      language: "python",
      code: `def naive_rag_pipeline(query, vector_store, llm_client):
    # 1. Embed query and search top-k chunks
    relevant_chunks = vector_store.similarity_search(query, k=3)
    
    # 2. Build augmented prompt
    context_str = "\\n---\\n".join([doc.page_content for doc in relevant_chunks])
    system_prompt = f"Answer the query using ONLY the context provided below:\\n{context_str}"
    
    # 3. Generate grounded response
    response = llm_client.chat(system=system_prompt, user=query)
    return response`,
      explanation:
        "The LLM is strictly constrained to the retrieved context, curbing hallucination."
    },
    checkpointQuiz: {
      question: "Why is Hybrid Search (combining BM25 keyword matching with Dense Vector embeddings) preferred in production RAG systems?",
      options: [
        "It eliminates the need for any embedding model completely",
        "Dense vectors capture semantic concepts, while BM25 accurately catches specific acronyms, error codes, and IDs",
        "It runs twice as fast as pure vector search",
        "It reduces vector database storage costs to zero"
      ],
      correctIndex: 1,
      explanation:
        "Vector embeddings can struggle with exact serial numbers, error codes, and domain acronyms. Hybrid search combines the semantic conceptual power of dense embeddings with the exact-match precision of lexical BM25."
    },
    content: `
### Production RAG Anatomy

1. **Ingestion & Chunking:** Parsing Markdown, PDF, HTML into semantic chunks with 10-20% overlap.
2. **Dense Vector Indexing:** Converting chunks into 768-d or 1536-d vectors via embedding models (e.g. text-embedding-3-small, BGE-M3).
3. **Retrieval & Filtering:** Top-K approximate nearest neighbors (HNSW / IVF-PQ) combined with metadata filters.
4. **Re-Ranking:** Scoring retrieved candidates through a cross-encoder model to sort by true question relevance.
5. **Generation & Citation:** Feeding the top-3 ranked chunks into the LLM with strict grounding instructions.
`
  }
};

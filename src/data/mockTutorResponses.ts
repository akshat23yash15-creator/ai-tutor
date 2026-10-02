export interface TutorResponse {
  keywords: string[];
  response: string;
  suggestedFollowUp?: string[];
  practiceQuestionPrompt?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const TUTOR_KNOWLEDGE_BASE: TutorResponse[] = [
  {
    keywords: ["overfitting", "overfit", "high variance", "generalize"],
    response: `**Overfitting** happens when a machine learning model learns the training data *too closely*—memorizing specific noise, outliers, and random quirks rather than the true underlying distribution.

### Key Symptoms:
1. **Near-zero training error** ($>99\\%$ accuracy on training data).
2. **Poor validation / test error** (performance collapses on unseen data).
3. **Huge model complexity** relative to dataset volume.

### How to Fix It:
- **Regularization:** Add $L_1$ (Lasso) or $L_2$ (Ridge) penalties to constrain parameter weights.
- **Pruning & Dropout:** Randomly deactivate neurons during training in neural nets.
- **More Data & Augmentation:** Expand data variety so the model cannot memorize simple positions.
- **Cross-Validation:** Use Stratified $K$-fold to catch variance early.`,
    suggestedFollowUp: [
      "How do L1 and L2 regularization differ?",
      "Can we detect overfitting with learning curves?",
      "Give me a practice question on overfitting"
    ],
    practiceQuestionPrompt: {
      question: "Which situation is most likely to indicate severe overfitting in a model?",
      options: [
        "Training accuracy: 99.8%, Validation accuracy: 62.4%",
        "Training accuracy: 65.0%, Validation accuracy: 64.2%",
        "Training accuracy: 88.0%, Validation accuracy: 87.5%",
        "The learning curve loss is completely flat from epoch 1"
      ],
      correctIndex: 0,
      explanation: "A massive delta between training accuracy (99.8%) and validation accuracy (62.4%) is the hallmark indicator of overfitting (high variance)."
    }
  },
  {
    keywords: ["gradient descent", "learning rate", "optimizer", "sgd", "adam", "descent"],
    response: `**Gradient Descent** is the optimization algorithm that enables machine learning models to "learn" by iteratively tweaking their parameters to minimize prediction error.

### Intuition:
Imagine walking down a foggy mountain blindfolded. You feel with your feet which direction slopes downward the steepest, and take a calculated step in that direction.

$$\\theta_{\\text{new}} = \\theta_{\\text{old}} - \\eta \\cdot \\nabla J(\\theta)$$

Where:
- $\\eta$ (eta) is your **learning rate** (step size).
- $\\nabla J(\\theta)$ is the **gradient vector** (slope direction).

### The Golden Rule of Learning Rate:
- **Too small:** Optimization crawls; you may get trapped in shallow local minima.
- **Too large:** The optimizer violently overshoots the minimum and diverges toward infinity.
- **Just right:** Smooth, exponential convergence toward global/local optimum.`,
    suggestedFollowUp: [
      "Why is Adam preferred over pure SGD?",
      "What is the vanishing gradient problem?",
      "Test me on gradient descent"
    ],
    practiceQuestionPrompt: {
      question: "What happens if the learning rate in gradient descent is set too high?",
      options: [
        "The model reaches the optimal weights instantly",
        "The loss oscillates violently and diverges toward infinity",
        "The gradients become exactly zero on epoch 1",
        "The weights are automatically set to null"
      ],
      correctIndex: 1,
      explanation: "Overshooting the valley floor causes parameters to oscillate with growing amplitude until numerical overflow occurs."
    }
  },
  {
    keywords: ["bias", "variance", "tradeoff", "underfitting"],
    response: `The **Bias-Variance Tradeoff** is the central dilemma in supervised learning:

$$\\text{Total Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Noise}$$

- **High Bias (Underfitting):** The model is too rigid (e.g. fitting a straight line to sinusoidal data). It misses true patterns.
- **High Variance (Overfitting):** The model is too flexible (e.g. 20-degree polynomial fitting 10 points). It models sample noise.
- **Goal:** Locate the golden minimum of total validation error where bias and variance balance out.`,
    suggestedFollowUp: [
      "Show me how this affects my personalized learning path",
      "Give me an example in real life",
      "Explain this like I'm 10 years old"
    ]
  },
  {
    keywords: ["beginner", "simple", "eli5", "like i'm 5", "plain english"],
    response: `Think of learning AI like learning to cook:

1. **Rule-Based Coding:** Writing down an exact recipe: *"Add 2g salt, stir 10 seconds, cook at 200°C for 5 minutes."* If an ingredient changes, the recipe fails.
2. **Machine Learning:** Tasting 1,000 different soups. Over time, your tongue automatically figures out the exact ratio of salt, acidity, and heat needed to make any soup delicious without checking a rigid manual!

You show the computer thousands of examples, and it discovers the recipe on its own! 🍲`,
    suggestedFollowUp: [
      "What is the difference between supervised and unsupervised learning?",
      "Where should I start in my learning path?",
      "Explain neural networks simply"
    ]
  },
  {
    keywords: ["neural network", "deep learning", "perceptron", "backprop"],
    response: `A **Neural Network** is a network of mathematical nodes arranged in interconnected layers, inspired by biological neurons.

### The 3 Core Operations of a Neuron:
1. **Weighted Sum:** Multiply inputs by weights ($z = \\sum w_i x_i + b$).
2. **Activation:** Pass the sum through a non-linear function (like ReLU or GELU) so the network can learn non-linear patterns.
3. **Backpropagation:** Compare output against the true answer, compute the derivative of the error via the chain rule, and update all weights backwards!`,
    suggestedFollowUp: [
      "What are activation functions and why do we need them?",
      "How does backpropagation work mathematically?",
      "Ask me a question on neural nets"
    ]
  },
  {
    keywords: ["fine-tuning", "fine tuning", "rag vs", "difference between rag", "difference between fine"],
    response: `### RAG vs. Fine-Tuning: The Core Difference

- **RAG (Open-Book Exam):** You provide the model with relevant reference sheets (retrieved document chunks) at query time. Best for rapidly changing data, private company knowledge bases, and citing exact source documents with near-zero hallucinations.
- **Fine-Tuning (Internalizing a Skill / Tone):** You update the model's neural weights on specialized pairs. Best for teaching a specific voice, constrained output formats (e.g. specialized JSON / SQL), or adapting to niche jargon.

**Rule of Thumb:**
- Need updated facts and verifiable sources? $\\rightarrow$ **Use RAG**.
- Need a model to adopt a specific tone or output format? $\\rightarrow$ **Fine-tune**.`,
    suggestedFollowUp: [
      "Can we combine RAG and Fine-Tuning?",
      "What vector databases are commonly used in RAG?",
      "Give me a quiz on RAG systems"
    ]
  },
  {
    keywords: ["quiz on rag", "rag quiz", "rag question", "test me on rag"],
    response: `Here is a checkpoint diagnostic question on RAG architectures:

**Question:** In a production RAG pipeline, why are documents partitioned into smaller overlapping chunks (e.g. 250–500 tokens) before creating vector embeddings?

1. Embeddings of huge documents dilute semantic precision and introduce noisy context into the prompt
2. Vector databases cannot store vectors with dimensions higher than 50
3. Chunking is mandatory to convert text into binary numbers
4. Smaller chunks prevent the retriever from running vector similarity

*What's your answer?*`,
    suggestedFollowUp: [
      "Is it option 1?",
      "What is cosine similarity in vector search?",
      "Explain RAG vs Fine-Tuning"
    ]
  },
  {
    keywords: ["rag", "retrieval", "vector", "embedding", "llm", "genai", "generative ai"],
    response: `**Retrieval-Augmented Generation (RAG)** provides an external memory book for Large Language Models.

### Why do we need it?
LLMs are like brilliant doctors who took their board exams 6 months ago. They know medicine deeply, but they don't know what happened to *your specific patient* this morning.

RAG solves this by:
1. Converting your company documents into **vector embeddings**.
2. Searching the most relevant excerpts when a user asks a question.
3. Pasting those excerpts into the LLM prompt as **ground truth context**.
4. The LLM answers using strictly the verified facts, with zero hallucinations!`,
    suggestedFollowUp: [
      "What is the difference between RAG and Fine-Tuning?",
      "What vector databases are used?",
      "Give me a quiz on RAG systems"
    ]
  },
  {
    keywords: ["practice", "question", "quiz", "test me", "challenge"],
    response: `Here is a fast diagnostic question tailored to your current skill level:

**Question:** You train a Random Forest on customer churn and get 99% accuracy on training data, but 71% on testing data. Which adjustment is most suitable?

1. Increase the maximum tree depth to unlimited
2. Restrict max tree depth and increase min_samples_split
3. Remove training samples
4. Turn off bagging

*Take a guess, and I'll explain why!*`,
    suggestedFollowUp: [
      "Is it option 2?",
      "Is it option 1?",
      "Explain Random Forests"
    ]
  }
];

export function getTutorReply(userMessage: string): { reply: string; followUps: string[]; quiz?: any } {
  const lower = userMessage.toLowerCase().trim();

  // Search knowledge base
  for (const item of TUTOR_KNOWLEDGE_BASE) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return {
        reply: item.response,
        followUps: item.suggestedFollowUp || [],
        quiz: item.practiceQuestionPrompt
      };
    }
  }

  // Fallback intelligent response
  return {
    reply: `I understand you're exploring **${userMessage.slice(0, 40)}...**! 

As your AI Tutor, I track what you know and adjust to your pace. Here are key angles we can dive into:
- The fundamental mathematical intuition
- Real-world production code example in Python
- A fast checkpoint question to test your mastery

What would help you most right now?`,
    followUps: [
      "Explain overfitting and bias-variance",
      "Explain gradient descent",
      "Explain RAG vs Fine-tuning",
      "Give me a practice question"
    ]
  };
}

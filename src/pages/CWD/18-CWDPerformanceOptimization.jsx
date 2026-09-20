import CookbookApp from "../../components/CookbookApp";
import Q407 from "../../assets/CWD/docs/18-performance-and-optimization/407-what-is-the-end-to-end-latency.md?raw";
import Q408 from "../../assets/CWD/docs/18-performance-and-optimization/408-where-is-latency-introduced.md?raw";
import Q409 from "../../assets/CWD/docs/18-performance-and-optimization/409-how-do-you-reduce-llm-latency.md?raw";
import Q410 from "../../assets/CWD/docs/18-performance-and-optimization/410-how-do-you-reduce-rag-latency.md?raw";
import Q411 from "../../assets/CWD/docs/18-performance-and-optimization/411-how-do-you-reduce-tool-call-latency.md?raw";
import Q412 from "../../assets/CWD/docs/18-performance-and-optimization/412-how-do-you-parallelize-workers.md?raw";
import Q413 from "../../assets/CWD/docs/18-performance-and-optimization/413-when-should-workers-execute-sequentially.md?raw";
import Q414 from "../../assets/CWD/docs/18-performance-and-optimization/414-how-do-you-reduce-token-consumption.md?raw";
import Q415 from "../../assets/CWD/docs/18-performance-and-optimization/415-how-do-you-cache.md?raw";
import Q416 from "../../assets/CWD/docs/18-performance-and-optimization/416-what-can-be-cached.md?raw";
import Q417 from "../../assets/CWD/docs/18-performance-and-optimization/417-what-should-not-be-cached.md?raw";
import Q418 from "../../assets/CWD/docs/18-performance-and-optimization/418-how-do-you-implement-semantic-caching.md?raw";
import Q419 from "../../assets/CWD/docs/18-performance-and-optimization/419-how-do-you-reduce-unnecessary-llm-calls.md?raw";
import Q420 from "../../assets/CWD/docs/18-performance-and-optimization/420-how-do-you-select-cheaper-models.md?raw";
import Q421 from "../../assets/CWD/docs/18-performance-and-optimization/421-how-do-you-optimize-prompt-size.md?raw";
import Q422 from "../../assets/CWD/docs/18-performance-and-optimization/422-how-do-you-optimize-embeddings.md?raw";
import Q423 from "../../assets/CWD/docs/18-performance-and-optimization/423-how-do-you-optimize-vector-search.md?raw";

const CWDPerformanceOptimization = [
  // =====================================================
  // 18. PERFORMANCE & OPTIMIZATION
  // =====================================================

  {
    id: "407-what-is-the-end-to-end-latency",
    category: "Performance & Optimization",
    title: "What is the end-to-end latency?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q407,
    code: "",
  },

  {
    id: "408-where-is-latency-introduced",
    category: "Performance & Optimization",
    title: "Where is latency introduced?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q408,
    code: "",
  },

  {
    id: "409-how-do-you-reduce-llm-latency",
    category: "Performance & Optimization",
    title: "How do you reduce LLM latency?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q409,
    code: "",
  },

  {
    id: "410-how-do-you-reduce-rag-latency",
    category: "Performance & Optimization",
    title: "How do you reduce RAG latency?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q410,
    code: "",
  },

  {
    id: "411-how-do-you-reduce-tool-call-latency",
    category: "Performance & Optimization",
    title: "How do you reduce tool-call latency?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q411,
    code: "",
  },

  {
    id: "412-how-do-you-parallelize-workers",
    category: "Performance & Optimization",
    title: "How do you parallelize Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q412,
    code: "",
  },

  {
    id: "413-when-should-workers-execute-sequentially",
    category: "Performance & Optimization",
    title: "When should Workers execute sequentially?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q413,
    code: "",
  },

  {
    id: "414-how-do-you-reduce-token-consumption",
    category: "Performance & Optimization",
    title: "How do you reduce token consumption?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q414,
    code: "",
  },

  {
    id: "415-how-do-you-cache",
    category: "Performance & Optimization",
    title: "How do you cache?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q415,
    code: "",
  },

  {
    id: "416-what-can-be-cached",
    category: "Performance & Optimization",
    title: "What can be cached?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q416,
    code: "",
  },

  {
    id: "417-what-should-not-be-cached",
    category: "Performance & Optimization",
    title: "What should not be cached?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q417,
    code: "",
  },

  {
    id: "418-how-do-you-implement-semantic-caching",
    category: "Performance & Optimization",
    title: "How do you implement semantic caching?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q418,
    code: "",
  },

  {
    id: "419-how-do-you-reduce-unnecessary-llm-calls",
    category: "Performance & Optimization",
    title: "How do you reduce unnecessary LLM calls?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q419,
    code: "",
  },

  {
    id: "420-how-do-you-select-cheaper-models",
    category: "Performance & Optimization",
    title: "How do you select cheaper models?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q420,
    code: "",
  },

  {
    id: "421-how-do-you-optimize-prompt-size",
    category: "Performance & Optimization",
    title: "How do you optimize prompt size?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q421,
    code: "",
  },

  {
    id: "422-how-do-you-optimize-embeddings",
    category: "Performance & Optimization",
    title: "How do you optimize embeddings?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q422,
    code: "",
  },

  {
    id: "423-how-do-you-optimize-vector-search",
    category: "Performance & Optimization",
    title: "How do you optimize vector search?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, caching, parallelism and token optimization.",
    concept: Q423,
    code: "",
  },

];

export default function CWDPerformanceOptimizationPage() {
  return (
    <CookbookApp
      data={CWDPerformanceOptimization}
      title="CWD Performance & Optimization Cookbook"
      subtitle="Latency, caching, parallelism and token optimization"
      icon="⚡"
      patternLabel="Questions"
    />
  );
}

import CookbookApp from "../../components/CookbookApp";

import Q189 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/189-why-use-redis-in-cwd.md?raw";
import Q190 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/190-what-would-you-cache.md?raw";
import Q191 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/191-would-you-cache-llm-responses.md?raw";
import Q192 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/192-would-you-cache-embeddings.md?raw";
import Q193 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/193-would-you-cache-customer-information.md?raw";
import Q194 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/194-how-would-you-handle-cache-invalidation.md?raw";
import Q195 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/195-what-happens-if-redis-becomes-unavailable.md?raw";
import Q196 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/196-redis-vs-cosmos-db.md?raw";
import Q197 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/197-how-would-caching-reduce-cwd-latency.md?raw";
import Q198 from "../../assets/docs/azure-interview-questions/13-azure-cache-for-redis/198-how-would-caching-reduce-azure-openai-cost.md?raw";

const AzureRedisQuestion = [
  {
    id: "189-why-use-redis-in-cwd",
    category: "Azure Cache for Redis",
    title: "Why use Redis in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q189,
    code: "",
  },

  {
    id: "190-what-would-you-cache",
    category: "Azure Cache for Redis",
    title: "What would you cache?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q190,
    code: "",
  },

  {
    id: "191-would-you-cache-llm-responses",
    category: "Azure Cache for Redis",
    title: "Would you cache LLM responses?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q191,
    code: "",
  },

  {
    id: "192-would-you-cache-embeddings",
    category: "Azure Cache for Redis",
    title: "Would you cache embeddings?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q192,
    code: "",
  },

  {
    id: "193-would-you-cache-customer-information",
    category: "Azure Cache for Redis",
    title: "Would you cache customer information?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q193,
    code: "",
  },

  {
    id: "194-how-would-you-handle-cache-invalidation",
    category: "Azure Cache for Redis",
    title: "How would you handle cache invalidation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q194,
    code: "",
  },

  {
    id: "195-what-happens-if-redis-becomes-unavailable",
    category: "Azure Cache for Redis",
    title: "What happens if Redis becomes unavailable?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q195,
    code: "",
  },

  {
    id: "196-redis-vs-cosmos-db",
    category: "Azure Cache for Redis",
    title: "Redis vs Cosmos DB?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q196,
    code: "",
  },

  {
    id: "197-how-would-caching-reduce-cwd-latency",
    category: "Azure Cache for Redis",
    title: "How would caching reduce CWD latency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q197,
    code: "",
  },

  {
    id: "198-how-would-caching-reduce-azure-openai-cost",
    category: "Azure Cache for Redis",
    title: "How would caching reduce Azure OpenAI cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q198,
    code: "",
  },

];

export default function AzureRedisQuestionPage() {
  return (
    <CookbookApp
      data={AzureRedisQuestion}
      title="Azure Cache for Redis Cookbook"
      subtitle="Caching strategy, invalidation, LLM and embedding caches, failure handling"
      icon="🧊"
      patternLabel="Questions"
    />
  );
}

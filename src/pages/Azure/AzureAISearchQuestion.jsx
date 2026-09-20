import CookbookApp from "../../components/CookbookApp";

import Q47 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/047-why-azure-ai-search-for-cwd.md?raw";
import Q48 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/048-how-would-you-implement-vector-search.md?raw";
import Q49 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/049-how-would-you-implement-hybrid-search.md?raw";
import Q50 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/050-what-is-bm25.md?raw";
import Q51 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/051-why-use-bm25-vector-search.md?raw";
import Q52 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/052-how-does-semantic-ranking-work.md?raw";
import Q53 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/053-how-do-you-generate-embeddings.md?raw";
import Q54 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/054-where-do-you-store-embeddings.md?raw";
import Q55 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/055-how-do-you-implement-metadata-filtering.md?raw";
import Q56 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/056-how-do-you-implement-document-level-acl-filtering.md?raw";
import Q57 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/057-how-do-you-prevent-unauthorized-documents-from-reaching-the-llm.md?raw";
import Q58 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/058-how-do-you-handle-document-updates.md?raw";
import Q59 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/059-how-do-you-handle-document-deletion.md?raw";
import Q60 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/060-how-do-you-handle-stale-embeddings.md?raw";
import Q61 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/061-how-do-you-optimize-azure-ai-search-performance.md?raw";
import Q62 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/062-how-do-you-monitor-azure-ai-search.md?raw";
import Q63 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/063-how-do-you-troubleshoot-slow-retrieval.md?raw";
import Q64 from "../../assets/docs/azure-interview-questions/04-azure-ai-search/064-azure-ai-search-vs-azure-ai-foundry-knowledge-base-capabilities.md?raw";

const AzureAISearchQuestion = [
  {
    id: "047-why-azure-ai-search-for-cwd",
    category: "Azure AI Search",
    title: "Why Azure AI Search for CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q47,
    code: "",
  },

  {
    id: "048-how-would-you-implement-vector-search",
    category: "Azure AI Search",
    title: "How would you implement vector search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q48,
    code: "",
  },

  {
    id: "049-how-would-you-implement-hybrid-search",
    category: "Azure AI Search",
    title: "How would you implement hybrid search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q49,
    code: "",
  },

  {
    id: "050-what-is-bm25",
    category: "Azure AI Search",
    title: "What is BM25?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q50,
    code: "",
  },

  {
    id: "051-why-use-bm25-vector-search",
    category: "Azure AI Search",
    title: "Why use BM25 + vector search?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q51,
    code: "",
  },

  {
    id: "052-how-does-semantic-ranking-work",
    category: "Azure AI Search",
    title: "How does semantic ranking work?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q52,
    code: "",
  },

  {
    id: "053-how-do-you-generate-embeddings",
    category: "Azure AI Search",
    title: "How do you generate embeddings?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q53,
    code: "",
  },

  {
    id: "054-where-do-you-store-embeddings",
    category: "Azure AI Search",
    title: "Where do you store embeddings?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q54,
    code: "",
  },

  {
    id: "055-how-do-you-implement-metadata-filtering",
    category: "Azure AI Search",
    title: "How do you implement metadata filtering?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q55,
    code: "",
  },

  {
    id: "056-how-do-you-implement-document-level-acl-filtering",
    category: "Azure AI Search",
    title: "How do you implement document-level ACL filtering?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q56,
    code: "",
  },

  {
    id: "057-how-do-you-prevent-unauthorized-documents-from-reaching-the-llm",
    category: "Azure AI Search",
    title: "How do you prevent unauthorized documents from reaching the LLM?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q57,
    code: "",
  },

  {
    id: "058-how-do-you-handle-document-updates",
    category: "Azure AI Search",
    title: "How do you handle document updates?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q58,
    code: "",
  },

  {
    id: "059-how-do-you-handle-document-deletion",
    category: "Azure AI Search",
    title: "How do you handle document deletion?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q59,
    code: "",
  },

  {
    id: "060-how-do-you-handle-stale-embeddings",
    category: "Azure AI Search",
    title: "How do you handle stale embeddings?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q60,
    code: "",
  },

  {
    id: "061-how-do-you-optimize-azure-ai-search-performance",
    category: "Azure AI Search",
    title: "How do you optimize Azure AI Search performance?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q61,
    code: "",
  },

  {
    id: "062-how-do-you-monitor-azure-ai-search",
    category: "Azure AI Search",
    title: "How do you monitor Azure AI Search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q62,
    code: "",
  },

  {
    id: "063-how-do-you-troubleshoot-slow-retrieval",
    category: "Azure AI Search",
    title: "How do you troubleshoot slow retrieval?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q63,
    code: "",
  },

  {
    id: "064-azure-ai-search-vs-azure-ai-foundry-knowledge-base-capabilities",
    category: "Azure AI Search",
    title: "Azure AI Search vs Azure AI Foundry/Knowledge-base capabilities?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q64,
    code: "",
  },

];

export default function AzureAISearchQuestionPage() {
  return (
    <CookbookApp
      data={AzureAISearchQuestion}
      title="Azure AI Search Cookbook"
      subtitle="Vector and hybrid search, ACL filtering, updates and performance"
      icon="🔎"
      patternLabel="Questions"
    />
  );
}

import CookbookApp from "../components/CookbookApp";

// RAG Fundamentals
import WhatIsRAG from "../assets/docs/RAG/what-is-rag.md?raw";
import WhyRAG from "../assets/docs/RAG/why-rag.md?raw";
import RAGVsFineTuning from "../assets/docs/RAG/rag-vs-fine-tuning.md?raw";
import RAGPipeline from "../assets/docs/RAG/rag-pipeline.md?raw";
import RAGProblems from "../assets/docs/RAG/rag-problems.md?raw";
import RAGLimitations from "../assets/docs/RAG/rag-limitations.md?raw";

// Chunking & Document Processing
import WhatIsChunking from "../assets/docs/RAG/what-is-chunking.md?raw";
import ChunkSize from "../assets/docs/RAG/chunk-size.md?raw";
import ChunkOverlap from "../assets/docs/RAG/chunk-overlap.md?raw";
import ChunkingStrategies from "../assets/docs/RAG/chunking-strategies.md?raw";
import DocumentProcessing from "../assets/docs/RAG/document-processing.md?raw";

// Embeddings
import WhatAreEmbeddings from "../assets/docs/RAG/what-are-embeddings.md?raw";
import EmbeddingModelSelection from "../assets/docs/RAG/embedding-model-selection.md?raw";
import CosineSimilarity from "../assets/docs/RAG/cosine-similarity.md?raw";
import EmbeddingDimensions from "../assets/docs/RAG/embedding-dimensions.md?raw";
import MultilingualEmbeddings from "../assets/docs/RAG/multilingual-embeddings.md?raw";

// Search & Vector Databases
import WhatIsVectorDatabase from "../assets/docs/RAG/what-is-vector-database.md?raw";
import VectorSearch from "../assets/docs/RAG/vector-search.md?raw";
import ANN from "../assets/docs/RAG/approximate-nearest-neighbor.md?raw";
import HNSW from "../assets/docs/RAG/hnsw.md?raw";
import MetadataFiltering from "../assets/docs/RAG/metadata-filtering.md?raw";
import HybridSearch from "../assets/docs/RAG/hybrid-search.md?raw";
import SemanticSearch from "../assets/docs/RAG/semantic-search.md?raw";
import SearchComparison from "../assets/docs/RAG/search-comparison.md?raw";
import SecurityTrimming from "../assets/docs/RAG/security-trimming.md?raw";

// Retrieval & Reranking
import TopKRetrieval from "../assets/docs/RAG/top-k-retrieval.md?raw";
import Reranking from "../assets/docs/RAG/reranking.md?raw";
import QueryExpansion from "../assets/docs/RAG/query-expansion.md?raw";
import MultiQueryRetrieval from "../assets/docs/RAG/multi-query-retrieval.md?raw";
import ContextualRetrieval from "../assets/docs/RAG/contextual-retrieval.md?raw";
import ImprovingRetrieval from "../assets/docs/RAG/improving-retrieval.md?raw";

// RAG + Agentic AI
import RAGWithAgents from "../assets/docs/RAG/rag-with-agents.md?raw";
import RAGVsTools from "../assets/docs/RAG/rag-vs-tools.md?raw";
import MultiKnowledgeBaseRAG from "../assets/docs/RAG/multi-knowledge-base-rag.md?raw";
import MultiAgentRAG from "../assets/docs/RAG/multi-agent-rag.md?raw";
import RAGWithLangGraph from "../assets/docs/RAG/rag-with-langgraph.md?raw";
import RAGWithMCP from "../assets/docs/RAG/rag-with-mcp.md?raw";

// Production RAG
import EnterpriseRAGArchitecture from "../assets/docs/RAG/enterprise-rag-architecture.md?raw";
import ProductionRAG from "../assets/docs/RAG/production-rag.md?raw";
import ScalableRAG from "../assets/docs/RAG/scalable-rag.md?raw";
import LowLatencyRAG from "../assets/docs/RAG/low-latency-rag.md?raw";
import MultiTenantRAG from "../assets/docs/RAG/multi-tenant-rag.md?raw";

// Security
import RAGSecurity from "../assets/docs/RAG/rag-security.md?raw";
import RAGAuthorization from "../assets/docs/RAG/rag-authorization.md?raw";
import ACLFiltering from "../assets/docs/RAG/acl-filtering.md?raw";

// Hallucination & Quality
import PreventHallucination from "../assets/docs/RAG/prevent-hallucination.md?raw";
import GroundedGeneration from "../assets/docs/RAG/grounded-generation.md?raw";
import ConflictingDocuments from "../assets/docs/RAG/conflicting-documents.md?raw";
import ZeroResults from "../assets/docs/RAG/zero-results.md?raw";

// Evaluation & Monitoring
import RAGEvaluation from "../assets/docs/RAG/rag-evaluation.md?raw";
import RAGAS from "../assets/docs/RAG/ragas.md?raw";
import Faithfulness from "../assets/docs/RAG/faithfulness.md?raw";
import ContextRelevance from "../assets/docs/RAG/context-relevance.md?raw";
import GoldenDataset from "../assets/docs/RAG/golden-dataset.md?raw";
import RAGMonitoring from "../assets/docs/RAG/rag-monitoring.md?raw";
import RAGTracing from "../assets/docs/RAG/rag-tracing.md?raw";

// Troubleshooting
import TroubleshootRAG from "../assets/docs/RAG/troubleshoot-rag.md?raw";
import PoorRetrieval from "../assets/docs/RAG/poor-retrieval.md?raw";
import HighLatencyRAG from "../assets/docs/RAG/high-latency-rag.md?raw";
import HighCostRAG from "../assets/docs/RAG/high-cost-rag.md?raw";
import RAGRegressionTesting from "../assets/docs/RAG/rag-regression-testing.md?raw";

// Multimodal RAG
import MultimodalRAG from "../assets/docs/RAG/multimodal-rag.md?raw";


const RAGQuestion = [

  // =========================================================
  // RAG FUNDAMENTALS
  // =========================================================

  {
    id: "what-is-rag",
    category: "RAG Fundamentals",
    title: "What is RAG?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsRAG,
    code: ""
  },

  {
    id: "why-rag",
    category: "RAG Fundamentals",
    title: "Why do we need RAG when we already have LLMs?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhyRAG,
    code: ""
  },

  {
    id: "rag-vs-fine-tuning",
    category: "RAG Fundamentals",
    title: "What is the difference between RAG and fine-tuning?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: RAGVsFineTuning,
    code: ""
  },

  {
    id: "rag-pipeline",
    category: "RAG Fundamentals",
    title: "How does a RAG pipeline work end-to-end?",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: RAGPipeline,
    code: ""
  },

  {
    id: "rag-problems",
    category: "RAG Fundamentals",
    title: "What problems does RAG solve?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: RAGProblems,
    code: ""
  },

  {
    id: "rag-limitations",
    category: "RAG Fundamentals",
    title: "What are the limitations of RAG?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: RAGLimitations,
    code: ""
  },


  // =========================================================
  // DOCUMENT PROCESSING & CHUNKING
  // =========================================================

  {
    id: "what-is-chunking",
    category: "Document Processing",
    title: "What is document chunking?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsChunking,
    code: ""
  },

  {
    id: "chunk-size",
    category: "Document Processing",
    title: "How do you decide the right chunk size?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ChunkSize,
    code: ""
  },

  {
    id: "chunk-overlap",
    category: "Document Processing",
    title: "What is chunk overlap and why is it important?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: ChunkOverlap,
    code: ""
  },

  {
    id: "chunking-strategies",
    category: "Document Processing",
    title: "What chunking strategies have you used?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ChunkingStrategies,
    code: ""
  },

  {
    id: "document-processing",
    category: "Document Processing",
    title: "How do you process PDFs, tables, images, and scanned documents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: DocumentProcessing,
    code: ""
  },


  // =========================================================
  // EMBEDDINGS
  // =========================================================

  {
    id: "what-are-embeddings",
    category: "Embeddings",
    title: "What are embeddings?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatAreEmbeddings,
    code: ""
  },

  {
    id: "embedding-model-selection",
    category: "Embeddings",
    title: "How do you select an embedding model?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: EmbeddingModelSelection,
    code: ""
  },

  {
    id: "cosine-similarity",
    category: "Embeddings",
    title: "What is cosine similarity?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: CosineSimilarity,
    code: ""
  },

  {
    id: "embedding-dimensions",
    category: "Embeddings",
    title: "What is embedding dimensionality?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: EmbeddingDimensions,
    code: ""
  },

  {
    id: "multilingual-embeddings",
    category: "Embeddings",
    title: "How do you handle multilingual documents with embeddings?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MultilingualEmbeddings,
    code: ""
  },


  // =========================================================
  // VECTOR DATABASES & SEARCH
  // =========================================================

  {
    id: "what-is-vector-database",
    category: "Vector Search",
    title: "What is a vector database?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsVectorDatabase,
    code: ""
  },

  {
    id: "vector-search",
    category: "Vector Search",
    title: "How does vector search work?",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: VectorSearch,
    code: ""
  },

  {
    id: "approximate-nearest-neighbor",
    category: "Vector Search",
    title: "What is Approximate Nearest Neighbor (ANN) search?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: ANN,
    code: ""
  },

  {
    id: "hnsw",
    category: "Vector Search",
    title: "What is HNSW and how does it work?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: HNSW,
    code: ""
  },

  {
    id: "metadata-filtering",
    category: "Vector Search",
    title: "What is metadata filtering in RAG?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MetadataFiltering,
    code: ""
  },

  {
    id: "hybrid-search",
    category: "Search Strategies",
    title: "What is hybrid search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: HybridSearch,
    code: ""
  },

  {
    id: "semantic-search",
    category: "Search Strategies",
    title: "What is semantic search?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: SemanticSearch,
    code: ""
  },

  {
    id: "search-comparison",
    category: "Search Strategies",
    title: "What is the difference between keyword, vector, hybrid, and semantic search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: SearchComparison,
    code: ""
  },

  {
    id: "security-trimming",
    category: "RAG Security",
    title: "How do you implement security trimming in RAG?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: SecurityTrimming,
    code: ""
  },


  // =========================================================
  // RETRIEVAL & RERANKING
  // =========================================================

  {
    id: "top-k-retrieval",
    category: "Retrieval",
    title: "What is top-K retrieval?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: TopKRetrieval,
    code: ""
  },

  {
    id: "reranking",
    category: "Retrieval",
    title: "What is reranking and why is it important?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Reranking,
    code: ""
  },

  {
    id: "query-expansion",
    category: "Retrieval",
    title: "What is query expansion?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: QueryExpansion,
    code: ""
  },

  {
    id: "multi-query-retrieval",
    category: "Retrieval",
    title: "What is multi-query retrieval?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MultiQueryRetrieval,
    code: ""
  },

  {
    id: "contextual-retrieval",
    category: "Retrieval",
    title: "What is contextual retrieval?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ContextualRetrieval,
    code: ""
  },

  {
    id: "improving-retrieval",
    category: "Retrieval",
    title: "How do you improve RAG retrieval quality?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ImprovingRetrieval,
    code: ""
  },


  // =========================================================
  // RAG + AGENTIC AI
  // =========================================================

  {
    id: "rag-with-agents",
    category: "RAG + Agentic AI",
    title: "How do you integrate RAG with Agentic AI?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGWithAgents,
    code: ""
  },

  {
    id: "rag-vs-tools",
    category: "RAG + Agentic AI",
    title: "When should an agent use RAG versus calling a tool or API?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGVsTools,
    code: ""
  },

  {
    id: "multi-knowledge-base-rag",
    category: "RAG + Agentic AI",
    title: "How do you implement multiple knowledge bases?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MultiKnowledgeBaseRAG,
    code: ""
  },

  {
    id: "multi-agent-rag",
    category: "RAG + Agentic AI",
    title: "How would you build a multi-agent RAG architecture?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: MultiAgentRAG,
    code: ""
  },

  {
    id: "rag-with-langgraph",
    category: "RAG + Agentic AI",
    title: "How do you implement RAG with LangGraph?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGWithLangGraph,
    code: ""
  },

  {
    id: "rag-with-mcp",
    category: "RAG + Agentic AI",
    title: "How do you integrate MCP with RAG?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGWithMCP,
    code: ""
  },


  // =========================================================
  // PRODUCTION RAG ARCHITECTURE
  // =========================================================

  {
    id: "enterprise-rag-architecture",
    category: "RAG Architecture",
    title: "How would you design an enterprise RAG architecture?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: EnterpriseRAGArchitecture,
    code: ""
  },

  {
    id: "production-rag",
    category: "RAG Architecture",
    title: "How would you design a production-ready RAG system?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: ProductionRAG,
    code: ""
  },

  {
    id: "scalable-rag",
    category: "RAG Architecture",
    title: "How would you design RAG for millions of documents?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: ScalableRAG,
    code: ""
  },

  {
    id: "low-latency-rag",
    category: "RAG Architecture",
    title: "How would you design RAG for low latency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LowLatencyRAG,
    code: ""
  },

  {
    id: "multi-tenant-rag",
    category: "RAG Architecture",
    title: "How would you design a multi-tenant RAG system?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: MultiTenantRAG,
    code: ""
  },


  // =========================================================
  // RAG SECURITY
  // =========================================================

  {
    id: "rag-security",
    category: "RAG Security",
    title: "How do you secure a RAG application?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGSecurity,
    code: ""
  },

  {
    id: "rag-authorization",
    category: "RAG Security",
    title: "How do you implement authorization in RAG?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGAuthorization,
    code: ""
  },

  {
    id: "acl-filtering",
    category: "RAG Security",
    title: "How do you implement document-level ACL filtering?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ACLFiltering,
    code: ""
  },


  // =========================================================
  // HALLUCINATION & RESPONSE QUALITY
  // =========================================================

  {
    id: "prevent-hallucination",
    category: "RAG Quality",
    title: "How do you prevent hallucinations in RAG?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: PreventHallucination,
    code: ""
  },

  {
    id: "grounded-generation",
    category: "RAG Quality",
    title: "How do you ensure the LLM generates grounded responses?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: GroundedGeneration,
    code: ""
  },

  {
    id: "conflicting-documents",
    category: "RAG Quality",
    title: "How do you handle conflicting information across documents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ConflictingDocuments,
    code: ""
  },

  {
    id: "zero-results",
    category: "RAG Quality",
    title: "What happens when RAG retrieval returns zero documents?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: ZeroResults,
    code: ""
  },


  // =========================================================
  // EVALUATION & MONITORING
  // =========================================================

  {
    id: "rag-evaluation",
    category: "RAG Evaluation",
    title: "How do you evaluate a RAG system?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGEvaluation,
    code: ""
  },

  {
    id: "ragas",
    category: "RAG Evaluation",
    title: "How do you use RAGAS to evaluate RAG?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGAS,
    code: ""
  },

  {
    id: "faithfulness",
    category: "RAG Evaluation",
    title: "What is faithfulness in RAG evaluation?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: Faithfulness,
    code: ""
  },

  {
    id: "context-relevance",
    category: "RAG Evaluation",
    title: "What are context relevance and context recall?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ContextRelevance,
    code: ""
  },

  {
    id: "golden-dataset",
    category: "RAG Evaluation",
    title: "How do you create a golden dataset for RAG evaluation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: GoldenDataset,
    code: ""
  },

  {
    id: "rag-monitoring",
    category: "RAG Observability",
    title: "How do you monitor RAG in production?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGMonitoring,
    code: ""
  },

  {
    id: "rag-tracing",
    category: "RAG Observability",
    title: "How do you trace a RAG request end-to-end?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGTracing,
    code: ""
  },


  // =========================================================
  // TROUBLESHOOTING
  // =========================================================

  {
    id: "troubleshoot-rag",
    category: "RAG Troubleshooting",
    title: "Your RAG system returns incorrect answers. How do you troubleshoot it?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: TroubleshootRAG,
    code: ""
  },

  {
    id: "poor-retrieval",
    category: "RAG Troubleshooting",
    title: "Retrieval is returning the wrong documents. How would you fix it?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: PoorRetrieval,
    code: ""
  },

  {
    id: "high-latency-rag",
    category: "RAG Troubleshooting",
    title: "Your RAG system has high latency. How would you optimize it?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: HighLatencyRAG,
    code: ""
  },

  {
    id: "high-cost-rag",
    category: "RAG Troubleshooting",
    title: "Your RAG system is expensive. How would you reduce cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: HighCostRAG,
    code: ""
  },

  {
    id: "rag-regression-testing",
    category: "RAG Troubleshooting",
    title: "How do you perform regression testing after changing the embedding model?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGRegressionTesting,
    code: ""
  },


  // =========================================================
  // MULTIMODAL RAG
  // =========================================================

  {
    id: "multimodal-rag",
    category: "Multimodal RAG",
    title: "How would you build a multimodal RAG system?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: MultimodalRAG,
    code: ""
  }

];


export default function RAGPage() {
  return (
    <CookbookApp
      data={RAGQuestion}
      title="RAG Interview Questions Cookbook"
      subtitle="Retrieval-Augmented Generation"
      icon="🔎"
      patternLabel="Topics"
    />
  );
}
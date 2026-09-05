import CookbookApp from "../../components/CookbookApp";

// =====================================================
// 12. RAG Architecture
// =====================================================

const RAGArchitecture = [
  {
    id: "cwd-rag",
    category: "RAG Architecture",
    title: "RAG Architecture",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the end-to-end Retrieval-Augmented Generation architecture used by CWD for secure enterprise knowledge retrieval, contextual grounding, and accurate LLM responses.",
  },
      {
        id: "why-rag",
        category: "RAG Architecture",
        title: "Why RAG?",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand why RAG is required to ground LLM responses in enterprise-specific, current, and governed knowledge instead of relying only on model knowledge.",
        concept: "",
        code: "",
      },

      {
        id: "rag-architecture",
        category: "RAG Architecture",
        title: "RAG Architecture",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the end-to-end RAG flow including ingestion, document processing, chunking, embeddings, indexing, retrieval, context construction, LLM generation, and response grounding.",
        concept: "",
        code: "",
      },

      {
        id: "rag-data-ingestion",
        category: "RAG Architecture",
        title: "Data Ingestion",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how enterprise documents and knowledge from systems such as SharePoint, enterprise applications, databases, and other governed sources are ingested into the RAG pipeline.",
        concept: "",
        code: "",
      },

      {
        id: "rag-chunking",
        category: "RAG Architecture",
        title: "Chunking",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand document chunking strategies, chunk size, overlap, semantic boundaries, and how chunking decisions affect retrieval quality and LLM context.",
        concept: "",
        code: "",
      },

      {
        id: "rag-embeddings",
        category: "RAG Architecture",
        title: "Embeddings",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how documents and queries are converted into vector representations to enable semantic similarity search and knowledge retrieval.",
        concept: "",
        code: "",
      },

      {
        id: "azure-ai-search",
        category: "RAG Architecture",
        title: "Azure AI Search",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand Azure AI Search as the enterprise retrieval layer for vector search, keyword search, hybrid retrieval, indexing, filtering, and semantic ranking.",
        concept: "",
        code: "",
      },

      {
        id: "rag-metadata",
        category: "RAG Architecture",
        title: "Metadata",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how document metadata such as source, domain, owner, document type, timestamp, classification, and business attributes improves filtering, ranking, and governance.",
        concept: "",
        code: "",
      },

      {
        id: "rag-acl-filtering",
        category: "RAG Architecture",
        title: "ACL Filtering",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand entitlement-aware retrieval and ACL filtering so users can retrieve only the enterprise information they are authorized to access.",
        concept: "",
        code: "",
      },

      {
        id: "intent-based-retrieval",
        category: "RAG Architecture",
        title: "Intent-Based Retrieval",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how user intent, domain, query type, and task context influence retrieval strategy, search filters, ranking, and the selection of relevant enterprise knowledge.",
        concept: "",
        code: "",
      },

      {
        id: "context-building",
        category: "RAG Architecture",
        title: "Context Building",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how retrieved chunks are filtered, ranked, deduplicated, and assembled into a high-quality context window for the LLM.",
        concept: "",
        code: "",
      },

      {
        id: "rag-cwd-flow",
        category: "RAG Architecture",
        title: "RAG + CWD Flow",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how RAG integrates with the CWD workflow across the Gateway, Coordinator, Delegator, specialized Workers, enterprise data sources, retrieval layer, context building, and final response generation.",
        concept: "",
        code: "",
      },
   
];

export default function RAGArchitecturePage() {
  return (
    <CookbookApp
      data={RAGArchitecture}
      title="RAG Architecture Cookbook"
      subtitle="Enterprise retrieval, grounding, security and CWD integration"
      icon="🔎"
      patternLabel="Topics"
    />
  );
}


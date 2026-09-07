import CookbookApp from "../../components/CookbookApp";
import CWDRAG from "../../assets/CWD/docs/cwd-rag.md?raw";
import WhyRAG from "../../assets/CWD/docs/why-rag.md?raw";
import RAGArchitectureFlow from "../../assets/CWD/docs/rag-architecture.md?raw";
import RAGDataIngestion from "../../assets/CWD/docs/rag-data-ingestion.md?raw";
import RAGChunking from "../../assets/CWD/docs/rag-chunking.md?raw";  
import RAGEmbeddings from "../../assets/CWD/docs/rag-embeddings.md?raw";
import AzureAISearch from "../../assets/CWD/docs/azure-ai-search.md?raw";
import RAGMetadata from "../../assets/CWD/docs/rag-metadata.md?raw";
import RAGACLFiltering from "../../assets/CWD/docs/rag-acl-filtering.md?raw";
import IntentBasedRetrieval from "../../assets/CWD/docs/intent-based-retrieval.md?raw";
import ContextBuilding from "../../assets/CWD/docs/context-building.md?raw";
import RAGCWDFlow from "../../assets/CWD/docs/rag-cwd-flow.md?raw";
// import RAGInterviewQuestions from "../../assets/CWD/docs/rag-interview-questions.md?raw";


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
  concept: CWDRAG,
    },
      {
        id: "why-rag",
        category: "RAG Architecture",
        title: "Why RAG?",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand why RAG is required to ground LLM responses in enterprise-specific, current, and governed knowledge instead of relying only on model knowledge.",
        concept: WhyRAG,
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
        concept: RAGArchitectureFlow,
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
        concept: RAGDataIngestion,
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
        concept: RAGChunking,
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
        concept: RAGEmbeddings,
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
        concept: AzureAISearch,
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
        concept: RAGMetadata,
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
        concept: RAGACLFiltering,
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
        concept: IntentBasedRetrieval,
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
        concept: ContextBuilding,
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
        concept: RAGCWDFlow,
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


import CookbookApp from "../../components/CookbookApp";
import Q198 from "../../assets/CWD/docs/09-rag-architecture/198-why-does-cwd-need-rag.md?raw";
import Q199 from "../../assets/CWD/docs/09-rag-architecture/199-what-data-sources-are-indexed.md?raw";
import Q200 from "../../assets/CWD/docs/09-rag-architecture/200-how-to-ingest-enterprise-documents.md?raw";
import Q201 from "../../assets/CWD/docs/09-rag-architecture/201-explain-your-ingestion-pipeline.md?raw";
import Q202 from "../../assets/CWD/docs/09-rag-architecture/202-how-do-you-chunk-documents.md?raw";
import Q203 from "../../assets/CWD/docs/09-rag-architecture/203-fixed-size-vs-semantic-chunking.md?raw";
import Q204 from "../../assets/CWD/docs/09-rag-architecture/204-what-chunk-size-did-you-choose-and-why.md?raw";
import Q205 from "../../assets/CWD/docs/09-rag-architecture/205-what-overlap-did-you-choose.md?raw";
import Q206 from "../../assets/CWD/docs/09-rag-architecture/206-how-to-handle-tables.md?raw";
import Q207 from "../../assets/CWD/docs/09-rag-architecture/207-how-to-handle-pdfs.md?raw";
import Q208 from "../../assets/CWD/docs/09-rag-architecture/208-how-to-handle-images.md?raw";
import Q209 from "../../assets/CWD/docs/09-rag-architecture/209-how-to-handle-scanned-documents.md?raw";
import Q210 from "../../assets/CWD/docs/09-rag-architecture/210-what-embedding-model-did-you-use.md?raw";
import Q211 from "../../assets/CWD/docs/09-rag-architecture/211-how-to-choose-an-embedding-model.md?raw";
import Q212 from "../../assets/CWD/docs/09-rag-architecture/212-what-vector-database-did-you-use.md?raw";
import Q213 from "../../assets/CWD/docs/09-rag-architecture/213-why-azure-ai-search.md?raw";
import Q214 from "../../assets/CWD/docs/09-rag-architecture/214-how-does-hybrid-search-work.md?raw";
import Q215 from "../../assets/CWD/docs/09-rag-architecture/215-explain-bm25.md?raw";
import Q216 from "../../assets/CWD/docs/09-rag-architecture/216-vector-search-vs-bm25.md?raw";
import Q217 from "../../assets/CWD/docs/09-rag-architecture/217-why-combine-both.md?raw";
import Q218 from "../../assets/CWD/docs/09-rag-architecture/218-what-is-semantic-ranking.md?raw";
import Q219 from "../../assets/CWD/docs/09-rag-architecture/219-what-is-metadata-filtering.md?raw";
import Q220 from "../../assets/CWD/docs/09-rag-architecture/220-how-to-implement-acl-filtering.md?raw";
import Q221 from "../../assets/CWD/docs/09-rag-architecture/221-how-to-prevent-unauthorized-documents-entering-llm-context.md?raw";
import Q222 from "../../assets/CWD/docs/09-rag-architecture/222-what-is-your-retrieval-pipeline.md?raw";
import Q223 from "../../assets/CWD/docs/09-rag-architecture/223-how-to-measure-retrieval-quality.md?raw";
import Q224 from "../../assets/CWD/docs/09-rag-architecture/224-what-is-recall-at-k.md?raw";
import Q225 from "../../assets/CWD/docs/09-rag-architecture/225-what-is-precision-at-k.md?raw";
import Q226 from "../../assets/CWD/docs/09-rag-architecture/226-what-is-mrr.md?raw";
import Q227 from "../../assets/CWD/docs/09-rag-architecture/227-what-is-ndcg.md?raw";
import Q228 from "../../assets/CWD/docs/09-rag-architecture/228-what-is-ragas.md?raw";
import Q229 from "../../assets/CWD/docs/09-rag-architecture/229-how-to-reduce-irrelevant-context.md?raw";
import Q230 from "../../assets/CWD/docs/09-rag-architecture/230-how-to-handle-stale-documents.md?raw";
import Q231 from "../../assets/CWD/docs/09-rag-architecture/231-how-to-handle-document-deletion.md?raw";
import Q232 from "../../assets/CWD/docs/09-rag-architecture/232-how-to-re-index-documents.md?raw";

const CWDRagArchitecture = [
  // =====================================================
  // 09. RAG ARCHITECTURE
  // =====================================================

  {
    id: "198-why-does-cwd-need-rag",
    category: "RAG Architecture",
    title: "Why does CWD need RAG?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q198,
    code: "",
  },

  {
    id: "199-what-data-sources-are-indexed",
    category: "RAG Architecture",
    title: "What data sources are indexed?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q199,
    code: "",
  },

  {
    id: "200-how-to-ingest-enterprise-documents",
    category: "RAG Architecture",
    title: "How do you ingest enterprise documents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q200,
    code: "",
  },

  {
    id: "201-explain-your-ingestion-pipeline",
    category: "RAG Architecture",
    title: "Explain your ingestion pipeline.",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q201,
    code: "",
  },

  {
    id: "202-how-do-you-chunk-documents",
    category: "RAG Architecture",
    title: "How do you chunk documents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q202,
    code: "",
  },

  {
    id: "203-fixed-size-vs-semantic-chunking",
    category: "RAG Architecture",
    title: "Fixed-size vs semantic chunking?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q203,
    code: "",
  },

  {
    id: "204-what-chunk-size-did-you-choose-and-why",
    category: "RAG Architecture",
    title: "What chunk size did you choose and why?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q204,
    code: "",
  },

  {
    id: "205-what-overlap-did-you-choose",
    category: "RAG Architecture",
    title: "What overlap did you choose?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q205,
    code: "",
  },

  {
    id: "206-how-to-handle-tables",
    category: "RAG Architecture",
    title: "How do you handle tables?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q206,
    code: "",
  },

  {
    id: "207-how-to-handle-pdfs",
    category: "RAG Architecture",
    title: "How do you handle PDFs?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q207,
    code: "",
  },

  {
    id: "208-how-to-handle-images",
    category: "RAG Architecture",
    title: "How do you handle images?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q208,
    code: "",
  },

  {
    id: "209-how-to-handle-scanned-documents",
    category: "RAG Architecture",
    title: "How do you handle scanned documents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q209,
    code: "",
  },

  {
    id: "210-what-embedding-model-did-you-use",
    category: "RAG Architecture",
    title: "What embedding model did you use?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q210,
    code: "",
  },

  {
    id: "211-how-to-choose-an-embedding-model",
    category: "RAG Architecture",
    title: "How do you choose an embedding model?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q211,
    code: "",
  },

  {
    id: "212-what-vector-database-did-you-use",
    category: "RAG Architecture",
    title: "What vector database did you use?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q212,
    code: "",
  },

  {
    id: "213-why-azure-ai-search",
    category: "RAG Architecture",
    title: "Why Azure AI Search?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q213,
    code: "",
  },

  {
    id: "214-how-does-hybrid-search-work",
    category: "RAG Architecture",
    title: "How does hybrid search work?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q214,
    code: "",
  },

  {
    id: "215-explain-bm25",
    category: "RAG Architecture",
    title: "Explain BM25.",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q215,
    code: "",
  },

  {
    id: "216-vector-search-vs-bm25",
    category: "RAG Architecture",
    title: "Vector search vs BM25?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q216,
    code: "",
  },

  {
    id: "217-why-combine-both",
    category: "RAG Architecture",
    title: "Why combine both?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q217,
    code: "",
  },

  {
    id: "218-what-is-semantic-ranking",
    category: "RAG Architecture",
    title: "What is semantic ranking?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q218,
    code: "",
  },

  {
    id: "219-what-is-metadata-filtering",
    category: "RAG Architecture",
    title: "What is metadata filtering?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q219,
    code: "",
  },

  {
    id: "220-how-to-implement-acl-filtering",
    category: "RAG Architecture",
    title: "How do you implement ACL filtering?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q220,
    code: "",
  },

  {
    id: "221-how-to-prevent-unauthorized-documents-entering-llm-context",
    category: "RAG Architecture",
    title: "How do you prevent unauthorized documents from entering the LLM context?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q221,
    code: "",
  },

  {
    id: "222-what-is-your-retrieval-pipeline",
    category: "RAG Architecture",
    title: "What is your retrieval pipeline?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q222,
    code: "",
  },

  {
    id: "223-how-to-measure-retrieval-quality",
    category: "RAG Architecture",
    title: "How do you measure retrieval quality?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q223,
    code: "",
  },

  {
    id: "224-what-is-recall-at-k",
    category: "RAG Architecture",
    title: "What is Recall@K?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q224,
    code: "",
  },

  {
    id: "225-what-is-precision-at-k",
    category: "RAG Architecture",
    title: "What is Precision@K?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q225,
    code: "",
  },

  {
    id: "226-what-is-mrr",
    category: "RAG Architecture",
    title: "What is MRR?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q226,
    code: "",
  },

  {
    id: "227-what-is-ndcg",
    category: "RAG Architecture",
    title: "What is NDCG?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q227,
    code: "",
  },

  {
    id: "228-what-is-ragas",
    category: "RAG Architecture",
    title: "What is RAGAS?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q228,
    code: "",
  },

  {
    id: "229-how-to-reduce-irrelevant-context",
    category: "RAG Architecture",
    title: "How do you reduce irrelevant context?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q229,
    code: "",
  },

  {
    id: "230-how-to-handle-stale-documents",
    category: "RAG Architecture",
    title: "How do you handle stale documents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q230,
    code: "",
  },

  {
    id: "231-how-to-handle-document-deletion",
    category: "RAG Architecture",
    title: "How do you handle document deletion?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q231,
    code: "",
  },

  {
    id: "232-how-to-re-index-documents",
    category: "RAG Architecture",
    title: "How do you re-index documents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation.",
    concept: Q232,
    code: "",
  },

];

export default function CWDRagArchitecturePage() {
  return (
    <CookbookApp
      data={CWDRagArchitecture}
      title="CWD RAG Architecture Cookbook"
      subtitle="Ingestion, chunking, hybrid search, ACL filtering and retrieval evaluation"
      icon="📚"
      patternLabel="Questions"
    />
  );
}

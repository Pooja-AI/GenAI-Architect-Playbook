import CookbookApp from "../../components/CookbookApp";

import Q133 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/133-why-opensearch-serverless-for-cwd.md?raw";
import Q134 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/134-how-would-you-implement-vector-search.md?raw";
import Q135 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/135-how-would-you-implement-hybrid-search.md?raw";
import Q136 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/136-how-would-you-implement-bm25-search.md?raw";
import Q137 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/137-how-would-you-store-embeddings.md?raw";
import Q138 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/138-how-would-you-create-embeddings-using-aws.md?raw";
import Q139 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/139-how-would-you-implement-metadata-filtering.md?raw";
import Q140 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/140-how-would-you-implement-document-level-security.md?raw";
import Q141 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/141-how-does-opensearch-scale.md?raw";
import Q142 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/142-opensearch-serverless-vs-traditional-opensearch.md?raw";
import Q143 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/143-opensearch-vs-dynamodb.md?raw";
import Q144 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/144-opensearch-vs-bedrock-knowledge-bases.md?raw";
import Q145 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/145-how-would-you-monitor-opensearch.md?raw";
import Q146 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/146-how-would-you-troubleshoot-slow-retrieval.md?raw";
import Q147 from "../../assets/docs/aws-interview-questions/aws-core-services/10-opensearch/147-how-would-you-optimize-opensearch-cost.md?raw";

const AWSOpenSearchQuestion = [
  {
    id: "133-why-opensearch-serverless-for-cwd",
    category: "OpenSearch",
    title: "Why OpenSearch Serverless for CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q133,
    code: "",
  },

  {
    id: "134-how-would-you-implement-vector-search",
    category: "OpenSearch",
    title: "How would you implement vector search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q134,
    code: "",
  },

  {
    id: "135-how-would-you-implement-hybrid-search",
    category: "OpenSearch",
    title: "How would you implement hybrid search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q135,
    code: "",
  },

  {
    id: "136-how-would-you-implement-bm25-search",
    category: "OpenSearch",
    title: "How would you implement BM25 search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q136,
    code: "",
  },

  {
    id: "137-how-would-you-store-embeddings",
    category: "OpenSearch",
    title: "How would you store embeddings?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q137,
    code: "",
  },

  {
    id: "138-how-would-you-create-embeddings-using-aws",
    category: "OpenSearch",
    title: "How would you create embeddings using AWS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q138,
    code: "",
  },

  {
    id: "139-how-would-you-implement-metadata-filtering",
    category: "OpenSearch",
    title: "How would you implement metadata filtering?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q139,
    code: "",
  },

  {
    id: "140-how-would-you-implement-document-level-security",
    category: "OpenSearch",
    title: "How would you implement document-level security?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q140,
    code: "",
  },

  {
    id: "141-how-does-opensearch-scale",
    category: "OpenSearch",
    title: "How does OpenSearch scale?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q141,
    code: "",
  },

  {
    id: "142-opensearch-serverless-vs-traditional-opensearch",
    category: "OpenSearch",
    title: "OpenSearch Serverless vs traditional OpenSearch?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q142,
    code: "",
  },

  {
    id: "143-opensearch-vs-dynamodb",
    category: "OpenSearch",
    title: "OpenSearch vs DynamoDB?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q143,
    code: "",
  },

  {
    id: "144-opensearch-vs-bedrock-knowledge-bases",
    category: "OpenSearch",
    title: "OpenSearch vs Bedrock Knowledge Bases?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q144,
    code: "",
  },

  {
    id: "145-how-would-you-monitor-opensearch",
    category: "OpenSearch",
    title: "How would you monitor OpenSearch?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q145,
    code: "",
  },

  {
    id: "146-how-would-you-troubleshoot-slow-retrieval",
    category: "OpenSearch",
    title: "How would you troubleshoot slow retrieval?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q146,
    code: "",
  },

  {
    id: "147-how-would-you-optimize-opensearch-cost",
    category: "OpenSearch",
    title: "How would you optimize OpenSearch cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q147,
    code: "",
  },

];

export default function AWSOpenSearchQuestionPage() {
  return (
    <CookbookApp
      data={AWSOpenSearchQuestion}
      title="OpenSearch Cookbook"
      subtitle="Vector and hybrid search, filtering, scaling and troubleshooting"
      icon="🔎"
      patternLabel="Questions"
    />
  );
}

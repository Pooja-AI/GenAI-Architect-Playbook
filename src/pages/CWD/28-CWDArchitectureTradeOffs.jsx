import CookbookApp from "../../components/CookbookApp";
import Q561 from "../../assets/CWD/docs/28-architecture-trade-off-questions/561-why-langgraph-instead-of-temporal.md?raw";
import Q562 from "../../assets/CWD/docs/28-architecture-trade-off-questions/562-why-langgraph-instead-of-airflow.md?raw";
import Q563 from "../../assets/CWD/docs/28-architecture-trade-off-questions/563-why-mcp-instead-of-rest.md?raw";
import Q564 from "../../assets/CWD/docs/28-architecture-trade-off-questions/564-why-a2a-instead-of-rest.md?raw";
import Q565 from "../../assets/CWD/docs/28-architecture-trade-off-questions/565-why-multi-agent-instead-of-single-agent.md?raw";
import Q566 from "../../assets/CWD/docs/28-architecture-trade-off-questions/566-why-azure-ai-search-instead-of-pinecone.md?raw";
import Q567 from "../../assets/CWD/docs/28-architecture-trade-off-questions/567-why-hybrid-search-instead-of-vector-only.md?raw";
import Q568 from "../../assets/CWD/docs/28-architecture-trade-off-questions/568-why-fastapi-instead-of-flask.md?raw";
import Q569 from "../../assets/CWD/docs/28-architecture-trade-off-questions/569-why-redis.md?raw";
import Q570 from "../../assets/CWD/docs/28-architecture-trade-off-questions/570-why-service-bus-sqs.md?raw";
import Q571 from "../../assets/CWD/docs/28-architecture-trade-off-questions/571-why-asynchronous-execution.md?raw";
import Q572 from "../../assets/CWD/docs/28-architecture-trade-off-questions/572-why-synchronous-execution.md?raw";
import Q573 from "../../assets/CWD/docs/28-architecture-trade-off-questions/573-why-use-multiple-llms.md?raw";
import Q574 from "../../assets/CWD/docs/28-architecture-trade-off-questions/574-why-use-an-agent-registry.md?raw";
import Q575 from "../../assets/CWD/docs/28-architecture-trade-off-questions/575-why-use-a-prompt-registry.md?raw";
import Q576 from "../../assets/CWD/docs/28-architecture-trade-off-questions/576-why-use-distributed-tracing.md?raw";
import Q577 from "../../assets/CWD/docs/28-architecture-trade-off-questions/577-why-use-a-circuit-breaker.md?raw";
import Q578 from "../../assets/CWD/docs/28-architecture-trade-off-questions/578-why-use-a-dlq.md?raw";

const CWDArchitectureTradeOffs = [
  // =====================================================
  // 28. ARCHITECTURE TRADE-OFF QUESTIONS
  // =====================================================

  {
    id: "561-why-langgraph-instead-of-temporal",
    category: "Architecture Trade-Off Questions",
    title: "Why LangGraph instead of Temporal?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q561,
    code: "",
  },

  {
    id: "562-why-langgraph-instead-of-airflow",
    category: "Architecture Trade-Off Questions",
    title: "Why LangGraph instead of Airflow?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q562,
    code: "",
  },

  {
    id: "563-why-mcp-instead-of-rest",
    category: "Architecture Trade-Off Questions",
    title: "Why MCP instead of REST?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q563,
    code: "",
  },

  {
    id: "564-why-a2a-instead-of-rest",
    category: "Architecture Trade-Off Questions",
    title: "Why A2A instead of REST?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q564,
    code: "",
  },

  {
    id: "565-why-multi-agent-instead-of-single-agent",
    category: "Architecture Trade-Off Questions",
    title: "Why multi-agent instead of single-agent?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q565,
    code: "",
  },

  {
    id: "566-why-azure-ai-search-instead-of-pinecone",
    category: "Architecture Trade-Off Questions",
    title: "Why Azure AI Search instead of Pinecone?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q566,
    code: "",
  },

  {
    id: "567-why-hybrid-search-instead-of-vector-only",
    category: "Architecture Trade-Off Questions",
    title: "Why hybrid search instead of vector-only?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q567,
    code: "",
  },

  {
    id: "568-why-fastapi-instead-of-flask",
    category: "Architecture Trade-Off Questions",
    title: "Why FastAPI instead of Flask?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q568,
    code: "",
  },

  {
    id: "569-why-redis",
    category: "Architecture Trade-Off Questions",
    title: "Why Redis?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q569,
    code: "",
  },

  {
    id: "570-why-service-bus-sqs",
    category: "Architecture Trade-Off Questions",
    title: "Why Service Bus/SQS?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q570,
    code: "",
  },

  {
    id: "571-why-asynchronous-execution",
    category: "Architecture Trade-Off Questions",
    title: "Why asynchronous execution?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q571,
    code: "",
  },

  {
    id: "572-why-synchronous-execution",
    category: "Architecture Trade-Off Questions",
    title: "Why synchronous execution?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q572,
    code: "",
  },

  {
    id: "573-why-use-multiple-llms",
    category: "Architecture Trade-Off Questions",
    title: "Why use multiple LLMs?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q573,
    code: "",
  },

  {
    id: "574-why-use-an-agent-registry",
    category: "Architecture Trade-Off Questions",
    title: "Why use an Agent Registry?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q574,
    code: "",
  },

  {
    id: "575-why-use-a-prompt-registry",
    category: "Architecture Trade-Off Questions",
    title: "Why use a Prompt Registry?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q575,
    code: "",
  },

  {
    id: "576-why-use-distributed-tracing",
    category: "Architecture Trade-Off Questions",
    title: "Why use distributed tracing?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q576,
    code: "",
  },

  {
    id: "577-why-use-a-circuit-breaker",
    category: "Architecture Trade-Off Questions",
    title: "Why use a circuit breaker?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q577,
    code: "",
  },

  {
    id: "578-why-use-a-dlq",
    category: "Architecture Trade-Off Questions",
    title: "Why use a DLQ?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: technology choices, alternatives evaluated and trade-offs accepted.",
    concept: Q578,
    code: "",
  },

];

export default function CWDArchitectureTradeOffsPage() {
  return (
    <CookbookApp
      data={CWDArchitectureTradeOffs}
      title="CWD Architecture Trade-Off Questions Cookbook"
      subtitle="Technology choices, alternatives evaluated and trade-offs accepted"
      icon="🔀"
      patternLabel="Questions"
    />
  );
}

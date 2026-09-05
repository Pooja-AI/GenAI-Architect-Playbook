import CookbookApp from "../../components/CookbookApp";

const EndToEndCWDScenario = [
  // =====================================================
  // 20. END-TO-END CWD SCENARIO
  // =====================================================

  {
    id: "cwd-cbd-scenario",
    category: "End-to-End CWD Scenario",
    title: "End-to-End CWD Scenario",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Walk through a complete Customer Briefing Document (CBD) scenario across the CWD platform, showing how the user request flows through the Coordinator, Sales Delegator, specialized Worker, enterprise data and RAG systems, context building, result generation, aggregation, and final response.",

  },
      {
        id: "customer-briefing-document",
        category: "End-to-End CWD Scenario",
        title: "Customer Briefing Document (CBD)",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the Customer Briefing Document use case, its business purpose, the information required to prepare a customer briefing, and how CWD automates the process using multi-agent orchestration and enterprise knowledge.",
        concept: "",
        code: "",
      },

      {
        id: "cbd-user-request",
        category: "End-to-End CWD Scenario",
        title: "User Request",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand how a user initiates a CBD request, including the requested customer, briefing objectives, required information, and any additional constraints provided with the request.",
        concept: "",
        code: "",
      },

      {
        id: "cbd-coordinator-processing",
        category: "End-to-End CWD Scenario",
        title: "Coordinator Processing",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Coordinator interprets the CBD request, identifies the intent, determines the required workflow, creates the execution plan, and routes the domain-level task to the appropriate Delegator.",
        concept: "",
        code: "",
      },

      {
        id: "sales-delegator",
        category: "End-to-End CWD Scenario",
        title: "Sales Delegator",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Sales Delegator receives the domain-level task, decomposes the CBD request into smaller activities, identifies required capabilities, and selects the appropriate Worker agents for execution.",
        concept: "",
        code: "",
      },

      {
        id: "cbd-worker",
        category: "End-to-End CWD Scenario",
        title: "CBD Worker",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the specialized CBD Worker executes assigned tasks by combining LLM reasoning, retrieval, enterprise tools, APIs, business rules, and domain-specific logic to produce the required briefing information.",
        concept: "",
        code: "",
      },

      {
        id: "cbd-data-retrieval",
        category: "End-to-End CWD Scenario",
        title: "Data Retrieval",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how customer and enterprise information is retrieved from approved data sources such as RAG indexes, databases, APIs, documents, CRM systems, and other enterprise knowledge repositories.",
        concept: "",
        code: "",
      },

      {
        id: "cbd-context-building",
        category: "End-to-End CWD Scenario",
        title: "Context Building",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how retrieved information is validated, filtered, ranked, and assembled into relevant context for the Worker and LLM while maintaining source attribution, security boundaries, and task-specific context.",
        concept: "",
        code: "",
      },

      {
        id: "cbd-result-generation",
        category: "End-to-End CWD Scenario",
        title: "Result Generation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Worker and LLM generate the CBD output from the retrieved evidence and constructed context, including summarization, synthesis, reasoning, formatting, and business-specific content generation.",
        concept: "",
        code: "",
      },

      {
        id: "cbd-aggregation",
        category: "End-to-End CWD Scenario",
        title: "Aggregation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how outputs from multiple Worker tasks, retrieval operations, and enterprise sources are collected, validated, reconciled, and combined into a coherent Customer Briefing Document result.",
        concept: "",
        code: "",
      },

      {
        id: "cbd-final-response",
        category: "End-to-End CWD Scenario",
        title: "Final Response",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand how the Coordinator receives the completed CBD result, performs final validation and response synthesis, and securely delivers the final customer briefing response to the user.",
        concept: "",
        code: "",
      },
   
];

export default function EndToEndCWDScenarioPage() {
  return (
    <CookbookApp
      data={EndToEndCWDScenario}
      title="End-to-End CWD Scenario Cookbook"
      subtitle="Customer briefing, orchestration, delegation, RAG and final response"
      icon="📋"
      patternLabel="Topics"
    />
  );
}


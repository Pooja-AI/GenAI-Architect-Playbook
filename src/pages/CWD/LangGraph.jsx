import CookbookApp from "../../components/CookbookApp";

const LangGraph = [
  // =====================================================
  // 07. LANGGRAPH
  // =====================================================

  {
    id: "cwd-langgraph",
    category: "LangGraph",
    title: "LangGraph",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand how LangGraph is used within CWD to implement stateful, controllable, and resilient agent orchestration, including graph-based workflows, state management, conditional routing, checkpointing, retries, human-in-the-loop execution, and Coordinator–Delegator–Worker coordination.",

  },
      {
        id: "why-langgraph-cwd",
        category: "LangGraph",
        title: "Why LangGraph?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why LangGraph is used for CWD orchestration, including stateful execution, explicit workflow control, conditional routing, persistence, retries, recovery, human-in-the-loop workflows, and complex multi-agent coordination.",
        concept: "",
        code: "",
      },

      {
        id: "stategraph",
        category: "LangGraph",
        title: "StateGraph",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand StateGraph as the foundation for defining state-driven agent workflows, including shared state, graph structure, node execution, transitions, workflow lifecycle, and how CWD maintains execution context across agents.",
        concept: "",
        code: "",
      },

      {
        id: "langgraph-nodes",
        category: "LangGraph",
        title: "Nodes",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand how LangGraph nodes represent individual units of work such as request processing, planning, Coordinator logic, Delegator routing, Worker execution, retrieval, tool invocation, validation, and response generation.",
        concept: "",
        code: "",
      },

      {
        id: "langgraph-edges",
        category: "LangGraph",
        title: "Edges",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand how edges connect LangGraph nodes and control workflow progression, including sequential execution, transitions between agents, completion paths, failure paths, and routing to downstream processing stages.",
        concept: "",
        code: "",
      },

      {
        id: "conditional-routing",
        category: "LangGraph",
        title: "Conditional Routing",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how conditional routing dynamically selects the next workflow path based on state, user intent, task status, agent decisions, Worker availability, tool results, validation outcomes, or failure conditions.",
        concept: "",
        code: "",
      },

      {
        id: "langgraph-state-management",
        category: "LangGraph",
        title: "State Management",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how execution state is created, updated, and propagated across the CWD workflow, including request context, task information, agent results, tool outputs, intermediate data, errors, status, and final response state.",
        concept: "",
        code: "",
      },

      {
        id: "langgraph-checkpointing",
        category: "LangGraph",
        title: "Checkpointing",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how checkpointing persists workflow state so long-running or interrupted CWD executions can resume from a known point, supporting recovery, debugging, state persistence, and reliable agent execution.",
        concept: "",
        code: "",
      },

      {
        id: "langgraph-retry",
        category: "LangGraph",
        title: "Retry",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how retry mechanisms handle transient failures in CWD workflows, including failed agent execution, temporary service failures, tool errors, LLM failures, retry policies, backoff strategies, and recovery decisions.",
        concept: "",
        code: "",
      },

      {
        id: "langgraph-human-loop",
        category: "LangGraph",
        title: "Human-in-the-Loop",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how human approval or intervention can be introduced into CWD workflows for high-risk operations, sensitive decisions, exception handling, validation, approval gates, and controlled continuation of agent execution.",
        concept: "",
        code: "",
      },

      {
        id: "langgraph-in-cwd",
        category: "LangGraph",
        title: "LangGraph in CWD",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the specific role of LangGraph in the CWD architecture, including how it manages workflow state and coordinates the Coordinator, Delegator, and Worker execution lifecycle while supporting conditional routing, retries, persistence, recovery, and controlled agent execution.",
        concept: "",
        code: "",
      },
    
  
];

export default function LangGraphPage() {
  return (
    <CookbookApp
      data={LangGraph}
      title="LangGraph Cookbook"
      subtitle="Stateful orchestration, routing, persistence and agent workflows"
      icon="🕸️"
      patternLabel="Topics"
    />
  );
}


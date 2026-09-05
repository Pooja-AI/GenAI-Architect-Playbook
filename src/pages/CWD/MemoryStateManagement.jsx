import CookbookApp from "../../components/CookbookApp";

const MemoryStateManagement = [
  // =====================================================
  // 13. MEMORY & STATE
  // =====================================================

  {
    id: "cwd-memory",
    category: "Memory & State Management",
    title: "Memory & State Management",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand how CWD manages conversational memory, persistent memory, execution state, session context, task state, and context propagation across Coordinator, Delegator, and Worker agents throughout the execution lifecycle.",

  },
      {
        id: "short-term-memory",
        category: "Memory & State",
        title: "Short-Term Memory",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand short-term memory used to maintain the current conversation and active execution context, including recent messages, intermediate results, tool outputs, agent decisions, and information required during the current workflow.",
        concept: "",
        code: "",
      },

      {
        id: "long-term-memory",
        category: "Memory & State",
        title: "Long-Term Memory",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand persistent memory that can be retained across conversations or tasks, including user preferences, historical interactions, approved business context, and other information that can improve future agent interactions while respecting governance policies.",
        concept: "",
        code: "",
      },

      {
        id: "redis-memory",
        category: "Memory & State",
        title: "Redis",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Redis can provide low-latency storage for session information, temporary execution state, caching, conversation context, distributed locks, task coordination, and short-lived agent state.",
        concept: "",
        code: "",
      },

      {
        id: "vector-db-memory",
        category: "Memory & State",
        title: "Vector DB",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how vector databases can support semantic memory by storing embeddings of relevant conversations, knowledge, or historical information and retrieving semantically similar context when required by an agent.",
        concept: "",
        code: "",
      },

      {
        id: "cosmos-db",
        category: "Memory & State",
        title: "Cosmos DB",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Cosmos DB can be used for persistent application and execution data, including session metadata, task information, workflow state, execution history, agent results, and other durable state required by distributed CWD services.",
        concept: "",
        code: "",
      },

      {
        id: "session-state",
        category: "Memory & State",
        title: "Session",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand the session-level state representing the overall user interaction, including identity context, conversation history, session metadata, active workflows, and references to tasks and executions associated with the session.",
        concept: "",
        code: "",
      },

      {
        id: "task-state",
        category: "Memory & State",
        title: "Task",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand task-level state representing the objective being executed, including task inputs, required capabilities, assigned agents, dependencies, status, intermediate results, errors, and completion information.",
        concept: "",
        code: "",
      },

      {
        id: "run-state",
        category: "Memory & State",
        title: "Run",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand run-level state representing a specific execution attempt for a task, including execution status, timestamps, participating agents, retries, intermediate outputs, failures, and final completion state.",
        concept: "",
        code: "",
      },

      {
        id: "turn-state",
        category: "Memory & State",
        title: "Turn",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand conversation-turn state representing an individual user request and corresponding agent response, including messages, context, decisions, tool interactions, and the results generated during that conversational turn.",
        concept: "",
        code: "",
      },

      {
        id: "step-state",
        category: "Memory & State",
        title: "Step",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand step-level state representing individual execution actions such as planning, delegation, retrieval, LLM invocation, tool execution, validation, aggregation, and response generation.",
        concept: "",
        code: "",
      },

      {
        id: "context-propagation",
        category: "Memory & State",
        title: "Context Propagation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how relevant context is propagated across the Coordinator, Delegator, and Worker agents while controlling what information is shared, preserving execution metadata, maintaining security boundaries, and avoiding unnecessary context growth.",
        concept: "",
        code: "",
      },

      {
        id: "state-lifecycle",
        category: "Memory & State",
        title: "State Lifecycle",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the complete lifecycle of CWD execution state from creation and initialization through updates, persistence, propagation, retries, completion, failure handling, cleanup, archival, and eventual expiration.",
        concept: "",
        code: "",
      },
    
  
];

export default function MemoryStateManagementPage() {
  return (
    <CookbookApp
      data={MemoryStateManagement}
      title="Memory & State Management Cookbook"
      subtitle="Memory, persistence, execution state and context propagation"
      icon="🧠"
      patternLabel="Topics"
    />
  );
}


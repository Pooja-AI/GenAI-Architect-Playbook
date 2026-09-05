import CookbookApp from "../../components/CookbookApp";

const CWDStateExecutionModel = [
  // =====================================================
  // CWD STATE & EXECUTION MODEL
  // =====================================================

  {
    id: "cwd-execution-model",
    category: "CWD State & Execution Model",
    title: "CWD State & Execution Model",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand the hierarchical execution and state model used by CWD, including sessions, tasks, runs, conversational turns, execution steps, LLM and tool invocations, state transitions, and the overall execution hierarchy.",

  },
      {
        id: "execution-session",
        category: "CWD State & Execution Model",
        title: "Session",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand how a CWD session represents the overall lifecycle of a user interaction, including session context, identity, conversation state, and execution history across multiple requests.",
        concept: "",
        code: "",
      },

      {
        id: "execution-task",
        category: "CWD State & Execution Model",
        title: "Task",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand how a user request is represented as a task and how tasks capture the objective, required capabilities, assigned agents, execution status, and task-level context.",
        concept: "",
        code: "",
      },

      {
        id: "execution-run",
        category: "CWD State & Execution Model",
        title: "Run",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand how a task execution is represented as a run, including run identifiers, lifecycle status, timestamps, participating agents, intermediate results, failures, and completion state.",
        concept: "",
        code: "",
      },

      {
        id: "execution-turn",
        category: "CWD State & Execution Model",
        title: "Turn",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand how individual conversational turns are tracked within a session and how user messages, agent responses, context, and turn-level state contribute to the overall interaction.",
        concept: "",
        code: "",
      },

      {
        id: "execution-step",
        category: "CWD State & Execution Model",
        title: "Step",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand how a run is broken into individual execution steps representing actions such as agent processing, planning, retrieval, tool calls, validation, and response generation.",
        concept: "",
        code: "",
      },

      {
        id: "llm-invocation",
        category: "CWD State & Execution Model",
        title: "LLM Invocation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how LLM invocations are represented within execution state, including model selection, prompts, input and output tokens, latency, response metadata, errors, retries, and usage or cost information.",
        concept: "",
        code: "",
      },

      {
        id: "tool-invocation",
        category: "CWD State & Execution Model",
        title: "Tool Invocation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how tool calls are tracked during execution, including tool selection, input parameters, authorization, execution status, results, errors, retries, and integration with MCP or enterprise services.",
        concept: "",
        code: "",
      },

      {
        id: "state-transitions",
        category: "CWD State & Execution Model",
        title: "State Transitions",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how execution state transitions between lifecycle stages such as pending, running, waiting, completed, failed, cancelled, and retried across Coordinator, Delegator, and Worker execution.",
        concept: "",
        code: "",
      },

      {
        id: "execution-hierarchy",
        category: "CWD State & Execution Model",
        title: "Execution Hierarchy",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the complete Session → Task → Run → Turn → Step hierarchy and how each level maintains its own state, context, metadata, execution history, and relationship to downstream agent and tool operations.",
        concept: "",
        code: "",
      },
    
];

export default function CWDStateExecutionModelPage() {
  return (
    <CookbookApp
      data={CWDStateExecutionModel}
      title="CWD State & Execution Model Cookbook"
      subtitle="Sessions, tasks, runs, turns, steps and execution state"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}


import CookbookApp from "../../components/CookbookApp";

import CWDLangGraph from "../../assets/CWD/docs/cwd-langgraph.md?raw";
import WhyLangGraph from "../../assets/CWD/docs/why-langgraph-cwd.md?raw";
import StateGraph from "../../assets/CWD/docs/stategraph.md?raw";
import LangGraphNodes from "../../assets/CWD/docs/langgraph-nodes.md?raw";
import LangGraphEdges from "../../assets/CWD/docs/langgraph-edges.md?raw";
import ConditionalRouting from "../../assets/CWD/docs/conditional-routing.md?raw";
import StateManagement from "../../assets/CWD/docs/langgraph-state-management.md?raw";
import Checkpointing from "../../assets/CWD/docs/langgraph-checkpointing.md?raw";
import Retry from "../../assets/CWD/docs/langgraph-retry.md?raw";
import HumanInTheLoop from "../../assets/CWD/docs/langgraph-human-loop.md?raw";
import LangGraphInCWD from "../../assets/CWD/docs/langgraph-in-cwd.md?raw"; 
import LangGraphCode from "../../assets/CWD/code/cwd_langgraph.py?raw";
import WhyLangGraphCode from "../../assets/CWD/code/why-langgraph-cwd.py?raw";
import StateGraphCode from "../../assets/CWD/code/stategraph.py?raw";
import LangGraphNodesCode from "../../assets/CWD/code/langgraph-nodes.py?raw";
import LangGraphEdgesCode from "../../assets/CWD/code/langgraph-edges.py?raw";
import ConditionalRoutingCode from "../../assets/CWD/code/conditional-routing.py?raw";
import StateManagementCode from "../../assets/CWD/code/langgraph-state-management.py?raw";
import CheckpointingCode from "../../assets/CWD/code/langgraph-checkpointing.py?raw";
import RetryCode from "../../assets/CWD/code/langgraph-retry.py?raw";
import HumanInTheLoopCode from "../../assets/CWD/code/langgraph-human-loop.py?raw";
import LangGraphInCWDCode from "../../assets/CWD/code/langgraph-in-cwd.py?raw";



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
concept: CWDLangGraph,
code: LangGraphCode,
  },
      {
        id: "why-langgraph-cwd",
        category: "LangGraph",
        title: "Why LangGraph?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why LangGraph is used for CWD orchestration, including stateful execution, explicit workflow control, conditional routing, persistence, retries, recovery, human-in-the-loop workflows, and complex multi-agent coordination.",
        concept: WhyLangGraph,
        code: WhyLangGraphCode,
      },

      {
        id: "stategraph",
        category: "LangGraph",
        title: "StateGraph",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand StateGraph as the foundation for defining state-driven agent workflows, including shared state, graph structure, node execution, transitions, workflow lifecycle, and how CWD maintains execution context across agents.",
        concept: StateGraph,
        code: StateGraphCode,
      },

      {
        id: "langgraph-nodes",
        category: "LangGraph",
        title: "Nodes",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand how LangGraph nodes represent individual units of work such as request processing, planning, Coordinator logic, Delegator routing, Worker execution, retrieval, tool invocation, validation, and response generation.",
        concept: LangGraphNodes,
        code: LangGraphNodesCode,
      },

      {
        id: "langgraph-edges",
        category: "LangGraph",
        title: "Edges",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand how edges connect LangGraph nodes and control workflow progression, including sequential execution, transitions between agents, completion paths, failure paths, and routing to downstream processing stages.",
        concept: LangGraphEdges,
        code: LangGraphEdgesCode,
      },

      {
        id: "conditional-routing",
        category: "LangGraph",
        title: "Conditional Routing",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how conditional routing dynamically selects the next workflow path based on state, user intent, task status, agent decisions, Worker availability, tool results, validation outcomes, or failure conditions.",
        concept: ConditionalRouting,
        code: ConditionalRoutingCode,
      },

      {
        id: "langgraph-state-management",
        category: "LangGraph",
        title: "State Management",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how execution state is created, updated, and propagated across the CWD workflow, including request context, task information, agent results, tool outputs, intermediate data, errors, status, and final response state.",
        concept: StateManagement,
        code: StateManagementCode,
      },

      {
        id: "langgraph-checkpointing",
        category: "LangGraph",
        title: "Checkpointing",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how checkpointing persists workflow state so long-running or interrupted CWD executions can resume from a known point, supporting recovery, debugging, state persistence, and reliable agent execution.",
        concept: Checkpointing,
        code: CheckpointingCode,
      },

      {
        id: "langgraph-retry",
        category: "LangGraph",
        title: "Retry",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how retry mechanisms handle transient failures in CWD workflows, including failed agent execution, temporary service failures, tool errors, LLM failures, retry policies, backoff strategies, and recovery decisions.",
        concept: Retry,
        code: RetryCode,
      },

      {
        id: "langgraph-human-loop",
        category: "LangGraph",
        title: "Human-in-the-Loop",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how human approval or intervention can be introduced into CWD workflows for high-risk operations, sensitive decisions, exception handling, validation, approval gates, and controlled continuation of agent execution.",
        concept: HumanInTheLoop,
        code: HumanInTheLoopCode,
      },

      {
        id: "langgraph-in-cwd",
        category: "LangGraph",
        title: "LangGraph in CWD",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the specific role of LangGraph in the CWD architecture, including how it manages workflow state and coordinates the Coordinator, Delegator, and Worker execution lifecycle while supporting conditional routing, retries, persistence, recovery, and controlled agent execution.",
        concept: LangGraphInCWD,
        code: LangGraphInCWDCode,
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


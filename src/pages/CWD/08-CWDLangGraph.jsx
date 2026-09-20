import CookbookApp from "../../components/CookbookApp";
import Q176 from "../../assets/CWD/docs/08-langgraph/176-why-langgraph.md?raw";
import Q177 from "../../assets/CWD/docs/08-langgraph/177-langgraph-vs-langchain.md?raw";
import Q178 from "../../assets/CWD/docs/08-langgraph/178-langgraph-vs-custom-python-orchestration.md?raw";
import Q179 from "../../assets/CWD/docs/08-langgraph/179-what-is-a-stategraph.md?raw";
import Q180 from "../../assets/CWD/docs/08-langgraph/180-what-is-graph-state.md?raw";
import Q181 from "../../assets/CWD/docs/08-langgraph/181-what-are-nodes.md?raw";
import Q182 from "../../assets/CWD/docs/08-langgraph/182-what-are-edges.md?raw";
import Q183 from "../../assets/CWD/docs/08-langgraph/183-what-are-conditional-edges.md?raw";
import Q184 from "../../assets/CWD/docs/08-langgraph/184-what-are-reducers.md?raw";
import Q185 from "../../assets/CWD/docs/08-langgraph/185-how-langgraph-supports-parallel-execution.md?raw";
import Q186 from "../../assets/CWD/docs/08-langgraph/186-how-langgraph-supports-state-persistence.md?raw";
import Q187 from "../../assets/CWD/docs/08-langgraph/187-how-langgraph-supports-human-in-the-loop.md?raw";
import Q188 from "../../assets/CWD/docs/08-langgraph/188-how-langgraph-supports-retries.md?raw";
import Q189 from "../../assets/CWD/docs/08-langgraph/189-how-langgraph-supports-checkpointing.md?raw";
import Q190 from "../../assets/CWD/docs/08-langgraph/190-how-to-resume-a-failed-workflow.md?raw";
import Q191 from "../../assets/CWD/docs/08-langgraph/191-how-to-prevent-infinite-loops.md?raw";
import Q192 from "../../assets/CWD/docs/08-langgraph/192-how-to-control-token-growth.md?raw";
import Q193 from "../../assets/CWD/docs/08-langgraph/193-how-to-manage-conversation-state.md?raw";
import Q194 from "../../assets/CWD/docs/08-langgraph/194-how-to-separate-session-state-and-workflow-state.md?raw";
import Q195 from "../../assets/CWD/docs/08-langgraph/195-how-to-debug-a-langgraph-workflow.md?raw";
import Q196 from "../../assets/CWD/docs/08-langgraph/196-how-to-test-individual-graph-nodes.md?raw";
import Q197 from "../../assets/CWD/docs/08-langgraph/197-how-to-test-the-complete-graph.md?raw";

const CWDLangGraph = [
  // =====================================================
  // 08. LANGGRAPH
  // =====================================================

  {
    id: "176-why-langgraph",
    category: "LangGraph",
    title: "Why LangGraph?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q176,
    code: "",
  },

  {
    id: "177-langgraph-vs-langchain",
    category: "LangGraph",
    title: "LangGraph vs LangChain?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q177,
    code: "",
  },

  {
    id: "178-langgraph-vs-custom-python-orchestration",
    category: "LangGraph",
    title: "LangGraph vs custom Python orchestration?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q178,
    code: "",
  },

  {
    id: "179-what-is-a-stategraph",
    category: "LangGraph",
    title: "What is a StateGraph?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q179,
    code: "",
  },

  {
    id: "180-what-is-graph-state",
    category: "LangGraph",
    title: "What is graph state?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q180,
    code: "",
  },

  {
    id: "181-what-are-nodes",
    category: "LangGraph",
    title: "What are nodes?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q181,
    code: "",
  },

  {
    id: "182-what-are-edges",
    category: "LangGraph",
    title: "What are edges?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q182,
    code: "",
  },

  {
    id: "183-what-are-conditional-edges",
    category: "LangGraph",
    title: "What are conditional edges?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q183,
    code: "",
  },

  {
    id: "184-what-are-reducers",
    category: "LangGraph",
    title: "What are reducers?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q184,
    code: "",
  },

  {
    id: "185-how-langgraph-supports-parallel-execution",
    category: "LangGraph",
    title: "How does LangGraph support parallel execution?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q185,
    code: "",
  },

  {
    id: "186-how-langgraph-supports-state-persistence",
    category: "LangGraph",
    title: "How does LangGraph support state persistence?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q186,
    code: "",
  },

  {
    id: "187-how-langgraph-supports-human-in-the-loop",
    category: "LangGraph",
    title: "How does LangGraph support human-in-the-loop?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q187,
    code: "",
  },

  {
    id: "188-how-langgraph-supports-retries",
    category: "LangGraph",
    title: "How does LangGraph support retries?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q188,
    code: "",
  },

  {
    id: "189-how-langgraph-supports-checkpointing",
    category: "LangGraph",
    title: "How does LangGraph support checkpointing?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q189,
    code: "",
  },

  {
    id: "190-how-to-resume-a-failed-workflow",
    category: "LangGraph",
    title: "How do you resume a failed workflow?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q190,
    code: "",
  },

  {
    id: "191-how-to-prevent-infinite-loops",
    category: "LangGraph",
    title: "How do you prevent infinite loops?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q191,
    code: "",
  },

  {
    id: "192-how-to-control-token-growth",
    category: "LangGraph",
    title: "How do you control token growth?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q192,
    code: "",
  },

  {
    id: "193-how-to-manage-conversation-state",
    category: "LangGraph",
    title: "How do you manage conversation state?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q193,
    code: "",
  },

  {
    id: "194-how-to-separate-session-state-and-workflow-state",
    category: "LangGraph",
    title: "How do you separate session state and workflow state?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q194,
    code: "",
  },

  {
    id: "195-how-to-debug-a-langgraph-workflow",
    category: "LangGraph",
    title: "How do you debug a LangGraph workflow?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q195,
    code: "",
  },

  {
    id: "196-how-to-test-individual-graph-nodes",
    category: "LangGraph",
    title: "How do you test individual graph nodes?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q196,
    code: "",
  },

  {
    id: "197-how-to-test-the-complete-graph",
    category: "LangGraph",
    title: "How do you test the complete graph?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: graph state, nodes, edges, checkpointing, debugging and testing.",
    concept: Q197,
    code: "",
  },

];

export default function CWDLangGraphPage() {
  return (
    <CookbookApp
      data={CWDLangGraph}
      title="CWD LangGraph Cookbook"
      subtitle="Graph state, nodes, edges, checkpointing, debugging and testing"
      icon="🕸️"
      patternLabel="Questions"
    />
  );
}

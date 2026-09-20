import CookbookApp from "../../components/CookbookApp";
import Q113 from "../../assets/CWD/docs/05-worker-architecture/113-what-exactly-is-a-worker.md?raw";
import Q114 from "../../assets/CWD/docs/05-worker-architecture/114-responsibility-of-a-worker.md?raw";
import Q115 from "../../assets/CWD/docs/05-worker-architecture/115-should-workers-contain-business-logic.md?raw";
import Q116 from "../../assets/CWD/docs/05-worker-architecture/116-should-workers-contain-llm-logic.md?raw";
import Q117 from "../../assets/CWD/docs/05-worker-architecture/117-should-every-worker-have-its-own-prompt.md?raw";
import Q118 from "../../assets/CWD/docs/05-worker-architecture/118-how-worker-receives-customer-id.md?raw";
import Q119 from "../../assets/CWD/docs/05-worker-architecture/119-how-worker-knows-which-enterprise-system-to-access.md?raw";
import Q120 from "../../assets/CWD/docs/05-worker-architecture/120-how-worker-calls-salesforce.md?raw";
import Q121 from "../../assets/CWD/docs/05-worker-architecture/121-how-worker-calls-servicenow.md?raw";
import Q122 from "../../assets/CWD/docs/05-worker-architecture/122-why-not-hardcode-salesforce-inside-every-worker.md?raw";
import Q123 from "../../assets/CWD/docs/05-worker-architecture/123-where-mcp-fits-into-worker-architecture.md?raw";
import Q124 from "../../assets/CWD/docs/05-worker-architecture/124-explain-worker-mcp-client-mcp-server-enterprise-tool-flow.md?raw";
import Q125 from "../../assets/CWD/docs/05-worker-architecture/125-who-owns-the-mcp-server.md?raw";
import Q126 from "../../assets/CWD/docs/05-worker-architecture/126-how-mcp-discovers-tools.md?raw";
import Q127 from "../../assets/CWD/docs/05-worker-architecture/127-how-worker-selects-an-mcp-tool.md?raw";
import Q128 from "../../assets/CWD/docs/05-worker-architecture/128-how-worker-passes-parameters.md?raw";
import Q129 from "../../assets/CWD/docs/05-worker-architecture/129-how-to-validate-tool-parameters.md?raw";
import Q130 from "../../assets/CWD/docs/05-worker-architecture/130-how-to-prevent-unauthorized-tool-execution.md?raw";
import Q131 from "../../assets/CWD/docs/05-worker-architecture/131-how-to-handle-mcp-server-failure.md?raw";
import Q132 from "../../assets/CWD/docs/05-worker-architecture/132-how-to-retry-mcp-calls.md?raw";
import Q133 from "../../assets/CWD/docs/05-worker-architecture/133-how-to-prevent-duplicate-transactions.md?raw";
import Q134 from "../../assets/CWD/docs/05-worker-architecture/134-how-to-audit-mcp-calls.md?raw";
import Q135 from "../../assets/CWD/docs/05-worker-architecture/135-how-to-timeout-mcp-calls.md?raw";
import Q136 from "../../assets/CWD/docs/05-worker-architecture/136-how-to-handle-malformed-mcp-responses.md?raw";

const CWDWorkerArchitecture = [
  // =====================================================
  // 05. WORKER ARCHITECTURE
  // =====================================================

  {
    id: "113-what-exactly-is-a-worker",
    category: "Worker Architecture",
    title: "What exactly is a Worker?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q113,
    code: "",
  },

  {
    id: "114-responsibility-of-a-worker",
    category: "Worker Architecture",
    title: "What is the responsibility of a Worker?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q114,
    code: "",
  },

  {
    id: "115-should-workers-contain-business-logic",
    category: "Worker Architecture",
    title: "Should Workers contain business logic?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q115,
    code: "",
  },

  {
    id: "116-should-workers-contain-llm-logic",
    category: "Worker Architecture",
    title: "Should Workers contain LLM logic?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q116,
    code: "",
  },

  {
    id: "117-should-every-worker-have-its-own-prompt",
    category: "Worker Architecture",
    title: "Should every Worker have its own prompt?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q117,
    code: "",
  },

  {
    id: "118-how-worker-receives-customer-id",
    category: "Worker Architecture",
    title: "How does a Worker receive customer ID?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q118,
    code: "",
  },

  {
    id: "119-how-worker-knows-which-enterprise-system-to-access",
    category: "Worker Architecture",
    title: "How does a Worker know which enterprise system to access?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q119,
    code: "",
  },

  {
    id: "120-how-worker-calls-salesforce",
    category: "Worker Architecture",
    title: "How does a Worker call Salesforce?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q120,
    code: "",
  },

  {
    id: "121-how-worker-calls-servicenow",
    category: "Worker Architecture",
    title: "How does a Worker call ServiceNow?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q121,
    code: "",
  },

  {
    id: "122-why-not-hardcode-salesforce-inside-every-worker",
    category: "Worker Architecture",
    title: "Why don't you hardcode Salesforce inside every Worker?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q122,
    code: "",
  },

  {
    id: "123-where-mcp-fits-into-worker-architecture",
    category: "Worker Architecture",
    title: "Where does MCP fit into your Worker architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q123,
    code: "",
  },

  {
    id: "124-explain-worker-mcp-client-mcp-server-enterprise-tool-flow",
    category: "Worker Architecture",
    title: "Explain the flow: Worker → MCP Client → MCP Server → Enterprise Tool → Salesforce / ServiceNow / SharePoint / etc.",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q124,
    code: "",
  },

  {
    id: "125-who-owns-the-mcp-server",
    category: "Worker Architecture",
    title: "Who owns the MCP server?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q125,
    code: "",
  },

  {
    id: "126-how-mcp-discovers-tools",
    category: "Worker Architecture",
    title: "How does MCP discover tools?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q126,
    code: "",
  },

  {
    id: "127-how-worker-selects-an-mcp-tool",
    category: "Worker Architecture",
    title: "How does the Worker select an MCP tool?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q127,
    code: "",
  },

  {
    id: "128-how-worker-passes-parameters",
    category: "Worker Architecture",
    title: "How does the Worker pass parameters?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q128,
    code: "",
  },

  {
    id: "129-how-to-validate-tool-parameters",
    category: "Worker Architecture",
    title: "How do you validate tool parameters?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q129,
    code: "",
  },

  {
    id: "130-how-to-prevent-unauthorized-tool-execution",
    category: "Worker Architecture",
    title: "How do you prevent unauthorized tool execution?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q130,
    code: "",
  },

  {
    id: "131-how-to-handle-mcp-server-failure",
    category: "Worker Architecture",
    title: "How do you handle MCP server failure?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q131,
    code: "",
  },

  {
    id: "132-how-to-retry-mcp-calls",
    category: "Worker Architecture",
    title: "How do you retry MCP calls?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q132,
    code: "",
  },

  {
    id: "133-how-to-prevent-duplicate-transactions",
    category: "Worker Architecture",
    title: "How do you prevent duplicate transactions?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q133,
    code: "",
  },

  {
    id: "134-how-to-audit-mcp-calls",
    category: "Worker Architecture",
    title: "How do you audit MCP calls?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q134,
    code: "",
  },

  {
    id: "135-how-to-timeout-mcp-calls",
    category: "Worker Architecture",
    title: "How do you timeout MCP calls?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q135,
    code: "",
  },

  {
    id: "136-how-to-handle-malformed-mcp-responses",
    category: "Worker Architecture",
    title: "How do you handle malformed MCP responses?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: worker design, MCP integration, tool safety and enterprise systems.",
    concept: Q136,
    code: "",
  },

];

export default function CWDWorkerArchitecturePage() {
  return (
    <CookbookApp
      data={CWDWorkerArchitecture}
      title="CWD Worker Architecture Cookbook"
      subtitle="Worker design, MCP integration, tool safety and enterprise systems"
      icon="⚙️"
      patternLabel="Questions"
    />
  );
}

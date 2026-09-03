import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Scenario50ToolsSelection from "../assets/docs/scenario/scenario-50-tools-selection.md?raw";
import ScenarioAgentCostOptimization from "../assets/docs/scenario/scenario-agent-cost-optimization.md?raw";
import ScenarioAgentIncorrectInformation from "../assets/docs/scenario/scenario-agent-incorrect-information.md?raw";
import ScenarioAgentLatency from "../assets/docs/scenario/scenario-agent-latency.md?raw";
import ScenarioConfidentialHRInformation from "../assets/docs/scenario/scenario-confidential-hr-information.md?raw";
import ScenarioConflictingAgentAnswers from "../assets/docs/scenario/scenario-conflicting-agent-answers.md?raw";
import ScenarioDangerousMCPDeleteTool from "../assets/docs/scenario/scenario-dangerous-mcp-delete-tool.md?raw";
import ScenarioMultiagentCloudMigration from "../assets/docs/scenario/scenario-multiagent-cloud-migration.md?raw";
import ScenarioCWDMulticloudDesign from "../assets/docs/scenario/scenario-cwd-multicloud-design.md?raw";
import ScenarioRAGIncorrectDocuments from "../assets/docs/scenario/scenario-rag-incorrect-documents.md?raw";
import ScenarioRepeatedToolCalls from "../assets/docs/scenario/scenario-repeated-tool-calls.md?raw";
import ScenarioWorkerAgentDown from "../assets/docs/scenario/scenario-worker-agent-down.md?raw";
import CWD from "../assets/docs/scenario/CWD.md?raw";



const AgenticScenarioBasedQuestion = 
[
  {
    id: "scenario-repeated-tool-calls",
    category: "Agentic AI Troubleshooting",
    title: "Your agent keeps calling the same tool repeatedly. How would you fix it?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Diagnose repeated tool execution using loop detection, state tracking, iteration limits, tool-result validation, termination conditions, idempotency, retry policies, prompt improvements, and workflow-level controls.",
    concept: ScenarioRepeatedToolCalls,
    code: ""
  },

  {
    id: "scenario-agent-incorrect-information",
    category: "Multi-Agent Reliability",
    title: "Agent A gives incorrect information to Agent B. How do you detect and prevent this?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Design mechanisms for validating inter-agent information using source attribution, schema validation, confidence scoring, groundedness checks, evaluator agents, independent verification, provenance tracking, and trust policies.",
    concept: ScenarioAgentIncorrectInformation,
    code: ""
  },

  {
    id: "scenario-50-tools-selection",
    category: "Agent Tool Management",
    title: "Your agent has access to 50 tools. Tool selection accuracy is poor. What would you do?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Improve tool selection using tool categorization, hierarchical routing, tool metadata, capability-based discovery, semantic tool retrieval, tool descriptions, constrained tool lists, specialized agents, and tool-selection evaluation.",
    concept: Scenario50ToolsSelection,
    code: ""
  },

  {
    id: "scenario-agent-cost-optimization",
    category: "Agentic AI FinOps",
    title: "Your agent costs $2 per request. Business wants it below $0.20. How do you optimize it?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Reduce agent cost through model routing, smaller models, prompt optimization, context reduction, caching, retrieval optimization, fewer agent iterations, reduced tool calls, batching, token limits, and cost-aware execution policies.",
    concept: ScenarioAgentCostOptimization,
    code: ""
  },

  {
    id: "scenario-agent-latency",
    category: "Agentic AI Performance",
    title: "Agent latency is 20 seconds. Business requires less than 5 seconds. What would you change?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Troubleshoot end-to-end latency by tracing LLM calls, retrieval, tool execution, agent loops, network calls, and orchestration, then optimize through parallel execution, streaming, caching, faster models, reduced context, and asynchronous processing.",
    concept: ScenarioAgentLatency,
    code: ""
  },

  {
    id: "scenario-rag-incorrect-documents",
    category: "Agentic RAG Troubleshooting",
    title: "Your RAG agent retrieves incorrect documents. How do you troubleshoot?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Troubleshoot retrieval quality across ingestion, document parsing, chunking, embeddings, metadata, indexing, query transformation, vector search, hybrid search, filtering, reranking, and retrieval evaluation.",
    concept: ScenarioRAGIncorrectDocuments,
    code: ""
  },

  {
    id: "scenario-confidential-hr-information",
    category: "Agentic AI Security",
    title: "An employee tries to get confidential HR information through an agent. How do you prevent it?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Design authorization and data protection controls using identity-aware access, RBAC or ABAC, document-level security, metadata filtering, tenant isolation, data classification, retrieval authorization, DLP, output filtering, and audit logging.",
    concept: ScenarioConfidentialHRInformation,
    code: ""
  },

  {
    id: "scenario-dangerous-mcp-delete-tool",
    category: "MCP Security",
    title: "An MCP tool can delete records. How do you safely expose it to an agent?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Secure destructive MCP operations using least privilege, explicit authorization, scoped permissions, allowlists, input validation, dry-run mode, confirmation workflows, human approval, idempotency, audit logging, and rollback or recovery mechanisms.",
    concept: ScenarioDangerousMCPDeleteTool,
    code: ""
  },

  {
    id: "scenario-worker-agent-down",
    category: "Multi-Agent Reliability",
    title: "One worker agent goes down in a multi-agent system. What happens?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Design failure handling using health checks, timeouts, retries, circuit breakers, task reassignment, fallback agents, queues, checkpointing, state recovery, graceful degradation, and coordinator-level failure management.",
    concept: ScenarioWorkerAgentDown,
    code: ""
  },

  {
    id: "scenario-conflicting-agent-answers",
    category: "Multi-Agent Decision Making",
    title: "Two agents produce conflicting answers. Which answer should the coordinator choose?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Design conflict-resolution strategies using source authority, confidence scores, evidence quality, agent specialization, independent verification, evaluator agents, voting, deterministic business rules, recency, and human escalation for high-risk decisions.",
    concept: ScenarioConflictingAgentAnswers,
    code: ""
  },

{
  id: "scenario-multiagent-cloud-migration",
  category: "Multi-Agent Decision Making",
  title: "Migrating a multi-agent system between cloud-native environments — what breaks first?",
  difficulty: "Expert",
  time: "~20 min",
  description:
    "Design a migration strategy for moving a multi-agent system across cloud-native environments (e.g., Kubernetes clusters, cloud providers, or regions): containerizing agent workers, moving secrets/config via K8s ConfigMaps/Secrets or a vault, re-pointing service meshes and API gateways, migrating vector DBs and agent memory stores, and validating that autoscaling and networking policies don't throttle agent-to-agent calls post-migration.",
  concept: ScenarioMultiagentCloudMigration,
  code: ""
},

{
  id: "scenario-cwd-multicloud-design",
  category: "Multi-Agent Decision Making",
  title: "How would you design container workload deployment (CWD) for multi-cloud?",
  difficulty: "Expert",
  time: "~20 min",
  description:
    "Design a container workload deployment strategy for a multi-agent system spanning multiple cloud providers: a common container runtime/orchestration layer (e.g., Kubernetes) abstracted from provider-specific services, a unified CI/CD pipeline that builds once and deploys everywhere, cluster federation or GitOps (e.g., ArgoCD/Flux) for syncing manifests across clouds, provider-agnostic secrets/config management, cross-cloud service discovery for agent-to-agent calls, and failover/traffic-routing rules when one cloud's region degrades.",
  concept: ScenarioCWDMulticloudDesign,
  code: ""
},
{
  id: "CWD",
  category: "Multi-Agent Decision Making",
  title: "CWD Design",
  difficulty: "Expert",
  time: "~20 min",
  description:
    "Design a container workload deployment strategy for a multi-agent system spanning multiple cloud providers: a common container runtime/orchestration layer (e.g., Kubernetes) abstracted from provider-specific services, a unified CI/CD pipeline that builds once and deploys everywhere, cluster federation or GitOps (e.g., ArgoCD/Flux) for syncing manifests across clouds, provider-agnostic secrets/config management, cross-cloud service discovery for agent-to-agent calls, and failover/traffic-routing rules when one cloud's region degrades.",
  concept: CWD,
  code: ""
}
];
const CATEGORIES = ["All", "Advanced"];

const DIFFICULTIES = {
  Beginner: "#0F6E56",
  Intermediate: "#185FA5",
  Advanced: "#993C1D",
};

const DIFFICULTY_BG = {
  Beginner: "#E1F5EE",
  Intermediate: "#E6F1FB",
  Advanced: "#FAECE7",
};

function ContentViewer({ content }) {
  return (
    <div className="prose max-w-none h-[75vh] overflow-y-auto p-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || "No concept available for this recipe."}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code || "");
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div style={{ position: "relative", marginTop: 16 }}>
      <button
        onClick={copy}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          padding: "4px 10px",
          borderRadius: 6,
          border: "0.5px solid var(--color-border-secondary)",
          background: "var(--color-background-secondary)",
          cursor: "pointer",
          fontSize: 12,
          color: "var(--color-text-secondary)",
          zIndex: 1,
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>

      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          borderRadius: 10,
          overflowX: "auto",
          background: "var(--color-background-secondary)",
          border: "0.5px solid var(--color-border-tertiary)",
          fontSize: 12,
          lineHeight: 1.65,
          fontFamily: "var(--font-mono)",
          color: "var(--color-text-primary)",
          whiteSpace: "pre",
        }}
      >
        <code>{code || "// No code available."}</code>
      </pre>
    </div>
  );
}

function RecipeCard({ recipe, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(recipe)}
      style={{
        padding: "16px 18px",
        borderRadius: 12,
        cursor: "pointer",
        border: selected
          ? "1.5px solid #185FA5"
          : "0.5px solid var(--color-border-tertiary)",
        background: selected
          ? "#061320"
          : "var(--color-background-primary)",
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            fontWeight: 400,
          }}
        >
          {recipe.category}
        </span>

        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 20,
            fontWeight: 500,
            background:
              DIFFICULTY_BG[recipe.difficulty] || "#E6F1FB",
            color:
              DIFFICULTIES[recipe.difficulty] || "#185FA5",
          }}
        >
          {recipe.difficulty}
        </span>
      </div>

      <div
        style={{
          fontWeight: 500,
          fontSize: 15,
          marginBottom: 4,
          color: "var(--color-text-primary)",
        }}
      >
        {recipe.title}
      </div>

      <div
        style={{
          fontSize: 13,
          color: "var(--color-text-secondary)",
          lineHeight: 1.5,
        }}
      >
        {recipe.description}
      </div>
    </div>
  );
}

function RecipeDetail({ recipe }) {
  const [tab, setTab] = useState("concept");

  return (
    <div
      style={{
        padding: "24px",
        borderRadius: 14,
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 4,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 12,
              color: "var(--color-text-tertiary)",
            }}
          >
            {recipe.category}
          </span>

          <h2
            style={{
              margin: "4px 0 6px",
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            {recipe.title}
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            paddingTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 12,
              padding: "3px 10px",
              borderRadius: 20,
              fontWeight: 500,
              background:
                DIFFICULTY_BG[recipe.difficulty] || "#E6F1FB",
              color:
                DIFFICULTIES[recipe.difficulty] || "#185FA5",
            }}
          >
            {recipe.difficulty}
          </span>

          {recipe.time && (
            <span
              style={{
                fontSize: 12,
                color: "var(--color-text-tertiary)",
              }}
            >
              ⏱ {recipe.time}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          margin: "0 0 20px",
          color: "var(--color-text-secondary)",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {recipe.description}
      </p>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 18,
          borderBottom:
            "0.5px solid var(--color-border-tertiary)",
          paddingBottom: 0,
        }}
      >
        {["concept", "code"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: tab === t ? 500 : 400,
              color:
                tab === t
                  ? "var(--color-text-primary)"
                  : "var(--color-text-secondary)",
              borderBottom:
                tab === t
                  ? "2px solid #185FA5"
                  : "2px solid transparent",
              marginBottom: -1,
              transition: "all 0.12s",
            }}
          >
            {t === "concept" ? "Concept" : "Code"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "concept" && (
        <ContentViewer content={recipe.concept} />
      )}

      {tab === "code" && <CodeBlock code={recipe.code} />}
    </div>
  );
}

function Sidebar({
  recipes,
  selected,
  onSelect,
  category,
  setCategory,
  search,
  setSearch,
}) {
  const filtered = recipes.filter((r) => {
    const matchCat =
      category === "All" || r.category === category;

    const searchText = search.toLowerCase();

    const matchSearch =
      r.title?.toLowerCase().includes(searchText) ||
      r.description?.toLowerCase().includes(searchText) ||
      r.category?.toLowerCase().includes(searchText);

    return matchCat && matchSearch;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 0,
      }}
    >
      {/* Search */}
      <div style={{ padding: "0 0 16px" }}>
        <input
          type="text"
          placeholder="Search questions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 12px",
            borderRadius: 8,
            border:
              "0.5px solid var(--color-border-secondary)",
            background:
              "var(--color-background-secondary)",
            color: "var(--color-text-primary)",
            fontSize: 13,
          }}
        />
      </div>

      {/* Categories */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              cursor: "pointer",
              border:
                category === c
                  ? "1.5px solid #185FA5"
                  : "0.5px solid var(--color-border-tertiary)",
              background:
                category === c
                  ? "#E6F1FB"
                  : "var(--color-background-primary)",
              color:
                category === c
                  ? "#185FA5"
                  : "var(--color-text-secondary)",
              fontWeight: category === c ? 500 : 400,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Recipe List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflowY: "auto",
          flex: 1,
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              color: "var(--color-text-tertiary)",
              fontSize: 13,
              padding: "12px 0",
            }}
          >
            No questions found.
          </div>
        ) : (
          filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onSelect={onSelect}
              selected={selected?.id === r.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div
      style={{
        padding: "20px 32px 16px",
        borderBottom:
          "0.5px solid var(--color-border-tertiary)",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "#E6F1FB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        📚
      </div>

      {/* Title */}
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "-0.3px",
          }}
        >
          AgenticAI Cookbook
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--color-text-secondary)",
          }}
        >
          End-to-end Agentic AI
        </p>
      </div>

      {/* Statistics */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 20,
        }}
      >
        {[
          {
            label: "Questions",
            value: AgenticScenarioBasedQuestion.length,
          },
          {
            label: "Patterns",
            value: CATEGORIES.length - 1,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              {value}
            </div>

            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-tertiary)",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(
    AgenticScenarioBasedQuestion[0]
  );

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily:
          "var(--font-sans, system-ui, sans-serif)",
        background:
          "var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))",
        color: "var(--color-text-primary)",
      }}
    >
      <Header />

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 320,
            minWidth: 260,
            padding: "20px 20px",
            borderRight:
              "0.5px solid var(--color-border-tertiary)",
            background:
              "var(--color-background-primary)",
            overflowY: "auto",
          }}
        >
          <Sidebar
            recipes={AgenticScenarioBasedQuestion}
            selected={selected}
            onSelect={setSelected}
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
          />
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
          }}
        >
          {selected ? (
            <RecipeDetail recipe={selected} />
          ) : (
            <div
              style={{
                color: "var(--color-text-tertiary)",
                padding: 40,
                textAlign: "center",
              }}
            >
              Select a question to get started
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
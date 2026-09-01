import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const ProductionLLMOpsQuestion = 
[
  {
    id: "deploy-agents-production",
    category: "Agentic AI Production",
    title: "How do you deploy agents into production?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Understand production deployment of AI agents using containerization, APIs, orchestration, CI/CD, configuration management, security, observability, autoscaling, persistence, and reliability controls.",
    concept: "",
    code: ""
  },

  {
    id: "version-prompts",
    category: "LLMOps",
    title: "How do you version prompts?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand enterprise prompt versioning using source control, prompt registries, metadata, version identifiers, evaluation results, approval workflows, environment promotion, and rollback.",
    concept: "",
    code: ""
  },

  {
    id: "version-agent-workflows",
    category: "Agentic AI Production",
    title: "How do you version agent workflows?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to version agent graphs, nodes, routing logic, tools, prompts, policies, dependencies, and configuration so workflow changes are traceable, testable, deployable, and reversible.",
    concept: "",
    code: ""
  },

  {
    id: "monitor-agents",
    category: "Agentic AI Observability",
    title: "How do you monitor agents?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Design agent monitoring across availability, task success, failures, tool usage, model performance, token consumption, latency, retries, loops, safety events, and business KPIs.",
    concept: "",
    code: ""
  },

  {
    id: "trace-agent-execution",
    category: "Agentic AI Observability",
    title: "How do you trace agent execution?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Understand distributed tracing for agent workflows, including user requests, agent transitions, LLM calls, tool calls, retrieval operations, MCP calls, A2A communication, retries, and final responses.",
    concept: "",
    code: ""
  },

  {
    id: "monitor-token-usage",
    category: "LLMOps",
    title: "How do you monitor token usage?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Track input and output tokens by user, tenant, agent, workflow, model, request, and tool execution to identify unexpected consumption and support cost optimization.",
    concept: "",
    code: ""
  },

  {
    id: "monitor-agent-latency",
    category: "Agentic AI Observability",
    title: "How do you monitor latency?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Measure end-to-end agent latency and break it down across LLM inference, first-token latency, retrieval, tool execution, MCP calls, A2A communication, orchestration, and downstream services.",
    concept: "",
    code: ""
  },

  {
    id: "prompt-regression-testing",
    category: "LLMOps",
    title: "How do you perform prompt regression testing?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Understand how to compare prompt versions against golden datasets using automated quality, groundedness, safety, task-success, latency, and cost thresholds before promoting changes to production.",
    concept: "",
    code: ""
  },

  {
    id: "rollback-agent",
    category: "Agentic AI Production",
    title: "How do you roll back an agent?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand safe rollback strategies for agent versions, prompts, workflows, models, tools, and configurations using immutable artifacts, deployment versioning, feature flags, canary releases, and automated rollback.",
    concept: "",
    code: ""
  },

  {
    id: "production-model-fallback",
    category: "LLMOps",
    title: "How do you implement model fallback?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Design model fallback using primary and secondary LLM providers, health checks, timeout detection, rate-limit handling, quality policies, routing logic, and graceful degradation.",
    concept: "",
    code: ""
  },

  {
    id: "multiple-llm-providers",
    category: "LLMOps",
    title: "How do you manage multiple LLM providers?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Understand multi-provider LLM architecture using abstraction layers, model registries, routing policies, provider-specific adapters, credentials, observability, cost controls, evaluation, and fallback strategies.",
    concept: "",
    code: ""
  },

  {
    id: "reduce-llm-cost",
    category: "LLMOps and FinOps",
    title: "How do you reduce LLM cost?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Understand LLM cost optimization through model routing, smaller models, prompt optimization, caching, context reduction, batching, token controls, retrieval optimization, reduced iterations, and avoiding unnecessary tool calls.",
    concept: "",
    code: ""
  },

  {
    id: "reduce-agent-latency",
    category: "Agentic AI Performance",
    title: "How do you reduce latency?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Understand latency optimization through parallel execution, streaming, model selection, caching, prompt reduction, retrieval optimization, connection reuse, asynchronous processing, and minimizing unnecessary agent iterations.",
    concept: "",
    code: ""
  },

  {
    id: "model-outages",
    category: "LLMOps Reliability",
    title: "How do you handle model outages?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Design resilient LLM infrastructure using provider health checks, automatic failover, circuit breakers, retries with backoff, alternate models, queueing, degraded modes, observability, and incident recovery.",
    concept: "",
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
            value: ProductionLLMOpsQuestion.length,
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
    ProductionLLMOpsQuestion[0]
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
            recipes={ProductionLLMOpsQuestion}
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
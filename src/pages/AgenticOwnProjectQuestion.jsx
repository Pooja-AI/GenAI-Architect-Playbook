import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const AgenticOwnProjectQuestion = 
[
  {
    id: "project-architecture-end-to-end",
    category: "Project Deep Dive",
    title: "Explain your architecture end-to-end.",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Explain the complete enterprise Agentic AI architecture from user request and API gateway through authentication, coordinator, delegators, worker agents, LangGraph orchestration, RAG, MCP, A2A, enterprise systems, state management, observability, security, and final response.",
    concept: "",
    code: ""
  },

  {
    id: "project-why-langgraph",
    category: "Project Deep Dive",
    title: "Why did you choose LangGraph?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain why LangGraph was selected for the project, including explicit workflow control, state management, conditional routing, loops, checkpointing, human-in-the-loop, retries, persistence, and hierarchical multi-agent orchestration.",
    concept: "",
    code: ""
  },

  {
    id: "project-why-hierarchical-agents",
    category: "Project Architecture",
    title: "Why hierarchical agents?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain why hierarchical multi-agent architecture was preferred for complex enterprise workloads, including separation of responsibilities, scalability, specialization, controlled autonomy, routing, maintainability, and fault isolation.",
    concept: "",
    code: ""
  },

  {
    id: "project-coordinator-delegator-worker",
    category: "Project Architecture",
    title: "Why coordinator + delegator + worker architecture?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain the responsibilities and architectural benefits of Coordinator, Delegator, and Worker layers, including task decomposition, domain routing, specialization, execution isolation, scalability, and governance.",
    concept: "",
    code: ""
  },

  {
    id: "project-single-agent-vs-multi-agent",
    category: "Project Architecture",
    title: "Why not use a single agent?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Compare a single-agent architecture with the hierarchical multi-agent design in terms of complexity, specialization, tool management, scalability, reliability, observability, security boundaries, and maintenance.",
    concept: "",
    code: ""
  },

  {
    id: "project-coordinator-delegator-selection",
    category: "Project Orchestration",
    title: "How does the coordinator select a delegator?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain how the coordinator analyzes user intent, task type, required capabilities, metadata, policies, and routing rules to select the appropriate domain delegator.",
    concept: "",
    code: ""
  },

  {
    id: "project-delegator-worker-selection",
    category: "Project Orchestration",
    title: "How do delegators select workers?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain how delegators select specialized workers based on capabilities, task requirements, tool access, workload, policies, confidence, and execution context.",
    concept: "",
    code: ""
  },

  {
    id: "project-worker-results",
    category: "Multi-Agent Communication",
    title: "How do workers communicate results?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Explain how worker agents return structured results, status, evidence, errors, metadata, and artifacts to delegators and coordinators using shared state or agent-to-agent communication patterns.",
    concept: "",
    code: ""
  },

  {
    id: "project-state-management",
    category: "Agent State",
    title: "Where is state maintained?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain where conversational state, workflow state, intermediate results, tool outputs, memory, checkpoints, and execution metadata are maintained and how state persistence supports recovery and resumability.",
    concept: "",
    code: ""
  },

  {
    id: "project-rag-implementation",
    category: "RAG Architecture",
    title: "How is RAG implemented?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Explain the end-to-end RAG pipeline including ingestion, parsing, chunking, embeddings, indexing, metadata, access control, query transformation, retrieval, reranking, context construction, grounded generation, and evaluation.",
    concept: "",
    code: ""
  },

  {
    id: "project-mcp-usage",
    category: "MCP",
    title: "Where did you use MCP?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain where MCP was used to standardize agent access to enterprise tools, APIs, databases, applications, or resources and how MCP servers were integrated into the agent architecture.",
    concept: "",
    code: ""
  },

  {
    id: "project-a2a-usage",
    category: "A2A",
    title: "Where did you use A2A?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain where A2A was used for agent-to-agent collaboration, task delegation, capability discovery, communication, result exchange, and distributed agent execution.",
    concept: "",
    code: ""
  },

  {
    id: "project-mcp-and-a2a",
    category: "Agentic Architecture",
    title: "Why use both MCP and A2A?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain why MCP and A2A solve different integration problems and how they complement each other: MCP for agent-to-tool and resource access, and A2A for agent-to-agent collaboration.",
    concept: "",
    code: ""
  },

  {
    id: "project-failure-handling",
    category: "Reliability",
    title: "How do you handle failures?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain failure handling across agents, tools, MCP servers, A2A communication, databases, vector stores, and LLM providers using retries, timeouts, circuit breakers, fallbacks, checkpoints, recovery, and graceful degradation.",
    concept: "",
    code: ""
  },

  {
    id: "project-hallucination-handling",
    category: "AI Reliability",
    title: "How do you handle hallucination?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain hallucination prevention using grounded RAG, source validation, structured outputs, confidence thresholds, tool verification, evaluator mechanisms, guardrails, citations, and refusal or escalation strategies.",
    concept: "",
    code: ""
  },

  {
    id: "project-security",
    category: "Security",
    title: "How do you secure the system?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Explain enterprise security across authentication, authorization, RBAC, identity propagation, data protection, prompt injection defense, tool permissions, secrets management, network isolation, encryption, PII protection, and auditing.",
    concept: "",
    code: ""
  },

  {
    id: "project-agent-evaluation",
    category: "Evaluation",
    title: "How do you evaluate agents?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain agent evaluation using task success, tool-call accuracy, groundedness, faithfulness, relevance, hallucination rate, latency, cost, safety, regression testing, and business-specific evaluation metrics.",
    concept: "",
    code: ""
  },

  {
    id: "project-monitoring",
    category: "Observability",
    title: "How do you monitor the system?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain end-to-end observability across agent execution, LangGraph nodes, LLM calls, tokens, tool calls, RAG retrieval, MCP, A2A, latency, failures, cost, user activity, and business KPIs.",
    concept: "",
    code: ""
  },

  {
    id: "project-cost-control",
    category: "FinOps",
    title: "How do you control cost?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Explain cost controls including model routing, smaller models, prompt optimization, context reduction, caching, token limits, reduced agent iterations, tool optimization, quotas, and per-tenant cost tracking.",
    concept: "",
    code: ""
  },

  {
    id: "project-llm-unavailable",
    category: "Reliability",
    title: "What happens if the LLM is unavailable?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Explain resilience to LLM outages using health checks, timeouts, retries, circuit breakers, alternate models or providers, fallback routing, queues, degraded modes, and recovery mechanisms.",
    concept: "",
    code: ""
  },

  {
    id: "project-mcp-server-failure",
    category: "MCP Reliability",
    title: "What happens if an MCP server fails?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Explain how the agent detects MCP server failure and handles it using health checks, timeouts, retries, circuit breakers, fallback tools, alternative MCP servers, task reassignment, and graceful degradation.",
    concept: "",
    code: ""
  },

  {
    id: "project-scale-architecture",
    category: "Scalability",
    title: "How would you scale this architecture?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Explain how to horizontally scale coordinators, delegators, workers, RAG services, MCP servers, A2A communication, databases, queues, and model access using autoscaling, caching, asynchronous execution, and load balancing.",
    concept: "",
    code: ""
  },

  {
    id: "project-hardest-technical-problem",
    category: "Project Deep Dive",
    title: "What was the hardest technical problem?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Prepare to explain the most challenging technical problem encountered during implementation, including the root cause, investigation, architectural trade-offs, solution, implementation details, measurable outcome, and lessons learned.",
    concept: "",
    code: ""
  },

  {
    id: "project-redesign",
    category: "Project Deep Dive",
    title: "What would you change if you redesigned it?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Evaluate the existing architecture critically and identify improvements in agent orchestration, model routing, RAG, MCP, A2A, security, scalability, observability, evaluation, cost, and operational maturity.",
    concept: "",
    code: ""
  },

  {
    id: "project-business-value",
    category: "Project Deep Dive",
    title: "What business value did the solution provide?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Explain the measurable business impact of the Agentic AI solution, including productivity improvement, automation, reduced resolution time, knowledge accessibility, operational efficiency, cost savings, accuracy, and user experience.",
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
            value: AgenticOwnProjectQuestion.length,
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
    AgenticOwnProjectQuestion[0]
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
            recipes={AgenticOwnProjectQuestion}
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
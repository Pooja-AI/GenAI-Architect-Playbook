import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const MultiAgentSystemsQuestion = 
[
  {
    id: "what-is-multi-agent-system",
    category: "Multi-Agent Architecture",
    title: "What is a multi-agent system?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the concept of multi-agent systems, how multiple specialized AI agents collaborate, communicate, coordinate, and execute tasks toward a common or distributed goal.",
    concept: "",
    code: ""
  },

  {
    id: "multi-agent-vs-single-agent",
    category: "Multi-Agent Architecture",
    title: "Why would you choose multi-agent architecture over a single agent?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand when multi-agent architecture provides advantages over a single agent through specialization, separation of responsibilities, scalability, parallel execution, security boundaries, and independent development.",
    concept: "",
    code: ""
  },

  {
    id: "multi-agent-patterns",
    category: "Multi-Agent Architecture",
    title: "What are the different multi-agent patterns?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand common multi-agent patterns including hierarchical, supervisor, peer-to-peer, sequential, parallel, pipeline, debate, swarm, and event-driven architectures.",
    concept: "",
    code: ""
  },

  {
    id: "hierarchical-multi-agent",
    category: "Multi-Agent Architecture",
    title: "What is hierarchical multi-agent architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand hierarchical agent architectures where higher-level agents coordinate or delegate work to lower-level specialized agents through structured layers of responsibility.",
    concept: "",
    code: ""
  },

  {
    id: "supervisor-architecture",
    category: "Multi-Agent Architecture",
    title: "What is supervisor architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the supervisor pattern where a central supervisor agent manages multiple specialized agents, determines task routing, coordinates execution, and aggregates results.",
    concept: "",
    code: ""
  },

  {
    id: "peer-to-peer-agent-communication",
    category: "Multi-Agent Architecture",
    title: "What is peer-to-peer agent communication?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand decentralized agent collaboration where agents communicate directly with one another without relying on a single centralized coordinator.",
    concept: "",
    code: ""
  },

  {
    id: "sequential-agent-orchestration",
    category: "Multi-Agent Architecture",
    title: "What is sequential agent orchestration?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand sequential agent execution where one agent completes its task and passes its output to the next agent in a predefined or dynamically controlled sequence.",
    concept: "",
    code: ""
  },

  {
    id: "parallel-agent-execution",
    category: "Multi-Agent Architecture",
    title: "What is parallel agent execution?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand how multiple agents execute tasks concurrently to reduce latency, improve throughput, and independently process decomposed subtasks before results are aggregated.",
    concept: "",
    code: ""
  },

  {
    id: "coordinator-agent",
    category: "Multi-Agent Architecture",
    title: "What is a coordinator agent?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the role of a coordinator agent in managing task decomposition, routing, delegation, execution control, result aggregation, and overall multi-agent workflow coordination.",
    concept: "",
    code: ""
  },

  {
    id: "worker-agent",
    category: "Multi-Agent Architecture",
    title: "What is a worker agent?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the role of specialized worker agents that execute well-defined tasks using specific tools, knowledge, models, or business capabilities within a larger agentic workflow.",
    concept: "",
    code: ""
  },

  {
    id: "delegator-agent",
    category: "Multi-Agent Architecture",
    title: "What is a delegator agent?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the role of a delegator agent in decomposing domain-level tasks and assigning subtasks to specialized worker agents while coordinating their execution and results.",
    concept: "",
    code: ""
  },

  {
    id: "coordinator-agent-routing",
    category: "Multi-Agent Orchestration",
    title: "How does a coordinator decide which agent should execute a task?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how coordinators perform task routing using intent classification, agent capabilities, metadata, policies, context, tool availability, rules, and LLM-based decision-making.",
    concept: "",
    code: ""
  },

  {
    id: "agent-communication-methods",
    category: "Multi-Agent Communication",
    title: "How do agents communicate with each other?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand synchronous and asynchronous agent communication using protocols, APIs, messaging systems, event streams, structured messages, task identifiers, and standardized agent-to-agent protocols.",
    concept: "",
    code: ""
  },

  {
    id: "multi-agent-shared-state",
    category: "Multi-Agent State Management",
    title: "How do you manage shared state?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how shared state is maintained across multiple agents using centralized state stores, distributed databases, checkpoints, event logs, shared context, and controlled state transitions.",
    concept: "",
    code: ""
  },

  {
    id: "prevent-agent-duplicate-work",
    category: "Multi-Agent Orchestration",
    title: "How do you prevent agents from duplicating work?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand mechanisms for preventing duplicate agent execution using task ownership, unique task IDs, state tracking, distributed locks, capability boundaries, idempotency, and centralized coordination.",
    concept: "",
    code: ""
  },

  {
    id: "conflicting-agent-outputs",
    category: "Multi-Agent Reliability",
    title: "How do you handle conflicting outputs from agents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to resolve conflicting agent outputs using validation, confidence scoring, evaluator agents, source verification, consensus mechanisms, ranking, and human escalation.",
    concept: "",
    code: ""
  },

  {
    id: "multi-agent-failure-handling",
    category: "Multi-Agent Reliability",
    title: "How do you handle one agent failure?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand failure recovery in multi-agent systems using retries, timeouts, fallback agents, circuit breakers, task reassignment, checkpoint recovery, graceful degradation, and error propagation.",
    concept: "",
    code: ""
  },

  {
    id: "multi-agent-monitoring",
    category: "Multi-Agent Observability",
    title: "How do you monitor a multi-agent system?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand end-to-end monitoring of agents, including distributed tracing, agent execution, LLM calls, tool calls, latency, token usage, failures, task outcomes, and business-level metrics.",
    concept: "",
    code: ""
  },

  {
    id: "multi-agent-cost-control",
    category: "Multi-Agent Cost Optimization",
    title: "How do you control multi-agent cost?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand strategies for controlling multi-agent costs through model selection, routing, token optimization, caching, execution limits, parallelism control, tool optimization, and agent-level cost monitoring.",
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
            value: MultiAgentSystemsQuestion.length,
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
    MultiAgentSystemsQuestion[0]
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
            recipes={MultiAgentSystemsQuestion}
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
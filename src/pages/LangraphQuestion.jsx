import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const LangraphQuestion = 
[
  {
    id: "what-is-langgraph",
    category: "LangGraph",
    title: "What is LangGraph?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand LangGraph as a framework for building stateful, multi-step, and controllable agent workflows using graphs, nodes, edges, state, persistence, and human-in-the-loop capabilities.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-vs-langchain-agents",
    category: "LangGraph",
    title: "Why LangGraph instead of LangChain agents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand why LangGraph may be selected over traditional LangChain agents for complex workflows requiring explicit orchestration, state management, conditional routing, loops, persistence, and production control.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-graph",
    category: "LangGraph",
    title: "What is a graph in LangGraph?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand how LangGraph represents an agent workflow as a graph containing nodes, edges, state transitions, and execution paths.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-nodes",
    category: "LangGraph",
    title: "What are nodes?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand nodes as executable units in LangGraph that perform operations such as calling an LLM, invoking tools, processing data, executing agents, or modifying state.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-edges",
    category: "LangGraph",
    title: "What are edges?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand edges as connections between LangGraph nodes that define how execution moves from one step to another.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-conditional-edges",
    category: "LangGraph",
    title: "What are conditional edges?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand how conditional edges dynamically route execution to different nodes based on the current state, model output, business rules, or execution results.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-state",
    category: "LangGraph",
    title: "What is state in LangGraph?",
    difficulty: "Intermediate",
    time: "~15 min",
    description:
      "Understand LangGraph state as the shared data structure that carries conversation context, task information, tool results, intermediate outputs, and execution information between nodes.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-state-persistence",
    category: "LangGraph",
    title: "How do you persist state?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how LangGraph state can be persisted using checkpointing and external storage so workflows can resume, recover, and maintain continuity across executions.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-checkpoints",
    category: "LangGraph",
    title: "How do you implement checkpoints?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand checkpointing in LangGraph, including saving execution state at workflow boundaries to support persistence, recovery, debugging, human approval, and resumable execution.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-human-approval",
    category: "LangGraph",
    title: "How do you implement human approval?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how LangGraph workflows can pause before sensitive actions, request human approval, persist execution state, and resume or terminate based on the human decision.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-loops",
    category: "LangGraph",
    title: "How do you implement loops?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how LangGraph supports cyclic workflows where execution can return to previous nodes based on conditions until a defined completion or termination criterion is reached.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-retries",
    category: "LangGraph",
    title: "How do you implement retries?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand retry strategies for LangGraph node execution, including retry policies, retryable errors, maximum attempts, backoff, and handling transient versus permanent failures.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-parallel-execution",
    category: "LangGraph",
    title: "How do you implement parallel execution?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how LangGraph can execute independent branches concurrently and later merge their results to improve throughput and reduce end-to-end latency.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-error-handling",
    category: "LangGraph",
    title: "How do you handle errors in LangGraph?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand error handling in LangGraph using retries, exception handling, fallback paths, conditional routing, checkpoints, recovery, graceful termination, and error propagation.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-hierarchical-agents",
    category: "LangGraph",
    title: "How do you build hierarchical agents using LangGraph?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Understand how to implement hierarchical multi-agent architectures in LangGraph, such as Coordinator → Delegator → Worker, using subgraphs, routing, shared state, and controlled execution.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-supervisor-agent",
    category: "LangGraph",
    title: "How do you implement a supervisor agent?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Understand how to design a supervisor agent in LangGraph that analyzes tasks, selects specialized agents, routes execution, manages state, and aggregates results.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-infinite-loops",
    category: "LangGraph",
    title: "How do you prevent infinite loops?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to prevent uncontrolled cyclic execution using termination conditions, recursion limits, iteration counters, state tracking, validation, timeouts, and explicit end states.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-observability-debugging",
    category: "LangGraph",
    title: "How do you observe and debug LangGraph execution?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to trace LangGraph execution, inspect state transitions, monitor nodes and tool calls, identify failures, analyze latency and token usage, and debug complex agent workflows.",
    concept: "",
    code: ""
  },

  {
    id: "langgraph-production-deployment",
    category: "LangGraph",
    title: "How do you deploy LangGraph into production?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Understand production deployment of LangGraph applications, including API services, containerization, cloud infrastructure, persistence, scaling, authentication, observability, secrets management, reliability, and CI/CD.",
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
            value: LangraphQuestion.length,
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
    LangraphQuestion[0]
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
            recipes={LangraphQuestion}
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
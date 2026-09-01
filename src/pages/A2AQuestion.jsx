import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const A2AQuestion = 
[
  {
    id: "what-is-a2a",
    category: "Agentic AI Protocols",
    title: "What is A2A?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the Agent2Agent (A2A) protocol, its purpose, core concepts, and how it enables interoperability and communication between independent AI agents.",
    concept: "",
    code: ""
  },

  {
    id: "why-agent-to-agent-communication",
    category: "Agentic AI Protocols",
    title: "Why do agents need agent-to-agent communication?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand why distributed AI agents need standardized communication for task delegation, collaboration, capability sharing, interoperability, and independent execution.",
    concept: "",
    code: ""
  },

  {
    id: "a2a-vs-mcp",
    category: "Agentic AI Protocols",
    title: "How is A2A different from MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the architectural differences between A2A and MCP, including agent-to-agent collaboration versus agent-to-tool, resource, and context integration.",
    concept: "",
    code: ""
  },

  {
    id: "how-agents-communicate",
    category: "Agentic AI Protocols",
    title: "How do two agents communicate?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how two independent agents exchange tasks, messages, context, status, and results using agent communication protocols and structured message formats.",
    concept: "",
    code: ""
  },

  {
    id: "what-is-agent-card",
    category: "Agentic AI Protocols",
    title: "What is an Agent Card?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the purpose of an Agent Card, how it describes an agent's identity, capabilities, skills, supported communication methods, and endpoint information.",
    concept: "",
    code: ""
  },

  {
    id: "agent-discovery-a2a",
    category: "Agentic AI Protocols",
    title: "How does an agent discover another agent?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand agent discovery mechanisms using Agent Cards, registries, service discovery, capability metadata, and endpoint information in distributed A2A systems.",
    concept: "",
    code: ""
  },

  {
    id: "a2a-agent-authentication",
    category: "Agentic AI Security",
    title: "How do you authenticate agents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand authentication mechanisms for agent-to-agent communication, including identity verification, OAuth, tokens, certificates, workload identity, and enterprise security controls.",
    concept: "",
    code: ""
  },

  {
    id: "a2a-asynchronous-communication",
    category: "Agentic AI Protocols",
    title: "How do you handle asynchronous agent communication?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to design asynchronous A2A interactions for long-running tasks using task identifiers, callbacks, event notifications, message queues, polling, and status tracking.",
    concept: "",
    code: ""
  },

  {
    id: "a2a-agent-failures",
    category: "Multi-Agent Reliability",
    title: "How do you handle agent failures?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand failure-handling strategies for A2A systems, including retries, timeouts, circuit breakers, fallback agents, task recovery, idempotency, dead-letter handling, and graceful degradation.",
    concept: "",
    code: ""
  },

  {
    id: "a2a-agent-capabilities",
    category: "Agentic AI Architecture",
    title: "How do you manage agent capabilities?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how agent capabilities and skills are defined, advertised, discovered, versioned, governed, and matched against incoming tasks in an enterprise multi-agent ecosystem.",
    concept: "",
    code: ""
  },

  {
    id: "enterprise-a2a-architecture",
    category: "Agentic AI Architecture",
    title: "How would you design an enterprise A2A architecture?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Design an enterprise-grade A2A architecture covering agent discovery, Agent Cards, authentication, authorization, communication, orchestration, asynchronous tasks, observability, security, scalability, and failure handling.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-and-a2a-together",
    category: "Agentic AI Protocols",
    title: "Can MCP and A2A be used together?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how MCP and A2A can coexist in an enterprise Agentic AI architecture, where A2A enables agent-to-agent collaboration and MCP enables agents to access tools, resources, and external systems.",
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
            value: A2AQuestion.length,
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
    A2AQuestion[0]
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
            recipes={A2AQuestion}
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
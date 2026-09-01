import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const MCPQuestion = 
[
  {
    id: "what-is-mcp",
    category: "MCP",
    title: "What is MCP?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the Model Context Protocol (MCP), its purpose, architecture, core components, and how it standardizes connections between AI applications and external tools, resources, and services.",
    concept: "",
    code: ""
  },

  {
    id: "why-mcp",
    category: "MCP",
    title: "Why do we need MCP?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand why MCP is needed to standardize how AI applications discover and interact with external tools, data sources, resources, and enterprise systems.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-problem",
    category: "MCP",
    title: "What problem does MCP solve?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the integration and interoperability problems MCP addresses, including fragmented tool integrations, duplicated connectors, inconsistent interfaces, and tight coupling between AI applications and external systems.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-client-server",
    category: "MCP Architecture",
    title: "What are MCP clients and servers?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the roles of MCP hosts, clients, and servers and how they interact to establish connections, discover capabilities, and exchange requests and results.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-tools",
    category: "MCP",
    title: "What are MCP tools?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand MCP tools as executable capabilities exposed by MCP servers that allow AI applications to perform actions such as querying systems, calling APIs, modifying data, or triggering business operations.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-resources",
    category: "MCP",
    title: "What are MCP resources?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand MCP resources as contextual data exposed by MCP servers, including documents, files, database information, application data, and other information that AI applications can retrieve.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-prompts",
    category: "MCP",
    title: "What are MCP prompts?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand MCP prompts as reusable prompt templates or interaction patterns exposed by MCP servers to help clients and AI applications use domain-specific instructions consistently.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-tool-discovery",
    category: "MCP",
    title: "How does an agent discover MCP tools?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how MCP clients connect to servers, discover available capabilities and tool schemas, and make those capabilities available to an AI agent for decision-making.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-tool-invocation",
    category: "MCP",
    title: "How does an agent invoke an MCP tool?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the lifecycle of an MCP tool invocation, including tool selection, structured arguments, request transmission, server-side execution, validation, response handling, and error processing.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-vs-rest-api",
    category: "MCP Architecture",
    title: "MCP vs REST API?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Compare MCP and REST APIs in terms of purpose, discovery, standardization, tool schemas, resources, transport, interoperability, integration patterns, and appropriate enterprise use cases.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-vs-function-calling",
    category: "MCP Architecture",
    title: "MCP vs function calling?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the difference between MCP as a standardized protocol for connecting AI applications with external capabilities and function calling as a model capability for generating structured requests to invoke functions.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-vs-plugins",
    category: "MCP Architecture",
    title: "MCP vs plugins?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Compare MCP with traditional plugin architectures in terms of interoperability, standardized discovery, tool definitions, portability, client-server separation, and ecosystem integration.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-security",
    category: "MCP Security",
    title: "How do you secure MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand MCP security controls including authentication, authorization, least privilege, input validation, output validation, secret management, network security, auditing, and tool-level access policies.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-auth-authorization",
    category: "MCP Security",
    title: "How do you implement authentication/authorization for MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to authenticate MCP clients and authorize tool and resource access using identity providers, OAuth, tokens, workload identity, RBAC, ABAC, scopes, and policy enforcement.",
    concept: "",
    code: ""
  },

  {
    id: "enterprise-mcp-server",
    category: "MCP Architecture",
    title: "How would you build an enterprise MCP server?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Design an enterprise-grade MCP server covering tool and resource design, authentication, authorization, validation, secrets management, scalability, observability, rate limiting, error handling, versioning, and deployment.",
    concept: "",
    code: ""
  },

  {
    id: "mcp-server-failures",
    category: "MCP Reliability",
    title: "How do you handle MCP server failures?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand strategies for handling MCP server failures using timeouts, retries, circuit breakers, health checks, fallback mechanisms, graceful degradation, error classification, and observability.",
    concept: "",
    code: ""
  },

  {
    id: "dangerous-mcp-tools",
    category: "MCP Security",
    title: "How do you prevent an agent from calling dangerous MCP tools?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Understand how to control dangerous MCP tool execution using least privilege, tool-level authorization, policy engines, allowlists, deny lists, input validation, human approval, sandboxing, and audit controls.",
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
            value: MCPQuestion.length,
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
    MCPQuestion[0]
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
            recipes={MCPQuestion}
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
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const AgenticAIFundamentalsQuestion = 
[
  {
    id: "what-is-agentic-ai",
    category: "Agentic AI Fundamentals",
    title: "What is Agentic AI?",
    difficulty: "Beginner",
    time: "~10 min",
    description:
      "Understand the concept of Agentic AI, its characteristics, autonomy, reasoning, planning, tool usage, decision-making, and how agents execute tasks toward a defined goal.",
    concept: "",
    code: ""
  },

  {
    id: "agentic-ai-vs-traditional-genai",
    category: "Agentic AI Fundamentals",
    title: "How is Agentic AI different from traditional GenAI?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the key differences between traditional Generative AI and Agentic AI across autonomy, planning, tool usage, memory, decision-making, execution, and multi-step task completion.",
    concept: "",
    code: ""
  },

  {
    id: "what-is-ai-agent",
    category: "Agentic AI Fundamentals",
    title: "What is an AI agent?",
    difficulty: "Beginner",
    time: "~10 min",
    description:
      "Understand what an AI agent is, how it perceives context, reasons about goals, selects actions, invokes tools, observes results, and iteratively works toward task completion.",
    concept: "",
    code: ""
  },

  {
    id: "core-components-ai-agent",
    category: "Agentic AI Fundamentals",
    title: "What are the core components of an AI agent?",
    difficulty: "Intermediate",
    time: "~15 min",
    description:
      "Understand the major components of an AI agent, including model, instructions, memory, state, tools, planning, reasoning, execution, observation, guardrails, and orchestration.",
    concept: "",
    code: ""
  },

  {
    id: "agent-vs-llm",
    category: "Agentic AI Fundamentals",
    title: "What is the difference between an agent and an LLM?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the distinction between an LLM as a reasoning and language-generation model and an agent as a system that uses an LLM with tools, memory, state, planning, and execution capabilities.",
    concept: "",
    code: ""
  },

  {
    id: "agent-vs-workflow",
    category: "Agentic AI Fundamentals",
    title: "What is the difference between an agent and a workflow?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the differences between agent-driven dynamic decision-making and deterministic workflows, including control flow, autonomy, predictability, and execution behavior.",
    concept: "",
    code: ""
  },

  {
    id: "autonomous-agent",
    category: "Agentic AI Fundamentals",
    title: "What is an autonomous agent?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand autonomous agents, their ability to independently plan, make decisions, use tools, observe outcomes, and continue execution with limited human intervention.",
    concept: "",
    code: ""
  },

  {
    id: "agentic-workflow",
    category: "Agentic AI Fundamentals",
    title: "What is an agentic workflow?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand agentic workflows where LLM-driven decisions dynamically determine the next action, tool, agent, or execution path based on the current state and task requirements.",
    concept: "",
    code: ""
  },

  {
    id: "react-pattern",
    category: "Agentic AI Reasoning",
    title: "What is the ReAct pattern?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the ReAct reasoning pattern and how agents combine reasoning and actions to interact with tools, observe results, and iteratively solve complex tasks.",
    concept: "",
    code: ""
  },

  {
    id: "agent-tool-selection",
    category: "Agentic AI Tools",
    title: "How does an agent decide which tool to use?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how agents select tools based on task requirements, tool descriptions, schemas, context, permissions, model reasoning, routing logic, and execution policies.",
    concept: "",
    code: ""
  },

  {
    id: "tool-function-calling",
    category: "Agentic AI Tools",
    title: "What is tool calling/function calling?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand how LLMs generate structured tool-call requests that applications or agents execute against external APIs, databases, services, and enterprise systems.",
    concept: "",
    code: ""
  },

  {
    id: "planning-agentic-ai",
    category: "Agentic AI Reasoning",
    title: "What is planning in Agentic AI?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how agents decompose complex goals into subtasks, determine execution order, select tools or agents, adapt plans, and track progress toward task completion.",
    concept: "",
    code: ""
  },

  {
    id: "reflection-self-reflection",
    category: "Agentic AI Reasoning",
    title: "What is reflection/self-reflection?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how an agent evaluates its own intermediate or final output, identifies errors or weaknesses, and revises its approach to improve task performance.",
    concept: "",
    code: ""
  },

  {
    id: "agent-memory",
    category: "Agentic AI Fundamentals",
    title: "What is memory in an agent?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand how agent memory stores and retrieves relevant information across interactions or tasks to provide continuity, personalization, and contextual awareness.",
    concept: "",
    code: ""
  },

  {
    id: "short-term-vs-long-term-memory",
    category: "Agentic AI Memory",
    title: "What is the difference between short-term and long-term memory?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the differences between short-term conversational or execution context and long-term persistent memory used across sessions and tasks.",
    concept: "",
    code: ""
  },

  {
    id: "agent-state-management",
    category: "Agentic AI Architecture",
    title: "What is state management in agents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how agent state represents the current execution context, task progress, tool results, messages, decisions, and intermediate information throughout an agent workflow.",
    concept: "",
    code: ""
  },

  {
    id: "agent-execution-loop",
    category: "Agentic AI Architecture",
    title: "What is the agent execution loop?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the iterative agent execution cycle of receiving a goal, reasoning, planning, selecting an action or tool, executing it, observing the result, and determining whether to continue or terminate.",
    concept: "",
    code: ""
  },

  {
    id: "agent-hallucination-causes",
    category: "Agentic AI Reliability",
    title: "What causes an agent to hallucinate?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the causes of agent hallucination, including unreliable model outputs, insufficient context, poor retrieval, incorrect tool usage, ambiguous instructions, and flawed reasoning or planning.",
    concept: "",
    code: ""
  },

  {
    id: "prevent-agent-infinite-loop",
    category: "Agentic AI Reliability",
    title: "How do you prevent an agent from getting into an infinite loop?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand techniques for preventing infinite agent execution using maximum iteration limits, termination conditions, state tracking, duplicate-action detection, timeouts, retries, circuit breakers, and human escalation.",
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
            value: AgenticAIFundamentalsQuestion.length,
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
    AgenticAIFundamentalsQuestion[0]
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
            recipes={AgenticAIFundamentalsQuestion}
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
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // =====================================================
  // POOJA SUNKARA
  // =====================================================

  const poojaTopics = [
    {
      name: "About Me",
      path: "/about",
    },
    
  ];

  // =====================================================
  // AGENTIC AI
  // KEEPING YOUR EXISTING TOPICS SAME
  // =====================================================

  const agenticAITopics = [
    {
      name: "Agentic AI Fundamentals",
      path: "/agentic-ai-fundamentals",
    },
    {
      name: "Single Agent Architecture",
      path: "/single-agent-architecture",
    },
    {
      name: "Multi-Agent Systems",
      path: "/multi-agent-systems",
    },
    {
      name: "LangGraph",
      path: "/langgraph",
    },
    {
      name: "MCP",
      path: "/mcp",
    },
    {
      name: "A2A",
      path: "/a2a",
    },
    {
      name: "Agentic RAG",
      path: "/agent-rag",
    },
    {
      name: "Planning & Reasoning",
      path: "/planning-reasoning",
    },
    {
      name: "Memory",
      path: "/memory",
    },
    {
      name: "Agent Evaluation",
      path: "/agent-evaluation",
    },
    {
      name: "Production LLMOps",
      path: "/production-llmops",
    },
    {
      name: "Security & Responsible AI",
      path: "/security-responsible-ai",
    },
    {
      name: "Cloud Architecture",
      path: "/cloud-architecture",
    },
    {
      name: "Enterprise Agent Architecture",
      path: "/enterprise-agent-architecture",
    },
    {
      name: "Agentic System Design",
      path: "/agentic-system-design",
    },
    {
      name: "Agentic Scenario Based",
      path: "/agentic-scenario-based",
    },
    {
      name: "Agentic Project Questions",
      path: "/agentic-own-project",
    },
    {
      name: "Top Questions",
      path: "/top-questions",
    },
    {
      name: "GenAI Questions",
      path: "/genai-questions",
    },
  ];

  // =====================================================
  // CWD PROJECT
  // =====================================================

  // CWD PROJECT
const cwdTopics = [
  { name: "01. Project Overview", path: "/cwd-project-overview" },

  { name: "02. CWD Architecture", path: "/cwd-architecture" },

  { name: "03. Coordinator Agent", path: "/cwd-coordinator" },

  { name: "04. Delegator Agents", path: "/cwd-delegator" },

  { name: "05. Worker Agents", path: "/cwd-workers" },

  { name: "06. CWD Orchestration Flow", path: "/cwd-orchestration" },

  { name: "07. LangGraph", path: "/cwd-langgraph" },

  { name: "08. MCP", path: "/cwd-mcp" },

  { name: "09. A2A Communication", path: "/cwd-a2a" },

  { name: "10. Agent Registry", path: "/cwd-agent-registry" },

  { name: "11. Prompt Registry", path: "/cwd-prompt-registry" },

  { name: "12. RAG Architecture", path: "/cwd-rag" },

  { name: "13. Memory & State Management", path: "/cwd-memory" },

  { name: "14. Enterprise Data Integration", path: "/cwd-data-integration" },

  { name: "15. Security & Governance", path: "/cwd-security" },

  { name: "16. Observability", path: "/cwd-observability" },

  { name: "17. Messaging Architecture", path: "/cwd-messaging" },

  { name: "18. Enterprise Gateway", path: "/cwd-gateway" },

  { name: "19. Infrastructure & Cloud", path: "/cwd-cloud" },

  { name: "20. End-to-End CWD Scenario", path: "/cwd-cbd-scenario" },

  { name: "21. CWD State & Execution Model", path: "/cwd-execution-model" },

  { name: "22. Reliability & Failure Handling", path: "/cwd-reliability" },

  { name: "23. Agent Evaluation", path: "/cwd-evaluation" },

  { name: "24. LLMOps / MLOps", path: "/cwd-llmops" },

  { name: "25. Architecture Decisions & Trade-offs", path: "/cwd-decisions" },

  { name: "26. Challenges & Solutions", path: "/cwd-challenges" },

  { name: "27. Current State vs Future State", path: "/cwd-current-future-state" },

  { name: "28. Interview Preparation", path: "/cwd-interview" },
];
  // =====================================================
  // CODING & AI
  // FEW TOPICS FOR NOW
  // =====================================================

  const codingTopics = [
    {
      name: "Python",
      path: "/python",
    },
  ];

  // =====================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================================
  // CLOSE DROPDOWN WITH ESCAPE
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // CLOSE DROPDOWN WHEN ROUTE CHANGES
  // =====================================================

  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  // =====================================================
  // TOGGLE DROPDOWN
  // =====================================================

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((previous) =>
      previous === dropdownName
        ? null
        : dropdownName
    );
  };

  // =====================================================
  // CLOSE AFTER CLICKING TOPIC
  // =====================================================

  const handleTopicClick = () => {
    setOpenDropdown(null);
  };

  // =====================================================
  // REUSABLE DROPDOWN
  // =====================================================

  const Dropdown = ({ name, topics }) => {
    const isOpen = openDropdown === name;

    return (
      <div className="dropdown">
        <button
          type="button"
          className={`dropdown-btn ${
            isOpen ? "open" : ""
          }`}
          onClick={() => toggleDropdown(name)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {name}

          <span className="arrow">
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {isOpen && (
          <div className="dropdown-content">
            {topics.map((topic) => (
              <Link
                key={topic.path}
                to={topic.path}
                onClick={handleTopicClick}
              >
                {topic.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // =====================================================
  // NAVBAR
  // =====================================================

  return (
    <nav className="navbar">

      {/* =================================================
          LOGO
      ================================================= */}

      <div className="logo">
        <Link to="/" className="logo-link">

          <img
            src={logo}
            alt="IntelliCatalyst AI Labs"
            className="logo-icon"
          />

          <div className="logo-text">

            <span className="logo-white">
              IntelliCatalyst
            </span>

            <span className="logo-blue">
              AI Labs
            </span>

          </div>

        </Link>
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div
        className="menu"
        ref={dropdownRef}
      >

        {/* =================================================
            POOJA SUNKARA
        ================================================= */}

        <Dropdown
          name="Pooja Sunkara"
          topics={poojaTopics}
        />

        {/* =================================================
            AGENTIC AI
        ================================================= */}

        <Dropdown
          name="AgenticAI"
          topics={agenticAITopics}
        />

        {/* =================================================
            CWD PROJECT
        ================================================= */}

        <Dropdown
          name="CWD Project"
          topics={cwdTopics}
        />

        {/* =================================================
            CODING & AI
        ================================================= */}

        <Dropdown
          name="Coding & AI"
          topics={codingTopics}
        />

      </div>

    </nav>
  );
}

export default Navbar;
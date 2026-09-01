import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

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

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
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

  // Close when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
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

  // Automatically close whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleTopicClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">

      {/* =========================
          LOGO
      ========================= */}

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


      {/* =========================
          NAVIGATION
      ========================= */}

      <div className="menu">

        {/* HOME */}

        <Link
          to="/"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>


        {/* =========================
            AGENTIC AI DROPDOWN
        ========================= */}

        <div
          className="dropdown"
          ref={dropdownRef}
        >

          <button
            type="button"
            className={`dropdown-btn ${
              isOpen ? "open" : ""
            }`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            AgenticAI

            <span className="arrow">
              ▼
            </span>
          </button>


          {/* DROPDOWN */}

          {isOpen && (
            <div className="dropdown-content">

              {agenticAITopics.map((topic) => (
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


        {/* BOOKS */}

        <Link
          to="/books"
          onClick={() => setIsOpen(false)}
        >
          Books
        </Link>


        {/* ABOUT */}

        <Link
          to="/about"
          onClick={() => setIsOpen(false)}
        >
          About
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;
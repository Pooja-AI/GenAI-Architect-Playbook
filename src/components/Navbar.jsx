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
      name: "Top Questions",
      path: "/top-questions",
    },
    {
      name: "RAG",
      path: "/rag",
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
      name: "Agentic Scenario Based",
      path: "/agentic-scenario-based",
    },
    
   
    
  ];

  // =====================================================
  // CWD PROJECT
  // =====================================================

  // CWD PROJECT
const cwdTopics = [
  {
      name: "CWD Top Questions",
      path: "/cwd-top-questions",
    },

  { name: "01. Project Overview", path: "/cwd-project-overview" },

  // ---------- CWD Interview Question Cookbooks ----------

  { name: "Q02. Architecture", path: "/cwd-q-architecture-questions" },

  { name: "Q03. Coordinator Agent", path: "/cwd-q-coordinator-agent" },

  { name: "Q04. Delegator Architecture", path: "/cwd-q-delegator-architecture" },

  { name: "Q05. Worker Architecture", path: "/cwd-q-worker-architecture" },

  { name: "Q06. MCP Deep Interview", path: "/cwd-q-mcp-deep-interview" },

  { name: "Q07. A2A — Agent Communication", path: "/cwd-q-a2a-agent-communication" },

  { name: "Q08. LangGraph", path: "/cwd-q-langgraph" },

  { name: "Q09. RAG Architecture", path: "/cwd-q-rag-architecture" },

  { name: "Q10. LLM Architecture", path: "/cwd-q-llm-architecture" },

  { name: "Q11. Hallucination & Grounding", path: "/cwd-q-hallucination-and-grounding" },

  { name: "Q12. LLM Evaluation", path: "/cwd-q-llm-evaluation" },

  { name: "Q13. Security Architecture", path: "/cwd-q-security-architecture" },

  { name: "Q15. Observability", path: "/cwd-q-observability" },

  { name: "Q16. Reliability & Failure Handling", path: "/cwd-q-reliability-and-failure-handling" },

  { name: "Q17. Scalability", path: "/cwd-q-scalability" },

  { name: "Q18. Performance & Optimization", path: "/cwd-q-performance-and-optimization" },

  { name: "Q19. Cost Optimization", path: "/cwd-q-cost-optimization" },

  { name: "Q20. Data Architecture", path: "/cwd-q-data-architecture" },

  { name: "Q21. Enterprise Integration", path: "/cwd-q-enterprise-integration" },

  { name: "Q22. API & Backend Architecture", path: "/cwd-q-api-and-backend-architecture" },

  { name: "Q23. Production Deployment / DevOps", path: "/cwd-q-production-deployment-devops" },

  { name: "Q24. Testing", path: "/cwd-q-testing" },

  { name: "Q25. Troubleshooting Scenarios", path: "/cwd-q-troubleshooting-scenarios" },

  { name: "Q26. Agentic AI Design Questions", path: "/cwd-q-agentic-ai-design-questions" },

  { name: "Q27. Governance", path: "/cwd-q-governance" },

  { name: "Q28. Architecture Trade-Off Questions", path: "/cwd-q-architecture-trade-off-questions" },

  { name: "Q29. Senior/Principal Architect Questions", path: "/cwd-q-senior-principal-architect-questions" },

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



  const CloudTopics = [
    {
      name: "Cloud Top Questions",
      path: "/cloud-top-questions",
    },
    {
      name: "Azure",
      path: "/Azure",
    },
    {
      name: "AWS",
      path: "/AWS",
    },
    {
      name: "GCP",
      path: "/GCP",
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
            Cloud AI
        ================================================= */}

      <Dropdown
          name="Cloud & AI"
          topics={CloudTopics}
        />

      </div>

    </nav>
  );
}

export default Navbar;
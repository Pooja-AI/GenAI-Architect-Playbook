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

   
];



  // const CloudTopics = [
  //   {
  //     name: "Cloud Top Questions",
  //     path: "/cloud-top-questions",
  //   },
  //   {
  //     name: "Azure",
  //     path: "/Azure",
  //   },
  //   {
  //     name: "AWS",
  //     path: "/AWS",
  //   },
  //   {
  //     name: "GCP",
  //     path: "/GCP",
  //   },
  // ];

const AWSTopics = [
    {
      name: "AWS Architecture",
      path: "/aws-architecture",
    },
    {
      name: "Amazon Bedrock",
      path: "/aws-bedrock",
    },
    {
      name: "API Gateway",
      path: "/aws-api-gateway",
    },
    {
      name: "AWS Lambda",
      path: "/aws-lambda",
    },
    {
      name: "ECS / Fargate / EKS",
      path: "/aws-ecs-fargate-eks",
    },
    {
      name: "SQS & Asynchronous Processing",
      path: "/aws-sqs",
    },
    {
      name: "Step Functions",
      path: "/aws-step-functions",
    },
    {
      name: "DynamoDB",
      path: "/aws-dynamodb",
    },
    {
      name: "Amazon S3",
      path: "/aws-s3",
    },
    {
      name: "OpenSearch",
      path: "/aws-opensearch",
    },
    {
      name: "IAM & Security",
      path: "/aws-iam-security",
    },
    {
      name: "KMS & Secrets Manager",
      path: "/aws-kms-secrets",
    },
    {
      name: "VPC & Networking",
      path: "/aws-vpc-networking",
    },
    {
      name: "CloudWatch & Observability",
      path: "/aws-cloudwatch",
    },
    {
      name: "Scalability & High Availability",
      path: "/aws-scalability-ha",
    },
    {
      name: "AWS Cost Optimization",
      path: "/aws-cost-optimization",
    },
    {
      name: "AWS DevOps / Deployment",
      path: "/aws-devops",
    },
    {
      name: "AWS Glue",
      path: "/aws-glue",
    },
    {
      name: "Amazon SageMaker",
      path: "/aws-sagemaker",
    },
  ];


const AzureTopics = [
    {
      name: "Azure Architecture",
      path: "/azure-architecture",
    },
    {
      name: "Azure OpenAI",
      path: "/azure-openai",
    },
    {
      name: "Azure AI Foundry",
      path: "/azure-ai-foundry",
    },
    {
      name: "Azure AI Search",
      path: "/azure-ai-search",
    },
    {
      name: "Azure Data Factory / Data Integration",
      path: "/azure-data-factory",
    },
    {
      name: "Azure Databricks",
      path: "/azure-databricks",
    },
    {
      name: "Azure Machine Learning",
      path: "/azure-machine-learning",
    },
    {
      name: "Azure Functions",
      path: "/azure-functions",
    },
    {
      name: "Azure Container Apps / AKS",
      path: "/azure-container-apps",
    },
    {
      name: "Azure API Management",
      path: "/azure-api-management",
    },
    {
      name: "Azure Service Bus",
      path: "/azure-service-bus",
    },
    {
      name: "Cosmos DB",
      path: "/azure-cosmos-db",
    },
    {
      name: "Azure Cache for Redis",
      path: "/azure-redis",
    },
    {
      name: "Microsoft Entra ID",
      path: "/azure-entra-id",
    },
    {
      name: "Azure Key Vault",
      path: "/azure-key-vault",
    },
    {
      name: "Azure Networking",
      path: "/azure-networking",
    },
    {
      name: "Azure Monitor / Application Insights",
      path: "/azure-monitor",
    },
    {
      name: "Azure DevOps / CI/CD",
      path: "/azure-devops",
    },
  ];

  // =====================================================
  // DATA STRUCTURES INTERVIEW QUESTION COOKBOOKS
  // One "Concept" and one "Code" entry per topic
  // =====================================================

  const dsTopics = [
    {
      name: "01. Arrays / Lists — Concept",
      path: "/ds-arrays-lists-concept",
    },
    {
      name: "01. Arrays / Lists — Code",
      path: "/ds-arrays-lists-code",
    },
    {
      name: "02. Strings — Concept",
      path: "/ds-strings-concept",
    },
    {
      name: "02. Strings — Code",
      path: "/ds-strings-code",
    },
    {
      name: "03. Hash Table / Dictionary — Concept",
      path: "/ds-hash-table-dictionary-concept",
    },
    {
      name: "03. Hash Table / Dictionary — Code",
      path: "/ds-hash-table-dictionary-code",
    },
    {
      name: "04. Set — Concept",
      path: "/ds-set-concept",
    },
    {
      name: "04. Set — Code",
      path: "/ds-set-code",
    },
    {
      name: "05. Linked List — Concept",
      path: "/ds-linked-list-concept",
    },
    {
      name: "05. Linked List — Code",
      path: "/ds-linked-list-code",
    },
    {
      name: "06. Stack — Concept",
      path: "/ds-stack-concept",
    },
    {
      name: "06. Stack — Code",
      path: "/ds-stack-code",
    },
    {
      name: "07. Queue — Concept",
      path: "/ds-queue-concept",
    },
    {
      name: "07. Queue — Code",
      path: "/ds-queue-code",
    },
    {
      name: "08. Heap / Priority Queue — Concept",
      path: "/ds-heap-priority-queue-concept",
    },
    {
      name: "08. Heap / Priority Queue — Code",
      path: "/ds-heap-priority-queue-code",
    },
    {
      name: "09. Trees — Concept",
      path: "/ds-trees-concept",
    },
    {
      name: "09. Trees — Code",
      path: "/ds-trees-code",
    },
    {
      name: "10. Binary Search Tree (BST) — Concept",
      path: "/ds-binary-search-tree-bst-concept",
    },
    {
      name: "10. Binary Search Tree (BST) — Code",
      path: "/ds-binary-search-tree-bst-code",
    },
    {
      name: "11. Trie — Concept",
      path: "/ds-trie-concept",
    },
    {
      name: "11. Trie — Code",
      path: "/ds-trie-code",
    },
    {
      name: "12. Graphs — Concept",
      path: "/ds-graphs-concept",
    },
    {
      name: "12. Graphs — Code",
      path: "/ds-graphs-code",
    },
    {
      name: "13. Graph Algorithms — Concept",
      path: "/ds-graph-algorithms-concept",
    },
    {
      name: "14. Union-Find / Disjoint Set — Concept",
      path: "/ds-union-find-disjoint-set-concept",
    },
    {
      name: "14. Union-Find / Disjoint Set — Code",
      path: "/ds-union-find-disjoint-set-code",
    },
    {
      name: "15. Recursion — Concept",
      path: "/ds-recursion-concept",
    },
    {
      name: "15. Recursion — Code",
      path: "/ds-recursion-code",
    },
    {
      name: "16. Backtracking — Concept",
      path: "/ds-backtracking-concept",
    },
    {
      name: "16. Backtracking — Code",
      path: "/ds-backtracking-code",
    },
    {
      name: "17. Sorting — Concept",
      path: "/ds-sorting-concept",
    },
    {
      name: "17. Sorting — Code",
      path: "/ds-sorting-code",
    },
    {
      name: "18. Searching — Concept",
      path: "/ds-searching-concept",
    },
    {
      name: "18. Searching — Code",
      path: "/ds-searching-code",
    },
    {
      name: "19. Prefix Sum — Concept",
      path: "/ds-prefix-sum-concept",
    },
    {
      name: "19. Prefix Sum — Code",
      path: "/ds-prefix-sum-code",
    },
    {
      name: "20. Sliding Window — Concept",
      path: "/ds-sliding-window-concept",
    },
    {
      name: "20. Sliding Window — Code",
      path: "/ds-sliding-window-code",
    },
    {
      name: "21. Two Pointers — Concept",
      path: "/ds-two-pointers-concept",
    },
    {
      name: "21. Two Pointers — Code",
      path: "/ds-two-pointers-code",
    },
    {
      name: "22. Monotonic Stack / Queue — Concept",
      path: "/ds-monotonic-stack-queue-concept",
    },
    {
      name: "22. Monotonic Stack / Queue — Code",
      path: "/ds-monotonic-stack-queue-code",
    },
    {
      name: "23. Intervals — Concept",
      path: "/ds-intervals-concept",
    },
    {
      name: "23. Intervals — Code",
      path: "/ds-intervals-code",
    },
    {
      name: "24. Bit Manipulation — Concept",
      path: "/ds-bit-manipulation-concept",
    },
    {
      name: "24. Bit Manipulation — Code",
      path: "/ds-bit-manipulation-code",
    },
    {
      name: "25. Complexity & Analysis — Concept",
      path: "/ds-complexity-analysis-concept",
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
          name="AWS"
          topics={AWSTopics}
        />

      <Dropdown
          name="Azure"
          topics={AzureTopics}
        />

        {/* =================================================
            DATA STRUCTURES
        ================================================= */}

      <Dropdown
          name="Data Structures"
          topics={dsTopics}
        />

      </div>

    </nav>
  );
}

export default Navbar;

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

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
 
       
 
 
       </div>
 
     </nav>
   );
 }
 
 export default Navbar;
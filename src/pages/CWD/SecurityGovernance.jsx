import CookbookApp from "../../components/CookbookApp";

// =====================================================
// 15. SECURITY & GOVERNANCE
// =====================================================

const SecurityGovernance = [
  {
    id: "cwd-security",
    category: "Security & Governance",
    title: "Security & Governance",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise security and governance for CWD, including identity, authentication, authorization, agent and tool access, data protection, threat prevention, auditing, and compliance.",
   },
      {
        id: "zero-trust",
        category: "Security & Governance",
        title: "Zero Trust",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Zero Trust principles are applied to CWD by continuously validating identity, device or workload context, permissions, and access to agents, tools, data, and services.",
        concept: "",
        code: "",
      },

      {
        id: "entitlement-first-execution",
        category: "Security & Governance",
        title: "Entitlement-First Execution",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand why user entitlement and authorization must be validated before Coordinator, Delegator, Worker, MCP tool, or enterprise data-source execution.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-rbac",
        category: "Security & Governance",
        title: "RBAC",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand role-based access control for managing permissions across users, agents, administrators, tools, data sources, prompts, and platform operations.",
        concept: "",
        code: "",
      },

      {
        id: "entra-id",
        category: "Security & Governance",
        title: "Entra ID / Azure AD",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand enterprise identity management using Microsoft Entra ID for user authentication, application identities, groups, roles, access policies, and token-based authorization.",
        concept: "",
        code: "",
      },

      {
        id: "managed-identity",
        category: "Security & Governance",
        title: "Managed Identity",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand passwordless service-to-service authentication using managed identities so CWD components can securely access Azure resources without storing credentials in application code.",
        concept: "",
        code: "",
      },

      {
        id: "key-vault",
        category: "Security & Governance",
        title: "Key Vault",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand centralized management of secrets, keys, certificates, and sensitive configuration using Azure Key Vault with controlled application access.",
        concept: "",
        code: "",
      },

      {
        id: "least-privilege",
        category: "Security & Governance",
        title: "Least Privilege",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD applies least-privilege access so each agent, Worker, MCP tool, service, and user receives only the permissions required for its specific responsibilities.",
        concept: "",
        code: "",
      },

      {
        id: "dlp",
        category: "Security & Governance",
        title: "DLP",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand data-loss prevention controls for detecting, restricting, and monitoring sensitive information flowing through prompts, retrieved context, agent outputs, tools, and enterprise integrations.",
        concept: "",
        code: "",
      },

      {
        id: "data-redaction",
        category: "Security & Governance",
        title: "Data Redaction",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how sensitive information such as PII, credentials, confidential business data, and regulated content can be detected and redacted before logging, retrieval, or LLM processing.",
        concept: "",
        code: "",
      },

      {
        id: "data-classification",
        category: "Security & Governance",
        title: "Data Classification",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand enterprise data classification based on sensitivity, business impact, confidentiality, and regulatory requirements, and how classification influences retrieval and access policies.",
        concept: "",
        code: "",
      },

      {
        id: "audit-logging",
        category: "Security & Governance",
        title: "Audit Logging",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD captures auditable records of authentication, authorization, agent execution, tool calls, data access, configuration changes, approvals, and security events.",
        concept: "",
        code: "",
      },

      {
        id: "security-threat-modeling",
        category: "Security & Governance",
        title: "Security Threat Modeling",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand threat modeling for agentic systems, including prompt injection, tool misuse, privilege escalation, data exfiltration, insecure agent communication, compromised dependencies, and unauthorized data access.",
        concept: "",
        code: "",
      },
   
];

export default function SecurityGovernancePage() {
  return (
    <CookbookApp
      data={SecurityGovernance}
      title="Security & Governance Cookbook"
      subtitle="Identity, authorization, data protection, threat modeling and compliance"
      icon="🔐"
      patternLabel="Topics"
    />
  );
}


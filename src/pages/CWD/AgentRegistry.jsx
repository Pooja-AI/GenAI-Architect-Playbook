import CookbookApp from "../../components/CookbookApp";

const AgentRegistry = [
  // =====================================================
  // AGENT REGISTRY
  // =====================================================

  {
    id: "cwd-agent-registry",
    category: "Agent Registry",
    title: "Agent Registry",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand centralized agent registration, discovery, metadata, capabilities, ownership, health, access control, and dynamic routing.",

  },
      {
        id: "why-agent-registry",
        category: "Agent Registry",
        title: "Why Agent Registry?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why an enterprise multi-agent platform requires a centralized Agent Registry for managing and discovering agents.",
        concept: "",
        code: "",
      },

      {
        id: "agent-discovery",
        category: "Agent Registry",
        title: "Agent Discovery",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how agents discover other available agents based on capabilities, domains, and availability.",
        concept: "",
        code: "",
      },

      {
        id: "agent-metadata",
        category: "Agent Registry",
        title: "Agent Metadata",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the metadata maintained for registered agents, including identity, endpoint, version, owner, capabilities, and status.",
        concept: "",
        code: "",
      },

      {
        id: "agent-capabilities",
        category: "Agent Registry",
        title: "Agent Capabilities",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how agent capabilities are defined, registered, exposed, and used for intelligent agent selection.",
        concept: "",
        code: "",
      },

      {
        id: "domain-ownership",
        category: "Agent Registry",
        title: "Domain Ownership",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how business domains and responsibilities are mapped to specific agents and agent owners.",
        concept: "",
        code: "",
      },

      {
        id: "supported-tools",
        category: "Agent Registry",
        title: "Supported Tools",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how tools, APIs, MCP servers, and external capabilities supported by each agent are registered.",
        concept: "",
        code: "",
      },

      {
        id: "agent-access-scope",
        category: "Agent Registry",
        title: "Access Scope",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how authentication, authorization, roles, permissions, and access scopes are associated with registered agents.",
        concept: "",
        code: "",
      },

      {
        id: "agent-health-metadata",
        category: "Agent Registry",
        title: "Health Metadata",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how agent health, availability, readiness, version, and operational status are tracked in the registry.",
        concept: "",
        code: "",
      },

      {
        id: "dynamic-agent-routing",
        category: "Agent Registry",
        title: "Dynamic Agent Routing",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how registry information is used to dynamically select and route requests to the most appropriate available agent.",
        concept: "",
        code: "",
      },
   
];

export default function AgentRegistryPage() {
  return (
    <CookbookApp
      data={AgentRegistry}
      title="Agent Registry Cookbook"
      subtitle="Discovery, capabilities, governance and dynamic routing"
      icon="🗂️"
      patternLabel="Topics"
    />
  );
}
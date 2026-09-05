import CookbookApp from "../../components/CookbookApp";

const InfrastructureCloud = [
  // =====================================================
  // 19. INFRASTRUCTURE & CLOUD
  // =====================================================

  {
    id: "cwd-cloud",
    category: "Infrastructure & Cloud",
    title: "Infrastructure & Cloud",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the Azure infrastructure used to deploy, secure, scale, connect, and operate the CWD enterprise multi-agent platform, including compute, networking, messaging, secrets management, orchestration, and resource organization.",

  },
      {
        id: "azure-architecture",
        category: "Infrastructure & Cloud",
        title: "Azure Architecture",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the overall Azure architecture supporting CWD, including application services, agent workloads, networking, identity, data services, messaging, security controls, monitoring, and how these components work together in an enterprise deployment.",
        concept: "",
        code: "",
      },

      {
        id: "azure-container-apps",
        category: "Infrastructure & Cloud",
        title: "Azure Container Apps",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how containerized CWD services and agents can be deployed using Azure Container Apps, including scaling, revisions, service-to-service communication, ingress, workload isolation, and operational management.",
        concept: "",
        code: "",
      },

      {
        id: "aks",
        category: "Infrastructure & Cloud",
        title: "AKS",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Azure Kubernetes Service can be used for production-grade deployment of CWD agents and supporting services, including container orchestration, scaling, networking, service discovery, workload management, and high availability.",
        concept: "",
        code: "",
      },

      {
        id: "azure-functions",
        category: "Infrastructure & Cloud",
        title: "Azure Functions",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand how Azure Functions can support event-driven and serverless workloads within CWD, including lightweight processing, asynchronous tasks, integrations, scheduled operations, and event-triggered agent workflows.",
        concept: "",
        code: "",
      },

      {
        id: "durable-functions",
        category: "Infrastructure & Cloud",
        title: "Durable Functions",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Durable Functions can implement stateful serverless orchestration, including long-running workflows, checkpoints, retries, timers, fan-out/fan-in patterns, and recovery of distributed CWD operations.",
        concept: "",
        code: "",
      },

      {
        id: "private-vnet",
        category: "Infrastructure & Cloud",
        title: "Private VNet",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how a private Azure Virtual Network isolates CWD workloads and enables secure communication between agents, services, data stores, and enterprise resources without unnecessary exposure to the public internet.",
        concept: "",
        code: "",
      },

      {
        id: "private-endpoints",
        category: "Infrastructure & Cloud",
        title: "Private Endpoints",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how private endpoints provide private network connectivity to Azure services, helping CWD access data, AI, storage, messaging, and other cloud resources through private IP addresses and controlled network paths.",
        concept: "",
        code: "",
      },

      {
        id: "cloud-key-vault",
        category: "Infrastructure & Cloud",
        title: "Key Vault",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Azure Key Vault protects secrets, credentials, certificates, encryption keys, and connection information used by CWD services while supporting managed identities, access policies, rotation, and centralized secret management.",
        concept: "",
        code: "",
      },

      {
        id: "cloud-service-bus",
        category: "Infrastructure & Cloud",
        title: "Service Bus",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Azure Service Bus supports reliable asynchronous communication between CWD components using queues and topics, including decoupling, message delivery, retries, dead-letter handling, ordering, and workload buffering.",
        concept: "",
        code: "",
      },

      {
        id: "resource-groups",
        category: "Infrastructure & Cloud",
        title: "Azure Resource Groups",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand how Azure Resource Groups organize and manage CWD infrastructure resources, including lifecycle management, access control, environment separation, deployment organization, tagging, monitoring, and cost management.",
        concept: "",
        code: "",
      },
   
];

export default function InfrastructureCloudPage() {
  return (
    <CookbookApp
      data={InfrastructureCloud}
      title="Infrastructure & Cloud Cookbook"
      subtitle="Azure compute, networking, security, messaging and orchestration"
      icon="☁️"
      patternLabel="Topics"
    />
  );
}


import CookbookApp from "../components/CookbookApp";

import Scenario50ToolsSelection from "../assets/docs/scenario/scenario-50-tools-selection.md?raw";
import ScenarioAgentCostOptimization from "../assets/docs/scenario/scenario-agent-cost-optimization.md?raw";
import ScenarioAgentIncorrectInformation from "../assets/docs/scenario/scenario-agent-incorrect-information.md?raw";
import ScenarioAgentLatency from "../assets/docs/scenario/scenario-agent-latency.md?raw";
import ScenarioConfidentialHRInformation from "../assets/docs/scenario/scenario-confidential-hr-information.md?raw";
import ScenarioConflictingAgentAnswers from "../assets/docs/scenario/scenario-conflicting-agent-answers.md?raw";
import ScenarioDangerousMCPDeleteTool from "../assets/docs/scenario/scenario-dangerous-mcp-delete-tool.md?raw";
import ScenarioMultiagentCloudMigration from "../assets/docs/scenario/scenario-multiagent-cloud-migration.md?raw";
import ScenarioCWDMulticloudDesign from "../assets/docs/scenario/scenario-cwd-multicloud-design.md?raw";
import ScenarioRAGIncorrectDocuments from "../assets/docs/scenario/scenario-rag-incorrect-documents.md?raw";
import ScenarioRepeatedToolCalls from "../assets/docs/scenario/scenario-repeated-tool-calls.md?raw";
import ScenarioWorkerAgentDown from "../assets/docs/scenario/scenario-worker-agent-down.md?raw";
import CWD from "../assets/docs/scenario/CWD.md?raw";



const AgenticScenarioBasedQuestion = 
[
  {
    id: "scenario-repeated-tool-calls",
    category: "Agentic AI Troubleshooting",
    title: "Your agent keeps calling the same tool repeatedly. How would you fix it?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Diagnose repeated tool execution using loop detection, state tracking, iteration limits, tool-result validation, termination conditions, idempotency, retry policies, prompt improvements, and workflow-level controls.",
    concept: ScenarioRepeatedToolCalls,
    code: ""
  },

  {
    id: "scenario-agent-incorrect-information",
    category: "Multi-Agent Reliability",
    title: "Agent A gives incorrect information to Agent B. How do you detect and prevent this?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Design mechanisms for validating inter-agent information using source attribution, schema validation, confidence scoring, groundedness checks, evaluator agents, independent verification, provenance tracking, and trust policies.",
    concept: ScenarioAgentIncorrectInformation,
    code: ""
  },

  {
    id: "scenario-50-tools-selection",
    category: "Agent Tool Management",
    title: "Your agent has access to 50 tools. Tool selection accuracy is poor. What would you do?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Improve tool selection using tool categorization, hierarchical routing, tool metadata, capability-based discovery, semantic tool retrieval, tool descriptions, constrained tool lists, specialized agents, and tool-selection evaluation.",
    concept: Scenario50ToolsSelection,
    code: ""
  },

  {
    id: "scenario-agent-cost-optimization",
    category: "Agentic AI FinOps",
    title: "Your agent costs $2 per request. Business wants it below $0.20. How do you optimize it?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Reduce agent cost through model routing, smaller models, prompt optimization, context reduction, caching, retrieval optimization, fewer agent iterations, reduced tool calls, batching, token limits, and cost-aware execution policies.",
    concept: ScenarioAgentCostOptimization,
    code: ""
  },

  {
    id: "scenario-agent-latency",
    category: "Agentic AI Performance",
    title: "Agent latency is 20 seconds. Business requires less than 5 seconds. What would you change?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Troubleshoot end-to-end latency by tracing LLM calls, retrieval, tool execution, agent loops, network calls, and orchestration, then optimize through parallel execution, streaming, caching, faster models, reduced context, and asynchronous processing.",
    concept: ScenarioAgentLatency,
    code: ""
  },

  {
    id: "scenario-rag-incorrect-documents",
    category: "Agentic RAG Troubleshooting",
    title: "Your RAG agent retrieves incorrect documents. How do you troubleshoot?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Troubleshoot retrieval quality across ingestion, document parsing, chunking, embeddings, metadata, indexing, query transformation, vector search, hybrid search, filtering, reranking, and retrieval evaluation.",
    concept: ScenarioRAGIncorrectDocuments,
    code: ""
  },

  {
    id: "scenario-confidential-hr-information",
    category: "Agentic AI Security",
    title: "An employee tries to get confidential HR information through an agent. How do you prevent it?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Design authorization and data protection controls using identity-aware access, RBAC or ABAC, document-level security, metadata filtering, tenant isolation, data classification, retrieval authorization, DLP, output filtering, and audit logging.",
    concept: ScenarioConfidentialHRInformation,
    code: ""
  },

  {
    id: "scenario-dangerous-mcp-delete-tool",
    category: "MCP Security",
    title: "An MCP tool can delete records. How do you safely expose it to an agent?",
    difficulty: "Expert",
    time: "~25 min",
    description:
      "Secure destructive MCP operations using least privilege, explicit authorization, scoped permissions, allowlists, input validation, dry-run mode, confirmation workflows, human approval, idempotency, audit logging, and rollback or recovery mechanisms.",
    concept: ScenarioDangerousMCPDeleteTool,
    code: ""
  },

  {
    id: "scenario-worker-agent-down",
    category: "Multi-Agent Reliability",
    title: "One worker agent goes down in a multi-agent system. What happens?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Design failure handling using health checks, timeouts, retries, circuit breakers, task reassignment, fallback agents, queues, checkpointing, state recovery, graceful degradation, and coordinator-level failure management.",
    concept: ScenarioWorkerAgentDown,
    code: ""
  },

  {
    id: "scenario-conflicting-agent-answers",
    category: "Multi-Agent Decision Making",
    title: "Two agents produce conflicting answers. Which answer should the coordinator choose?",
    difficulty: "Expert",
    time: "~20 min",
    description:
      "Design conflict-resolution strategies using source authority, confidence scores, evidence quality, agent specialization, independent verification, evaluator agents, voting, deterministic business rules, recency, and human escalation for high-risk decisions.",
    concept: ScenarioConflictingAgentAnswers,
    code: ""
  },

{
  id: "scenario-multiagent-cloud-migration",
  category: "Multi-Agent Decision Making",
  title: "Migrating a multi-agent system between cloud-native environments — what breaks first?",
  difficulty: "Expert",
  time: "~20 min",
  description:
    "Design a migration strategy for moving a multi-agent system across cloud-native environments (e.g., Kubernetes clusters, cloud providers, or regions): containerizing agent workers, moving secrets/config via K8s ConfigMaps/Secrets or a vault, re-pointing service meshes and API gateways, migrating vector DBs and agent memory stores, and validating that autoscaling and networking policies don't throttle agent-to-agent calls post-migration.",
  concept: ScenarioMultiagentCloudMigration,
  code: ""
},

{
  id: "scenario-cwd-multicloud-design",
  category: "Multi-Agent Decision Making",
  title: "How would you design container workload deployment (CWD) for multi-cloud?",
  difficulty: "Expert",
  time: "~20 min",
  description:
    "Design a container workload deployment strategy for a multi-agent system spanning multiple cloud providers: a common container runtime/orchestration layer (e.g., Kubernetes) abstracted from provider-specific services, a unified CI/CD pipeline that builds once and deploys everywhere, cluster federation or GitOps (e.g., ArgoCD/Flux) for syncing manifests across clouds, provider-agnostic secrets/config management, cross-cloud service discovery for agent-to-agent calls, and failover/traffic-routing rules when one cloud's region degrades.",
  concept: ScenarioCWDMulticloudDesign,
  code: ""
},
{
  id: "CWD",
  category: "Multi-Agent Decision Making",
  title: "CWD Design",
  difficulty: "Expert",
  time: "~20 min",
  description:
    "Design a container workload deployment strategy for a multi-agent system spanning multiple cloud providers: a common container runtime/orchestration layer (e.g., Kubernetes) abstracted from provider-specific services, a unified CI/CD pipeline that builds once and deploys everywhere, cluster federation or GitOps (e.g., ArgoCD/Flux) for syncing manifests across clouds, provider-agnostic secrets/config management, cross-cloud service discovery for agent-to-agent calls, and failover/traffic-routing rules when one cloud's region degrades.",
  concept: CWD,
  code: ""
}
];

export default function CWDPage() {
  return (
    <CookbookApp
      data={AgenticScenarioBasedQuestion}
      title="AgenticScenarioBasedQuestion Cookbook"
      subtitle="Complete Workflow Design"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}
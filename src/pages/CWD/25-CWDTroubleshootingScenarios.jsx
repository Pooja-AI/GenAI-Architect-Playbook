import CookbookApp from "../../components/CookbookApp";
import Q512 from "../../assets/CWD/docs/25-troubleshooting-scenarios/512-scenario-01-user-request-takes-30-seconds-instead-of-5-seconds-how-do-you-troubleshoot.md?raw";
import Q513 from "../../assets/CWD/docs/25-troubleshooting-scenarios/513-scenario-02-salesforce-worker-takes-10-seconds-what-do-you-investigate.md?raw";
import Q514 from "../../assets/CWD/docs/25-troubleshooting-scenarios/514-scenario-03-llm-latency-suddenly-increases.md?raw";
import Q515 from "../../assets/CWD/docs/25-troubleshooting-scenarios/515-scenario-04-token-consumption-doubled-after-a-release.md?raw";
import Q516 from "../../assets/CWD/docs/25-troubleshooting-scenarios/516-scenario-05-rag-returns-irrelevant-documents.md?raw";
import Q517 from "../../assets/CWD/docs/25-troubleshooting-scenarios/517-scenario-06-correct-documents-are-retrieved-but-the-llm-gives-an-incorrect-answer.md?raw";
import Q518 from "../../assets/CWD/docs/25-troubleshooting-scenarios/518-scenario-07-coordinator-selects-the-wrong-delegator.md?raw";
import Q519 from "../../assets/CWD/docs/25-troubleshooting-scenarios/519-scenario-08-delegator-selects-the-wrong-worker.md?raw";
import Q520 from "../../assets/CWD/docs/25-troubleshooting-scenarios/520-scenario-09-worker-calls-the-wrong-mcp-tool.md?raw";
import Q521 from "../../assets/CWD/docs/25-troubleshooting-scenarios/521-scenario-10-mcp-tool-succeeds-but-worker-reports-failure.md?raw";
import Q522 from "../../assets/CWD/docs/25-troubleshooting-scenarios/522-scenario-11-worker-succeeds-but-delegator-doesn-t-receive-the-result.md?raw";
import Q523 from "../../assets/CWD/docs/25-troubleshooting-scenarios/523-scenario-12-two-workers-return-conflicting-customer-information.md?raw";
import Q524 from "../../assets/CWD/docs/25-troubleshooting-scenarios/524-scenario-13-worker-1-and-worker-2-succeed-worker-3-fails.md?raw";
import Q525 from "../../assets/CWD/docs/25-troubleshooting-scenarios/525-scenario-14-user-submits-the-same-request-twice.md?raw";
import Q526 from "../../assets/CWD/docs/25-troubleshooting-scenarios/526-scenario-15-a-malicious-user-asks-cwd-to-retrieve-another-employee-s-confidential-data.md?raw";
import Q527 from "../../assets/CWD/docs/25-troubleshooting-scenarios/527-scenario-16-prompt-injection-appears-inside-a-retrieved-document.md?raw";
import Q528 from "../../assets/CWD/docs/25-troubleshooting-scenarios/528-scenario-17-one-tenant-generates-extremely-high-traffic.md?raw";
import Q529 from "../../assets/CWD/docs/25-troubleshooting-scenarios/529-scenario-18-llm-provider-becomes-unavailable.md?raw";
import Q530 from "../../assets/CWD/docs/25-troubleshooting-scenarios/530-scenario-19-azure-ai-search-becomes-unavailable.md?raw";
import Q531 from "../../assets/CWD/docs/25-troubleshooting-scenarios/531-scenario-20-production-evaluation-score-suddenly-drops-after-a-model-upgrade.md?raw";

const CWDTroubleshootingScenarios = [
  // =====================================================
  // 25. TROUBLESHOOTING SCENARIOS
  // =====================================================

  {
    id: "512-scenario-01-user-request-takes-30-seconds-instead-of-5-seconds-how-do-you-troubleshoot",
    category: "Troubleshooting Scenarios",
    title: "Scenario 1: User request takes 30 seconds instead of 5 seconds. How do you troubleshoot?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q512,
    code: "",
  },

  {
    id: "513-scenario-02-salesforce-worker-takes-10-seconds-what-do-you-investigate",
    category: "Troubleshooting Scenarios",
    title: "Scenario 2: Salesforce Worker takes 10 seconds. What do you investigate?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q513,
    code: "",
  },

  {
    id: "514-scenario-03-llm-latency-suddenly-increases",
    category: "Troubleshooting Scenarios",
    title: "Scenario 3: LLM latency suddenly increases.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q514,
    code: "",
  },

  {
    id: "515-scenario-04-token-consumption-doubled-after-a-release",
    category: "Troubleshooting Scenarios",
    title: "Scenario 4: Token consumption doubled after a release.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q515,
    code: "",
  },

  {
    id: "516-scenario-05-rag-returns-irrelevant-documents",
    category: "Troubleshooting Scenarios",
    title: "Scenario 5: RAG returns irrelevant documents.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q516,
    code: "",
  },

  {
    id: "517-scenario-06-correct-documents-are-retrieved-but-the-llm-gives-an-incorrect-answer",
    category: "Troubleshooting Scenarios",
    title: "Scenario 6: Correct documents are retrieved but the LLM gives an incorrect answer.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q517,
    code: "",
  },

  {
    id: "518-scenario-07-coordinator-selects-the-wrong-delegator",
    category: "Troubleshooting Scenarios",
    title: "Scenario 7: Coordinator selects the wrong Delegator.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q518,
    code: "",
  },

  {
    id: "519-scenario-08-delegator-selects-the-wrong-worker",
    category: "Troubleshooting Scenarios",
    title: "Scenario 8: Delegator selects the wrong Worker.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q519,
    code: "",
  },

  {
    id: "520-scenario-09-worker-calls-the-wrong-mcp-tool",
    category: "Troubleshooting Scenarios",
    title: "Scenario 9: Worker calls the wrong MCP tool.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q520,
    code: "",
  },

  {
    id: "521-scenario-10-mcp-tool-succeeds-but-worker-reports-failure",
    category: "Troubleshooting Scenarios",
    title: "Scenario 10: MCP tool succeeds but Worker reports failure.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q521,
    code: "",
  },

  {
    id: "522-scenario-11-worker-succeeds-but-delegator-doesn-t-receive-the-result",
    category: "Troubleshooting Scenarios",
    title: "Scenario 11: Worker succeeds but Delegator doesn't receive the result.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q522,
    code: "",
  },

  {
    id: "523-scenario-12-two-workers-return-conflicting-customer-information",
    category: "Troubleshooting Scenarios",
    title: "Scenario 12: Two Workers return conflicting customer information.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q523,
    code: "",
  },

  {
    id: "524-scenario-13-worker-1-and-worker-2-succeed-worker-3-fails",
    category: "Troubleshooting Scenarios",
    title: "Scenario 13: Worker 1 and Worker 2 succeed, Worker 3 fails.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q524,
    code: "",
  },

  {
    id: "525-scenario-14-user-submits-the-same-request-twice",
    category: "Troubleshooting Scenarios",
    title: "Scenario 14: User submits the same request twice.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q525,
    code: "",
  },

  {
    id: "526-scenario-15-a-malicious-user-asks-cwd-to-retrieve-another-employee-s-confidential-data",
    category: "Troubleshooting Scenarios",
    title: "Scenario 15: A malicious user asks CWD to retrieve another employee's confidential data.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q526,
    code: "",
  },

  {
    id: "527-scenario-16-prompt-injection-appears-inside-a-retrieved-document",
    category: "Troubleshooting Scenarios",
    title: "Scenario 16: Prompt injection appears inside a retrieved document.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q527,
    code: "",
  },

  {
    id: "528-scenario-17-one-tenant-generates-extremely-high-traffic",
    category: "Troubleshooting Scenarios",
    title: "Scenario 17: One tenant generates extremely high traffic.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q528,
    code: "",
  },

  {
    id: "529-scenario-18-llm-provider-becomes-unavailable",
    category: "Troubleshooting Scenarios",
    title: "Scenario 18: LLM provider becomes unavailable.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q529,
    code: "",
  },

  {
    id: "530-scenario-19-azure-ai-search-becomes-unavailable",
    category: "Troubleshooting Scenarios",
    title: "Scenario 19: Azure AI Search becomes unavailable.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q530,
    code: "",
  },

  {
    id: "531-scenario-20-production-evaluation-score-suddenly-drops-after-a-model-upgrade",
    category: "Troubleshooting Scenarios",
    title: "Scenario 20: Production evaluation score suddenly drops after a model upgrade.",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: latency, retrieval, routing, failure and security incident scenarios.",
    concept: Q531,
    code: "",
  },

];

export default function CWDTroubleshootingScenariosPage() {
  return (
    <CookbookApp
      data={CWDTroubleshootingScenarios}
      title="CWD Troubleshooting Scenarios Cookbook"
      subtitle="Latency, retrieval, routing, failure and security incident scenarios"
      icon="🛠️"
      patternLabel="Questions"
    />
  );
}

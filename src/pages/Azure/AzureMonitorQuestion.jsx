import CookbookApp from "../../components/CookbookApp";

import Q234 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/234-how-do-you-implement-observability-in-cwd.md?raw";
import Q235 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/235-what-azure-monitor-metrics-would-you-track.md?raw";
import Q236 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/236-what-would-you-log.md?raw";
import Q237 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/237-how-would-you-trace-a-request-across-coordinator-delegator-worker.md?raw";
import Q238 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/238-how-would-you-implement-correlation-ids.md?raw";
import Q239 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/239-how-would-you-monitor-azure-openai.md?raw";
import Q240 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/240-how-would-you-monitor-apim.md?raw";
import Q241 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/241-how-would-you-monitor-functions.md?raw";
import Q242 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/242-how-would-you-monitor-aks-container-apps.md?raw";
import Q243 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/243-how-would-you-monitor-service-bus.md?raw";
import Q244 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/244-how-would-you-monitor-azure-ai-search.md?raw";
import Q245 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/245-how-would-you-detect-latency-problems.md?raw";
import Q246 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/246-how-would-you-detect-agent-failures.md?raw";
import Q247 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/247-how-would-you-create-alerts.md?raw";
import Q248 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/248-application-insights-vs-azure-monitor.md?raw";
import Q249 from "../../assets/docs/azure-interview-questions/17-azure-monitor-application-insights/249-how-would-you-troubleshoot-a-production-incident.md?raw";

const AzureMonitorQuestion = [
  {
    id: "234-how-do-you-implement-observability-in-cwd",
    category: "Azure Monitor / Application Insights",
    title: "How do you implement observability in CWD?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q234,
    code: "",
  },

  {
    id: "235-what-azure-monitor-metrics-would-you-track",
    category: "Azure Monitor / Application Insights",
    title: "What Azure Monitor metrics would you track?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q235,
    code: "",
  },

  {
    id: "236-what-would-you-log",
    category: "Azure Monitor / Application Insights",
    title: "What would you log?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q236,
    code: "",
  },

  {
    id: "237-how-would-you-trace-a-request-across-coordinator-delegator-worker",
    category: "Azure Monitor / Application Insights",
    title: "How would you trace a request across Coordinator → Delegator → Worker?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q237,
    code: "",
  },

  {
    id: "238-how-would-you-implement-correlation-ids",
    category: "Azure Monitor / Application Insights",
    title: "How would you implement correlation IDs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q238,
    code: "",
  },

  {
    id: "239-how-would-you-monitor-azure-openai",
    category: "Azure Monitor / Application Insights",
    title: "How would you monitor Azure OpenAI?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q239,
    code: "",
  },

  {
    id: "240-how-would-you-monitor-apim",
    category: "Azure Monitor / Application Insights",
    title: "How would you monitor APIM?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q240,
    code: "",
  },

  {
    id: "241-how-would-you-monitor-functions",
    category: "Azure Monitor / Application Insights",
    title: "How would you monitor Functions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q241,
    code: "",
  },

  {
    id: "242-how-would-you-monitor-aks-container-apps",
    category: "Azure Monitor / Application Insights",
    title: "How would you monitor AKS/Container Apps?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q242,
    code: "",
  },

  {
    id: "243-how-would-you-monitor-service-bus",
    category: "Azure Monitor / Application Insights",
    title: "How would you monitor Service Bus?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q243,
    code: "",
  },

  {
    id: "244-how-would-you-monitor-azure-ai-search",
    category: "Azure Monitor / Application Insights",
    title: "How would you monitor Azure AI Search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q244,
    code: "",
  },

  {
    id: "245-how-would-you-detect-latency-problems",
    category: "Azure Monitor / Application Insights",
    title: "How would you detect latency problems?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q245,
    code: "",
  },

  {
    id: "246-how-would-you-detect-agent-failures",
    category: "Azure Monitor / Application Insights",
    title: "How would you detect agent failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q246,
    code: "",
  },

  {
    id: "247-how-would-you-create-alerts",
    category: "Azure Monitor / Application Insights",
    title: "How would you create alerts?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q247,
    code: "",
  },

  {
    id: "248-application-insights-vs-azure-monitor",
    category: "Azure Monitor / Application Insights",
    title: "Application Insights vs Azure Monitor?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q248,
    code: "",
  },

  {
    id: "249-how-would-you-troubleshoot-a-production-incident",
    category: "Azure Monitor / Application Insights",
    title: "How would you troubleshoot a production incident?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q249,
    code: "",
  },

];

export default function AzureMonitorQuestionPage() {
  return (
    <CookbookApp
      data={AzureMonitorQuestion}
      title="Azure Monitor / Application Insights Cookbook"
      subtitle="Tracing, correlation IDs, metrics, alerts and incident troubleshooting"
      icon="📡"
      patternLabel="Questions"
    />
  );
}

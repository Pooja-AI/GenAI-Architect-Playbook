import CookbookApp from "../../components/CookbookApp";
import Q389 from "../../assets/CWD/docs/17-scalability/389-how-many-concurrent-users-can-cwd-support.md?raw";
import Q390 from "../../assets/CWD/docs/17-scalability/390-what-is-the-bottleneck.md?raw";
import Q391 from "../../assets/CWD/docs/17-scalability/391-how-would-you-scale-coordinator.md?raw";
import Q392 from "../../assets/CWD/docs/17-scalability/392-how-would-you-scale-delegators.md?raw";
import Q393 from "../../assets/CWD/docs/17-scalability/393-how-would-you-scale-workers.md?raw";
import Q394 from "../../assets/CWD/docs/17-scalability/394-how-would-you-scale-mcp-servers.md?raw";
import Q395 from "../../assets/CWD/docs/17-scalability/395-how-would-you-scale-vector-search.md?raw";
import Q396 from "../../assets/CWD/docs/17-scalability/396-how-would-you-scale-llm-calls.md?raw";
import Q397 from "../../assets/CWD/docs/17-scalability/397-how-would-you-handle-sudden-traffic-spikes.md?raw";
import Q398 from "../../assets/CWD/docs/17-scalability/398-where-would-you-use-autoscaling.md?raw";
import Q399 from "../../assets/CWD/docs/17-scalability/399-how-would-you-implement-backpressure.md?raw";
import Q400 from "../../assets/CWD/docs/17-scalability/400-how-would-you-implement-rate-limiting.md?raw";
import Q401 from "../../assets/CWD/docs/17-scalability/401-how-would-you-prevent-one-customer-from-consuming-all-resources.md?raw";
import Q402 from "../../assets/CWD/docs/17-scalability/402-how-would-you-implement-tenant-level-quotas.md?raw";
import Q403 from "../../assets/CWD/docs/17-scalability/403-how-would-you-design-multi-region.md?raw";
import Q404 from "../../assets/CWD/docs/17-scalability/404-how-would-you-design-disaster-recovery.md?raw";
import Q405 from "../../assets/CWD/docs/17-scalability/405-what-is-rto.md?raw";
import Q406 from "../../assets/CWD/docs/17-scalability/406-what-is-rpo.md?raw";

const CWDScalability = [
  // =====================================================
  // 17. SCALABILITY
  // =====================================================

  {
    id: "389-how-many-concurrent-users-can-cwd-support",
    category: "Scalability",
    title: "How many concurrent users can CWD support?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q389,
    code: "",
  },

  {
    id: "390-what-is-the-bottleneck",
    category: "Scalability",
    title: "What is the bottleneck?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q390,
    code: "",
  },

  {
    id: "391-how-would-you-scale-coordinator",
    category: "Scalability",
    title: "How would you scale Coordinator?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q391,
    code: "",
  },

  {
    id: "392-how-would-you-scale-delegators",
    category: "Scalability",
    title: "How would you scale Delegators?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q392,
    code: "",
  },

  {
    id: "393-how-would-you-scale-workers",
    category: "Scalability",
    title: "How would you scale Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q393,
    code: "",
  },

  {
    id: "394-how-would-you-scale-mcp-servers",
    category: "Scalability",
    title: "How would you scale MCP servers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q394,
    code: "",
  },

  {
    id: "395-how-would-you-scale-vector-search",
    category: "Scalability",
    title: "How would you scale vector search?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q395,
    code: "",
  },

  {
    id: "396-how-would-you-scale-llm-calls",
    category: "Scalability",
    title: "How would you scale LLM calls?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q396,
    code: "",
  },

  {
    id: "397-how-would-you-handle-sudden-traffic-spikes",
    category: "Scalability",
    title: "How would you handle sudden traffic spikes?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q397,
    code: "",
  },

  {
    id: "398-where-would-you-use-autoscaling",
    category: "Scalability",
    title: "Where would you use autoscaling?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q398,
    code: "",
  },

  {
    id: "399-how-would-you-implement-backpressure",
    category: "Scalability",
    title: "How would you implement backpressure?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q399,
    code: "",
  },

  {
    id: "400-how-would-you-implement-rate-limiting",
    category: "Scalability",
    title: "How would you implement rate limiting?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q400,
    code: "",
  },

  {
    id: "401-how-would-you-prevent-one-customer-from-consuming-all-resources",
    category: "Scalability",
    title: "How would you prevent one customer from consuming all resources?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q401,
    code: "",
  },

  {
    id: "402-how-would-you-implement-tenant-level-quotas",
    category: "Scalability",
    title: "How would you implement tenant-level quotas?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q402,
    code: "",
  },

  {
    id: "403-how-would-you-design-multi-region",
    category: "Scalability",
    title: "How would you design multi-region?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q403,
    code: "",
  },

  {
    id: "404-how-would-you-design-disaster-recovery",
    category: "Scalability",
    title: "How would you design disaster recovery?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q404,
    code: "",
  },

  {
    id: "405-what-is-rto",
    category: "Scalability",
    title: "What is RTO?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q405,
    code: "",
  },

  {
    id: "406-what-is-rpo",
    category: "Scalability",
    title: "What is RPO?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: scaling, backpressure, quotas, multi-region and disaster recovery.",
    concept: Q406,
    code: "",
  },

];

export default function CWDScalabilityPage() {
  return (
    <CookbookApp
      data={CWDScalability}
      title="CWD Scalability Cookbook"
      subtitle="Scaling, backpressure, quotas, multi-region and disaster recovery"
      icon="📈"
      patternLabel="Questions"
    />
  );
}

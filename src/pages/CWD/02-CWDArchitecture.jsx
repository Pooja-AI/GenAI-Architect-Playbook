import CookbookApp from "../../components/CookbookApp";
import Q25 from "../../assets/CWD/docs/02-architecture-questions/25-what-makes-cwd-enterprise-architecture-not-simple-chatbot.md?raw";
import Q26 from "../../assets/CWD/docs/02-architecture-questions/26-major-architectural-trade-offs.md?raw";
import Q27 from "../../assets/CWD/docs/02-architecture-questions/27-biggest-risks-in-this-architecture.md?raw";
import Q28 from "../../assets/CWD/docs/02-architecture-questions/28-architectural-decisions-i-personally-made.md?raw";
import Q29 from "../../assets/CWD/docs/02-architecture-questions/29-synchronous-components.md?raw";
import Q30 from "../../assets/CWD/docs/02-architecture-questions/30-asynchronous-components.md?raw";
import Q31 from "../../assets/CWD/docs/02-architecture-questions/31-where-to-introduce-queues.md?raw";
import Q32 from "../../assets/CWD/docs/02-architecture-questions/32-where-to-introduce-caching.md?raw";
import Q33 from "../../assets/CWD/docs/02-architecture-questions/33-where-to-introduce-persistence.md?raw";
import Q34 from "../../assets/CWD/docs/02-architecture-questions/34-single-points-of-failure.md?raw";
import Q35 from "../../assets/CWD/docs/02-architecture-questions/35-how-to-remove-single-points-of-failure.md?raw";

const CWDArchitecture = [
  // =====================================================
  // 02. ARCHITECTURE
  // =====================================================

  {
    id: "25-what-makes-cwd-enterprise-architecture-not-simple-chatbot",
    category: "Architecture",
    title: "What makes CWD an enterprise architecture rather than a simple chatbot?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q25,
    code: "",
  },

  {
    id: "26-major-architectural-trade-offs",
    category: "Architecture",
    title: "What are the major architectural trade-offs?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q26,
    code: "",
  },

  {
    id: "27-biggest-risks-in-this-architecture",
    category: "Architecture",
    title: "What are the biggest risks in this architecture?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q27,
    code: "",
  },

  {
    id: "28-architectural-decisions-i-personally-made",
    category: "Architecture",
    title: "What architectural decisions did you personally make?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q28,
    code: "",
  },

  {
    id: "29-synchronous-components",
    category: "Architecture",
    title: "Which components are synchronous?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q29,
    code: "",
  },

  {
    id: "30-asynchronous-components",
    category: "Architecture",
    title: "Which components are asynchronous?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q30,
    code: "",
  },

  {
    id: "31-where-to-introduce-queues",
    category: "Architecture",
    title: "Where would you introduce queues?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q31,
    code: "",
  },

  {
    id: "32-where-to-introduce-caching",
    category: "Architecture",
    title: "Where would you introduce caching?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q32,
    code: "",
  },

  {
    id: "33-where-to-introduce-persistence",
    category: "Architecture",
    title: "Where would you introduce persistence?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q33,
    code: "",
  },

  {
    id: "34-single-points-of-failure",
    category: "Architecture",
    title: "What are the single points of failure?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q34,
    code: "",
  },

  {
    id: "35-how-to-remove-single-points-of-failure",
    category: "Architecture",
    title: "How would you remove those single points of failure?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: enterprise architecture, trade-offs, risks and failure points.",
    concept: Q35,
    code: "",
  },

];

export default function CWDArchitecturePage() {
  return (
    <CookbookApp
      data={CWDArchitecture}
      title="CWD Architecture Cookbook"
      subtitle="Enterprise architecture, trade-offs, risks and failure points"
      icon="🧭"
      patternLabel="Questions"
    />
  );
}

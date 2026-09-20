import CookbookApp from "../../components/CookbookApp";

import Q1 from "../../assets/docs/azure-interview-questions/01-azure-architecture/001-explain-the-complete-azure-architecture-for-cwd.md?raw";
import Q2 from "../../assets/docs/azure-interview-questions/01-azure-architecture/002-which-azure-services-did-you-use-and-why.md?raw";
import Q3 from "../../assets/docs/azure-interview-questions/01-azure-architecture/003-explain-the-end-to-end-request-flow-in-azure.md?raw";
import Q4 from "../../assets/docs/azure-interview-questions/01-azure-architecture/004-why-did-you-choose-azure-for-cwd.md?raw";
import Q5 from "../../assets/docs/azure-interview-questions/01-azure-architecture/005-which-components-run-on-azure.md?raw";
import Q6 from "../../assets/docs/azure-interview-questions/01-azure-architecture/006-which-components-are-synchronous.md?raw";
import Q7 from "../../assets/docs/azure-interview-questions/01-azure-architecture/007-which-components-are-asynchronous.md?raw";
import Q8 from "../../assets/docs/azure-interview-questions/01-azure-architecture/008-where-would-you-introduce-queues.md?raw";
import Q9 from "../../assets/docs/azure-interview-questions/01-azure-architecture/009-where-would-you-introduce-caching.md?raw";
import Q10 from "../../assets/docs/azure-interview-questions/01-azure-architecture/010-where-would-you-introduce-persistence.md?raw";
import Q11 from "../../assets/docs/azure-interview-questions/01-azure-architecture/011-what-are-the-single-points-of-failure.md?raw";
import Q12 from "../../assets/docs/azure-interview-questions/01-azure-architecture/012-how-would-you-eliminate-the-single-points-of-failure.md?raw";
import Q13 from "../../assets/docs/azure-interview-questions/01-azure-architecture/013-how-would-you-design-cwd-for-10-000-concurrent-users.md?raw";
import Q14 from "../../assets/docs/azure-interview-questions/01-azure-architecture/014-how-would-you-design-cwd-for-multi-region-deployment.md?raw";
import Q15 from "../../assets/docs/azure-interview-questions/01-azure-architecture/015-what-architectural-trade-offs-did-you-make.md?raw";

const AzureArchitectureQuestion = [
  {
    id: "001-explain-the-complete-azure-architecture-for-cwd",
    category: "Azure Architecture",
    title: "Explain the complete Azure architecture for CWD.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q1,
    code: "",
  },

  {
    id: "002-which-azure-services-did-you-use-and-why",
    category: "Azure Architecture",
    title: "Which Azure services did you use and why?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q2,
    code: "",
  },

  {
    id: "003-explain-the-end-to-end-request-flow-in-azure",
    category: "Azure Architecture",
    title: "Explain the end-to-end request flow in Azure.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q3,
    code: "",
  },

  {
    id: "004-why-did-you-choose-azure-for-cwd",
    category: "Azure Architecture",
    title: "Why did you choose Azure for CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q4,
    code: "",
  },

  {
    id: "005-which-components-run-on-azure",
    category: "Azure Architecture",
    title: "Which components run on Azure?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q5,
    code: "",
  },

  {
    id: "006-which-components-are-synchronous",
    category: "Azure Architecture",
    title: "Which components are synchronous?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q6,
    code: "",
  },

  {
    id: "007-which-components-are-asynchronous",
    category: "Azure Architecture",
    title: "Which components are asynchronous?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q7,
    code: "",
  },

  {
    id: "008-where-would-you-introduce-queues",
    category: "Azure Architecture",
    title: "Where would you introduce queues?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q8,
    code: "",
  },

  {
    id: "009-where-would-you-introduce-caching",
    category: "Azure Architecture",
    title: "Where would you introduce caching?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q9,
    code: "",
  },

  {
    id: "010-where-would-you-introduce-persistence",
    category: "Azure Architecture",
    title: "Where would you introduce persistence?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q10,
    code: "",
  },

  {
    id: "011-what-are-the-single-points-of-failure",
    category: "Azure Architecture",
    title: "What are the single points of failure?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q11,
    code: "",
  },

  {
    id: "012-how-would-you-eliminate-the-single-points-of-failure",
    category: "Azure Architecture",
    title: "How would you eliminate the single points of failure?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q12,
    code: "",
  },

  {
    id: "013-how-would-you-design-cwd-for-10-000-concurrent-users",
    category: "Azure Architecture",
    title: "How would you design CWD for 10,000 concurrent users?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q13,
    code: "",
  },

  {
    id: "014-how-would-you-design-cwd-for-multi-region-deployment",
    category: "Azure Architecture",
    title: "How would you design CWD for multi-region deployment?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q14,
    code: "",
  },

  {
    id: "015-what-architectural-trade-offs-did-you-make",
    category: "Azure Architecture",
    title: "What architectural trade-offs did you make?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q15,
    code: "",
  },

];

export default function AzureArchitectureQuestionPage() {
  return (
    <CookbookApp
      data={AzureArchitectureQuestion}
      title="Azure Architecture Cookbook"
      subtitle="End-to-end Azure architecture, request flow, trade-offs and resilience"
      icon="🏗️"
      patternLabel="Questions"
    />
  );
}

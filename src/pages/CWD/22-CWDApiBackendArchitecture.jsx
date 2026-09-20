import CookbookApp from "../../components/CookbookApp";
import Q467 from "../../assets/CWD/docs/22-api-and-backend-architecture/467-why-fastapi.md?raw";
import Q468 from "../../assets/CWD/docs/22-api-and-backend-architecture/468-why-not-flask.md?raw";
import Q469 from "../../assets/CWD/docs/22-api-and-backend-architecture/469-what-apis-does-cwd-expose.md?raw";
import Q470 from "../../assets/CWD/docs/22-api-and-backend-architecture/470-how-is-authentication-implemented.md?raw";
import Q471 from "../../assets/CWD/docs/22-api-and-backend-architecture/471-how-is-authorization-implemented.md?raw";
import Q472 from "../../assets/CWD/docs/22-api-and-backend-architecture/472-how-do-you-validate-api-requests.md?raw";
import Q473 from "../../assets/CWD/docs/22-api-and-backend-architecture/473-how-do-you-handle-api-versioning.md?raw";
import Q474 from "../../assets/CWD/docs/22-api-and-backend-architecture/474-how-do-you-implement-rate-limiting.md?raw";
import Q475 from "../../assets/CWD/docs/22-api-and-backend-architecture/475-how-do-you-implement-request-ids.md?raw";
import Q476 from "../../assets/CWD/docs/22-api-and-backend-architecture/476-how-do-you-handle-asynchronous-apis.md?raw";
import Q477 from "../../assets/CWD/docs/22-api-and-backend-architecture/477-how-do-you-handle-long-running-agent-workflows.md?raw";
import Q478 from "../../assets/CWD/docs/22-api-and-backend-architecture/478-why-might-you-return-202-accepted.md?raw";
import Q479 from "../../assets/CWD/docs/22-api-and-backend-architecture/479-how-does-the-client-retrieve-workflow-status.md?raw";
import Q480 from "../../assets/CWD/docs/22-api-and-backend-architecture/480-how-do-you-secure-api-endpoints.md?raw";

const CWDApiBackendArchitecture = [
  // =====================================================
  // 22. API & BACKEND ARCHITECTURE
  // =====================================================

  {
    id: "467-why-fastapi",
    category: "API & Backend Architecture",
    title: "Why FastAPI?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q467,
    code: "",
  },

  {
    id: "468-why-not-flask",
    category: "API & Backend Architecture",
    title: "Why not Flask?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q468,
    code: "",
  },

  {
    id: "469-what-apis-does-cwd-expose",
    category: "API & Backend Architecture",
    title: "What APIs does CWD expose?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q469,
    code: "",
  },

  {
    id: "470-how-is-authentication-implemented",
    category: "API & Backend Architecture",
    title: "How is authentication implemented?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q470,
    code: "",
  },

  {
    id: "471-how-is-authorization-implemented",
    category: "API & Backend Architecture",
    title: "How is authorization implemented?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q471,
    code: "",
  },

  {
    id: "472-how-do-you-validate-api-requests",
    category: "API & Backend Architecture",
    title: "How do you validate API requests?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q472,
    code: "",
  },

  {
    id: "473-how-do-you-handle-api-versioning",
    category: "API & Backend Architecture",
    title: "How do you handle API versioning?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q473,
    code: "",
  },

  {
    id: "474-how-do-you-implement-rate-limiting",
    category: "API & Backend Architecture",
    title: "How do you implement rate limiting?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q474,
    code: "",
  },

  {
    id: "475-how-do-you-implement-request-ids",
    category: "API & Backend Architecture",
    title: "How do you implement request IDs?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q475,
    code: "",
  },

  {
    id: "476-how-do-you-handle-asynchronous-apis",
    category: "API & Backend Architecture",
    title: "How do you handle asynchronous APIs?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q476,
    code: "",
  },

  {
    id: "477-how-do-you-handle-long-running-agent-workflows",
    category: "API & Backend Architecture",
    title: "How do you handle long-running agent workflows?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q477,
    code: "",
  },

  {
    id: "478-why-might-you-return-202-accepted",
    category: "API & Backend Architecture",
    title: "Why might you return 202 Accepted?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q478,
    code: "",
  },

  {
    id: "479-how-does-the-client-retrieve-workflow-status",
    category: "API & Backend Architecture",
    title: "How does the client retrieve workflow status?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q479,
    code: "",
  },

  {
    id: "480-how-do-you-secure-api-endpoints",
    category: "API & Backend Architecture",
    title: "How do you secure API endpoints?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: fastAPI, API security, async workflows and status retrieval.",
    concept: Q480,
    code: "",
  },

];

export default function CWDApiBackendArchitecturePage() {
  return (
    <CookbookApp
      data={CWDApiBackendArchitecture}
      title="CWD API & Backend Architecture Cookbook"
      subtitle="FastAPI, API security, async workflows and status retrieval"
      icon="🌐"
      patternLabel="Questions"
    />
  );
}

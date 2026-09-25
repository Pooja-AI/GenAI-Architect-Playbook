import CookbookApp from "../../../components/CookbookApp";

import Q469 from "../../../assets/docs/data-structures-interview-questions/22-monotonic-stack-queue/concept/469-what-is-a-monotonic-stack.md?raw";
import Q470 from "../../../assets/docs/data-structures-interview-questions/22-monotonic-stack-queue/concept/470-increasing-vs-decreasing-monotonic-stack.md?raw";
import Q471 from "../../../assets/docs/data-structures-interview-questions/22-monotonic-stack-queue/concept/471-why-use-a-monotonic-stack.md?raw";
import Q472 from "../../../assets/docs/data-structures-interview-questions/22-monotonic-stack-queue/concept/472-what-problems-can-it-solve.md?raw";
import Q473 from "../../../assets/docs/data-structures-interview-questions/22-monotonic-stack-queue/concept/473-how-does-it-achieve-o-n.md?raw";

const DSMonotonicStackQueueConceptQuestion = [
  {
    id: "469-what-is-a-monotonic-stack",
    category: "Monotonic Stack / Queue",
    title: "What is a monotonic stack?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q469,
    code: "",
  },

  {
    id: "470-increasing-vs-decreasing-monotonic-stack",
    category: "Monotonic Stack / Queue",
    title: "Increasing vs decreasing monotonic stack?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q470,
    code: "",
  },

  {
    id: "471-why-use-a-monotonic-stack",
    category: "Monotonic Stack / Queue",
    title: "Why use a monotonic stack?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q471,
    code: "",
  },

  {
    id: "472-what-problems-can-it-solve",
    category: "Monotonic Stack / Queue",
    title: "What problems can it solve?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q472,
    code: "",
  },

  {
    id: "473-how-does-it-achieve-o-n",
    category: "Monotonic Stack / Queue",
    title: "How does it achieve O(n)?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q473,
    code: "",
  },
];

export default function DSMonotonicStackQueueConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSMonotonicStackQueueConceptQuestion}
      title="Monotonic Stack / Queue Cookbook"
      subtitle="Fundamentals and theory questions on Monotonic Stack / Queue"
      icon="📈"
      patternLabel="Questions"
    />
  );
}

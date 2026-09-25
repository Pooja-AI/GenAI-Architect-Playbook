import CookbookApp from "../../../components/CookbookApp";

import Q132 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/132-what-is-a-stack.md?raw";
import Q133 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/133-what-is-lifo.md?raw";
import Q134 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/134-stack-vs-queue.md?raw";
import Q135 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/135-what-are-stack-operations.md?raw";
import Q136 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/136-what-is-push.md?raw";
import Q137 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/137-what-is-pop.md?raw";
import Q138 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/138-what-is-peek.md?raw";
import Q139 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/139-what-is-stack-overflow.md?raw";
import Q140 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/140-what-is-stack-underflow.md?raw";
import Q141 from "../../../assets/docs/data-structures-interview-questions/06-stack/concept/141-how-can-you-implement-a-stack-in-python.md?raw";

const DSStackConceptQuestion = [
  {
    id: "132-what-is-a-stack",
    category: "Stack",
    title: "What is a stack?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q132,
    code: "",
  },

  {
    id: "133-what-is-lifo",
    category: "Stack",
    title: "What is LIFO?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q133,
    code: "",
  },

  {
    id: "134-stack-vs-queue",
    category: "Stack",
    title: "Stack vs queue?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q134,
    code: "",
  },

  {
    id: "135-what-are-stack-operations",
    category: "Stack",
    title: "What are stack operations?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q135,
    code: "",
  },

  {
    id: "136-what-is-push",
    category: "Stack",
    title: "What is push?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q136,
    code: "",
  },

  {
    id: "137-what-is-pop",
    category: "Stack",
    title: "What is pop?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q137,
    code: "",
  },

  {
    id: "138-what-is-peek",
    category: "Stack",
    title: "What is peek?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q138,
    code: "",
  },

  {
    id: "139-what-is-stack-overflow",
    category: "Stack",
    title: "What is stack overflow?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q139,
    code: "",
  },

  {
    id: "140-what-is-stack-underflow",
    category: "Stack",
    title: "What is stack underflow?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q140,
    code: "",
  },

  {
    id: "141-how-can-you-implement-a-stack-in-python",
    category: "Stack",
    title: "How can you implement a stack in Python?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q141,
    code: "",
  },
];

export default function DSStackConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSStackConceptQuestion}
      title="Stack Cookbook"
      subtitle="Fundamentals and theory questions on Stack"
      icon="📚"
      patternLabel="Questions"
    />
  );
}

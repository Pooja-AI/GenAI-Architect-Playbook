import CookbookApp from "../../../components/CookbookApp";

import Q452 from "../../../assets/docs/data-structures-interview-questions/21-two-pointers/concept/452-what-is-the-two-pointer-technique.md?raw";
import Q453 from "../../../assets/docs/data-structures-interview-questions/21-two-pointers/concept/453-when-should-you-use-two-pointers.md?raw";
import Q454 from "../../../assets/docs/data-structures-interview-questions/21-two-pointers/concept/454-two-pointers-vs-sliding-window.md?raw";
import Q455 from "../../../assets/docs/data-structures-interview-questions/21-two-pointers/concept/455-why-is-sorting-often-useful-with-two-pointers.md?raw";

const DSTwoPointersConceptQuestion = [
  {
    id: "452-what-is-the-two-pointer-technique",
    category: "Two Pointers",
    title: "What is the two-pointer technique?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q452,
    code: "",
  },

  {
    id: "453-when-should-you-use-two-pointers",
    category: "Two Pointers",
    title: "When should you use two pointers?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q453,
    code: "",
  },

  {
    id: "454-two-pointers-vs-sliding-window",
    category: "Two Pointers",
    title: "Two pointers vs sliding window?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q454,
    code: "",
  },

  {
    id: "455-why-is-sorting-often-useful-with-two-pointers",
    category: "Two Pointers",
    title: "Why is sorting often useful with two pointers?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q455,
    code: "",
  },
];

export default function DSTwoPointersConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSTwoPointersConceptQuestion}
      title="Two Pointers Cookbook"
      subtitle="Fundamentals and theory questions on Two Pointers"
      icon="👉"
      patternLabel="Questions"
    />
  );
}

import CookbookApp from "../../../components/CookbookApp";

import Q437 from "../../../assets/docs/data-structures-interview-questions/20-sliding-window/concept/437-what-is-sliding-window.md?raw";
import Q438 from "../../../assets/docs/data-structures-interview-questions/20-sliding-window/concept/438-fixed-vs-variable-size-window.md?raw";
import Q439 from "../../../assets/docs/data-structures-interview-questions/20-sliding-window/concept/439-when-should-you-use-sliding-window.md?raw";
import Q440 from "../../../assets/docs/data-structures-interview-questions/20-sliding-window/concept/440-sliding-window-vs-two-pointers.md?raw";

const DSSlidingWindowConceptQuestion = [
  {
    id: "437-what-is-sliding-window",
    category: "Sliding Window",
    title: "What is sliding window?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q437,
    code: "",
  },

  {
    id: "438-fixed-vs-variable-size-window",
    category: "Sliding Window",
    title: "Fixed vs variable-size window?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q438,
    code: "",
  },

  {
    id: "439-when-should-you-use-sliding-window",
    category: "Sliding Window",
    title: "When should you use sliding window?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q439,
    code: "",
  },

  {
    id: "440-sliding-window-vs-two-pointers",
    category: "Sliding Window",
    title: "Sliding window vs two pointers?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q440,
    code: "",
  },
];

export default function DSSlidingWindowConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSSlidingWindowConceptQuestion}
      title="Sliding Window Cookbook"
      subtitle="Fundamentals and theory questions on Sliding Window"
      icon="🪟"
      patternLabel="Questions"
    />
  );
}

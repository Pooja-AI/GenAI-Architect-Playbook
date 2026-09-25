import CookbookApp from "../../../components/CookbookApp";

import Q338 from "../../../assets/docs/data-structures-interview-questions/15-recursion/concept/338-what-is-recursion.md?raw";
import Q339 from "../../../assets/docs/data-structures-interview-questions/15-recursion/concept/339-what-is-a-base-case.md?raw";
import Q340 from "../../../assets/docs/data-structures-interview-questions/15-recursion/concept/340-what-is-a-recursive-case.md?raw";
import Q341 from "../../../assets/docs/data-structures-interview-questions/15-recursion/concept/341-what-happens-in-the-call-stack.md?raw";
import Q342 from "../../../assets/docs/data-structures-interview-questions/15-recursion/concept/342-recursion-vs-iteration.md?raw";
import Q343 from "../../../assets/docs/data-structures-interview-questions/15-recursion/concept/343-what-causes-infinite-recursion.md?raw";
import Q344 from "../../../assets/docs/data-structures-interview-questions/15-recursion/concept/344-what-is-stack-overflow.md?raw";
import Q345 from "../../../assets/docs/data-structures-interview-questions/15-recursion/concept/345-when-should-recursion-be-avoided.md?raw";

const DSRecursionConceptQuestion = [
  {
    id: "338-what-is-recursion",
    category: "Recursion",
    title: "What is recursion?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q338,
    code: "",
  },

  {
    id: "339-what-is-a-base-case",
    category: "Recursion",
    title: "What is a base case?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q339,
    code: "",
  },

  {
    id: "340-what-is-a-recursive-case",
    category: "Recursion",
    title: "What is a recursive case?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q340,
    code: "",
  },

  {
    id: "341-what-happens-in-the-call-stack",
    category: "Recursion",
    title: "What happens in the call stack?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q341,
    code: "",
  },

  {
    id: "342-recursion-vs-iteration",
    category: "Recursion",
    title: "Recursion vs iteration?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q342,
    code: "",
  },

  {
    id: "343-what-causes-infinite-recursion",
    category: "Recursion",
    title: "What causes infinite recursion?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q343,
    code: "",
  },

  {
    id: "344-what-is-stack-overflow",
    category: "Recursion",
    title: "What is stack overflow?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q344,
    code: "",
  },

  {
    id: "345-when-should-recursion-be-avoided",
    category: "Recursion",
    title: "When should recursion be avoided?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q345,
    code: "",
  },
];

export default function DSRecursionConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSRecursionConceptQuestion}
      title="Recursion Cookbook"
      subtitle="Fundamentals and theory questions on Recursion"
      icon="🔁"
      patternLabel="Questions"
    />
  );
}

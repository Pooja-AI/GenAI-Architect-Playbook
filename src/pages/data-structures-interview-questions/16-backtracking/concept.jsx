import CookbookApp from "../../../components/CookbookApp";

import Q357 from "../../../assets/docs/data-structures-interview-questions/16-backtracking/concept/357-what-is-backtracking.md?raw";
import Q358 from "../../../assets/docs/data-structures-interview-questions/16-backtracking/concept/358-backtracking-vs-recursion.md?raw";
import Q359 from "../../../assets/docs/data-structures-interview-questions/16-backtracking/concept/359-what-is-the-decision-tree.md?raw";
import Q360 from "../../../assets/docs/data-structures-interview-questions/16-backtracking/concept/360-when-should-you-use-backtracking.md?raw";
import Q361 from "../../../assets/docs/data-structures-interview-questions/16-backtracking/concept/361-what-is-pruning.md?raw";
import Q362 from "../../../assets/docs/data-structures-interview-questions/16-backtracking/concept/362-how-do-you-identify-a-backtracking-problem.md?raw";

const DSBacktrackingConceptQuestion = [
  {
    id: "357-what-is-backtracking",
    category: "Backtracking",
    title: "What is backtracking?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q357,
    code: "",
  },

  {
    id: "358-backtracking-vs-recursion",
    category: "Backtracking",
    title: "Backtracking vs recursion?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q358,
    code: "",
  },

  {
    id: "359-what-is-the-decision-tree",
    category: "Backtracking",
    title: "What is the decision tree?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q359,
    code: "",
  },

  {
    id: "360-when-should-you-use-backtracking",
    category: "Backtracking",
    title: "When should you use backtracking?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q360,
    code: "",
  },

  {
    id: "361-what-is-pruning",
    category: "Backtracking",
    title: "What is pruning?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q361,
    code: "",
  },

  {
    id: "362-how-do-you-identify-a-backtracking-problem",
    category: "Backtracking",
    title: "How do you identify a backtracking problem?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q362,
    code: "",
  },
];

export default function DSBacktrackingConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSBacktrackingConceptQuestion}
      title="Backtracking Cookbook"
      subtitle="Fundamentals and theory questions on Backtracking"
      icon="↩️"
      patternLabel="Questions"
    />
  );
}

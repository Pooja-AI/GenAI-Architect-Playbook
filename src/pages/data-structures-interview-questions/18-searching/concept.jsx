import CookbookApp from "../../../components/CookbookApp";

import Q399 from "../../../assets/docs/data-structures-interview-questions/18-searching/concept/399-what-is-linear-search.md?raw";
import Q400 from "../../../assets/docs/data-structures-interview-questions/18-searching/concept/400-what-is-binary-search.md?raw";
import Q401 from "../../../assets/docs/data-structures-interview-questions/18-searching/concept/401-what-condition-is-required-for-binary-search.md?raw";
import Q402 from "../../../assets/docs/data-structures-interview-questions/18-searching/concept/402-binary-search-complexity.md?raw";
import Q403 from "../../../assets/docs/data-structures-interview-questions/18-searching/concept/403-recursive-vs-iterative-binary-search.md?raw";
import Q404 from "../../../assets/docs/data-structures-interview-questions/18-searching/concept/404-what-is-search-space.md?raw";

const DSSearchingConceptQuestion = [
  {
    id: "399-what-is-linear-search",
    category: "Searching",
    title: "What is linear search?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q399,
    code: "",
  },

  {
    id: "400-what-is-binary-search",
    category: "Searching",
    title: "What is binary search?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q400,
    code: "",
  },

  {
    id: "401-what-condition-is-required-for-binary-search",
    category: "Searching",
    title: "What condition is required for binary search?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q401,
    code: "",
  },

  {
    id: "402-binary-search-complexity",
    category: "Searching",
    title: "Binary search complexity?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q402,
    code: "",
  },

  {
    id: "403-recursive-vs-iterative-binary-search",
    category: "Searching",
    title: "Recursive vs iterative binary search?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q403,
    code: "",
  },

  {
    id: "404-what-is-search-space",
    category: "Searching",
    title: "What is search space?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q404,
    code: "",
  },
];

export default function DSSearchingConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSSearchingConceptQuestion}
      title="Searching Cookbook"
      subtitle="Fundamentals and theory questions on Searching"
      icon="🔍"
      patternLabel="Questions"
    />
  );
}

import CookbookApp from "../../../components/CookbookApp";

import Q421 from "../../../assets/docs/data-structures-interview-questions/19-prefix-sum/concept/421-what-is-prefix-sum.md?raw";
import Q422 from "../../../assets/docs/data-structures-interview-questions/19-prefix-sum/concept/422-why-use-prefix-sums.md?raw";
import Q423 from "../../../assets/docs/data-structures-interview-questions/19-prefix-sum/concept/423-what-is-the-complexity-of-building-prefix-sums.md?raw";
import Q424 from "../../../assets/docs/data-structures-interview-questions/19-prefix-sum/concept/424-how-does-prefix-sum-improve-range-queries.md?raw";
import Q425 from "../../../assets/docs/data-structures-interview-questions/19-prefix-sum/concept/425-prefix-sum-vs-sliding-window.md?raw";

const DSPrefixSumConceptQuestion = [
  {
    id: "421-what-is-prefix-sum",
    category: "Prefix Sum",
    title: "What is prefix sum?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q421,
    code: "",
  },

  {
    id: "422-why-use-prefix-sums",
    category: "Prefix Sum",
    title: "Why use prefix sums?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q422,
    code: "",
  },

  {
    id: "423-what-is-the-complexity-of-building-prefix-sums",
    category: "Prefix Sum",
    title: "What is the complexity of building prefix sums?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q423,
    code: "",
  },

  {
    id: "424-how-does-prefix-sum-improve-range-queries",
    category: "Prefix Sum",
    title: "How does prefix sum improve range queries?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q424,
    code: "",
  },

  {
    id: "425-prefix-sum-vs-sliding-window",
    category: "Prefix Sum",
    title: "Prefix sum vs sliding window?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q425,
    code: "",
  },
];

export default function DSPrefixSumConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSPrefixSumConceptQuestion}
      title="Prefix Sum Cookbook"
      subtitle="Fundamentals and theory questions on Prefix Sum"
      icon="➕"
      patternLabel="Questions"
    />
  );
}

import CookbookApp from "../../../components/CookbookApp";

import Q485 from "../../../assets/docs/data-structures-interview-questions/23-intervals/concept/485-what-is-an-interval.md?raw";
import Q486 from "../../../assets/docs/data-structures-interview-questions/23-intervals/concept/486-how-do-you-represent-intervals.md?raw";
import Q487 from "../../../assets/docs/data-structures-interview-questions/23-intervals/concept/487-how-do-you-detect-overlapping-intervals.md?raw";
import Q488 from "../../../assets/docs/data-structures-interview-questions/23-intervals/concept/488-why-do-we-usually-sort-intervals-first.md?raw";
import Q489 from "../../../assets/docs/data-structures-interview-questions/23-intervals/concept/489-what-is-interval-merging.md?raw";

const DSIntervalsConceptQuestion = [
  {
    id: "485-what-is-an-interval",
    category: "Intervals",
    title: "What is an interval?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q485,
    code: "",
  },

  {
    id: "486-how-do-you-represent-intervals",
    category: "Intervals",
    title: "How do you represent intervals?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q486,
    code: "",
  },

  {
    id: "487-how-do-you-detect-overlapping-intervals",
    category: "Intervals",
    title: "How do you detect overlapping intervals?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q487,
    code: "",
  },

  {
    id: "488-why-do-we-usually-sort-intervals-first",
    category: "Intervals",
    title: "Why do we usually sort intervals first?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q488,
    code: "",
  },

  {
    id: "489-what-is-interval-merging",
    category: "Intervals",
    title: "What is interval merging?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q489,
    code: "",
  },
];

export default function DSIntervalsConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSIntervalsConceptQuestion}
      title="Intervals Cookbook"
      subtitle="Fundamentals and theory questions on Intervals"
      icon="⏱️"
      patternLabel="Questions"
    />
  );
}

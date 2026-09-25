import CookbookApp from "../../../components/CookbookApp";

import Q85 from "../../../assets/docs/data-structures-interview-questions/04-set/concept/085-what-is-a-set.md?raw";
import Q86 from "../../../assets/docs/data-structures-interview-questions/04-set/concept/086-why-does-a-set-not-contain-duplicates.md?raw";
import Q87 from "../../../assets/docs/data-structures-interview-questions/04-set/concept/087-how-is-a-set-implemented-internally.md?raw";
import Q88 from "../../../assets/docs/data-structures-interview-questions/04-set/concept/088-set-vs-list.md?raw";
import Q89 from "../../../assets/docs/data-structures-interview-questions/04-set/concept/089-set-vs-dictionary.md?raw";
import Q90 from "../../../assets/docs/data-structures-interview-questions/04-set/concept/090-what-is-the-average-lookup-complexity.md?raw";
import Q91 from "../../../assets/docs/data-structures-interview-questions/04-set/concept/091-when-should-you-use-a-set.md?raw";

const DSSetConceptQuestion = [
  {
    id: "085-what-is-a-set",
    category: "Set",
    title: "What is a set?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q85,
    code: "",
  },

  {
    id: "086-why-does-a-set-not-contain-duplicates",
    category: "Set",
    title: "Why does a set not contain duplicates?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q86,
    code: "",
  },

  {
    id: "087-how-is-a-set-implemented-internally",
    category: "Set",
    title: "How is a set implemented internally?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q87,
    code: "",
  },

  {
    id: "088-set-vs-list",
    category: "Set",
    title: "Set vs list?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q88,
    code: "",
  },

  {
    id: "089-set-vs-dictionary",
    category: "Set",
    title: "Set vs dictionary?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q89,
    code: "",
  },

  {
    id: "090-what-is-the-average-lookup-complexity",
    category: "Set",
    title: "What is the average lookup complexity?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q90,
    code: "",
  },

  {
    id: "091-when-should-you-use-a-set",
    category: "Set",
    title: "When should you use a set?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q91,
    code: "",
  },
];

export default function DSSetConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSSetConceptQuestion}
      title="Set Cookbook"
      subtitle="Fundamentals and theory questions on Set"
      icon="🎯"
      patternLabel="Questions"
    />
  );
}

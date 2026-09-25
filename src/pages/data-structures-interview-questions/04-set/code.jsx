import CookbookApp from "../../../components/CookbookApp";

import Q92 from "../../../assets/docs/data-structures-interview-questions/04-set/code/092-remove-duplicates-from-an-array.md?raw";
import Q93 from "../../../assets/docs/data-structures-interview-questions/04-set/code/093-find-intersection-of-two-arrays.md?raw";
import Q94 from "../../../assets/docs/data-structures-interview-questions/04-set/code/094-find-union-of-two-arrays.md?raw";
import Q95 from "../../../assets/docs/data-structures-interview-questions/04-set/code/095-find-difference-between-two-arrays.md?raw";
import Q96 from "../../../assets/docs/data-structures-interview-questions/04-set/code/096-find-elements-appearing-in-both-arrays.md?raw";
import Q97 from "../../../assets/docs/data-structures-interview-questions/04-set/code/097-find-missing-elements.md?raw";
import Q98 from "../../../assets/docs/data-structures-interview-questions/04-set/code/098-find-duplicate-values.md?raw";
import Q99 from "../../../assets/docs/data-structures-interview-questions/04-set/code/099-determine-whether-two-arrays-contain-the-same-elements.md?raw";
import Q100 from "../../../assets/docs/data-structures-interview-questions/04-set/code/100-find-common-characters-between-strings.md?raw";

const DSSetCodeQuestion = [
  {
    id: "092-remove-duplicates-from-an-array",
    category: "Set",
    title: "Remove duplicates from an array.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q92,
  },

  {
    id: "093-find-intersection-of-two-arrays",
    category: "Set",
    title: "Find intersection of two arrays.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q93,
  },

  {
    id: "094-find-union-of-two-arrays",
    category: "Set",
    title: "Find union of two arrays.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q94,
  },

  {
    id: "095-find-difference-between-two-arrays",
    category: "Set",
    title: "Find difference between two arrays.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q95,
  },

  {
    id: "096-find-elements-appearing-in-both-arrays",
    category: "Set",
    title: "Find elements appearing in both arrays.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q96,
  },

  {
    id: "097-find-missing-elements",
    category: "Set",
    title: "Find missing elements.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q97,
  },

  {
    id: "098-find-duplicate-values",
    category: "Set",
    title: "Find duplicate values.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q98,
  },

  {
    id: "099-determine-whether-two-arrays-contain-the-same-elements",
    category: "Set",
    title: "Determine whether two arrays contain the same elements.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q99,
  },

  {
    id: "100-find-common-characters-between-strings",
    category: "Set",
    title: "Find common characters between strings.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q100,
  },
];

export default function DSSetCodeQuestionPage() {
  return (
    <CookbookApp
      data={DSSetCodeQuestion}
      title="Set Cookbook"
      subtitle="Coding practice problems on Set"
      icon="🎯"
      patternLabel="Questions"
    />
  );
}

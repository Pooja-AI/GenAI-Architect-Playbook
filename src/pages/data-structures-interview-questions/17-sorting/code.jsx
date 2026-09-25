import CookbookApp from "../../../components/CookbookApp";

import Q396 from "../../../assets/docs/data-structures-interview-questions/17-sorting/code/396-sort-an-array-of-0s-1s-and-2s.md?raw";
import Q397 from "../../../assets/docs/data-structures-interview-questions/17-sorting/code/397-sort-an-almost-sorted-array.md?raw";
import Q398 from "../../../assets/docs/data-structures-interview-questions/17-sorting/code/398-merge-overlapping-intervals.md?raw";

const DSSortingCodeQuestion = [
  {
    id: "396-sort-an-array-of-0s-1s-and-2s",
    category: "Sorting",
    title: "Sort an array of 0s, 1s, and 2s.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q396,
  },

  {
    id: "397-sort-an-almost-sorted-array",
    category: "Sorting",
    title: "Sort an almost sorted array.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q397,
  },

  {
    id: "398-merge-overlapping-intervals",
    category: "Sorting",
    title: "Merge overlapping intervals.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q398,
  },
];

export default function DSSortingCodeQuestionPage() {
  return (
    <CookbookApp
      data={DSSortingCodeQuestion}
      title="Sorting Cookbook"
      subtitle="Coding practice problems on Sorting"
      icon="🔃"
      patternLabel="Questions"
    />
  );
}

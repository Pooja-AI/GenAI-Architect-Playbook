import CookbookApp from "../../../components/CookbookApp";

import Q323 from "../../../assets/docs/data-structures-interview-questions/14-union-find-disjoint-set/concept/323-what-is-union-find.md?raw";
import Q324 from "../../../assets/docs/data-structures-interview-questions/14-union-find-disjoint-set/concept/324-what-problem-does-union-find-solve.md?raw";
import Q325 from "../../../assets/docs/data-structures-interview-questions/14-union-find-disjoint-set/concept/325-what-are-find-and-union.md?raw";
import Q326 from "../../../assets/docs/data-structures-interview-questions/14-union-find-disjoint-set/concept/326-what-is-path-compression.md?raw";
import Q327 from "../../../assets/docs/data-structures-interview-questions/14-union-find-disjoint-set/concept/327-what-is-union-by-rank.md?raw";
import Q328 from "../../../assets/docs/data-structures-interview-questions/14-union-find-disjoint-set/concept/328-what-is-union-by-size.md?raw";
import Q329 from "../../../assets/docs/data-structures-interview-questions/14-union-find-disjoint-set/concept/329-what-is-the-complexity-with-optimizations.md?raw";

const DSUnionFindDisjointSetConceptQuestion = [
  {
    id: "323-what-is-union-find",
    category: "Union-Find / Disjoint Set",
    title: "What is Union-Find?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q323,
    code: "",
  },

  {
    id: "324-what-problem-does-union-find-solve",
    category: "Union-Find / Disjoint Set",
    title: "What problem does Union-Find solve?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q324,
    code: "",
  },

  {
    id: "325-what-are-find-and-union",
    category: "Union-Find / Disjoint Set",
    title: "What are find() and union()?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q325,
    code: "",
  },

  {
    id: "326-what-is-path-compression",
    category: "Union-Find / Disjoint Set",
    title: "What is path compression?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q326,
    code: "",
  },

  {
    id: "327-what-is-union-by-rank",
    category: "Union-Find / Disjoint Set",
    title: "What is union by rank?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q327,
    code: "",
  },

  {
    id: "328-what-is-union-by-size",
    category: "Union-Find / Disjoint Set",
    title: "What is union by size?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q328,
    code: "",
  },

  {
    id: "329-what-is-the-complexity-with-optimizations",
    category: "Union-Find / Disjoint Set",
    title: "What is the complexity with optimizations?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q329,
    code: "",
  },
];

export default function DSUnionFindDisjointSetConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSUnionFindDisjointSetConceptQuestion}
      title="Union-Find / Disjoint Set Cookbook"
      subtitle="Fundamentals and theory questions on Union-Find / Disjoint Set"
      icon="🧩"
      patternLabel="Questions"
    />
  );
}

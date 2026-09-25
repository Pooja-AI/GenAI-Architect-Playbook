import CookbookApp from "../../../components/CookbookApp";

import Q258 from "../../../assets/docs/data-structures-interview-questions/11-trie/concept/258-what-is-a-trie.md?raw";
import Q259 from "../../../assets/docs/data-structures-interview-questions/11-trie/concept/259-why-use-a-trie-instead-of-a-hash-table.md?raw";
import Q260 from "../../../assets/docs/data-structures-interview-questions/11-trie/concept/260-what-is-prefix-searching.md?raw";
import Q261 from "../../../assets/docs/data-structures-interview-questions/11-trie/concept/261-what-is-autocomplete.md?raw";
import Q262 from "../../../assets/docs/data-structures-interview-questions/11-trie/concept/262-how-is-a-trie-structured.md?raw";
import Q263 from "../../../assets/docs/data-structures-interview-questions/11-trie/concept/263-what-is-the-complexity-of-trie-search.md?raw";
import Q264 from "../../../assets/docs/data-structures-interview-questions/11-trie/concept/264-trie-vs-bst.md?raw";
import Q265 from "../../../assets/docs/data-structures-interview-questions/11-trie/concept/265-trie-vs-dictionary.md?raw";

const DSTrieConceptQuestion = [
  {
    id: "258-what-is-a-trie",
    category: "Trie",
    title: "What is a Trie?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q258,
    code: "",
  },

  {
    id: "259-why-use-a-trie-instead-of-a-hash-table",
    category: "Trie",
    title: "Why use a Trie instead of a hash table?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q259,
    code: "",
  },

  {
    id: "260-what-is-prefix-searching",
    category: "Trie",
    title: "What is prefix searching?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q260,
    code: "",
  },

  {
    id: "261-what-is-autocomplete",
    category: "Trie",
    title: "What is autocomplete?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q261,
    code: "",
  },

  {
    id: "262-how-is-a-trie-structured",
    category: "Trie",
    title: "How is a Trie structured?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q262,
    code: "",
  },

  {
    id: "263-what-is-the-complexity-of-trie-search",
    category: "Trie",
    title: "What is the complexity of Trie search?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q263,
    code: "",
  },

  {
    id: "264-trie-vs-bst",
    category: "Trie",
    title: "Trie vs BST?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q264,
    code: "",
  },

  {
    id: "265-trie-vs-dictionary",
    category: "Trie",
    title: "Trie vs dictionary?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q265,
    code: "",
  },
];

export default function DSTrieConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSTrieConceptQuestion}
      title="Trie Cookbook"
      subtitle="Fundamentals and theory questions on Trie"
      icon="🔠"
      patternLabel="Questions"
    />
  );
}

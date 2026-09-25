import CookbookApp from "../../../components/CookbookApp";

import Q31 from "../../../assets/docs/data-structures-interview-questions/02-strings/concept/031-what-is-a-string.md?raw";
import Q32 from "../../../assets/docs/data-structures-interview-questions/02-strings/concept/032-are-python-strings-mutable-or-immutable.md?raw";
import Q33 from "../../../assets/docs/data-structures-interview-questions/02-strings/concept/033-why-are-strings-immutable.md?raw";
import Q34 from "../../../assets/docs/data-structures-interview-questions/02-strings/concept/034-what-is-the-time-complexity-of-string-concatenation.md?raw";
import Q35 from "../../../assets/docs/data-structures-interview-questions/02-strings/concept/035-difference-between-string-list-and-tuple.md?raw";
import Q36 from "../../../assets/docs/data-structures-interview-questions/02-strings/concept/036-how-do-you-reverse-a-string.md?raw";
import Q37 from "../../../assets/docs/data-structures-interview-questions/02-strings/concept/037-how-do-you-iterate-through-a-string.md?raw";

const DSStringsConceptQuestion = [
  {
    id: "031-what-is-a-string",
    category: "Strings",
    title: "What is a string?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q31,
    code: "",
  },

  {
    id: "032-are-python-strings-mutable-or-immutable",
    category: "Strings",
    title: "Are Python strings mutable or immutable?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q32,
    code: "",
  },

  {
    id: "033-why-are-strings-immutable",
    category: "Strings",
    title: "Why are strings immutable?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q33,
    code: "",
  },

  {
    id: "034-what-is-the-time-complexity-of-string-concatenation",
    category: "Strings",
    title: "What is the time complexity of string concatenation?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q34,
    code: "",
  },

  {
    id: "035-difference-between-string-list-and-tuple",
    category: "Strings",
    title: "Difference between string, list, and tuple?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q35,
    code: "",
  },

  {
    id: "036-how-do-you-reverse-a-string",
    category: "Strings",
    title: "How do you reverse a string?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q36,
    code: "",
  },

  {
    id: "037-how-do-you-iterate-through-a-string",
    category: "Strings",
    title: "How do you iterate through a string?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q37,
    code: "",
  },
];

export default function DSStringsConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSStringsConceptQuestion}
      title="Strings Cookbook"
      subtitle="Fundamentals and theory questions on Strings"
      icon="🔤"
      patternLabel="Questions"
    />
  );
}

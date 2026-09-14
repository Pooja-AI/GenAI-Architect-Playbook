import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CookbookApp from "../components/CookbookApp";

const LangraphQuestion = [
  {
    id: "what-is-langgraph",
    category: "LangGraph",
    title: "What is LangGraph?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-vs-langchain-agents",
    category: "LangGraph",
    title: "Why LangGraph instead of LangChain agents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-graph",
    category: "LangGraph",
    title: "What is a graph in LangGraph?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-nodes",
    category: "LangGraph",
    title: "What are nodes?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-edges",
    category: "LangGraph",
    title: "What are edges?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-conditional-edges",
    category: "LangGraph",
    title: "What are conditional edges?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-state",
    category: "LangGraph",
    title: "What is state in LangGraph?",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-state-persistence",
    category: "LangGraph",
    title: "How do you persist state?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-checkpoints",
    category: "LangGraph",
    title: "How do you implement checkpoints?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-human-approval",
    category: "LangGraph",
    title: "How do you implement human approval?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-loops",
    category: "LangGraph",
    title: "How do you implement loops?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-retries",
    category: "LangGraph",
    title: "How do you implement retries?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-parallel-execution",
    category: "LangGraph",
    title: "How do you implement parallel execution?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-error-handling",
    category: "LangGraph",
    title: "How do you handle errors in LangGraph?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-hierarchical-agents",
    category: "LangGraph",
    title: "How do you build hierarchical agents using LangGraph?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-supervisor-agent",
    category: "LangGraph",
    title: "How do you implement a supervisor agent?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-infinite-loops",
    category: "LangGraph",
    title: "How do you prevent infinite loops?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-observability-debugging",
    category: "LangGraph",
    title: "How do you observe and debug LangGraph execution?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: "",
    code: "",
  },

  {
    id: "langgraph-production-deployment",
    category: "LangGraph",
    title: "How do you deploy LangGraph into production?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: "",
    code: "",
  },
];

export default function CWDPage() {
  return (
    <CookbookApp
      data={LangraphQuestion}
      title="LangraphQuestion Cookbook"
      subtitle="Complete Workflow Design"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}


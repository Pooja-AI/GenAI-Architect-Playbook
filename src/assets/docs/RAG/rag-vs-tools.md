# RAG vs. Tool Use

RAG and tool use (function calling) are both ways to give an LLM access to information or capabilities beyond its training data, but they suit different needs.

## RAG
- Best for **unstructured knowledge**: documents, wikis, policies, support articles.
- Retrieves relevant text passages to ground the model's response.
- Answers are generated from retrieved context combined with the model's language abilities.

## Tool Use
- Best for **structured actions and data**: calling APIs, querying databases, running calculations, sending emails, checking live system state.
- The model decides to invoke a specific tool/function with structured parameters and receives a structured result.

## Combining Both
Modern systems often combine RAG (for unstructured knowledge retrieval) with tool use (for structured operations), letting an agent decide which approach fits a given sub-task — e.g., using RAG to look up a policy document, then using a tool to check a customer's live account balance.

## Rule of Thumb
If the answer lives in prose/documents → RAG. If the answer requires precise, structured, or real-time data → a tool/function call.

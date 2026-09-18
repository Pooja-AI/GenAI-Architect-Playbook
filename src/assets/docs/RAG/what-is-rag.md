# What Is RAG?

Retrieval-Augmented Generation (RAG) is a technique that combines a large language model (LLM) with an external knowledge source. Instead of relying only on what the model learned during training, RAG retrieves relevant documents or passages at query time and feeds them into the model's context so it can generate answers grounded in that retrieved information.

## How It Works
1. **Index** — Documents are split into chunks, converted into vector embeddings, and stored in a vector database.
2. **Retrieve** — When a user asks a question, the query is embedded and used to search the index for the most relevant chunks.
3. **Augment** — The retrieved chunks are inserted into the prompt alongside the user's question.
4. **Generate** — The LLM produces an answer using both its parametric knowledge and the retrieved context.

## Why It Matters
RAG lets an LLM answer questions about private, proprietary, or rapidly changing information without retraining the model, and it reduces hallucinations by grounding responses in real source material.

**Faithfulness** measures whether an LLM's answer is supported by the context it was given, such as the retrieved documents in RAG. A faithful answer makes no claims that go beyond that context or contradict it.

**How it's calculated (the RAGAS approach)**
1. Break the answer into individual claims.
2. Check each claim against the retrieved context, usually with an LLM judge.
3. Score = supported claims ÷ total claims (0 to 1).

**Example**
- Context: "The refund window is 30 days from delivery."
- Answer: "You can get a refund within 30 days, and shipping is free."
- The first claim is supported and the second is not, so faithfulness is 1/2 = 0.5.

**How it differs from related metrics**
- **Faithfulness / groundedness:** Is the answer backed by the context? Some tools treat the two terms as the same thing, others define them slightly differently.
- **Factual correctness:** Is the answer true in the real world? A faithful answer can still be wrong if the retrieved document is wrong.
- **Answer relevance:** Does the answer actually address the question?
- **Context precision and recall:** Did retrieval return the right documents?

**Why it matters for CWD**
It is your main hallucination metric for RAG. Low faithfulness with good retrieval points to a prompt or model problem. Low faithfulness with poor retrieval points to a retrieval problem.

**Ways to improve it**
- Better retrieval and reranking, and less irrelevant context.
- Prompts like "answer only from the context; say you don't know otherwise".
- Required citations.
- A grounding check on the output, such as Bedrock Guardrails' contextual grounding check or Azure's groundedness detection.

**Caveat:** LLM judges are noisy, so use a fixed judge model and check a sample by hand. Also, a very cautious answer can score well on faithfulness while being unhelpful, so read it alongside answer relevance.

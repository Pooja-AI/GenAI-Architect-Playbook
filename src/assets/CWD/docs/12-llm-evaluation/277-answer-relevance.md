**Answer relevance** measures whether the answer actually addresses the question that was asked. It penalises answers that are incomplete, off-topic or padded with unnecessary detail. It does not check whether the answer is true.

**How it's calculated (the RAGAS approach)**
1. Give an LLM the answer and ask it to generate several questions that the answer would respond to.
2. Embed those generated questions and the original question.
3. Score = average cosine similarity between the original question and the generated ones.

If the answer is on topic, the generated questions look like the original. If it drifts or misses the point, they don't. Other tools use an LLM judge that rates relevance on a scale instead.

**Example**
- Question: "What is the refund window?"
- Answer A: "30 days from delivery." This scores high.
- Answer B: "Our company was founded in 2005 and values customer service." This scores low, even if every statement in it is true.
- Answer C: "I don't know." Many implementations score this as low relevance (RAGAS gives 0 for a non-committal answer).

**How it differs from related metrics**
- **Faithfulness:** is the answer supported by the context? An answer can be faithful but irrelevant, or relevant but unfaithful.
- **Factual correctness:** is it true? Relevance ignores this.
- **Context relevance / precision:** did retrieval return useful documents? That measures retrieval, not the answer.

**Why it matters for CWD**
It catches answers that are grounded but unhelpful, such as a correct paragraph about the wrong policy or a Worker result that doesn't answer the user's actual request. Read it together with faithfulness. Good on both means the answer is on topic and supported.

**Ways to improve it**
- Better intent classification and routing, so the right Delegator and Worker handle the question.
- Prompts that require answering the specific question first, then adding detail.
- Ask a clarifying question when the request is ambiguous.
- Trim irrelevant context, since noisy context makes the model wander.

**Caveat:** The embedding-based score is sensitive to the embedding model and to how many questions are generated. Use a fixed setup so scores stay comparable, and spot-check by hand.

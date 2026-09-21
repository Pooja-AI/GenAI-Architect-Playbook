**Hallucination rate** is the share of answers that contain content not supported by the evidence or by reality. It is usually reported as a percentage of responses, or of individual claims.

**How it's calculated**
Hallucination rate = responses (or claims) with unsupported content ÷ total responses (or claims).

**Two common definitions**
- **Grounded (RAG) hallucination:** a claim is not supported by the retrieved context. This is the inverse of faithfulness, so the rate is roughly 1 − faithfulness. It is the main version for CWD.
- **Factual hallucination:** a claim is false in the real world, checked against a trusted source or reference answer.

**How to measure it**
1. Split the answer into claims.
2. Check each claim against the context or a reference, using an LLM judge, entailment models or human review.
3. Count answers with at least one unsupported claim (response-level rate), or the share of unsupported claims (claim-level rate).
4. Run it offline on a golden dataset and online on sampled production traffic.

**Example**
- Context: "The refund window is 30 days."
- Answer: "Refunds are accepted within 30 days, and you get store credit if you miss it."
- The second claim has no support, so this response counts as hallucinated. At the claim level, 1 of 2 claims is unsupported.

**Related things to track**
- **Abstention rate:** how often CWD correctly says "I don't know" when evidence is missing. A low hallucination rate from over-refusing is not a win.
- **Citation accuracy:** whether the cited passage really supports the claim.
- **Tool hallucination:** invented tool names, arguments, customer IDs or Delegators. Validate these in code against the registry and schemas.
- **Severity:** a wrong policy detail matters more than a wrong adjective, so weight or categorise errors.

**Why it matters for CWD**
In an enterprise setting, a confident wrong answer about a policy, contract or customer record is a business risk. Track the rate by intent, tenant and model or prompt version, so you can see regressions after a release.

**Ways to reduce it**
- Better retrieval and reranking; drop low-relevance chunks.
- Prompts requiring answers only from context, with citations, and an explicit "I don't know" path.
- Post-generation grounding checks (for example the contextual grounding check in Bedrock Guardrails or groundedness detection in Azure).
- Lower temperature for factual tasks; structured outputs; validate tool arguments.

**Caveat:** The rate depends heavily on the dataset, the judge and the claim definition, so it can't be compared across teams without the same setup. Use a fixed judge, spot-check by hand, and treat it as a trend metric.


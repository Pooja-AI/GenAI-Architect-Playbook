### Scenario 6: Correct documents are retrieved but LLM gives an incorrect answer

I would focus on the **generation layer**:

1. **Check the prompt**

   * Is the retrieved context clearly provided to the LLM?
   * Are instructions telling it to answer **only from the context**?

2. **Check context**

   * Are relevant documents actually included in the final prompt?
   * Is important information being truncated because of token limits?

3. **Check grounding**

   * Require the answer to include **citations/source references**.
   * If evidence is missing, return **"I don't have enough information."**

4. **Check model behavior**

   * Temperature too high?
   * Wrong model?
   * Model ignoring instructions?

5. **Check output validation**

   * Use structured output/Pydantic validation where applicable.
   * Add factual/groundedness evaluation.

6. **Evaluate**

   * Use **faithfulness/groundedness, answer relevance, and RAGAS** metrics.

### Interview answer

> **"If retrieval is correct but the answer is wrong, I would investigate the generation layer. I would verify that the retrieved context is correctly passed to the LLM, prevent context truncation, strengthen grounding instructions, require citations, and use a fallback when sufficient evidence is unavailable. Then I would measure groundedness and answer relevance to confirm the fix."**

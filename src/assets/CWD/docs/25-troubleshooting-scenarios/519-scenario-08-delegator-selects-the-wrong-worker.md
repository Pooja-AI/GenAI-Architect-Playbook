### Scenario 8: Delegator selects the wrong Worker

I would troubleshoot the **Worker discovery and selection layer**:

1. **Check task understanding**

   * Did the Delegator correctly understand the task?

2. **Check Worker Registry**

   * Is each Worker registered with the correct **capabilities, tools, and descriptions**?
   * Example: Salesforce Worker vs ServiceNow Worker.

3. **Check routing logic**

   * Is the Delegator using rules, LLM-based selection, or both?
   * Are capability matches ambiguous?

4. **Check input/entity**

   * Is `customer_id`, ticket ID, or other entity correctly extracted?

5. **Check confidence**

   * If confidence is low, use **fallback or clarification** instead of selecting blindly.

6. **Check evaluation**

   * Create test cases for each Worker and measure **Worker-selection accuracy**.

### Interview answer

> **"I would first verify the task and entities, then check the Worker Registry to make sure capabilities and metadata are accurate. I would inspect the Delegator's routing decision and confidence. For ambiguous cases, I would use a fallback or clarification path. Finally, I would monitor Worker-selection accuracy with a set of routing test cases."**

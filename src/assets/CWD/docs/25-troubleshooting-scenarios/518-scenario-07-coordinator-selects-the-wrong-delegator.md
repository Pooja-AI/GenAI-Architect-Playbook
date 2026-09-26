### Scenario 7: Coordinator selects the wrong Delegator

I would troubleshoot the **routing/intent-classification layer**:

1. **Check user intent**

   * Was the request classified correctly?
   * Example: *customer issue* → Sales vs IT/Service.

2. **Check entity extraction**

   * Was `customer_id`, intent, or other key information extracted correctly?

3. **Check Agent Registry**

   * Is the correct Delegator registered?
   * Are its **capabilities, descriptions, and routing rules** accurate?

4. **Check routing logic**

   * Is routing based on rules, LLM classification, or both?
   * Are there ambiguous intents?

5. **Check confidence**

   * If confidence is low, don't blindly route.
   * Ask for clarification or use a fallback path.

6. **Check evaluation**

   * Maintain test cases for different intents and measure **routing accuracy/confusion matrix**.

### Interview answer

> **"I would first verify intent and entity extraction, then check the Agent Registry and Delegator capability metadata. I would inspect the routing decision and confidence score. For ambiguous requests, I would use a clarification or fallback path rather than blindly selecting a Delegator. Finally, I would add routing test cases and monitor routing accuracy to prevent regression."**

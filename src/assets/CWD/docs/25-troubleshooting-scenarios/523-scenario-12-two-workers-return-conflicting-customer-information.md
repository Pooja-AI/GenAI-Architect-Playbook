### Scenario 12: Two Workers return conflicting customer information

I would handle this as a **data consistency and source-of-truth problem**.

1. **Identify the sources**

   * Example: Salesforce says one address, Oracle says another.

2. **Define source of truth**

   * Establish which system is authoritative for each field.
   * Example: Salesforce → customer profile; ServiceNow → incidents.

3. **Check data freshness**

   * Compare timestamps / `last_updated`.
   * One system may contain stale data.

4. **Validate the records**

   * Confirm both Workers queried the **same customer ID**.
   * Check whether the data was transformed incorrectly.

5. **Delegator conflict handling**

   * Don't let the LLM arbitrarily choose.
   * Apply deterministic conflict rules.

6. **Expose uncertainty**

   * If the conflict cannot be resolved, return both values with their sources and flag it for review.

### Interview answer

> **"I would first identify the conflicting sources and verify that both Workers queried the same customer. Then I would apply a predefined source-of-truth and freshness policy. The Delegator should not allow the LLM to arbitrarily choose between conflicting values. If the conflict cannot be resolved automatically, I would return the conflicting values with source and timestamp information and trigger human review when required."**

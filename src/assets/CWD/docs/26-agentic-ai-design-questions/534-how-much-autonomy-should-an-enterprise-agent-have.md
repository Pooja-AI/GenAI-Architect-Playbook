### How much autonomy should an enterprise agent have?

**Autonomy should be based on risk, not capability.**

A simple model:

| Action type                            | Autonomy                        |
| -------------------------------------- | ------------------------------- |
| Read/search data                       | **High**                        |
| Generate summaries/reports             | **High**                        |
| Internal analysis                      | **High**                        |
| Low-risk updates                       | **Controlled**                  |
| Financial/customer-impacting actions   | **Human approval**              |
| Destructive/security-sensitive actions | **Human approval / restricted** |

For CWD:

```text
Low Risk
   ↓
Agent can act automatically
   ↓
Medium Risk
   ↓
Policy + authorization + validation
   ↓
High Risk
   ↓
Human approval
```

**Interview answer:**

> “I would not give an enterprise agent unlimited autonomy. I would use risk-based autonomy. Read-only and low-impact activities can be highly autonomous, while actions that change data, affect customers, have financial impact, or are destructive should require stronger controls and potentially human approval. The principle is: automate the decision and execution as much as safely possible, but keep humans in control of high-impact actions.”

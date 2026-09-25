## Prevent untested AI model deployment

I would make **AI evaluation a mandatory CI/CD quality gate** before production.

```text
New Model / Prompt
       ↓
CodeBuild
       ↓
Unit + Integration Tests
       ↓
LLM Evaluation
 ├─ Accuracy
 ├─ Groundedness
 ├─ Hallucination
 ├─ Safety
 └─ Latency / Cost
       ↓
   Quality Gate
    ↙       ↘
 FAIL       PASS
  ↓           ↓
STOP       Staging
              ↓
          Approval
              ↓
           Canary
              ↓
           PROD
```

### Key controls

1. **Golden evaluation dataset** → test the model against known examples.
2. **Automated thresholds** → deployment fails if quality drops below the approved baseline.
3. **Security/safety tests** → prompt injection, unsafe outputs, data leakage.
4. **Regression testing** → compare new model against the current production model.
5. **Human approval** → required before production for high-risk changes.
6. **Canary deployment** → expose the new model to limited traffic first.
7. **Automatic rollback** → rollback if quality, latency, errors, or cost degrade.

### Example

```text
Current model: groundedness = 92%
New model:     groundedness = 84%

Required:      >= 90%

             ↓
          ❌ BLOCK
```

### Interview answer

> “I would treat the AI model like a production software artifact and make evaluation a mandatory CI/CD gate. Before deployment, I would run a golden dataset, regression, groundedness, hallucination, safety, latency, and cost evaluations against the current production baseline. If the model fails the required thresholds, the pipeline stops. Only a passing model moves to staging, approval, and finally canary production deployment.”

**Memory:**
**Evaluate → Compare → Gate → Approve → Canary → Monitor → Rollback**

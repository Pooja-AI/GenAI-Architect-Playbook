## How would you perform A/B testing between models?

I would send **different user/request traffic to two model versions** and compare their results using the same evaluation metrics.

```text
                    Requests
                       ↓
                 Model Router
                  ↙       ↘
             Model A      Model B
               50%          50%
                  ↘       ↙
                 Metrics
                    ↓
              Compare Results
```

### Practical approach

1. Deploy **Model A** and **Model B** separately.
2. Route traffic, for example **50% → A, 50% → B**.
3. Keep the same input population and evaluation period.
4. Collect:

   * Accuracy / F1
   * Error rate
   * P95/P99 latency
   * Cost
   * Business-specific quality metrics
5. Compare the results.
6. If B meets the required quality and operational thresholds, gradually increase its traffic.

### CWD example

```text
Customer requests
      ↓
   Router
   ↙    ↘
 v1      v2
50%     50%
```

For an intent-classification model, compare **F1, false positives, latency, and cost**.

### Interview answer

> “I would deploy both model versions and use a routing layer to split traffic between them. I would keep the experiment population and evaluation period consistent, then compare model quality, latency, error rate, and cost. If the new model meets the predefined acceptance criteria, I would gradually increase its traffic and eventually promote it.”

**Memory:** `Deploy A/B → Split Traffic → Measure → Compare → Gradually Promote`

## How do you prevent a bad prompt from reaching production?

In CWD, I treat prompts as **versioned production artifacts**. A prompt cannot go directly from development to production. It has to pass **evaluation, security, regression, and approval gates**.

### Flow

```text
Prompt Change
     ↓
Git / Prompt Registry
     ↓
Pull Request
     ↓
Prompt Validation
     ↓
Security Tests
     ↓
Golden Dataset Evaluation
     ↓
Regression Comparison
     ↓
Human Approval
     ↓
Staging
     ↓
Canary
     ↓
Production
```

### 1. Never overwrite the production prompt

Suppose production is:

```text
customer_briefing_prompt v3.1
```

A developer creates:

```text
customer_briefing_prompt v3.2
```

I keep v3.1 unchanged.

```text
v3.1 → ACTIVE
v3.2 → CANDIDATE
```

This gives me an immediate rollback option.

---

### 2. Run automated validation

Before evaluation, I validate the prompt itself:

```text
✓ Required variables exist
✓ Template syntax is valid
✓ Expected output format is defined
✓ No secrets
✓ No credentials
✓ No prohibited instructions
✓ Correct prompt version
```

For example, if the prompt requires:

```text
{customer_id}
{context}
```

the pipeline verifies those variables exist.

---

### 3. Run security checks

I test for things such as:

```text
Prompt injection
Unsafe instructions
Data exfiltration
Secret leakage
Unauthorized tool instructions
System-prompt conflicts
```

A prompt should never be allowed to bypass CWD authorization.

For example, a prompt saying:

> "Always call the Salesforce delete tool."

doesn't grant permission to call that tool.

**Authorization remains outside the prompt and LLM.**

---

### 4. Run the golden dataset

This is the most important gate.

I run the new prompt against representative CWD scenarios:

```text
Normal requests
Edge cases
Ambiguous requests
No-data cases
Tool failures
Authorization cases
Prompt injection
Multi-worker workflows
```

For Customer Briefing:

```text
Input
 ↓
Coordinator
 ↓
Sales Delegator + IT Delegator
 ↓
Workers
 ↓
MCP tools
 ↓
Final answer
```

I verify that the new prompt doesn't change expected behavior incorrectly.

---

### 5. Compare against the production prompt

Suppose:

```text
             v3.1       v3.2
Task completion  95%       91%
Groundedness     96%       94%
Tool accuracy    97%       92%
Hallucination     2%        7%
```

If v3.2 violates the predefined quality gates:

```text
❌ Evaluation failed
       ↓
❌ Deployment blocked
```

It never reaches production.

---

### 6. Use deterministic checks + LLM evaluation

I don't rely only on an LLM judge.

I combine:

```text
Deterministic tests
        +
Golden/reference evaluation
        +
LLM-as-a-judge
        +
Security tests
        +
Business validation
```

For example:

```text
Expected Worker = incident_worker
Actual Worker   = customer_worker
```

That can be checked deterministically.

For answer quality or completeness, an evaluation model can provide additional assessment.

---

### 7. Require approval

After automated gates pass:

```text
Developer
   ↓
Automated Evaluation
   ↓
Reviewer Approval
   ↓
Staging
```

For high-risk changes, I require explicit approval before production.

---

### 8. Deploy through canary

I don't immediately expose the new prompt to 100% of users.

```text
v3.1 → 95%
v3.2 → 5%
```

Then monitor:

```text
Task completion
Groundedness
Hallucination
Tool success
Latency
Tokens
Cost
Safety
```

If v3.2 behaves badly:

```text
v3.2 → 0%
v3.1 → 100%
```

---

### 9. Make the prompt version traceable

Every CWD workflow records:

```text
workflow_id
agent_version
prompt_version
model_version
mcp_version
rag_index_version
```

So if a bad response occurs, I can determine exactly which prompt produced it.

---

### 10. Production failures become regression tests

If a prompt causes a production failure:

```text
Production failure
       ↓
Capture sanitized scenario
       ↓
Add to golden dataset
       ↓
Fix prompt
       ↓
Run CI/CD evaluation again
```

This prevents the same regression from coming back.

---

## Interview-ready answer

> **“I prevent bad prompts from reaching production by treating prompts as versioned artifacts with CI/CD quality gates. A new prompt goes through syntax and security validation, deterministic tests, golden-dataset evaluation, regression comparison against the current production prompt, and human approval. For Agentic AI, I specifically evaluate routing, tool selection, task completion, groundedness, hallucination and safety—not just text quality. After staging, I use canary deployment and monitor the new prompt against the production baseline. If any critical gate fails, the pipeline blocks the release; if a regression appears during canary, I immediately roll back to the previous approved prompt.”**

### Easy memory

**Version → Validate → Evaluate → Compare → Approve → Canary → Monitor → Rollback**

### Strong interview line

> **“A prompt is production code from a governance perspective, so I never let an untested prompt reach production.”**

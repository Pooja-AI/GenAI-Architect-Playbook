## What happens when the context exceeds the model limit?

If the context becomes larger than the model's context window, the request can **fail or be rejected**, so in CWD I prevent this before sending the prompt to the LLM.

### CWD approach

```text
Worker Results + RAG Chunks + Conversation
                    ↓
             Token Counter
                    ↓
          Context within limit?
             ↙           ↘
           YES            NO
            ↓              ↓
           LLM       Reduce Context
                           ↓
                 ┌─────────────────┐
                 │ 1. Remove dupes │
                 │ 2. Reduce Top-K │
                 │ 3. Compress     │
                 │ 4. Summarize    │
                 │ 5. Trim history │
                 └─────────────────┘
                           ↓
                    Token validation
                           ↓
                          LLM
```

### 1. Reduce RAG results

For example:

```text
Top 20 chunks
     ↓
Reranking
     ↓
Top 8 chunks
```

If still too large:

```text
Top 8
 ↓
Top 5
```

### 2. Compress the retrieved context

Instead of sending:

> 10 pages of incident history

we extract only information relevant to the user's question.

```text
Raw documents
      ↓
Relevant facts
      ↓
LLM
```

### 3. Summarize conversation history

Instead of sending the complete conversation:

```text
Old conversation → Summary
Recent conversation → Full
```

The LLM receives the summary plus the most recent important messages.

### 4. Summarize Worker results

This is particularly important in CWD.

Suppose three Workers return large responses:

```text
Sales Worker       → 5,000 tokens
ServiceNow Worker  → 4,000 tokens
Customer Worker    → 3,000 tokens
```

I don't simply pass all 12,000 tokens to the Coordinator.

Instead:

```text
Worker Results
     ↓
Structured extraction / summarization
     ↓
Important facts
     ↓
Coordinator
```

For example:

```json
{
  "customer_id": "C123",
  "open_incidents": 2,
  "revenue": "$2.4M",
  "critical_issue": "Cooling failure"
}
```

### 5. Use a token budget

Before calling the LLM, I calculate approximately:

```text
Available Context
=
Model Context Window
- System Prompt
- User Prompt
- Expected Output
- Safety Buffer
```

Then I make sure the input fits within that budget.

### 6. Last-resort handling

If the context is still too large:

```text
Context too large
      ↓
Reduce history
      ↓
Reduce retrieved chunks
      ↓
Compress/summarize
      ↓
Retry
```

If it still cannot fit, I return a controlled response rather than repeatedly retrying the same oversized request.

---

### 🎯 Strong interview answer

> **“If the context exceeds the model limit, I don't send the request as-is. Before the LLM call, I estimate token usage and enforce a context budget. I reduce RAG Top-K, remove duplicate chunks, compress retrieved content, summarize older conversation history, and summarize Worker results before sending them to the Coordinator. I also reserve tokens for the model's output and keep a safety buffer. If the context still cannot fit, I fail gracefully rather than repeatedly sending an oversized request.”**

### Easy memory trick

**Measure → Reduce → Compress → Summarize → Validate → Call**

Key interview line:

> **“Context management happens before the LLM call, not after the context-window error.”**

## How do you reduce prompt size?

In CWD, I reduce prompt size by sending the LLM **only the information it actually needs** instead of sending the entire conversation, all retrieved documents, or raw Worker responses.

### CWD approach

```text
User Request
     ↓
Relevant Context Selection
     ↓
Remove unnecessary history
     ↓
Filter RAG results
     ↓
Rerank
     ↓
Deduplicate
     ↓
Compress / Summarize
     ↓
Structured Worker results
     ↓
Small final prompt
     ↓
LLM
```

### 1. Reduce conversation history

Don't send the complete conversation every time.

```text
Old conversation → Summary
Recent messages  → Keep
Important state  → Keep
```

For example, instead of sending 20 previous turns, maintain a concise summary such as:

```text
Customer = C123
Issue = overheating
User wants = current incidents + sales status
```

### 2. Reduce RAG Top-K

Instead of:

```text
Retrieve 50 chunks
       ↓
Send 50 to LLM
```

use:

```text
Retrieve 30–50
      ↓
Rerank
      ↓
Top 5–10
      ↓
LLM
```

### 3. Remove duplicate information

If several chunks contain the same information, keep only the most relevant one.

### 4. Compress retrieved content

Instead of passing an entire document:

```text
10-page incident report
        ↓
Relevant facts
        ↓
LLM
```

For example:

```text
Root cause: Cooling fan failure
Incident: INC1001
Customer: C123
Status: Resolved
```

### 5. Summarize Worker responses

This is very important in CWD.

Instead of:

```text
Sales Worker → 4,000 tokens
Service Worker → 5,000 tokens
Customer Worker → 3,000 tokens
```

pass structured summaries:

```json
{
  "customer": "C123",
  "revenue": "$2.4M",
  "open_incidents": 2,
  "critical_issue": "Cooling failure"
}
```

The Coordinator doesn't need every raw API response.

### 6. Keep prompts structured

Avoid unnecessary instructions and repeated information.

For example:

```text
System instructions
+
User request
+
Relevant context
+
Required output format
```

rather than repeatedly including the same instructions in every Worker call.

### 7. Use the right model/task

Simple tasks can use smaller prompts and smaller models.

For example:

```text
Intent classification → short prompt
Entity extraction     → short prompt
Complex synthesis     → richer context
```

---

### 🎯 Strong interview answer

> **“I reduce prompt size by controlling both the conversation history and retrieved context. I summarize older conversation, retrieve only relevant RAG chunks, rerank and reduce Top-K, remove duplicates, and compress large documents. In CWD, I also convert large Worker responses into structured summaries before sending them to the Coordinator. Finally, I keep system instructions concise and avoid repeating information. This reduces token cost and latency while preserving the information needed for accurate reasoning.”**

### Easy memory trick

**History → Filter → Rerank → Deduplicate → Compress → Structure**

Key line:

> **“The goal is not the smallest prompt; it is the smallest prompt that contains enough information to solve the task correctly.”**

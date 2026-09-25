# How do you implement retries for Bedrock?

## Short answer

I implement **bounded retries with exponential backoff and jitter** around the Bedrock call.

I retry only **transient failures** such as throttling or temporary service errors. I don't retry every error.

```text
Worker
  ↓
Bedrock
  ↓
Success? ── Yes → Return result
  │
  No
  ↓
Is error retryable?
  ↓
Yes
  ↓
Exponential backoff + jitter
  ↓
Retry
  ↓
Max retries reached?
  ↓
Fallback / partial response / failure
```

## Key points

### 1. Define retryable errors

Typical candidates include:

* Throttling / `429`
* Temporary service-unavailable errors
* Transient network failures
* Certain gateway/service errors

I would **not automatically retry**:

* Invalid request
* Invalid parameters
* Authentication/authorization failure
* Malformed prompt/request
* Validation errors

Those need correction rather than repeated calls.

---

### 2. Use exponential backoff

Instead of:

```text
Retry immediately
Retry immediately
Retry immediately
```

use:

```text
Attempt 1 → wait ~0.5 sec
Attempt 2 → wait ~1 sec
Attempt 3 → wait ~2 sec
```

The actual delays should be configurable based on the workload and SLA.

---

### 3. Add jitter

Without jitter, multiple CWD Workers may retry simultaneously:

```text
Worker 1 ─┐
Worker 2 ─┤
Worker 3 ─┼── Retry at exactly 2 sec ❌
Worker 4 ─┤
Worker 5 ─┘
```

With jitter:

```text
Worker 1 → 1.8 sec
Worker 2 → 2.2 sec
Worker 3 → 2.6 sec
Worker 4 → 1.9 sec
```

This reduces a **retry storm**.

---

### 4. Limit the number of retries

I don't retry forever.

For example:

```text
max_retries = 2 or 3
```

After the limit:

```text
Bedrock
   ↓
Retry 1
   ↓
Retry 2
   ↓
Retry 3
   ↓
Failed
```

Then the Worker reports failure to the Delegator.

---

# Example code

A simple Python implementation could look like:

```python
import random
import time

MAX_RETRIES = 3
BASE_DELAY = 0.5

def call_bedrock_with_retry(client, request):

    for attempt in range(MAX_RETRIES + 1):

        try:
            return client.invoke_model(**request)

        except ThrottlingException:
            if attempt == MAX_RETRIES:
                raise

            delay = BASE_DELAY * (2 ** attempt)
            jitter = random.uniform(0, 0.5)

            time.sleep(delay + jitter)

        except ServiceUnavailableException:
            if attempt == MAX_RETRIES:
                raise

            delay = BASE_DELAY * (2 ** attempt)
            jitter = random.uniform(0, 0.5)

            time.sleep(delay + jitter)
```

In production, I would generally prefer the **AWS SDK's built-in retry configuration** where appropriate, and add application-level policies only when CWD needs additional control.

---

# 5. Respect service retry guidance

For throttling, if the service provides a retry timing signal such as `Retry-After`, I would respect it.

Conceptually:

```text
Bedrock
   ↓
429
   ↓
Retry-After
   ↓
Wait
   ↓
Retry
```

Don't immediately retry.

---

# 6. Add timeout + retry together

Retry without timeout can be dangerous.

```text
Bedrock call
   ↓
Timeout
   ↓
Retry?
   ↓
Backoff
   ↓
Retry
```

So I normally define both:

```text
Request timeout
+
Maximum retry attempts
+
Maximum retry duration
```

This protects the overall CWD SLA.

---

# 7. Handle retries at Worker level

In CWD:

```text
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
Bedrock
```

The **Worker** should generally own the Bedrock retry logic because it knows the model call details.

Example:

```text
Service Worker
      ↓
Bedrock
      ↓
429
      ↓
Retry
      ↓
Success
```

If all retries fail:

```text
Worker
   ↓
Failure status
   ↓
Delegator
```

The Delegator decides whether the Worker is:

* Mandatory → fail/replan
* Optional → continue with partial result

---

# 8. Prevent duplicate side effects

For a normal Bedrock generation call, retrying generally doesn't create the same kind of external transaction as retrying a destructive enterprise tool.

But if the model response causes:

```text
Bedrock
 ↓
Tool decision
 ↓
Salesforce update
```

I would **not blindly retry the entire workflow**.

Instead:

```text
LLM generation
      ↓
Validate tool call
      ↓
Idempotency check
      ↓
MCP tool execution
```

This prevents duplicate enterprise transactions.

---

# 🎯 Strong interview answer

> **“I implement bounded retries around Bedrock using exponential backoff with jitter. First, I classify errors and retry only transient failures such as throttling or temporary service errors. I respect any service retry guidance, add jitter to prevent retry storms, and limit both retry count and total retry duration so we don't violate the CWD SLA. The Worker owns the Bedrock retry logic, and after retries are exhausted it reports the failure to the Delegator, which decides whether to retry, use an approved fallback, or continue with a partial result. I also combine retries with timeouts, concurrency control and monitoring so retries don't make an overloaded system worse.”**

## Easy memory trick

**C → R → B → J → L → F**

* **C** = Classify error
* **R** = Retry transient errors
* **B** = Backoff
* **J** = Jitter
* **L** = Limit retries
* **F** = Fallback / failure handling

### Key distinction

**Retry policy:** *Should I try again?*

**Backoff:** *When should I try again?*

**Circuit breaker:** *Should I temporarily stop calling Bedrock altogether?*

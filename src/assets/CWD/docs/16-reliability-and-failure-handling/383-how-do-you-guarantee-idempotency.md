## How do you guarantee idempotency?

**Idempotency means executing the same request multiple times produces the same business outcome as executing it once.**

In CWD, this is especially important when we **retry or replay** failed Worker requests.

### CWD example

Suppose the Incident Worker creates a ServiceNow ticket:

```text
Incident Worker
      ↓
MCP Client
      ↓
MCP Server
      ↓
ServiceNow
```

The request reaches ServiceNow and **creates the ticket successfully**, but the response times out:

```text
Worker → ServiceNow
             ↓
       Ticket created ✅
             ↓
       Response lost ❌
```

The Worker thinks it failed and retries.

Without idempotency:

```text
Retry → ServiceNow → Creates another ticket ❌
```

With idempotency:

```text
Request 1
idempotency_key = CWD-5001-TASK-1001
        ↓
ServiceNow creates ticket

Retry
same idempotency_key
        ↓
ServiceNow recognizes duplicate
        ↓
Returns existing result
```

Only **one business transaction** is created.

---

## How I implement it in CWD

### 1. Generate a unique idempotency key

For every business operation:

```python
idempotency_key = f"{workflow_id}:{task_id}:{operation}"
```

Example:

```text
CWD-5001:TASK-1001:create_incident
```

The same logical operation must reuse the **same key during retries/replays**.

---

### 2. Store the key and status

Maintain an idempotency record in a durable store such as Cosmos DB/DynamoDB or an appropriate transactional datastore:

```text
idempotency_key
status
request_hash
result_reference
created_at
expires_at
```

Example:

```text
Key:    CWD-5001:TASK-1001:create_incident
Status: COMPLETED
Result: SNOW-INC-78291
```

---

### 3. Check before executing

Conceptually:

```python
existing = idempotency_store.get(idempotency_key)

if existing and existing.status == "COMPLETED":
    return existing.result

if existing and existing.status == "IN_PROGRESS":
    return wait_or_resume(existing)

# Atomically claim the operation
create_idempotency_record_if_absent(key)

result = execute_business_operation()

save_result(key, result)
```

The important part is that **checking and claiming must be atomic**.

Otherwise:

```text
Worker A → check → not found
Worker B → check → not found
Worker A → create
Worker B → create
```

Both could execute the transaction.

---

## 4. Make downstream operations idempotent

Ideally, the downstream system also supports an idempotency key or unique transaction/reference ID.

For example:

```text
CWD
 ↓
MCP
 ↓
ServiceNow
    idempotency_key = CWD-5001:TASK-1001
```

The MCP Server can pass the appropriate idempotency/reference information to the enterprise API.

**Important:** If the downstream system itself has no idempotency mechanism, the CWD/MCP layer must use a durable deduplication mechanism, but you should avoid claiming that this gives an absolute guarantee against every failure mode.

---

## 5. Use idempotency for replay

This connects directly to your previous DLQ question:

```text
Worker
 ↓
ServiceNow
 ↓
Success, but response lost
 ↓
Retry
 ↓
Same idempotency key
 ↓
Existing transaction returned
```

So **DLQ + replay + idempotency** work together.

---

## What about read operations?

For reads:

```text
get_customer(C12345)
```

Repeating the request normally doesn't create a duplicate business transaction, so idempotency is less critical.

It is especially important for:

* Create
* Update
* Delete
* Payment/financial operations
* Ticket creation
* Sending notifications
* Provisioning resources

---

## Interview-ready answer

> **“I guarantee idempotency by assigning a unique idempotency key to each logical business operation and persisting that key with its execution status and result. Retries and DLQ replays reuse the same key. Before executing, we atomically check and claim the key, and the downstream system or MCP layer also uses the same transaction/reference ID where supported. This prevents duplicate Salesforce or ServiceNow transactions even when a request times out after the actual operation succeeded.”**

### Strong interview line

> **“Retries are safe only when the operation is idempotent. I use durable idempotency keys, atomic deduplication, and downstream transaction IDs to make retries and replays safe.”**

### Easy memory

**Same business operation → Same idempotency key → Atomic check → Execute once → Store result → Retry returns existing result.**

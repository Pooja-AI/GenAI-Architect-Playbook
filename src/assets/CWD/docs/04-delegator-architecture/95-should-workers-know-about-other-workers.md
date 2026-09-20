## Should Workers know about other Workers?

**Normally, no.**

In CWD, Workers should be **independent and loosely coupled**.

```text
Coordinator
     ↓
Delegator
   ↓     ↓
Worker  Worker
```

A Worker should know:

* What **capability** it performs
* What **input** it needs
* Which **tools/APIs** it can call
* What **output** it should return

It should **not know**:

* Which other Workers exist
* Which Worker should run before/after it
* How another Worker works
* How to call another Worker

### Example

Instead of:

```text
CustomerWorker → ContractWorker   ❌
```

The Delegator manages the dependency:

```text
Sales Delegator
      ↓
CustomerWorker
      ↓
ContractWorker
```

If `ContractWorker` depends on customer information, the **Delegator passes the required data** to it.

### Why?

This gives us:

* **Loose coupling**
* **Reusability**
* **Easy testing**
* **Independent scaling**
* **Easier maintenance**

### Interview answer

> **"No, Workers should normally not know about other Workers. Each Worker owns one specific capability, while the Delegator manages dependencies and execution between Workers. This keeps Workers loosely coupled, reusable, and independently maintainable."**

**One line to memorize:**

> **"Workers know their capability and tools; the Delegator knows how Workers work together."**

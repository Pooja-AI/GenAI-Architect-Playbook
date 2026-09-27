## What is the Worst-Case Lookup Complexity?

The **worst-case lookup complexity of a hash table is O(n)**.

This can happen when **many different keys collide** and map to the same bucket/index.

### Example

Suppose several keys map to bucket `5`:

```text
Bucket 5
   ↓
Key A → Key B → Key C → Key D → Key E
```

If we are searching for `Key E`, we may need to check each key:

```text
Key A → Key B → Key C → Key D → Key E
  1       2       3       4       5
```

With `n` elements in the bucket, the lookup takes **O(n)**.

### Complexity

| Case             |   Lookup |
| ---------------- | -------: |
| **Average case** | **O(1)** |
| **Worst case**   | **O(n)** |

### Interview Answer

> **The worst-case lookup complexity of a hash table is O(n), which can occur when many keys collide and the lookup must examine multiple entries in the same bucket.**

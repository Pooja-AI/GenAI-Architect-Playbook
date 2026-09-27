## What is a Hash Collision?

A **hash collision** occurs when **two different keys produce the same hash value or map to the same bucket/index** in a hash table.

### Simple Example

Suppose our hash function is:

```python
def hash_function(key):
    return key % 10
```

Now:

```text
25 → 25 % 10 → 5
35 → 35 % 10 → 5
```

Both `25` and `35` map to index `5`.

```text
Key     Hash
25  ──→   5
35  ──→   5   ← Collision
```

The hash table must have a way to store **both values** even though they have the same location.

### How are collisions handled?

Common techniques are:

1. **Separate Chaining**

   * Multiple elements are stored in the same bucket, commonly using a linked list or another structure.

2. **Open Addressing**

   * If the calculated position is occupied, the hash table searches for another available position.
   * Common methods:

     * Linear probing
     * Quadratic probing
     * Double hashing

### Important Point

A collision is **normal and unavoidable** in hash tables because there can be more possible keys than available buckets.

### Interview Answer

> **A hash collision occurs when two different keys produce the same hash value or map to the same bucket in a hash table. Hash tables handle collisions using techniques such as separate chaining or open addressing.**

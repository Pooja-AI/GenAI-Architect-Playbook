## What is Hashing?

**Hashing** is the process of converting a piece of data, called a **key**, into a fixed-size numeric value using a **hash function**.

The hash value helps a data structure such as a **hash table** determine where to store or find the data.

### Basic idea

```text
Key
 ↓
Hash Function
 ↓
Hash Value
 ↓
Index / Bucket
```

For example:

```python
key = "Pooja"

hash(key)
```

Python generates a hash value for `"Pooja"`.

Conceptually:

```text
"Pooja"
   ↓
Hash Function
   ↓
123456789
   ↓
Bucket / Location
```

The actual hash value is implementation-dependent and may differ between Python runs.

---

### Why is hashing useful?

Hashing allows us to locate data **quickly**.

For example:

```python
student = {
    "name": "Pooja",
    "age": 30
}
```

When we do:

```python
student["name"]
```

Conceptually:

```text
"name"
   ↓
hash("name")
   ↓
find location
   ↓
"Pooja"
```

This is why dictionary lookup is **O(1) on average**.

---

### What makes a good hash function?

A good hash function should:

1. **Be deterministic** — the same key should produce a consistent hash in the relevant context.
2. **Distribute keys evenly** — avoid putting too many keys into the same bucket.
3. **Be efficient** — hashing should be fast.
4. **Minimize collisions** — different keys mapping to the same bucket should be relatively uncommon.

---

### What is a collision?

A collision occurs when two different keys produce the same bucket/index.

```text
"John"  ──→ Hash ──→ Bucket 5
"Sarah" ──→ Hash ──→ Bucket 5
```

The hash table must then use a collision-resolution technique such as **chaining** or **open addressing**.

---

### Hashing vs Hash Table

These are related but different:

| Hashing                   | Hash Table                           |
| ------------------------- | ------------------------------------ |
| A technique/process       | A data structure                     |
| Uses a hash function      | Uses hashing to organize data        |
| Converts key → hash value | Stores and retrieves key-value pairs |
| Helps determine location  | Provides fast lookup                 |

### ⭐ Interview answer

> **Hashing is the process of converting a key into a hash value using a hash function. Hash tables use this hash value to determine where data should be stored or retrieved, providing average O(1) lookup, insertion, and deletion.**

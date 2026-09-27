## What is the Average Lookup Complexity?

The **average lookup complexity of a hash table is O(1)** — **constant time**.

This means that, on average, we can find a value **without searching through every element**.

### Example

```python
users = {
    "Alice": 101,
    "Bob": 102,
    "John": 103
}

print(users["Bob"])
```

Conceptually:

```text
"Bob"
  ↓
Hash Function
  ↓
Bucket / Index
  ↓
102
```

The hash function helps directly locate where `"Bob"` is stored.

### Complexity

| Operation |  Average | Worst Case |
| --------- | -------: | ---------: |
| Lookup    | **O(1)** |       O(n) |
| Insertion | **O(1)** |       O(n) |
| Deletion  | **O(1)** |       O(n) |

### Why can lookup become O(n)?

If many keys have **collisions** and end up in the same bucket, the hash table may need to examine multiple entries.

```text
Bucket 5
   ↓
Key A → Key B → Key C → Key D
```

In the worst case, lookup could require checking **n elements → O(n)**.

### Interview Answer

> **The average lookup complexity of a hash table is O(1) because the hash function allows the table to locate the key directly. In the worst case, due to many collisions, lookup can become O(n).**

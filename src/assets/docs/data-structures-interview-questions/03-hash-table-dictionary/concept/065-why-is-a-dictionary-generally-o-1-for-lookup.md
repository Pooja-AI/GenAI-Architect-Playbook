## Why is a dictionary generally O(1) for lookup?

A Python **dictionary (`dict`)** is generally **O(1)** for lookup because it uses **hashing** to quickly determine where a key is stored.

### How it works

When you write:

```python
users = {
    "Alice": 101,
    "Bob": 102,
    "John": 103
}

print(users["Bob"])
```

Python conceptually does:

```text
"Bob"
  ↓
Hash function
  ↓
Hash value
  ↓
Table index
  ↓
Find "Bob"
  ↓
102
```

Instead of checking every key:

```text
Alice → Bob → John → ...
```

the dictionary uses the key's **hash** to locate the appropriate position directly.

### Why O(1)?

The number of elements doesn't normally determine how many locations Python needs to inspect.

For example:

```text
10 elements    → approximately constant lookup
10,000 elements → approximately constant lookup
1,000,000 elements → approximately constant lookup
```

So the **average lookup is O(1)**.

### What about collisions?

Different keys can sometimes map to the same location. Python's dictionary has mechanisms for handling these collisions and maintaining efficient lookup.

In an extreme worst case, lookup can become **O(n)**, but under normal hashing behavior, dictionary lookup is **O(1) on average**.

### Interview Answer

> **A dictionary is generally O(1) for lookup because it uses hashing to map a key to a location in the hash table, allowing the value to be accessed directly without searching through all elements.**

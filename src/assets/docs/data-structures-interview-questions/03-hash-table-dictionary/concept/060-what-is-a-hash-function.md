## What is a Hash Function?

A **hash function** is a function that takes an input (called a **key**) and converts it into a **fixed-size hash value**, usually an integer.

In a **hash table**, this hash value is used to determine where the key-value pair should be stored.

### Simple example

```python
def hash_function(key):
    return key % 10

print(hash_function(25))  # 5
print(hash_function(42))  # 2
```

Here:

```text
Key → Hash Function → Hash Value
25  →      % 10     →     5
42  →      % 10     →     2
```

The hash value can then be used as an **index/bucket location** in a hash table.

### Properties of a good hash function

A good hash function should be:

1. **Deterministic** – same key produces the same hash during its valid lifetime.
2. **Fast** – should calculate the hash efficiently.
3. **Uniformly distributed** – spreads keys across buckets.
4. **Minimizes collisions** – different keys should rarely produce the same hash/index.

### What is a collision?

A collision happens when two different keys produce the same hash/index.

```text
25 → 25 % 10 → 5
35 → 35 % 10 → 5
```

Both keys map to bucket `5`, so the hash table needs a **collision-resolution technique**.

### Hash Function vs Hash Table

| Hash Function                     | Hash Table                             |
| --------------------------------- | -------------------------------------- |
| Converts key → hash value         | Data structure storing key-value pairs |
| Mathematical/algorithmic function | Uses hashing for fast operations       |
| Helps determine location          | Stores and retrieves data              |
| Example: `key % 10`               | Python `dict`                          |

### Interview Answer

> **A hash function is a function that converts a key into a hash value, which is used by a hash table to determine the storage location of that key-value pair. A good hash function is fast, deterministic, distributes keys evenly, and minimizes collisions.**

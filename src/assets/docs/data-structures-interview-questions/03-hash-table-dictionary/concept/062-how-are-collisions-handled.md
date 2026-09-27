## How are collisions handled in a hash table?

When two different keys map to the **same bucket/index**, the hash table uses a **collision-resolution technique** to store both entries.

There are two major approaches:

### 1. Separate Chaining

Each bucket stores multiple entries.

```text
Hash Table

Index 0 → 
Index 1 → (Key A, Value A)
Index 2 → 
Index 3 → (Key B, Value B) → (Key C, Value C)
Index 4 →
```

If `Key B` and `Key C` produce the same index, they are stored together in the same bucket.

**Example:**

```python
25 % 10 = 5
35 % 10 = 5
```

Both go to bucket `5`:

```text
Bucket 5 → [(25, value1), (35, value2)]
```

---

### 2. Open Addressing

Instead of storing multiple entries in one bucket, the hash table finds **another empty position**.

Common methods:

#### Linear Probing

Check the next position sequentially.

```text
25 → index 5
35 → index 5 (occupied)
35 → index 6 (empty)
```

```text
Index 5 → 25
Index 6 → 35
```

#### Quadratic Probing

Instead of checking the next position one by one, it checks positions using increasing square offsets.

```text
5 → 6 → 9 → 14 → ...
```

#### Double Hashing

Uses a **second hash function** to determine how far to move when a collision occurs.

---

### Comparison

| Method                | How collision is handled                  |
| --------------------- | ----------------------------------------- |
| **Separate Chaining** | Store multiple entries in the same bucket |
| **Linear Probing**    | Search next available position            |
| **Quadratic Probing** | Search using quadratic offsets            |
| **Double Hashing**    | Use a second hash function                |

### Python Note

Python's `dict` uses a form of **open addressing**, rather than traditional separate chaining.

### Interview Answer

> **Hash collisions are handled using collision-resolution techniques such as separate chaining and open addressing. Separate chaining stores multiple entries in the same bucket, while open addressing finds another available position using techniques such as linear probing, quadratic probing, or double hashing.**

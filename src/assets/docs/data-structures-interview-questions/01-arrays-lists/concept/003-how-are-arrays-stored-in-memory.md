Arrays are typically stored in **contiguous memory locations**. This is one of the most important concepts for understanding why array index access is **O(1)**.

### 1. Contiguous memory

Suppose we have:

```python
arr = [10, 20, 30, 40, 50]
```

Conceptually, a traditional integer array could be stored like this:

```text
Memory Address

1000 → 10
1004 → 20
1008 → 30
1012 → 40
1016 → 50
```

If each integer takes **4 bytes**, each element is placed immediately after the previous one.

```text
       4 bytes    4 bytes    4 bytes    4 bytes    4 bytes
      ┌────────┬────────┬────────┬────────┬────────┐
      │   10   │   20   │   30   │   40   │   50   │
      └────────┴────────┴────────┴────────┴────────┘
       1000     1004     1008     1012     1016
```

### 2. How does `arr[3]` find 40?

The computer doesn't need to search through the array.

It calculates the address:

```text
Address = Base Address + (Index × Element Size)
```

For `arr[3]`:

```text
1000 + (3 × 4)
= 1012
```

So it directly goes to address `1012` and gets `40`.

That's why:

```python
arr[3]
```

is **O(1)** — constant time.

---

### 3. Why is this important?

Because arrays are contiguous, these operations are typically:

| Operation             |     Time |
| --------------------- | -------: |
| Access `arr[i]`       | **O(1)** |
| Update `arr[i]`       | **O(1)** |
| Search unsorted array | **O(n)** |
| Insert at beginning   | **O(n)** |
| Delete from beginning | **O(n)** |

For example, inserting `5` at the beginning:

```text
Before:
[10, 20, 30, 40]

Insert 5:

[5, 10, 20, 30, 40]
```

The existing elements may need to be shifted, which takes **O(n)**.

### Important Python detail

For **Python lists**, the picture is slightly different.

A Python list is a **dynamic array of references/pointers**, not necessarily a block containing the actual objects themselves:

```text
Python list

┌──────┬──────┬──────┬──────┐
│  ────┼──→10 │  ────┼──→20 │ ...
└──────┴──────┴──────┴──────┘
```

The list's internal array stores references to Python objects.

So when learning for interviews, remember:

> **Traditional arrays store elements in contiguous memory. Python lists use a contiguous dynamic array internally, containing references to objects.**

This contiguous-memory concept leads directly to the next important interview topic: **why array insertion/deletion is O(n), while accessing an element is O(1).**

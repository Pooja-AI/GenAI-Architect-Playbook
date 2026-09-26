The time complexity of **inserting an element at the beginning of an array** is:

# **O(n) — Linear Time**

### Why?

Because when you insert at index `0`, all existing elements generally need to be **shifted one position to the right**.

Example:

```text
Before:
[10, 20, 30, 40]

Insert 5 at beginning:

[5, 10, 20, 30, 40]
```

The elements move:

```text
40 → right
30 → right
20 → right
10 → right
```

For `n` elements, potentially **n elements must be moved**.

### Complexity

| Operation           |               Time |
| ------------------- | -----------------: |
| Insert at beginning |           **O(n)** |
| Insert at middle    |           **O(n)** |
| Insert at end*      | **O(1)** amortized |
| Access `arr[i]`     |           **O(1)** |

*For a dynamic array such as a Python list, appending is **O(1) amortized**, though an occasional resize can take O(n).

### Interview answer

> **Inserting at the beginning of an array is O(n) because the existing elements must be shifted one position to make room for the new element.**

**Easy memory trick:**

> **Beginning → shift elements → O(n)**.

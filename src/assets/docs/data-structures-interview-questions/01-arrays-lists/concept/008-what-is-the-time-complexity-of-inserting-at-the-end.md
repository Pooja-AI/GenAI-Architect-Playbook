The time complexity of **inserting at the end of a dynamic array** is:

# **O(1) — Amortized Constant Time**

### Why?

If there is already space available, the new element is simply placed at the next available position.

```text
Before:
[10, 20, 30, 40]

Insert 50:

[10, 20, 30, 40, 50]
```

No existing elements need to be shifted.

### But why "amortized"?

Sometimes the array has no extra capacity:

```text
[10, 20, 30, 40]  ← full
```

The system must:

1. Allocate a larger memory area
2. Copy the existing elements
3. Add the new element

That particular insertion can take **O(n)**.

However, resizing doesn't happen every time. Spread across many insertions, the average cost is **O(1)**.

### Complexity

| Case                    | Complexity |
| ----------------------- | ---------: |
| Normal insertion at end |   **O(1)** |
| Resize required         |   **O(n)** |
| **Amortized**           |   **O(1)** |

### Python example

```python
arr = [10, 20, 30]
arr.append(40)
```

`append()` is **O(1) amortized**.

### Interview answer

> **Inserting at the end of a dynamic array is O(1) amortized because normally we just place the element in the next available position. Occasionally resizing takes O(n), but over many insertions the average cost is O(1).**

**Remember:**

> **End → usually no shifting → O(1) amortized**.

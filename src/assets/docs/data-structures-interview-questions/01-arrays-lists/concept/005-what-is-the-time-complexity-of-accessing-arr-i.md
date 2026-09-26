The time complexity of accessing `arr[i]` is:

# **O(1) — Constant Time**

### Why?

Arrays support **random access**. The computer can calculate the memory address of element `i` directly:

```text
Address = Base Address + (i × Element Size)
```

For example:

```python
arr = [10, 20, 30, 40, 50]

arr[3]   # 40
```

The computer doesn't need to check `10 → 20 → 30` first. It jumps directly to the location of `40`.

### Interview answer

> **Accessing `arr[i]` takes O(1) time because arrays provide random access. The address of an element can be calculated directly from its index.**

| Operation             | Complexity |
| --------------------- | ---------: |
| `arr[i]` access       |   **O(1)** |
| Update `arr[i]`       |   **O(1)** |
| Search                |   **O(n)** |
| Insert at beginning   |   **O(n)** |
| Delete from beginning |   **O(n)** |

**Key thing to remember:**
**Index access → O(1)** because of **random access + contiguous memory**.

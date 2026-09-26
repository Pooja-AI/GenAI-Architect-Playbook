The time complexity of searching an **unsorted array** is:

# **O(n) — Linear Time**

### Why?

Because the elements are not sorted, you may have to check **every element** to find the target.

Example:

```python
arr = [10, 25, 7, 40, 15]
target = 40
```

You may need to check:

```text
10 → 25 → 7 → 40
```

If the target is the **last element**:

```text
10 → 25 → 7 → 40 → 15
```

you check all `n` elements.

### Example code

```python
def search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1
```

### Complexity

| Case                                        | Time Complexity |
| ------------------------------------------- | --------------: |
| **Best case** — target is first             |        **O(1)** |
| **Average case**                            |        **O(n)** |
| **Worst case** — target is last/not present |        **O(n)** |
| Space                                       |        **O(1)** |

### Interview answer

> **Searching an unsorted array takes O(n) time in the worst and average cases because we may need to examine every element. The best case is O(1) if the target is the first element.**

**Remember:**
**Unsorted array → Linear Search → O(n)**.

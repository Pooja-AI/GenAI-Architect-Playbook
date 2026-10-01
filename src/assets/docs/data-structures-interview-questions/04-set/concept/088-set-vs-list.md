### Set vs List in Python

| Feature         | List                      | Set                          |
| --------------- | ------------------------- | ---------------------------- |
| Syntax          | `[]`                      | `{}`                         |
| Ordering        | Ordered                   | Unordered                    |
| Duplicates      | ✅ Allowed                 | ❌ Not allowed                |
| Indexing        | ✅ Yes                     | ❌ No                         |
| Mutable         | ✅ Yes                     | ✅ Yes                        |
| Elements        | Any objects               | Must be hashable             |
| Membership `in` | **O(n)** average          | **O(1)** average             |
| Insertion       | **O(1)** amortized at end | **O(1)** average             |
| Deletion        | **O(n)** by value         | **O(1)** average             |
| Main use        | Maintain a sequence       | Uniqueness + fast membership |

### Example

**List:**

```python
skills = ["Python", "AWS", "Python"]

print(skills[0])
# Python
```

Duplicates are preserved and indexing is available.

**Set:**

```python
skills = {"Python", "AWS", "Python"}

print(skills)
# {"Python", "AWS"}
```

Duplicates are automatically removed.

### Most important difference for interviews

Consider:

```python
items = [1, 2, 3, 4, 5]

3 in items
```

Python may need to scan the list:

```text
1 → 2 → 3
```

So membership is **O(n)**.

With a set:

```python
items = {1, 2, 3, 4, 5}

3 in items
```

Hashing allows Python to locate the element directly on average:

**O(1)**.

### Interview answer

> **“A list is an ordered collection that allows duplicates and supports indexing, while a set is an unordered collection of unique hashable elements. Lists provide O(n) average membership lookup, whereas sets provide O(1) average membership lookup. I use a list when order and indexing matter, and a set when uniqueness and fast membership testing matter.”**

### Common follow-up

**When would you choose a list over a set even though set lookup is faster?**

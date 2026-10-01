### What is a Set in Python?

A **set** is an **unordered collection of unique elements**.

```python
skills = {"Python", "AWS", "Azure", "Python"}

print(skills)
# {'Python', 'AWS', 'Azure'}
```

The duplicate `"Python"` is automatically removed.

### Key properties

* **Unique elements** — duplicates are removed.
* **Mutable** — you can add/remove elements.
* **Unordered** — you don't access elements by index.
* **Hash-based** — average `O(1)` membership lookup.
* Elements themselves must be **hashable**.

```python
skills.add("GCP")
skills.remove("AWS")

print("Python" in skills)   # True
```

### Common operations

```python
a = {1, 2, 3}
b = {3, 4, 5}

a | b       # Union: {1, 2, 3, 4, 5}
a & b       # Intersection: {3}
a - b       # Difference: {1, 2}
a ^ b       # Symmetric difference: {1, 2, 4, 5}
```

### Interview answer

> **“A set is a mutable collection of unique, hashable elements. It is implemented using hashing, so membership checks, insertion, and deletion are O(1) on average. Sets are mainly used for removing duplicates and fast membership testing.”**

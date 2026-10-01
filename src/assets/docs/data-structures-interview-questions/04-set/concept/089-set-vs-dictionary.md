### Set vs Dictionary in Python

Both are **hash-table-based** data structures, but they store different things.

| Feature        | Set                     | Dictionary              |
| -------------- | ----------------------- | ----------------------- |
| Stores         | **Unique values**       | **Key-value pairs**     |
| Syntax         | `{1, 2, 3}`             | `{"a": 1, "b": 2}`      |
| Duplicates     | ❌ No                    | ❌ Keys cannot duplicate |
| Access         | Membership testing      | Lookup by key           |
| `in` operation | Checks values           | Checks **keys**         |
| Average lookup | O(1)                    | O(1)                    |
| Elements/keys  | Must be hashable        | Keys must be hashable   |
| Main purpose   | Uniqueness / membership | Mapping keys → values   |

### Set

```python id="j1r6s9"
skills = {"Python", "AWS", "Azure"}

print("Python" in skills)
# True
```

A set answers:

> **“Does this value exist?”**

### Dictionary

```python id="u6n8c2"
employee = {
    "name": "Pooja",
    "role": "AI Architect"
}

print(employee["role"])
# AI Architect
```

A dictionary answers:

> **“What value is associated with this key?”**

### Important interview point

Dictionary:

```python id="m6j3xw"
"name" in employee
```

checks whether `"name"` is a **key**, not whether `"Pooja"` is a value.

```python id="q3g5mp"
"Pooja" in employee
# False
```

To check values:

```python id="6v0j4f"
"Pooja" in employee.values()
# True
```

### Why are they related internally?

Conceptually, a set can be thought of as storing **keys without associated values**:

```text
Dictionary:
    key → value

Set:
    value → present
```

CPython has separate internal implementations, but both fundamentally use **hash-table techniques**.

### Interview answer

> **“A set stores unique hashable values, while a dictionary stores key-value pairs where the keys must be hashable. Both provide average O(1) lookup. I use a set when I need uniqueness or membership testing, and a dictionary when I need to associate each key with some data.”**


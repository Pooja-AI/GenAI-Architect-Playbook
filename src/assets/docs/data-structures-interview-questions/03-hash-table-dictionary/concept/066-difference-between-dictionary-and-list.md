### Difference between List and Dictionary in Python

| Feature          | List                         | Dictionary                            |
| ---------------- | ---------------------------- | ------------------------------------- |
| Structure        | Ordered collection of values | Collection of key-value pairs         |
| Syntax           | `[]`                         | `{}`                                  |
| Access           | By **index**                 | By **key**                            |
| Example          | `["Pooja", 10, "AI"]`        | `{"name": "Pooja", "experience": 10}` |
| Duplicate values | Allowed                      | Keys must be unique                   |
| Lookup           | `O(n)` generally             | `O(1)` average for key lookup         |
| Use when         | You need a sequence          | You need to map a key to a value      |

### Example

```python
skills = ["Python", "AWS", "Azure"]

print(skills[0])
# Python
```

Here, `0` is the index.

Dictionary:

```python
candidate = {
    "name": "Pooja",
    "experience": 10,
    "skill": "GenAI"
}

print(candidate["skill"])
# GenAI
```

Here, `"skill"` is the key.

### Interview answer

> **A list is an ordered collection where elements are accessed using indexes, while a dictionary stores data as key-value pairs and provides average O(1) lookup by key. I use lists when order and sequential processing matter, and dictionaries when I need fast lookup or want to represent structured key-value data.**

**Follow-up interview question:**
**Why is dictionary lookup O(1) on average while list lookup is O(n)?**

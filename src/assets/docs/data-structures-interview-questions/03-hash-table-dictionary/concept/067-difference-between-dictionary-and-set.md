### Difference between Dictionary and Set in Python

| Feature          | Dictionary                        | Set                                     |
| ---------------- | --------------------------------- | --------------------------------------- |
| Structure        | Key-value pairs                   | Unique values                           |
| Syntax           | `{key: value}`                    | `{value1, value2}`                      |
| Example          | `{"name": "Pooja", "age": 10}`    | `{"Python", "AWS", "Azure"}`            |
| Duplicate values | Keys cannot duplicate; values can | No duplicates                           |
| Access           | By key                            | No indexing/key-based access            |
| Lookup           | Average **O(1)**                  | Average **O(1)**                        |
| Main purpose     | Map a key to a value              | Store unique items / membership testing |

### Dictionary

```python
person = {
    "name": "Pooja",
    "role": "AI Architect"
}

print(person["role"])
# AI Architect
```

A dictionary answers:

> **"Given this key, what is its value?"**

### Set

```python
skills = {"Python", "AWS", "Azure", "Python"}

print(skills)
# {"Python", "AWS", "Azure"}
```

The duplicate `"Python"` is automatically removed.

A set answers:

> **"Does this value exist?"**

```python
if "AWS" in skills:
    print("Found")
```

### Important interview point

Both **dictionary and set are hash-table based**, so membership/key lookup is **O(1) average**, but they serve different purposes.

**Interview answer:**

> “A dictionary stores key-value pairs, whereas a set stores only unique values. Both provide average O(1) lookup using hashing. I use a dictionary when I need to associate data with a key, and a set when I mainly need uniqueness or fast membership checking.”

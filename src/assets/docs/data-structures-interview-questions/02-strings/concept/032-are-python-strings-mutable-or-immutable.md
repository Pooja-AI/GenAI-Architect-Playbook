Python strings are **immutable**.

This means that **once a string is created, its individual characters cannot be changed**.

### Example

```python
name = "Pooja"
name[0] = "R"
```

This gives an error:

```text
TypeError: 'str' object does not support item assignment
```

Instead, Python creates a **new string**:

```python
name = "Pooja"
name = "R" + name[1:]

print(name)
```

Output:

```text
Rooja
```

### Interview answer

> **Python strings are immutable, meaning their contents cannot be modified after creation. Any operation that appears to modify a string actually creates a new string object.**

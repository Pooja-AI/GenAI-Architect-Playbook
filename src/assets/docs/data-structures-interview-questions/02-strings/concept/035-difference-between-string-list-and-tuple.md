### Difference between String, List, and Tuple in Python

| Feature                    | String                 | List                         | Tuple                        |
| -------------------------- | ---------------------- | ---------------------------- | ---------------------------- |
| **Purpose**                | Stores text/characters | Stores a collection of items | Stores a collection of items |
| **Syntax**                 | `"hello"`              | `[1, 2, 3]`                  | `(1, 2, 3)`                  |
| **Mutable?**               | ❌ No                   | ✅ Yes                        | ❌ No                         |
| **Ordered?**               | ✅ Yes                  | ✅ Yes                        | ✅ Yes                        |
| **Allows duplicates?**     | ✅ Yes                  | ✅ Yes                        | ✅ Yes                        |
| **Different data types?**  | Characters only        | ✅ Yes                        | ✅ Yes                        |
| **Indexing?**              | ✅ Yes                  | ✅ Yes                        | ✅ Yes                        |
| **Can be dictionary key?** | ✅ Yes*                 | ❌ No                         | ✅ Yes*                       |
| **Common use**             | Text                   | Data that may change         | Fixed data                   |

*A string or tuple can be a dictionary key if it is hashable; a tuple containing unhashable elements cannot be.

### Example

```python
name = "Pooja"                 # String

numbers = [10, 20, 30]        # List

coordinates = (10, 20, 30)    # Tuple
```

### Main difference

**String**

```python
name = "Pooja"
# Cannot change individual characters
```

**List**

```python
numbers = [10, 20, 30]
numbers[0] = 100
# Can be modified
```

**Tuple**

```python
numbers = (10, 20, 30)
# Cannot modify individual elements
```

### Interview answer

> **A string is an immutable sequence of characters, a list is a mutable ordered collection of elements, and a tuple is an immutable ordered collection of elements.**

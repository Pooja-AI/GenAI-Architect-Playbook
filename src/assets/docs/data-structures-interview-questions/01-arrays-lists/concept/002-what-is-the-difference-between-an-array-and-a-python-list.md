The key point is:

> **A Python `list` is a dynamic, flexible data structure implemented using a dynamic array internally.**

### Array vs Python List

| Feature                  | Traditional Array         | Python List                     |
| ------------------------ | ------------------------- | ------------------------------- |
| **Size**                 | Usually fixed             | **Dynamic**                     |
| **Data types**           | Usually same type         | Can contain different types     |
| **Memory**               | Typically contiguous      | Internally uses a dynamic array |
| **Resize**               | Usually difficult/fixed   | Automatically grows/shrinks     |
| **Access by index**      | `O(1)`                    | `O(1)`                          |
| **Insert at end**        | Depends on implementation | Usually `O(1)` amortized        |
| **Insert/delete middle** | `O(n)`                    | `O(n)`                          |
| **Ease of use**          | More low-level            | Very easy                       |
| **Python example**       | `array` module / NumPy    | `list`                          |

### Example

A traditional typed array might look conceptually like:

```text
int array[5] = {10, 20, 30, 40, 50}
```

It has space for **5 integers**.

A Python list:

```python
numbers = [10, 20, 30]
numbers.append(40)
numbers.append(50)
```

can grow automatically.

Python lists can also contain different types:

```python
data = [10, "hello", 3.14, True]
```

### Why is Python list called a dynamic array?

When you do:

```python
numbers.append(60)
```

Python doesn't require you to manually allocate a larger array. The list implementation manages its storage and may allocate additional capacity when needed.

So for interviews, remember:

**Array**
→ ordered collection
→ commonly fixed-size
→ generally same data type
→ direct index access

**Python List**
→ dynamic array
→ resizable
→ can contain mixed types
→ supports many built-in operations

### Interview answer

If the interviewer asks **"What is the difference between an array and a Python list?"**, you can say:

> "A traditional array generally has a fixed size and stores elements of the same data type. A Python list is a dynamic array that can grow or shrink automatically and can contain elements of different types. Both provide constant-time average indexed access, but Python lists provide much more flexibility and built-in functionality."

### Average Lookup Complexity

For Python's common hash-table structures:

| Data structure | Lookup                      |  Average |
| -------------- | --------------------------- | -------: |
| **List**       | `x in list`                 | **O(n)** |
| **Set**        | `x in set`                  | **O(1)** |
| **Dictionary** | `key in dict` / `dict[key]` | **O(1)** |

### Why Set and Dictionary are O(1)

Both use **hashing**.

```python
my_set = {10, 20, 30, 40}

20 in my_set
```

Python approximately:

```text
20
 ↓
hash(20)
 ↓
hash-table location
 ↓
find element
```

It doesn't normally scan every element.

Similarly:

```python
my_dict = {"name": "Pooja", "role": "AI"}

my_dict["role"]
```

uses the hash of `"role"` to locate the value.

### But remember

**O(1) is average-case, not guaranteed.**

With many hash collisions:

```text
Average: O(1)
Worst case: O(n)
```

### Interview answer

> **“The average lookup complexity of a set and dictionary is O(1), because they use hash tables. For a list, membership lookup is O(n) because elements may need to be checked sequentially. Hash collisions can make dictionary or set lookup degrade toward O(n) in the worst case.”**

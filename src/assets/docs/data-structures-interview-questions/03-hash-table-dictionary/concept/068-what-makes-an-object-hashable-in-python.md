### What makes an object hashable in Python?

An object is **hashable** if:

1. It has a **hash value that does not change during its lifetime**.
2. It can be compared for equality using `__eq__()`.
3. If two objects are equal, they **must have the same hash value**.
4. It can therefore be used as a **dictionary key** or as an element of a **set**.

### Example

```python
x = "hello"

print(hash(x))
# Some integer

my_dict = {x: 100}
my_set = {x}
```

Strings are hashable because they are immutable.

### Common hashable objects

```text
int
float
str
bool
tuple (if all its elements are hashable)
frozenset
```

### Common non-hashable objects

```text
list
dict
set
```

For example:

```python
my_dict = {
    [1, 2, 3]: "value"
}
```

This raises:

```text
TypeError: unhashable type: 'list'
```

because a list is **mutable**. Its contents can change, which would make a previously calculated hash unreliable.

### Important interview example

```python
t = (1, 2, 3)       # hashable
t = (1, [2, 3])     # NOT hashable
```

A tuple itself is immutable, but it is hashable **only if all of its elements are hashable**.

### Strong interview answer

> **“An object is hashable if it has a stable hash value throughout its lifetime and supports equality comparison consistently with that hash. Hashable objects can be used as dictionary keys and set elements. Immutable built-in types such as strings, integers, and suitable tuples are hashable, while mutable types like lists, dictionaries, and sets are not.”**

**Common follow-up:**
**Why can a tuple be hashable while a list is not?**
### Why can a tuple be hashable while a list is not?

The main reason is **mutability**.

* **Tuple → immutable**: Once created, its elements cannot be changed, so its hash can remain stable.
* **List → mutable**: Elements can be added, removed, or modified, so its contents—and therefore a potential hash—could change.

### Example

```python
t = (1, 2, 3)
d = {t: "hello"}     # ✅ Works
```

But:

```python
lst = [1, 2, 3]
d = {lst: "hello"}   # ❌ TypeError: unhashable type: 'list'
```

Imagine Python allowed a list as a dictionary key:

```python
lst = [1, 2, 3]
# hash(lst) → X

lst.append(4)
# list changed
# hash(lst) would need to change
```

That would break the dictionary's hash-table structure because the object could no longer be found in the bucket where it was originally stored.

### Important exception

A tuple is **not automatically hashable**.

```python
t1 = (1, 2, 3)       # ✅ hashable
t2 = (1, [2, 3])     # ❌ not hashable
```

Why?

Because the tuple contains a **list**, which is mutable.

### Interview answer

> **“A tuple can be hashable because it is immutable, so its contents cannot change after creation. A list is mutable, so its contents can change, which would violate the requirement that a hash value remain stable. However, a tuple is hashable only when all of its elements are themselves hashable.”**


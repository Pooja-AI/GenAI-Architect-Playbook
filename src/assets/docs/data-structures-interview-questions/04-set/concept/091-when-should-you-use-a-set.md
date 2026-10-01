### When should you use a `set` in Python?

Use a **set when you need a collection of unique values and fast membership checking**.

### Common use cases

1. **Remove duplicates**

```python
nums = [1, 2, 2, 3, 3, 4]
unique = set(nums)

print(unique)  # {1, 2, 3, 4}
```

2. **Fast membership checking**

```python
allowed_users = {"alice", "bob", "charlie"}

if "bob" in allowed_users:
    print("Allowed")
```

Average lookup: **O(1)**.

3. **Set operations**

```python
a = {1, 2, 3}
b = {2, 3, 4}

print(a & b)  # intersection: {2, 3}
print(a | b)  # union: {1, 2, 3, 4}
print(a - b)  # difference: {1}
```

4. **Find common/unique elements**

```python
common = set(list1) & set(list2)
```

### When NOT to use a set

Don't use a set when:

* You need **duplicates**
* You need **index-based access** like `items[0]`
* You need to preserve a specific sequence/order for your logic

### Interview answer

> **“I use a set when I need unique elements and fast membership checks. Sets provide average O(1) lookup because they are hash-table based, and they are especially useful for deduplication and set operations like union, intersection, and difference.”**

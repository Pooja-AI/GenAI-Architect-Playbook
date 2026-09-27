## What is a Hash Table?

A **hash table** is a data structure that stores data as **key-value pairs** and provides very fast lookup, insertion, and deletion.

In Python, a hash table is commonly represented by a **dictionary (`dict`)**.

### Example

```python
student = {
    "name": "Pooja",
    "age": 30,
    "city": "Dallas"
}
```

Here:

* `"name"` → **key**
* `"Pooja"` → **value**
* `"age"` → **key**
* `30` → **value**

You can quickly access a value using its key:

```python
print(student["name"])
```

Output:

```text
Pooja
```

### How does it work?

A hash table uses a **hash function** to convert a key into a hash value, which determines where the value is stored.

```text
Key
 ↓
Hash Function
 ↓
Hash Value
 ↓
Index / Bucket
 ↓
Value
```

For example:

```text
"name"
   ↓
hash("name")
   ↓
some index
   ↓
"Pooja"
```

### Time Complexity

| Operation |  Average | Worst Case |
| --------- | -------: | ---------: |
| Search    | **O(1)** |       O(n) |
| Insert    | **O(1)** |       O(n) |
| Delete    | **O(1)** |       O(n) |

The average **O(1)** performance is the main advantage of hash tables.

### Interview answer

> **A hash table is a data structure that stores key-value pairs and uses a hash function to map keys to locations, providing average O(1) time for search, insertion, and deletion.**


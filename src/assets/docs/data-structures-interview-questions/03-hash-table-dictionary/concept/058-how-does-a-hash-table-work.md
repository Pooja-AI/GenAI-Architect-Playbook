## How does a Hash Table work?

A hash table works by converting a **key into an index** using a **hash function**, then storing or finding the value at that location.

### Basic flow

```text
        Key
         ↓
   Hash Function
         ↓
    Hash Value
         ↓
   Calculate Index
         ↓
      Bucket
         ↓
   Key + Value
```

Let's walk through it.

---

### 1. Start with a key

Suppose we have:

```python
student = {
    "name": "Pooja"
}
```

The key is:

```text
"name"
```

---

### 2. Hash the key

The hash table passes the key through a **hash function**:

```text
"name"
   ↓
hash function
   ↓
hash value
```

In Python, you can see a hash value with:

```python
hash("name")
```

The exact value isn't important here.

---

### 3. Convert the hash to an index

The hash table uses the hash value to determine a location/bucket in its internal table.

Conceptually:

```text
hash value
    ↓
calculate index
    ↓
index = 4
```

So `"name"` might be associated with bucket `4`.

> The exact index calculation is an implementation detail; conceptually, the hash identifies where to look.

---

### 4. Store the key and value

The table stores something conceptually like:

```text
Bucket 4
---------
"name" → "Pooja"
```

So the complete process is:

```text
"name"
   ↓
hash("name")
   ↓
hash value
   ↓
bucket/index
   ↓
"name" → "Pooja"
```

---

# How does lookup work?

Suppose we execute:

```python
student["name"]
```

The hash table doesn't normally search every entry.

Instead:

```text
"name"
   ↓
Hash Function
   ↓
Hash Value
   ↓
Find Bucket
   ↓
Compare Key
   ↓
"Pooja"
```

That's why dictionary lookup is **O(1) on average**.

---

# What happens when there is a collision?

A **collision** occurs when two different keys map to the same location.

For example:

```text
"name"  ──→ bucket 4
"city"  ──→ bucket 4
```

Both keys want bucket 4.

The hash table needs a **collision-resolution strategy**.

Common approaches include:

### Separate chaining

```text
Bucket 4

"name" → "Pooja"
   ↓
"city" → "Dallas"
```

Multiple entries can be associated with the same bucket.

### Open addressing

The table searches for another available location according to a probing strategy.

```text
Bucket 4 → occupied
Bucket 5 → occupied
Bucket 6 → available
                    ↓
              store the entry
```

---

# What happens when the table gets too full?

As more elements are inserted, collisions can increase.

The hash table can **resize** its underlying storage and redistribute entries. This is commonly called **rehashing**.

Conceptually:

```text
Small table
[ ][X][X][X][X]
       ↓
    resize
       ↓
Larger table
[ ][ ][X][ ][X][ ][ ]
```

The resize operation itself can take **O(n)**, but insertions are typically **O(1) amortized**.

---

# Example with Python

```python
student = {
    "name": "Pooja",
    "age": 30
}
```

When you execute:

```python
student["age"]
```

Conceptually:

```text
"age"
 ↓
hash("age")
 ↓
calculate location
 ↓
find "age"
 ↓
return 30
```

You don't need to manually calculate the hash or manage the buckets—Python's `dict` handles that internally.

---

## Complexity

| Operation |  Average | Worst Case |
| --------- | -------: | ---------: |
| Search    | **O(1)** |       O(n) |
| Insert    | **O(1)** |       O(n) |
| Delete    | **O(1)** |       O(n) |

The **O(n) worst case** can occur when collisions become problematic or when resizing requires many entries to be moved.

---

### ⭐ Interview answer

> **A hash table works by passing a key through a hash function to generate a hash value, using that value to determine a bucket or location, and storing the key-value pair there. During lookup, the same hashing process identifies where to look, giving average O(1) search, insertion, and deletion. Collisions are handled using techniques such as chaining or open addressing.**

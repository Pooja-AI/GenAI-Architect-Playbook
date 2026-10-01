### Why does a set not contain duplicates?

Because a Python `set` is implemented using a **hash table**.

When you add an element:

```python
s = {1, 2, 3}
s.add(2)
```

Python:

1. Calculates the element's **hash**.
2. Uses the hash to find where the element belongs.
3. If an equal element already exists, Python **doesn't add it again**.
4. If it doesn't exist, the element is inserted.

So:

```python
s = {1, 2, 3}
s.add(2)

print(s)
# {1, 2, 3}
```

### Important concept: `hash()` + `==`

Set uniqueness is based on **hashing and equality**.

```python
a = {10}
b = {10}

print(10 in a)
# True
```

Python effectively determines whether the new element matches an existing element using its hash and equality comparison.

### Interview answer

> **“A set doesn't contain duplicates because it uses a hash table. When an element is inserted, Python calculates its hash and checks for an existing equal element. If an equal element is already present, the new element is not inserted. This is why set membership and insertion are O(1) on average.”**

### Very common follow-up

**What happens if two different objects have the same hash value?**

That leads to **hash collision**, which is an important Python interview topic.

### What happens if two different objects have the same hash value?

This is called a **hash collision**.

A hash collision happens when:

```python
hash(a) == hash(b)
```

but:

```python
a != b
```

Python handles this by using **both the hash value and equality comparison (`==`)** to distinguish the objects.

### Example

```python
class Person:
    def __init__(self, name):
        self.name = name

    def __hash__(self):
        return 100

    def __eq__(self, other):
        return self.name == other.name


p1 = Person("Pooja")
p2 = Person("Ravi")

print(hash(p1))
print(hash(p2))
# Both 100

print(p1 == p2)
# False
```

Even though both objects have the same hash, Python knows they are different because:

```python
p1 == p2
# False
```

So both can exist in a set:

```python
people = {p1, p2}

print(len(people))
# 2
```

### How does Python handle it?

Conceptually:

```text
Object
   ↓
hash(object)
   ↓
Hash table location
   ↓
Collision?
   ↓
Yes
   ↓
Compare objects using ==
   ↓
Equal? ── Yes → Don't insert duplicate
   │
   No
   ↓
Keep both objects
```

### Important interview point

**Same hash does NOT mean objects are equal.**

The important rule is:

```text
If a == b
    → hash(a) MUST equal hash(b)

But:

hash(a) == hash(b)
    → does NOT mean a == b
```

### Interview answer

> **“When two different objects have the same hash value, it is called a hash collision. Python handles the collision by using equality comparison in addition to the hash. If the objects are equal, they are treated as the same key or set element; if they are not equal, both can coexist. Hash collisions can reduce performance, but Python's hash-table implementation is designed to handle them.”**

**Next common question:**
**What is the time complexity of dictionary and set operations, and can hash collisions change it?**

### Dictionary and Set Time Complexity

Both **dictionary** and **set** are implemented using hash tables.

| Operation               |  Average | Worst Case |
| ----------------------- | -------: | ---------: |
| Search / lookup         | **O(1)** |   **O(n)** |
| Insert                  | **O(1)** |   **O(n)** |
| Delete                  | **O(1)** |   **O(n)** |
| Update dictionary value | **O(1)** |   **O(n)** |

### Why is the average O(1)?

For a dictionary:

```python
d = {"name": "Pooja", "role": "AI"}
```

When you do:

```python
d["name"]
```

Python approximately does:

```text
"name"
   ↓
hash("name")
   ↓
hash table location
   ↓
find value
```

It doesn't need to scan every key.

Similarly, for a set:

```python
s = {"Python", "AWS", "Azure"}

"Python" in s
```

uses hashing to quickly locate the element.

---

### Can hash collisions change the complexity?

**Yes.**

Suppose:

```text
hash(A) = 100
hash(B) = 100
hash(C) = 100
hash(D) = 100
```

Multiple objects are mapped to the same hash location.

Python must resolve these collisions and perform additional comparisons.

If there are many collisions, lookup becomes slower.

In the theoretical worst case:

```text
O(1) average
O(n) worst case
```

### Important distinction

A collision does **not** mean Python treats the objects as duplicates.

Python checks equality too:

```python
hash(a) == hash(b)   # True

a == b               # Could be False
```

If `a != b`, both can exist in the dictionary/set.

### Strong interview answer

> **“Dictionary and set operations such as lookup, insertion, and deletion are O(1) on average because they use hash tables. In the worst case they can become O(n), mainly due to hash collisions causing multiple objects to occupy the same hash location. Python resolves collisions using additional equality checks, so the same hash does not imply that two objects are equal.”**

### One important interview correction

Don't say:

> ❌ “Dictionary lookup is always O(1).”

Say:

> ✅ **“Dictionary lookup is O(1) on average and O(n) in the worst case.”**

That's the answer interviewers generally expect.

### How is a Set implemented internally in Python?

A Python `set` is implemented internally using a **hash table**.

Conceptually:

```text
             SET
              │
              ▼
        Hash Table
   ┌────┬────┬────┬────┐
   │    │ A  │    │ B  │
   └────┴────┴────┴────┘
          ↑         ↑
       hash(A)   hash(B)
```

When you do:

```python
s = {"Python", "AWS", "Azure"}
```

Python roughly performs:

```text
"Python"
   ↓
hash("Python")
   ↓
calculate table position
   ↓
store object
```

### When checking membership

```python
"Python" in s
```

Python doesn't scan every element like a list.

Conceptually:

```text
"Python"
    ↓
hash("Python")
    ↓
find corresponding table position
    ↓
compare with existing object
    ↓
Found → True
```

That's why membership is **O(1) on average**.

### What about collisions?

Two different objects can have the same hash:

```text
hash(A) = 100
hash(B) = 100
```

Python needs a way to store both. CPython's set implementation uses **open addressing** to resolve collisions.

Conceptually:

```text
Hash → Slot 5
          ↓
       occupied
          ↓
   probe another slot
          ↓
       Slot 8
          ↓
       store object
```

So the set doesn't simply depend on the hash value alone. It uses the hash to locate candidates and equality checks to determine whether the actual element is already present.

### Why can't a list be used as a set element?

Because set elements must be **hashable**:

```python
s = {[1, 2, 3]}   # ❌ TypeError
```

But:

```python
s = {(1, 2, 3)}   # ✅
```

because the tuple is hashable when all its elements are hashable.

### Interview answer

> **“Python sets are implemented using a hash table. Each element is hashed to determine where it should be stored. Membership, insertion, and deletion are O(1) on average. When hash collisions occur, CPython uses open addressing to find another available slot, and equality checks determine whether an equivalent element already exists.”**


### Why are strings immutable in Python?

Python strings are immutable mainly for **safety, performance, and consistency**.

1. **Security** 🔒
   Strings are often used for filenames, usernames, passwords, URLs, etc. Immutability prevents unexpected changes to a string that may be shared or referenced elsewhere.

2. **Performance** ⚡
   Since strings cannot change, Python can safely **reuse the same string object** in some situations, reducing memory usage.

3. **Hashing and dictionaries**
   Strings can be used as **dictionary keys** and **set elements** because their value does not change after they are created.

```python
data = {"name": "Pooja"}
```

Here `"name"` can safely be a dictionary key because its hash remains stable.

4. **Thread safety**
   Immutable objects are safer to share between different parts of a program because one part cannot modify the object unexpectedly.

### Interview answer

> **Python strings are immutable to provide safety, allow efficient memory reuse, maintain stable hash values for use as dictionary keys, and make strings safer to share.**

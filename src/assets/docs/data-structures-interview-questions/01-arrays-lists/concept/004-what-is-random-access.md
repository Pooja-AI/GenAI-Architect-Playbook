### What is Random Access?

**Random access** means you can **directly access any element in a data structure using its index**, without having to go through the elements before it.

For example:

```python
arr = [10, 20, 30, 40, 50]
```

If you want the 4th element:

```python
arr[3]
```

You get:

```text
40
```

The computer can calculate where element `3` is located using:

```text
Address = Base Address + (Index × Element Size)
```

So it doesn't need to read:

```text
10 → 20 → 30 → 40
```

Instead, it can **jump directly to 40**.

### Why is random access O(1)?

Because accessing an element by index takes approximately the same amount of time regardless of where the element is.

```text
arr[0]  → direct access
arr[3]  → direct access
arr[100] → direct access
arr[1,000,000] → direct access
```

Therefore:

> **Random access = O(1) indexed access.**

### Random access vs sequential access

| Random Access               | Sequential Access                      |
| --------------------------- | -------------------------------------- |
| Jump directly to an element | Go through elements one by one         |
| Uses an index/address       | Starts from beginning/current position |
| Usually **O(1)** for arrays | Can be **O(n)**                        |
| Example: `arr[500]`         | Read element 0 → 1 → 2 → ... → 500     |

### Interview answer

> **Random access is the ability to directly access any element using its index without traversing the elements before it. Arrays support random access in O(1) time because their elements are stored in contiguous memory.**

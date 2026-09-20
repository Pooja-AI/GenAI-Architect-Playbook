# How would you perform regression testing?

## Short answer
Regression-test every change to a prompt, model or configuration against a golden dataset.

## Key points
- Run automatically in CI on each change.
- Compare with the baseline and block on a drop beyond threshold.
- Track results per slice (intent, tenant type, difficulty).
- Manage non-determinism with fixed settings and multiple runs.

## CWD context
Add every production failure to the golden dataset.

# Compensation Patterns in CWD

Compensation is the process of correcting the effects of a partially completed workflow when the remaining steps fail and the original operations cannot simply be rolled back.

In CWD, compensation is essential because workflows often cross multiple independent systems:

```
Coordinator
    ↓
Payment Service
    ↓
Inventory Service
    ↓
Order Management
    ↓
Notification Service
```

A failure may occur after payment succeeds but before inventory or order creation completes. Since these systems do not share one transaction, CWD must recover using corrective actions, not assume that one global rollback is possible.

> Rollback reverses an operation. Compensation performs a new operation that corrects its business effect.

# 1. Why distributed rollback is difficult

Consider an online purchase:

```
1. Reserve inventory       → Success
2. Charge payment          → Success
3. Create order            → Failure
4. Send confirmation       → Not executed
```

A traditional database transaction might roll back all changes. But in a distributed workflow:

* The payment service has its own database.

* The inventory service has its own transaction.

* The order service may be unavailable.

* The payment provider may not support immediate reversal.

* An external email may already have been sent.

* Some operations may be irreversible.

Therefore, CWD cannot simply execute:

Python

Run

```
rollback_everything()
```

Instead, it needs a compensation plan.

# 2. Rollback versus compensation

|
Concept

|

Meaning

|

Example

|
| --- | --- | --- |
|

Database rollback

|

Reverses uncommitted changes in one transaction

|

Undo an uncommitted SQL update

|
|

Distributed rollback

|

Attempts to reverse multiple participating operations

|

Two-phase transaction rollback

|
|

Compensation

|

Executes a corrective business action

|

Refund a completed payment

|
|

Reconciliation

|

Checks actual external state

|

Verify whether payment succeeded

|
|

Recovery

|

Restores workflow execution continuity

|

Resume from a persisted checkpoint

|

### Example

Original operation:

```
Charge customer $100
```

Compensating operation:

```
Refund customer $100
```

The refund is not a technical rollback of the original payment transaction. It is a new business transaction that corrects the financial effect.

# 3. The Saga pattern

A common approach for distributed workflows is the Saga pattern.

A Saga divides a workflow into several local transactions. Each successful step has a corresponding compensating action.

```
T1 → T2 → T3 → T4
```

If `T3` fails:

```
T1 → T2 → T3 fails
          ↓
       C2 → C1
```

Where:

* `T1`, `T2`, `T3`, `T4` are forward transactions.

* `C1`, `C2` are compensating actions for `T1` and `T2`.

## Example

```
T1: Reserve inventory
T2: Charge payment
T3: Create order
T4: Send confirmation
```

Compensations:

```
C1: Release inventory
C2: Refund payment
C3: Cancel order
C4: Send correction notification
```

If order creation fails after payment succeeds:

```
T1 → T2 → T3 fails
          ↓
       C2: Refund payment
          ↓
       C1: Release inventory
```

# 4. Compensation lifecycle in CWD

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_127_%22%20width%3D%221190.8428955078125%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%221092.800048828125%22%20viewBox%3D%224%204%201190.8428955078125%201092.800048828125%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_127_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_127_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_127_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_127_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_127_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_127_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_127_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_127_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_127_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_127_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_127_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_127_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_127_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_127_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_127_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_127_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_127_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_127_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_127_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_127_%20.label%20text%2C%23mermaid-_r_127_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_127_%20.node%20rect%2C%23mermaid-_r_127_%20.node%20circle%2C%23mermaid-_r_127_%20.node%20ellipse%2C%23mermaid-_r_127_%20.node%20polygon%2C%23mermaid-_r_127_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_127_%20.rough-node%20.label%20text%2C%23mermaid-_r_127_%20.node%20.label%20text%2C%23mermaid-_r_127_%20.image-shape%20.label%2C%23mermaid-_r_127_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_127_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_127_%20.rough-node%20.label%2C%23mermaid-_r_127_%20.node%20.label%2C%23mermaid-_r_127_%20.image-shape%20.label%2C%23mermaid-_r_127_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_127_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_127_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_127_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_127_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_127_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_127_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_127_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_127_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_127_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_127_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_127_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_127_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_127_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_127_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_127_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_127_%20.icon-shape%2C%23mermaid-_r_127_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_127_%20.icon-shape%20p%2C%23mermaid-_r_127_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_127_%20.icon-shape%20rect%2C%23mermaid-_r_127_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_127_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_127_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_127_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_127_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_127_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_127_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_127_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_127_%20.node%20rect%2C%23mermaid-_r_127_%20.node%20circle%2C%23mermaid-_r_127_%20.node%20ellipse%2C%23mermaid-_r_127_%20.node%20polygon%2C%23mermaid-_r_127_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_127_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_127_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_127_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_127_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_127_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_127_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_127__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_127__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_127__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_127__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_127__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_127__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(725.0968678792318%2C%20439.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-91.69939041137695%22%20y%3D%22-30%22%20width%3D%22183.3987808227539%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorkflow%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20starts%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(725.0968678792318%2C%20539.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-127.125%22%20y%3D%22-30%22%20width%3D%22254.25%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPersist%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20compensation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20plan%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(425.98359425862634%2C%20659.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-108.83735656738281%22%20y%3D%22-30%22%20width%3D%22217.67471313476562%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EExecute%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20forward%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20task%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(936.4345614115397%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-87.59439849853516%22%20y%3D%22-30%22%20width%3D%22175.1887969970703%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETask%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20succeeds%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(162.0749969482422%2C%20233.5999984741211\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-129.07500457763672%22%20y%3D%22-35.599998474121094%22%20width%3D%22258.15000915527344%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPersist%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20completed%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20task%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Eoutput%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(162.0749969482422%2C%20339.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-77.67829895019531%22%20y%3D%22-30%22%20width%3D%22155.35659790039062%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EMore%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20tasks%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-G-13%22%20transform%3D%22translate\(187.967763264974%2C%20539.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-109.5625%22%20y%3D%22-30%22%20width%3D%22219.125%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorkflow%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20completed%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-H-15%22%20transform%3D%22translate\(980.2317606608073%2C%20233.5999984741211\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-86.06361389160156%22%20y%3D%22-30%22%20width%3D%22172.12722778320312%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EClassify%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failure%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-I-17%22%20transform%3D%22translate\(980.2317606608073%2C%20339.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-117.32657623291016%22%20y%3D%22-30%22%20width%3D%22234.6531524658203%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECan%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20retry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20forward%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20task%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-19%22%20transform%3D%22translate\(447.7510655721029%2C%20539.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-110.2208023071289%22%20y%3D%22-30%22%20width%3D%22220.4416046142578%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20within%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20deadline%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-K-23%22%20transform%3D%22translate\(1019.3406194051106%2C%20539.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-127.1187515258789%22%20y%3D%22-30%22%20width%3D%22254.2375030517578%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECreate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20compensation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20plan%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-L-25%22%20transform%3D%22translate\(1019.3406194051106%2C%20664.7999954223633\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-135.3123550415039%22%20y%3D%22-35.599998474121094%22%20width%3D%22270.6247100830078%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECompensate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20completed%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20side%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Eeffects%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-M-27%22%20transform%3D%22translate\(1019.3406194051106%2C%20770.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-123.47565460205078%22%20y%3D%22-30%22%20width%3D%22246.95130920410156%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECompensation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20succeeds%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-N-29%22%20transform%3D%22translate\(773.5852483113606%2C%20941.9999923706055\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-126.77735900878906%22%20y%3D%22-30%22%20width%3D%22253.55471801757812%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPersist%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20compensated%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20state%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-O-31%22%20transform%3D%22translate\(1060.499173482259%2C%20941.9999923706055\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-93.9903335571289%22%20y%3D%22-35.599998474121094%22%20width%3D%22187.9806671142578%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20escalate%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Ecompensation%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-P-33%22%20transform%3D%22translate\(773.5852483113606%2C%201053.1999893188477\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-120.57018280029297%22%20y%3D%22-35.599998474121094%22%20width%3D%22241.14036560058594%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReturn%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failed%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20partially%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Erecovered%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20result%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-Q-35%22%20transform%3D%22translate\(1060.499173482259%2C%201053.1999893188477\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-126.34375%22%20y%3D%22-35.599998474121094%22%20width%3D%22252.6875%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReconciliation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20human%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Eintervention%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M725.0968678792318%2C469.1999969482422L725.0968678792318%2C497.1999969482422%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6NzI1LjA5Njg2Nzg3OTIzMTgsInkiOjQ2OS4xOTk5OTY5NDgyNDIyfSx7IngiOjcyNS4wOTY4Njc4NzkyMzE4LCJ5Ijo1MDEuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M725.0968678792318%2C569.1999969482422L725.0968678792318%2C582.4170409229475Q725.0968678792318%2C584.1999969482422%20724.0110814416049%2C585.6142105106153L724.0110814416049%2C585.6142105106153Q722.925295003978%2C587.0284240729884%20721.5110814416049%2C588.1142105106153L721.5110814416049%2C588.1142105106153Q720.0968678792318%2C589.1999969482422%20718.3139118539372%2C589.1999969482422L498.0689642243507%2C589.1999969482422Q496.286008199056%2C589.1999969482422%20494.8717946366829%2C590.2857833858691L494.8717946366829%2C590.2857833858691Q493.4575810743098%2C591.371569823496%20492.3717946366829%2C592.7857833858691L492.3717946366829%2C592.7857833858691Q491.286008199056%2C594.1999969482422%20491.286008199056%2C595.9829529735368L491.286008199056%2C617.1999969482422%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6NzI1LjA5Njg2Nzg3OTIzMTgsInkiOjU2OS4xOTk5OTY5NDgyNDIyfSx7IngiOjcyNS4wOTY4Njc4NzkyMzE4LCJ5Ijo1ODkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo0OTEuMjg2MDA4MTk5MDU2LCJ5Ijo1ODkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo0OTEuMjg2MDA4MTk5MDU2LCJ5Ijo2MjEuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M360.68118031819665%2C629.1999969482422L360.68118031819665%2C615.9829529735368Q360.68118031819665%2C614.1999969482422%20359.59539388056976%2C612.7857833858691L359.59539388056976%2C612.7857833858691Q358.50960744294287%2C611.371569823496%20357.09539388056976%2C610.2857833858691L357.09539388056976%2C610.2857833858691Q355.68118031819665%2C609.1999969482422%20353.898224292902%2C609.1999969482422L18.782956025294652%2C609.1999969482422Q17%2C609.1999969482422%2015.585786437626904%2C608.1142105106153L15.585786437626904%2C608.1142105106153Q14.17157287525381%2C607.0284240729884%2013.085786437626915%2C605.6142105106153L13.085786437626904%2C605.6142105106153Q12%2C604.1999969482422%2012%2C602.4170409229475L12%2C539.1999969482422L12%2C439.1999969482422L12%2C339.1999969482422L12%2C233.5999984741211L12%2C145L12%2C98.78295602529465Q12%2C97%2013.085786437626904%2C95.58578643762691L13.085786437626904%2C95.58578643762691Q14.17157287525381%2C94.17157287525382%2015.585786437626902%2C93.08578643762691L15.585786437626904%2C93.08578643762691Q17%2C92%2018.78295602529466%2C92L885.8544061369774%2C92Q887.6373621622721%2C92%20889.0515757246452%2C90.91421356237309L889.0515757246452%2C90.91421356237308Q890.4657892870183%2C89.82842712474618%20891.5515757246452%2C88.41421356237309L891.5515757246452%2C88.41421356237309Q892.6373621622721%2C87%20892.6373621622721%2C85.21704397470535L892.6373621622721%2C82%22%20id%3D%22L_C_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_D_0%22%20data-points%3D%22W3sieCI6MzYwLjY4MTE4MDMxODE5NjY1LCJ5Ijo2MjkuMTk5OTk2OTQ4MjQyMn0seyJ4IjozNjAuNjgxMTgwMzE4MTk2NjUsInkiOjYwOS4xOTk5OTY5NDgyNDIyfSx7IngiOjEyLCJ5Ijo2MDkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoxMiwieSI6NTM5LjE5OTk5Njk0ODI0MjJ9LHsieCI6MTIsInkiOjQzOS4xOTk5OTY5NDgyNDIyfSx7IngiOjEyLCJ5IjozMzkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoxMiwieSI6MjMzLjU5OTk5ODQ3NDEyMTF9LHsieCI6MTIsInkiOjE0NX0seyJ4IjoxMiwieSI6OTJ9LHsieCI6ODkyLjYzNzM2MjE2MjI3MjEsInkiOjkyfSx7IngiOjg5Mi42MzczNjIxNjIyNzIxLCJ5Ijo3OH1d%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M936.4345614115397%2C72L936.4345614115397%2C105.21704397470535Q936.4345614115397%2C107%20935.3487749739128%2C108.41421356237309L935.3487749739128%2C108.41421356237309Q934.2629885362859%2C109.82842712474618%20932.8487749739128%2C110.91421356237308L932.8487749739128%2C110.91421356237309Q931.4345614115397%2C112%20929.651605386245%2C112L168.85795297353684%2C112Q167.0749969482422%2C112%20165.66078338586908%2C113.08578643762691L165.66078338586908%2C113.08578643762691Q164.246569823496%2C114.17157287525382%20163.16078338586908%2C115.58578643762691L163.16078338586908%2C115.58578643762691Q162.0749969482422%2C117%20162.0749969482422%2C118.78295602529465L162.0749969482422%2C186%22%20id%3D%22L_D_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_E_0%22%20data-points%3D%22W3sieCI6OTM2LjQzNDU2MTQxMTUzOTcsInkiOjcyfSx7IngiOjkzNi40MzQ1NjE0MTE1Mzk3LCJ5IjoxMTJ9LHsieCI6MTYyLjA3NDk5Njk0ODI0MjIsInkiOjExMn0seyJ4IjoxNjIuMDc0OTk2OTQ4MjQyMiwieSI6MTkwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M162.0749969482422%2C269.1999969482422L162.0749969482422%2C297.1999969482422%22%20id%3D%22L_E_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_E_F_0%22%20data-points%3D%22W3sieCI6MTYyLjA3NDk5Njk0ODI0MjIsInkiOjI2OS4xOTk5OTY5NDgyNDIyfSx7IngiOjE2Mi4wNzQ5OTY5NDgyNDIyLCJ5IjozMDEuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M136.18223063151035%2C369.1999969482422L136.18223063151038%2C382.1289291363767Q136.18223063151038%2C389.1999969482422%20129.1111628196449%2C389.1999969482422L64.18821929026865%2C389.1999969482422Q62.405263264973996%2C389.1999969482422%2060.991049702600904%2C390.2857833858691L60.991049702600904%2C390.2857833858691Q59.576836140227805%2C391.371569823496%2058.49104970260091%2C392.7857833858691L58.491049702600904%2C392.7857833858691Q57.405263264973996%2C394.1999969482422%2057.405263264973996%2C395.98295297353684L57.405263264973996%2C539.1999969482422L57.405263264973996%2C582.4170409229475Q57.405263264973996%2C584.1999969482422%2058.491049702600904%2C585.6142105106153L58.49104970260091%2C585.6142105106153Q59.576836140227805%2C587.0284240729884%2060.991049702600904%2C588.1142105106153L60.991049702600904%2C588.1142105106153Q62.405263264973996%2C589.1999969482422%2064.18821929026865%2C589.1999969482422L397.4331669198551%2C589.1999969482422Q399.2161229451498%2C589.1999969482422%20400.6303365075229%2C590.2857833858691L400.6303365075229%2C590.2857833858691Q402.044550069896%2C591.371569823496%20403.1303365075229%2C592.7857833858691L403.1303365075229%2C592.7857833858691Q404.2161229451498%2C594.1999969482422%20404.2161229451498%2C595.9829529735368L404.2161229451498%2C617.1999969482422%22%20id%3D%22L_F_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_C_0%22%20data-points%3D%22W3sieCI6MTM2LjE4MjIzMDYzMTUxMDM1LCJ5IjozNjkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoxMzYuMTgyMjMwNjMxNTEwMzgsInkiOjM4OS4xOTk5OTY5NDgyNDIyfSx7IngiOjU3LjQwNTI2MzI2NDk3Mzk5NiwieSI6Mzg5LjE5OTk5Njk0ODI0MjJ9LHsieCI6NTcuNDA1MjYzMjY0OTczOTk2LCJ5Ijo1MzkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo1Ny40MDUyNjMyNjQ5NzM5OTYsInkiOjU4OS4xOTk5OTY5NDgyNDIyfSx7IngiOjQwNC4yMTYxMjI5NDUxNDk4LCJ5Ijo1ODkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo0MDQuMjE2MTIyOTQ1MTQ5OCwieSI6NjIxLjE5OTk5Njk0ODI0MjJ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M187.96776326497402%2C369.1999969482422L187.967763264974%2C497.1999969482422%22%20id%3D%22L_F_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_G_0%22%20data-points%3D%22W3sieCI6MTg3Ljk2Nzc2MzI2NDk3NDAyLCJ5IjozNjkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoxODcuOTY3NzYzMjY0OTc0LCJ5Ijo1MDEuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M980.2317606608073%2C72L980.2317606608073%2C191.5999984741211%22%20id%3D%22L_D_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_H_0%22%20data-points%3D%22W3sieCI6OTgwLjIzMTc2MDY2MDgwNzMsInkiOjcyfSx7IngiOjk4MC4yMzE3NjA2NjA4MDczLCJ5IjoxOTUuNTk5OTk4NDc0MTIxMX1d%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M980.2317606608073%2C263.5999984741211L980.2317606608073%2C297.1999969482422%22%20id%3D%22L_H_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_H_I_0%22%20data-points%3D%22W3sieCI6OTgwLjIzMTc2MDY2MDgwNzMsInkiOjI2My41OTk5OTg0NzQxMjExfSx7IngiOjk4MC4yMzE3NjA2NjA4MDczLCJ5IjozMDEuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M941.1229019165039%2C369.1999969482422L941.1229019165039%2C382.41704092294754Q941.1229019165039%2C384.1999969482422%20940.037115478877%2C385.6142105106153L940.037115478877%2C385.6142105106153Q938.9513290412501%2C387.0284240729884%20937.537115478877%2C388.1142105106153L937.537115478877%2C388.1142105106153Q936.1229019165039%2C389.1999969482422%20934.3399458912093%2C389.1999969482422L454.53402159739755%2C389.1999969482422Q452.7510655721029%2C389.1999969482422%20451.3368520097298%2C390.2857833858691L451.3368520097298%2C390.2857833858691Q449.9226384473567%2C391.371569823496%20448.8368520097298%2C392.7857833858691L448.8368520097298%2C392.7857833858691Q447.7510655721029%2C394.1999969482422%20447.7510655721029%2C395.98295297353684L447.7510655721029%2C497.1999969482422%22%20id%3D%22L_I_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_J_0%22%20data-points%3D%22W3sieCI6OTQxLjEyMjkwMTkxNjUwMzksInkiOjM2OS4xOTk5OTY5NDgyNDIyfSx7IngiOjk0MS4xMjI5MDE5MTY1MDM5LCJ5IjozODkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo0NDcuNzUxMDY1NTcyMTAyOSwieSI6Mzg5LjE5OTk5Njk0ODI0MjJ9LHsieCI6NDQ3Ljc1MTA2NTU3MjEwMjksInkiOjUwMS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M447.7510655721029%2C569.1999969482422L447.7510655721029%2C617.1999969482422%22%20id%3D%22L_J_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_J_C_0%22%20data-points%3D%22W3sieCI6NDQ3Ljc1MTA2NTU3MjEwMjksInkiOjU2OS4xOTk5OTY5NDgyNDIyfSx7IngiOjQ0Ny43NTEwNjU1NzIxMDI5LCJ5Ijo2MjEuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1019.3406194051106%2C369.1999969482422L1019.3406194051106%2C497.1999969482422%22%20id%3D%22L_I_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_K_0%22%20data-points%3D%22W3sieCI6MTAxOS4zNDA2MTk0MDUxMTA2LCJ5IjozNjkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoxMDE5LjM0MDYxOTQwNTExMDYsInkiOjUwMS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1019.3406194051106%2C569.1999969482422L1019.3406194051106%2C617.1999969482422%22%20id%3D%22L_K_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_K_L_0%22%20data-points%3D%22W3sieCI6MTAxOS4zNDA2MTk0MDUxMTA2LCJ5Ijo1NjkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoxMDE5LjM0MDYxOTQwNTExMDYsInkiOjYyMS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1019.3406194051106%2C700.3999938964844L1019.3406194051106%2C728.3999938964844%22%20id%3D%22L_L_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_M_0%22%20data-points%3D%22W3sieCI6MTAxOS4zNDA2MTk0MDUxMTA2LCJ5Ijo3MDAuMzk5OTkzODk2NDg0NH0seyJ4IjoxMDE5LjM0MDYxOTQwNTExMDYsInkiOjczMi4zOTk5OTM4OTY0ODQ0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M978.1820653279622%2C800.3999938964844L978.1820653279622%2C813.6170378711897Q978.1820653279622%2C815.3999938964844%20977.0962788903353%2C816.8142074588575L977.0962788903353%2C816.8142074588575Q976.0104924527084%2C818.2284210212306%20974.5962788903353%2C819.3142074588575L974.5962788903353%2C819.3142074588575Q973.1820653279622%2C820.3999938964844%20971.3991093026675%2C820.3999938964844L780.3682043366553%2C820.3999938964844Q778.5852483113606%2C820.3999938964844%20777.1710347489875%2C821.4857803341113L777.1710347489875%2C821.4857803341113Q775.7568211866144%2C822.5715667717382%20774.6710347489875%2C823.9857803341113L774.6710347489875%2C823.9857803341113Q773.5852483113606%2C825.3999938964844%20773.5852483113606%2C827.182949921779L773.5852483113606%2C899.9999923706055%22%20id%3D%22L_M_N_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_M_N_0%22%20data-points%3D%22W3sieCI6OTc4LjE4MjA2NTMyNzk2MjIsInkiOjgwMC4zOTk5OTM4OTY0ODQ0fSx7IngiOjk3OC4xODIwNjUzMjc5NjIyLCJ5Ijo4MjAuMzk5OTkzODk2NDg0NH0seyJ4Ijo3NzMuNTg1MjQ4MzExMzYwNiwieSI6ODIwLjM5OTk5Mzg5NjQ4NDR9LHsieCI6NzczLjU4NTI0ODMxMTM2MDYsInkiOjkwMy45OTk5OTIzNzA2MDU1fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1060.499173482259%2C800.3999938964844L1060.499173482259%2C894.3999938964844%22%20id%3D%22L_M_O_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_M_O_0%22%20data-points%3D%22W3sieCI6MTA2MC40OTkxNzM0ODIyNTksInkiOjgwMC4zOTk5OTM4OTY0ODQ0fSx7IngiOjEwNjAuNDk5MTczNDgyMjU5LCJ5Ijo4OTguMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M773.5852483113606%2C971.9999923706055L773.5852483113606%2C1005.5999908447266%22%20id%3D%22L_N_P_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_N_P_0%22%20data-points%3D%22W3sieCI6NzczLjU4NTI0ODMxMTM2MDYsInkiOjk3MS45OTk5OTIzNzA2MDU1fSx7IngiOjc3My41ODUyNDgzMTEzNjA2LCJ5IjoxMDA5LjU5OTk5MDg0NDcyNjZ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1060.499173482259%2C977.5999908447266L1060.499173482259%2C1005.5999908447266%22%20id%3D%22L_O_Q_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_Q_0%22%20data-points%3D%22W3sieCI6MTA2MC40OTkxNzM0ODIyNTksInkiOjk3Ny41OTk5OTA4NDQ3MjY2fSx7IngiOjEwNjAuNDk5MTczNDgyMjU5LCJ5IjoxMDA5LjU5OTk5MDg0NDcyNjZ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_127__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_D_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(161.82195663452148%2C%20145\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_E_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_E_F_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(57.15222295125329%2C%20439.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_C_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(187.91385014851892%2C%20439.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_G_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(980.1778475443522%2C%20145\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_H_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_H_I_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(447.4980252583822%2C%20439.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_J_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_J_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(1019.2867062886555%2C%20439.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_K_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_K_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_M_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(773.3322079976399%2C%20853.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_M_N_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(1060.445260365804%2C%20853.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_M_O_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_N_P_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_Q_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

The compensation plan should be persisted before or alongside execution, so a Coordinator failure does not erase knowledge of which actions need to be reversed.

# 5. Forward actions and compensating actions

A CWD workflow can represent each task with both its forward and corrective behavior.

Python

Run

```
workflow_steps = [
    {
        "task_id": "reserve_inventory",
        "forward_action": "reserve_inventory",
        "compensation_action": "release_inventory",
    },
    {
        "task_id": "charge_payment",
        "forward_action": "charge_payment",
        "compensation_action": "refund_payment",
    },
    {
        "task_id": "create_order",
        "forward_action": "create_order",
        "compensation_action": "cancel_order",
    },
    {
        "task_id": "send_confirmation",
        "forward_action": "send_confirmation",
        "compensation_action": "send_correction",
    },
]
```

Each completed step should record:

Python

Run

```
{
    "task_id": "charge_payment",
    "status": "completed",
    "output": {
        "payment_id": "pay-123",
        "amount": 100.00,
    },
    "compensation_status": "pending",
}
```

This allows CWD to identify exactly which side effects occurred.

# 6. Compensation is usually executed in reverse order

If the workflow is sequential:

```
T1 → T2 → T3 → T4
```

Compensation normally runs in reverse:

```
C4 → C3 → C2 → C1
```

This is useful because later operations may depend on earlier ones.

Example:

```
1. Create shipment
2. Reserve inventory
3. Charge payment
```

If the workflow fails after payment:

```
Refund payment
Release inventory
Cancel shipment
```

However, reverse order is not always mandatory. The compensation order should follow business dependencies, not merely the original execution order.

# 7. Orchestration-based compensation

In orchestration, the Coordinator explicitly controls the Saga.

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_12b_%22%20width%3D%22963.5%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%22795%22%20viewBox%3D%22-76.5%20-10%20963.5%20795%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22sequence%22%3E%3Cg%3E%3Crect%20x%3D%22687%22%20y%3D%22709%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22O%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-bottom%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22762%22%20y%3D%22741.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22762%22%20dy%3D%220%22%3EOrder%20Worker%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cg%3E%3Crect%20x%3D%22487%22%20y%3D%22709%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22P%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-bottom%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22562%22%20y%3D%22741.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22562%22%20dy%3D%220%22%3EPayment%20Worker%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cg%3E%3Crect%20x%3D%22287%22%20y%3D%22709%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22I%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-bottom%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22362%22%20y%3D%22741.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22362%22%20dy%3D%220%22%3EInventory%20Worker%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cg%3E%3Crect%20x%3D%220%22%20y%3D%22709%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22C%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-bottom%22%3E%3C%2Frect%3E%3Ctext%20x%3D%2275%22%20y%3D%22741.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%2275%22%20dy%3D%220%22%3ECoordinator%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cg%3E%3Cline%20id%3D%22actor3%22%20x1%3D%22762%22%20y1%3D%2265%22%20x2%3D%22762%22%20y2%3D%22709%22%20class%3D%22actor-line%20200%22%20stroke-width%3D%220.5px%22%20stroke%3D%22%23999%22%20name%3D%22O%22%3E%3C%2Fline%3E%3Cg%20id%3D%22root-3%22%3E%3Crect%20x%3D%22687%22%20y%3D%220%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22O%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-top%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22762%22%20y%3D%2232.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22762%22%20dy%3D%220%22%3EOrder%20Worker%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%3E%3Cline%20id%3D%22actor2%22%20x1%3D%22562%22%20y1%3D%2265%22%20x2%3D%22562%22%20y2%3D%22709%22%20class%3D%22actor-line%20200%22%20stroke-width%3D%220.5px%22%20stroke%3D%22%23999%22%20name%3D%22P%22%3E%3C%2Fline%3E%3Cg%20id%3D%22root-2%22%3E%3Crect%20x%3D%22487%22%20y%3D%220%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22P%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-top%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22562%22%20y%3D%2232.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22562%22%20dy%3D%220%22%3EPayment%20Worker%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%3E%3Cline%20id%3D%22actor1%22%20x1%3D%22362%22%20y1%3D%2265%22%20x2%3D%22362%22%20y2%3D%22709%22%20class%3D%22actor-line%20200%22%20stroke-width%3D%220.5px%22%20stroke%3D%22%23999%22%20name%3D%22I%22%3E%3C%2Fline%3E%3Cg%20id%3D%22root-1%22%3E%3Crect%20x%3D%22287%22%20y%3D%220%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22I%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-top%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22362%22%20y%3D%2232.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%22362%22%20dy%3D%220%22%3EInventory%20Worker%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%3E%3Cline%20id%3D%22actor0%22%20x1%3D%2275%22%20y1%3D%2265%22%20x2%3D%2275%22%20y2%3D%22709%22%20class%3D%22actor-line%20200%22%20stroke-width%3D%220.5px%22%20stroke%3D%22%23999%22%20name%3D%22C%22%3E%3C%2Fline%3E%3Cg%20id%3D%22root-0%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23eaeaea%22%20stroke%3D%22%23666%22%20width%3D%22150%22%20height%3D%2265%22%20name%3D%22C%22%20rx%3D%223%22%20ry%3D%223%22%20class%3D%22actor%20actor-top%22%3E%3C%2Frect%3E%3Ctext%20x%3D%2275%22%20y%3D%2232.5%22%20dominant-baseline%3D%22central%22%20alignment-baseline%3D%22central%22%20class%3D%22actor%20actor-box%22%20style%3D%22text-anchor%3A%20middle%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%20font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%22%3E%3Ctspan%20x%3D%2275%22%20dy%3D%220%22%3ECoordinator%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cstyle%3E%23mermaid-_r_12b_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_12b_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_12b_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_12b_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_12b_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_12b_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_12b_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_12b_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_12b_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_12b_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_12b_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_12b_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12b_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12b_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_12b_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_12b_%20.actor%7Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bfill%3Argb\(9%2C%2023%2C%2044\)%3B%7D%23mermaid-_r_12b_%20text.actor%26gt%3Btspan%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_12b_%20.actor-line%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12b_%20.innerArc%7Bstroke-width%3A1.5%3Bstroke-dasharray%3Anone%3B%7D%23mermaid-_r_12b_%20.messageLine0%7Bstroke-width%3A1.5%3Bstroke-dasharray%3Anone%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12b_%20.messageLine1%7Bstroke-width%3A1.5%3Bstroke-dasharray%3A2%2C2%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12b_%20%23arrowhead%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12b_%20.sequenceNumber%7Bfill%3A%23323232%3B%7D%23mermaid-_r_12b_%20%23sequencenumber%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12b_%20%23crosshead%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12b_%20.messageText%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_12b_%20.labelBox%7Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_12b_%20.labelText%2C%23mermaid-_r_12b_%20.labelText%26gt%3Btspan%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_12b_%20.loopText%2C%23mermaid-_r_12b_%20.loopText%26gt%3Btspan%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_12b_%20.loopLine%7Bstroke-width%3A2px%3Bstroke-dasharray%3A2%2C2%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bfill%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3B%7D%23mermaid-_r_12b_%20.note%7Bstroke%3Argb\(58%2C%20132%2C%2063\)%3Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_12b_%20.noteText%2C%23mermaid-_r_12b_%20.noteText%26gt%3Btspan%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Anone%3B%7D%23mermaid-_r_12b_%20.activation0%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Ahsl\(0%2C%200%25%2C%202.9411764706%25\)%3B%7D%23mermaid-_r_12b_%20.activation1%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Ahsl\(0%2C%200%25%2C%202.9411764706%25\)%3B%7D%23mermaid-_r_12b_%20.activation2%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Ahsl\(0%2C%200%25%2C%202.9411764706%25\)%3B%7D%23mermaid-_r_12b_%20.actorPopupMenu%7Bposition%3Aabsolute%3B%7D%23mermaid-_r_12b_%20.actorPopupMenuPanel%7Bposition%3Aabsolute%3Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bbox-shadow%3A0px%208px%2016px%200px%20rgba\(0%2C0%2C0%2C0.2\)%3Bfilter%3Adrop-shadow\(3px%205px%202px%20rgb\(0%200%200%20%2F%200.4\)\)%3B%7D%23mermaid-_r_12b_%20.actor-man%20line%7Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bfill%3Argb\(9%2C%2023%2C%2044\)%3B%7D%23mermaid-_r_12b_%20.actor-man%20circle%2C%23mermaid-_r_12b_%20line%7Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke-width%3A2px%3B%7D%23mermaid-_r_12b_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_12b_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3C%2Fg%3E%3Cdefs%3E%3Csymbol%20id%3D%22computer%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20transform%3D%22scale\(.5\)%22%20d%3D%22M2%202v13h20v-13h-20zm18%2011h-16v-9h16v9zm-10.228%206l.466-1h3.524l.467%201h-4.457zm14.228%203h-24l2-6h2.104l-1.33%204h18.45l-1.297-4h2.073l2%206zm-5-10h-14v-7h14v7z%22%3E%3C%2Fpath%3E%3C%2Fsymbol%3E%3C%2Fdefs%3E%3Cdefs%3E%3Csymbol%20id%3D%22database%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%3E%3Cpath%20transform%3D%22scale\(.5\)%22%20d%3D%22M12.258.001l.256.004.255.005.253.008.251.01.249.012.247.015.246.016.242.019.241.02.239.023.236.024.233.027.231.028.229.031.225.032.223.034.22.036.217.038.214.04.211.041.208.043.205.045.201.046.198.048.194.05.191.051.187.053.183.054.18.056.175.057.172.059.168.06.163.061.16.063.155.064.15.066.074.033.073.033.071.034.07.034.069.035.068.035.067.035.066.035.064.036.064.036.062.036.06.036.06.037.058.037.058.037.055.038.055.038.053.038.052.038.051.039.05.039.048.039.047.039.045.04.044.04.043.04.041.04.04.041.039.041.037.041.036.041.034.041.033.042.032.042.03.042.029.042.027.042.026.043.024.043.023.043.021.043.02.043.018.044.017.043.015.044.013.044.012.044.011.045.009.044.007.045.006.045.004.045.002.045.001.045v17l-.001.045-.002.045-.004.045-.006.045-.007.045-.009.044-.011.045-.012.044-.013.044-.015.044-.017.043-.018.044-.02.043-.021.043-.023.043-.024.043-.026.043-.027.042-.029.042-.03.042-.032.042-.033.042-.034.041-.036.041-.037.041-.039.041-.04.041-.041.04-.043.04-.044.04-.045.04-.047.039-.048.039-.05.039-.051.039-.052.038-.053.038-.055.038-.055.038-.058.037-.058.037-.06.037-.06.036-.062.036-.064.036-.064.036-.066.035-.067.035-.068.035-.069.035-.07.034-.071.034-.073.033-.074.033-.15.066-.155.064-.16.063-.163.061-.168.06-.172.059-.175.057-.18.056-.183.054-.187.053-.191.051-.194.05-.198.048-.201.046-.205.045-.208.043-.211.041-.214.04-.217.038-.22.036-.223.034-.225.032-.229.031-.231.028-.233.027-.236.024-.239.023-.241.02-.242.019-.246.016-.247.015-.249.012-.251.01-.253.008-.255.005-.256.004-.258.001-.258-.001-.256-.004-.255-.005-.253-.008-.251-.01-.249-.012-.247-.015-.245-.016-.243-.019-.241-.02-.238-.023-.236-.024-.234-.027-.231-.028-.228-.031-.226-.032-.223-.034-.22-.036-.217-.038-.214-.04-.211-.041-.208-.043-.204-.045-.201-.046-.198-.048-.195-.05-.19-.051-.187-.053-.184-.054-.179-.056-.176-.057-.172-.059-.167-.06-.164-.061-.159-.063-.155-.064-.151-.066-.074-.033-.072-.033-.072-.034-.07-.034-.069-.035-.068-.035-.067-.035-.066-.035-.064-.036-.063-.036-.062-.036-.061-.036-.06-.037-.058-.037-.057-.037-.056-.038-.055-.038-.053-.038-.052-.038-.051-.039-.049-.039-.049-.039-.046-.039-.046-.04-.044-.04-.043-.04-.041-.04-.04-.041-.039-.041-.037-.041-.036-.041-.034-.041-.033-.042-.032-.042-.03-.042-.029-.042-.027-.042-.026-.043-.024-.043-.023-.043-.021-.043-.02-.043-.018-.044-.017-.043-.015-.044-.013-.044-.012-.044-.011-.045-.009-.044-.007-.045-.006-.045-.004-.045-.002-.045-.001-.045v-17l.001-.045.002-.045.004-.045.006-.045.007-.045.009-.044.011-.045.012-.044.013-.044.015-.044.017-.043.018-.044.02-.043.021-.043.023-.043.024-.043.026-.043.027-.042.029-.042.03-.042.032-.042.033-.042.034-.041.036-.041.037-.041.039-.041.04-.041.041-.04.043-.04.044-.04.046-.04.046-.039.049-.039.049-.039.051-.039.052-.038.053-.038.055-.038.056-.038.057-.037.058-.037.06-.037.061-.036.062-.036.063-.036.064-.036.066-.035.067-.035.068-.035.069-.035.07-.034.072-.034.072-.033.074-.033.151-.066.155-.064.159-.063.164-.061.167-.06.172-.059.176-.057.179-.056.184-.054.187-.053.19-.051.195-.05.198-.048.201-.046.204-.045.208-.043.211-.041.214-.04.217-.038.22-.036.223-.034.226-.032.228-.031.231-.028.234-.027.236-.024.238-.023.241-.02.243-.019.245-.016.247-.015.249-.012.251-.01.253-.008.255-.005.256-.004.258-.001.258.001zm-9.258%2020.499v.01l.001.021.003.021.004.022.005.021.006.022.007.022.009.023.01.022.011.023.012.023.013.023.015.023.016.024.017.023.018.024.019.024.021.024.022.025.023.024.024.025.052.049.056.05.061.051.066.051.07.051.075.051.079.052.084.052.088.052.092.052.097.052.102.051.105.052.11.052.114.051.119.051.123.051.127.05.131.05.135.05.139.048.144.049.147.047.152.047.155.047.16.045.163.045.167.043.171.043.176.041.178.041.183.039.187.039.19.037.194.035.197.035.202.033.204.031.209.03.212.029.216.027.219.025.222.024.226.021.23.02.233.018.236.016.24.015.243.012.246.01.249.008.253.005.256.004.259.001.26-.001.257-.004.254-.005.25-.008.247-.011.244-.012.241-.014.237-.016.233-.018.231-.021.226-.021.224-.024.22-.026.216-.027.212-.028.21-.031.205-.031.202-.034.198-.034.194-.036.191-.037.187-.039.183-.04.179-.04.175-.042.172-.043.168-.044.163-.045.16-.046.155-.046.152-.047.148-.048.143-.049.139-.049.136-.05.131-.05.126-.05.123-.051.118-.052.114-.051.11-.052.106-.052.101-.052.096-.052.092-.052.088-.053.083-.051.079-.052.074-.052.07-.051.065-.051.06-.051.056-.05.051-.05.023-.024.023-.025.021-.024.02-.024.019-.024.018-.024.017-.024.015-.023.014-.024.013-.023.012-.023.01-.023.01-.022.008-.022.006-.022.006-.022.004-.022.004-.021.001-.021.001-.021v-4.127l-.077.055-.08.053-.083.054-.085.053-.087.052-.09.052-.093.051-.095.05-.097.05-.1.049-.102.049-.105.048-.106.047-.109.047-.111.046-.114.045-.115.045-.118.044-.12.043-.122.042-.124.042-.126.041-.128.04-.13.04-.132.038-.134.038-.135.037-.138.037-.139.035-.142.035-.143.034-.144.033-.147.032-.148.031-.15.03-.151.03-.153.029-.154.027-.156.027-.158.026-.159.025-.161.024-.162.023-.163.022-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.011-.178.01-.179.008-.179.008-.181.006-.182.005-.182.004-.184.003-.184.002h-.37l-.184-.002-.184-.003-.182-.004-.182-.005-.181-.006-.179-.008-.179-.008-.178-.01-.176-.011-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.022-.162-.023-.161-.024-.159-.025-.157-.026-.156-.027-.155-.027-.153-.029-.151-.03-.15-.03-.148-.031-.146-.032-.145-.033-.143-.034-.141-.035-.14-.035-.137-.037-.136-.037-.134-.038-.132-.038-.13-.04-.128-.04-.126-.041-.124-.042-.122-.042-.12-.044-.117-.043-.116-.045-.113-.045-.112-.046-.109-.047-.106-.047-.105-.048-.102-.049-.1-.049-.097-.05-.095-.05-.093-.052-.09-.051-.087-.052-.085-.053-.083-.054-.08-.054-.077-.054v4.127zm0-5.654v.011l.001.021.003.021.004.021.005.022.006.022.007.022.009.022.01.022.011.023.012.023.013.023.015.024.016.023.017.024.018.024.019.024.021.024.022.024.023.025.024.024.052.05.056.05.061.05.066.051.07.051.075.052.079.051.084.052.088.052.092.052.097.052.102.052.105.052.11.051.114.051.119.052.123.05.127.051.131.05.135.049.139.049.144.048.147.048.152.047.155.046.16.045.163.045.167.044.171.042.176.042.178.04.183.04.187.038.19.037.194.036.197.034.202.033.204.032.209.03.212.028.216.027.219.025.222.024.226.022.23.02.233.018.236.016.24.014.243.012.246.01.249.008.253.006.256.003.259.001.26-.001.257-.003.254-.006.25-.008.247-.01.244-.012.241-.015.237-.016.233-.018.231-.02.226-.022.224-.024.22-.025.216-.027.212-.029.21-.03.205-.032.202-.033.198-.035.194-.036.191-.037.187-.039.183-.039.179-.041.175-.042.172-.043.168-.044.163-.045.16-.045.155-.047.152-.047.148-.048.143-.048.139-.05.136-.049.131-.05.126-.051.123-.051.118-.051.114-.052.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.051.07-.052.065-.051.06-.05.056-.051.051-.049.023-.025.023-.024.021-.025.02-.024.019-.024.018-.024.017-.024.015-.023.014-.023.013-.024.012-.022.01-.023.01-.023.008-.022.006-.022.006-.022.004-.021.004-.022.001-.021.001-.021v-4.139l-.077.054-.08.054-.083.054-.085.052-.087.053-.09.051-.093.051-.095.051-.097.05-.1.049-.102.049-.105.048-.106.047-.109.047-.111.046-.114.045-.115.044-.118.044-.12.044-.122.042-.124.042-.126.041-.128.04-.13.039-.132.039-.134.038-.135.037-.138.036-.139.036-.142.035-.143.033-.144.033-.147.033-.148.031-.15.03-.151.03-.153.028-.154.028-.156.027-.158.026-.159.025-.161.024-.162.023-.163.022-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.011-.178.009-.179.009-.179.007-.181.007-.182.005-.182.004-.184.003-.184.002h-.37l-.184-.002-.184-.003-.182-.004-.182-.005-.181-.007-.179-.007-.179-.009-.178-.009-.176-.011-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.022-.162-.023-.161-.024-.159-.025-.157-.026-.156-.027-.155-.028-.153-.028-.151-.03-.15-.03-.148-.031-.146-.033-.145-.033-.143-.033-.141-.035-.14-.036-.137-.036-.136-.037-.134-.038-.132-.039-.13-.039-.128-.04-.126-.041-.124-.042-.122-.043-.12-.043-.117-.044-.116-.044-.113-.046-.112-.046-.109-.046-.106-.047-.105-.048-.102-.049-.1-.049-.097-.05-.095-.051-.093-.051-.09-.051-.087-.053-.085-.052-.083-.054-.08-.054-.077-.054v4.139zm0-5.666v.011l.001.02.003.022.004.021.005.022.006.021.007.022.009.023.01.022.011.023.012.023.013.023.015.023.016.024.017.024.018.023.019.024.021.025.022.024.023.024.024.025.052.05.056.05.061.05.066.051.07.051.075.052.079.051.084.052.088.052.092.052.097.052.102.052.105.051.11.052.114.051.119.051.123.051.127.05.131.05.135.05.139.049.144.048.147.048.152.047.155.046.16.045.163.045.167.043.171.043.176.042.178.04.183.04.187.038.19.037.194.036.197.034.202.033.204.032.209.03.212.028.216.027.219.025.222.024.226.021.23.02.233.018.236.017.24.014.243.012.246.01.249.008.253.006.256.003.259.001.26-.001.257-.003.254-.006.25-.008.247-.01.244-.013.241-.014.237-.016.233-.018.231-.02.226-.022.224-.024.22-.025.216-.027.212-.029.21-.03.205-.032.202-.033.198-.035.194-.036.191-.037.187-.039.183-.039.179-.041.175-.042.172-.043.168-.044.163-.045.16-.045.155-.047.152-.047.148-.048.143-.049.139-.049.136-.049.131-.051.126-.05.123-.051.118-.052.114-.051.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.052.07-.051.065-.051.06-.051.056-.05.051-.049.023-.025.023-.025.021-.024.02-.024.019-.024.018-.024.017-.024.015-.023.014-.024.013-.023.012-.023.01-.022.01-.023.008-.022.006-.022.006-.022.004-.022.004-.021.001-.021.001-.021v-4.153l-.077.054-.08.054-.083.053-.085.053-.087.053-.09.051-.093.051-.095.051-.097.05-.1.049-.102.048-.105.048-.106.048-.109.046-.111.046-.114.046-.115.044-.118.044-.12.043-.122.043-.124.042-.126.041-.128.04-.13.039-.132.039-.134.038-.135.037-.138.036-.139.036-.142.034-.143.034-.144.033-.147.032-.148.032-.15.03-.151.03-.153.028-.154.028-.156.027-.158.026-.159.024-.161.024-.162.023-.163.023-.165.021-.166.02-.167.019-.169.018-.169.017-.171.016-.173.015-.173.014-.175.013-.175.012-.177.01-.178.01-.179.009-.179.007-.181.006-.182.006-.182.004-.184.003-.184.001-.185.001-.185-.001-.184-.001-.184-.003-.182-.004-.182-.006-.181-.006-.179-.007-.179-.009-.178-.01-.176-.01-.176-.012-.175-.013-.173-.014-.172-.015-.171-.016-.17-.017-.169-.018-.167-.019-.166-.02-.165-.021-.163-.023-.162-.023-.161-.024-.159-.024-.157-.026-.156-.027-.155-.028-.153-.028-.151-.03-.15-.03-.148-.032-.146-.032-.145-.033-.143-.034-.141-.034-.14-.036-.137-.036-.136-.037-.134-.038-.132-.039-.13-.039-.128-.041-.126-.041-.124-.041-.122-.043-.12-.043-.117-.044-.116-.044-.113-.046-.112-.046-.109-.046-.106-.048-.105-.048-.102-.048-.1-.05-.097-.049-.095-.051-.093-.051-.09-.052-.087-.052-.085-.053-.083-.053-.08-.054-.077-.054v4.153zm8.74-8.179l-.257.004-.254.005-.25.008-.247.011-.244.012-.241.014-.237.016-.233.018-.231.021-.226.022-.224.023-.22.026-.216.027-.212.028-.21.031-.205.032-.202.033-.198.034-.194.036-.191.038-.187.038-.183.04-.179.041-.175.042-.172.043-.168.043-.163.045-.16.046-.155.046-.152.048-.148.048-.143.048-.139.049-.136.05-.131.05-.126.051-.123.051-.118.051-.114.052-.11.052-.106.052-.101.052-.096.052-.092.052-.088.052-.083.052-.079.052-.074.051-.07.052-.065.051-.06.05-.056.05-.051.05-.023.025-.023.024-.021.024-.02.025-.019.024-.018.024-.017.023-.015.024-.014.023-.013.023-.012.023-.01.023-.01.022-.008.022-.006.023-.006.021-.004.022-.004.021-.001.021-.001.021.001.021.001.021.004.021.004.022.006.021.006.023.008.022.01.022.01.023.012.023.013.023.014.023.015.024.017.023.018.024.019.024.02.025.021.024.023.024.023.025.051.05.056.05.06.05.065.051.07.052.074.051.079.052.083.052.088.052.092.052.096.052.101.052.106.052.11.052.114.052.118.051.123.051.126.051.131.05.136.05.139.049.143.048.148.048.152.048.155.046.16.046.163.045.168.043.172.043.175.042.179.041.183.04.187.038.191.038.194.036.198.034.202.033.205.032.21.031.212.028.216.027.22.026.224.023.226.022.231.021.233.018.237.016.241.014.244.012.247.011.25.008.254.005.257.004.26.001.26-.001.257-.004.254-.005.25-.008.247-.011.244-.012.241-.014.237-.016.233-.018.231-.021.226-.022.224-.023.22-.026.216-.027.212-.028.21-.031.205-.032.202-.033.198-.034.194-.036.191-.038.187-.038.183-.04.179-.041.175-.042.172-.043.168-.043.163-.045.16-.046.155-.046.152-.048.148-.048.143-.048.139-.049.136-.05.131-.05.126-.051.123-.051.118-.051.114-.052.11-.052.106-.052.101-.052.096-.052.092-.052.088-.052.083-.052.079-.052.074-.051.07-.052.065-.051.06-.05.056-.05.051-.05.023-.025.023-.024.021-.024.02-.025.019-.024.018-.024.017-.023.015-.024.014-.023.013-.023.012-.023.01-.023.01-.022.008-.022.006-.023.006-.021.004-.022.004-.021.001-.021.001-.021-.001-.021-.001-.021-.004-.021-.004-.022-.006-.021-.006-.023-.008-.022-.01-.022-.01-.023-.012-.023-.013-.023-.014-.023-.015-.024-.017-.023-.018-.024-.019-.024-.02-.025-.021-.024-.023-.024-.023-.025-.051-.05-.056-.05-.06-.05-.065-.051-.07-.052-.074-.051-.079-.052-.083-.052-.088-.052-.092-.052-.096-.052-.101-.052-.106-.052-.11-.052-.114-.052-.118-.051-.123-.051-.126-.051-.131-.05-.136-.05-.139-.049-.143-.048-.148-.048-.152-.048-.155-.046-.16-.046-.163-.045-.168-.043-.172-.043-.175-.042-.179-.041-.183-.04-.187-.038-.191-.038-.194-.036-.198-.034-.202-.033-.205-.032-.21-.031-.212-.028-.216-.027-.22-.026-.224-.023-.226-.022-.231-.021-.233-.018-.237-.016-.241-.014-.244-.012-.247-.011-.25-.008-.254-.005-.257-.004-.26-.001-.26.001z%22%3E%3C%2Fpath%3E%3C%2Fsymbol%3E%3C%2Fdefs%3E%3Cdefs%3E%3Csymbol%20id%3D%22clock%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20transform%3D%22scale\(.5\)%22%20d%3D%22M12%202c5.514%200%2010%204.486%2010%2010s-4.486%2010-10%2010-10-4.486-10-10%204.486-10%2010-10zm0-2c-6.627%200-12%205.373-12%2012s5.373%2012%2012%2012%2012-5.373%2012-12-5.373-12-12-12zm5.848%2012.459c.202.038.202.333.001.372-1.907.361-6.045%201.111-6.547%201.111-.719%200-1.301-.582-1.301-1.301%200-.512.77-5.447%201.125-7.445.034-.192.312-.181.343.014l.985%206.238%205.394%201.011z%22%3E%3C%2Fpath%3E%3C%2Fsymbol%3E%3C%2Fdefs%3E%3Cdefs%3E%3Cmarker%20id%3D%22arrowhead%22%20refX%3D%227.9%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2212%22%20markerHeight%3D%2212%22%20orient%3D%22auto-start-reverse%22%3E%3Cpath%20d%3D%22M%20-1%200%20L%2010%205%20L%200%2010%20z%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3Cdefs%3E%3Cmarker%20id%3D%22crosshead%22%20markerWidth%3D%2215%22%20markerHeight%3D%228%22%20orient%3D%22auto%22%20refX%3D%224%22%20refY%3D%224.5%22%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22%23000000%22%20stroke-width%3D%221pt%22%20d%3D%22M%201%2C2%20L%206%2C7%20M%206%2C2%20L%201%2C7%22%20style%3D%22stroke-dasharray%3A%200%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3Cdefs%3E%3Cmarker%20id%3D%22filled-head%22%20refX%3D%2215.5%22%20refY%3D%227%22%20markerWidth%3D%2220%22%20markerHeight%3D%2228%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%2018%2C7%20L9%2C13%20L14%2C7%20L9%2C1%20Z%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3Cdefs%3E%3Cmarker%20id%3D%22sequencenumber%22%20refX%3D%2215%22%20refY%3D%2215%22%20markerWidth%3D%2260%22%20markerHeight%3D%2240%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%226%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3C%2Fdefs%3E%3Ctext%20x%3D%22217%22%20y%3D%2280%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EReserve%20inventory%3C%2Ftext%3E%3Cline%20x1%3D%2276%22%20y1%3D%22119%22%20x2%3D%22358%22%20y2%3D%22119%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22220%22%20y%3D%22134%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EInventory%20reserved%3C%2Ftext%3E%3Cline%20x1%3D%22361%22%20y1%3D%22173%22%20x2%3D%2279%22%20y2%3D%22173%22%20class%3D%22messageLine1%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22stroke-dasharray%3A%203%2C%203%3B%20fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22317%22%20y%3D%22188%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3ECharge%20payment%3C%2Ftext%3E%3Cline%20x1%3D%2276%22%20y1%3D%22227%22%20x2%3D%22558%22%20y2%3D%22227%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22320%22%20y%3D%22242%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EPayment%20successful%3C%2Ftext%3E%3Cline%20x1%3D%22561%22%20y1%3D%22281%22%20x2%3D%2279%22%20y2%3D%22281%22%20class%3D%22messageLine1%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22stroke-dasharray%3A%203%2C%203%3B%20fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22417%22%20y%3D%22296%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3ECreate%20order%3C%2Ftext%3E%3Cline%20x1%3D%2276%22%20y1%3D%22335%22%20x2%3D%22758%22%20y2%3D%22335%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22420%22%20y%3D%22350%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EFailure%3C%2Ftext%3E%3Cline%20x1%3D%22761%22%20y1%3D%22389%22%20x2%3D%2279%22%20y2%3D%22389%22%20class%3D%22messageLine1%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22stroke-dasharray%3A%203%2C%203%3B%20fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22317%22%20y%3D%22404%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3ECompensate%3A%20refund%20payment%3C%2Ftext%3E%3Cline%20x1%3D%2276%22%20y1%3D%22443%22%20x2%3D%22558%22%20y2%3D%22443%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22320%22%20y%3D%22458%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3ERefund%20successful%3C%2Ftext%3E%3Cline%20x1%3D%22561%22%20y1%3D%22497%22%20x2%3D%2279%22%20y2%3D%22497%22%20class%3D%22messageLine1%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22stroke-dasharray%3A%203%2C%203%3B%20fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22217%22%20y%3D%22512%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3ECompensate%3A%20release%20inventory%3C%2Ftext%3E%3Cline%20x1%3D%2276%22%20y1%3D%22551%22%20x2%3D%22358%22%20y2%3D%22551%22%20class%3D%22messageLine0%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%22220%22%20y%3D%22566%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EInventory%20released%3C%2Ftext%3E%3Cline%20x1%3D%22361%22%20y1%3D%22605%22%20x2%3D%2279%22%20y2%3D%22605%22%20class%3D%22messageLine1%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22stroke-dasharray%3A%203%2C%203%3B%20fill%3A%20none%3B%22%3E%3C%2Fline%3E%3Ctext%20x%3D%2276%22%20y%3D%22620%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20alignment-baseline%3D%22middle%22%20class%3D%22messageText%22%20dy%3D%221em%22%20style%3D%22font-family%3A%20-apple-system%2C%20BlinkMacSystemFont%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Roboto%2C%20Oxygen%2C%20Ubuntu%2C%20Cantarell%2C%20%26quot%3BHelvetica%20Neue%26quot%3B%2C%20Arial%2C%20%26quot%3Bsans-serif%26quot%3B%3B%20font-size%3A%2016px%3B%20font-weight%3A%20400%3B%22%3EMark%20workflow%20compensated%3C%2Ftext%3E%3Cpath%20d%3D%22M%2076%2C659%20C%20136%2C649%20136%2C689%2076%2C679%22%20class%3D%22messageLine1%22%20stroke-width%3D%222%22%20stroke%3D%22none%22%20marker-end%3D%22url\(%23arrowhead\)%22%20style%3D%22stroke-dasharray%3A%203%2C%203%3B%20fill%3A%20none%3B%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E)

### Advantages

* Centralized visibility

* Explicit recovery logic

* Easier auditability

* Coordinator can choose compensation order

* Suitable for complex business workflows

### Disadvantages

* Coordinator becomes responsible for compensation logic

* More orchestration state must be persisted

* Coordinator must handle compensation failures

# 8. Choreography-based compensation

In choreography, services react to events rather than receiving every command from the Coordinator.

```
PaymentCompleted
    ↓
Order Service creates order
    ↓
OrderCreationFailed
    ↓
Payment Service receives event
    ↓
PaymentRefunded
    ↓
Inventory Service releases reservation
```

### Advantages

* Looser coupling

* Services own their local recovery behavior

* Useful for event-driven architectures

### Disadvantages

* Harder to understand the complete workflow

* More difficult to trace compensation

* Event ordering and duplicate events must be handled

* Recovery may require more complex correlation

For CWD, orchestration is often easier for business-critical workflows where the Coordinator already manages task state and execution order.

# 9. Compensation state machine

Compensation should have its own persisted lifecycle.

```
FORWARD_RUNNING
    ↓
FORWARD_FAILED
    ↓
COMPENSATION_REQUIRED
    ↓
COMPENSATING
    ↓
COMPENSATED
```

If compensation fails:

```
COMPENSATING
    ↓
COMPENSATION_FAILED
    ↓
RETRYING_COMPENSATION
    ↓
COMPENSATED
```

If it cannot be completed automatically:

```
COMPENSATION_FAILED
    ↓
MANUAL_REVIEW_REQUIRED
```

Example state:

Python

Run

```
{
    "workflow_id": "wf-2001",
    "status": "compensating",
    "failed_task": "create_order",
    "completed_tasks": [
        "reserve_inventory",
        "charge_payment"
    ],
    "compensation_tasks": [
        {
            "task_id": "refund_payment",
            "status": "completed"
        },
        {
            "task_id": "release_inventory",
            "status": "pending"
        }
    ]
}
```

# 10. Compensation must be idempotent

Compensation itself can fail.

For example:

```
Refund request sent
    ↓
Network timeout
    ↓
CWD does not know whether refund succeeded
```

Retrying the refund blindly could create a duplicate refund.

Therefore, compensation actions also need idempotency keys:

Python

Run

```
compensation_key = (
    f"{workflow_id}:{original_task_id}:refund"
)
```

Example:

Python

Run

```
await payment_service.refund(
    payment_id="pay-123",
    idempotency_key="wf-2001:charge_payment:refund",
)
```

If the same compensation request is received again, the payment service should return the existing result instead of creating another refund.

# 11. Compensation when operations cannot be reversed

Some operations cannot be fully undone.

Examples:

* An email has already been delivered.

* A notification was sent through an external system.

* A customer downloaded a document.

* A physical shipment has already left the warehouse.

* A third-party API performed an irreversible action.

* A model-generated recommendation was already displayed.

* A financial transfer cannot be immediately reversed.

In these cases, CWD uses forward recovery or corrective actions.

## Example: irreversible notification

Original action:

```
Send “Order shipped” notification
```

Compensation:

```
Send “Correction: shipment status updated” notification
```

The original message is not deleted, but the user receives a correction.

## Example: physical shipment

Original action:

```
Dispatch package
```

Possible corrective actions:

```
Request shipment cancellation
Create return request
Update delivery instructions
Issue refund
Escalate to logistics team
```

The correct action depends on the business process.

# 12. Compensation strategies

## Strategy A: Full compensation

Reverse all completed side effects.

```
Payment → Refund
Inventory → Release
Order → Cancel
```

Use when the business process requires complete reversal.

## Strategy B: Partial compensation

Reverse only selected effects.

```
Payment → Refund
Inventory → Keep reservation
```

Use when some completed actions are still useful or should be preserved.

## Strategy C: Forward recovery

Continue the workflow using an alternative path.

```
Primary order creation fails
    ↓
Create order through fallback system
```

## Strategy D: Manual compensation

Escalate when automation cannot safely reverse the operation.

```
Uncertain payment state
    ↓
Create reconciliation case
    ↓
Human verifies payment
    ↓
Refund or complete order manually
```

## Strategy E: Eventual compensation

Queue corrective actions for asynchronous execution.

```
Workflow fails
    ↓
Compensation event persisted
    ↓
Compensation queue
    ↓
Worker retries until completed
```

This is useful when the external service is temporarily unavailable.

# 13. Example: travel booking workflow

Consider a travel-planning workflow:

```
1. Reserve flight
2. Reserve hotel
3. Charge payment
4. Create itinerary
5. Send confirmation
```

Suppose:

```
Flight reservation → Success
Hotel reservation  → Success
Payment            → Success
Itinerary creation → Failure
```

CWD may execute:

```
1. Refund payment
2. Cancel hotel reservation
3. Cancel flight reservation
4. Mark workflow as compensated
```

But if the flight cancellation fails:

```
Flight cancellation → Timeout
```

CWD should not assume the flight was cancelled.

It should:

1. Query the reservation status.

2. Determine whether cancellation succeeded.

3. Retry using the same cancellation key if safe.

4. Create a manual reconciliation case if status remains unknown.

5. Preserve the payment and reservation identifiers.

# 14. Recovery when compensation fails

Compensation failure is often more serious than the original workflow failure because the system may now be inconsistent.

Example:

```
Payment succeeded
Order creation failed
Refund attempted
Refund status unknown
```

CWD should mark the workflow as:

```
PARTIALLY_RECOVERED
```

or:

```
MANUAL_REVIEW_REQUIRED
```

It should not incorrectly report:

```
COMPENSATED
```

unless all required corrective actions have been confirmed.

A recovery record may contain:

JSON

```
{
  "workflow_id": "wf-2001",
  "original_failure": "order_creation_failed",
  "compensation_status": "partial",
  "completed_compensations": [
    "release_inventory"
  ],
  "pending_compensations": [
    "refund_payment"
  ],
  "reconciliation_required": true,
  "priority": "high"
}
```

# 15. Compensation and persisted execution state

The Coordinator must persist enough information to recover after its own failure.

```
Request context
    ↓
Workflow state
    ↓
Completed forward tasks
    ↓
External resource IDs
    ↓
Compensation actions
    ↓
Compensation status
    ↓
Recovery checkpoint
```

Example:

Python

Run

```
{
    "request_id": "req-1001",
    "workflow_id": "wf-2001",
    "user_goal": "Purchase a laptop",
    "status": "compensation_required",
    "completed_steps": [
        "reserve_inventory",
        "charge_payment"
    ],
    "failed_step": "create_order",
    "resources": {
        "reservation_id": "res-123",
        "payment_id": "pay-456"
    },
    "compensation_plan": [
        {
            "action": "refund_payment",
            "resource_id": "pay-456",
            "status": "pending"
        },
        {
            "action": "release_inventory",
            "resource_id": "res-123",
            "status": "pending"
        }
    ]
}
```

If the Coordinator restarts, it can resume compensation instead of repeating the original workflow.

# 16. Compensation with retries

Compensation actions should have their own retry policy.

```
Forward task fails
    ↓
Create compensation task
    ↓
Retry compensation on transient failure
    ↓
Respect timeout and deadline
    ↓
If still failing:
    queue for asynchronous recovery
    or escalate
```

However, compensation may need a different policy from the forward operation.

Example:

```
Forward notification:
    Maximum 2 attempts

Refund:
    Retry until confirmed or reconciled
```

A refund may require durable recovery because financial correctness is more important than completing the original request quickly.

# 17. Compensation versus retrying the original task

The correct action depends on the failure point.

### Case 1: Operation definitely did not execute

```
Order creation request rejected before processing
```

Action:

```
Retry order creation
```

### Case 2: Operation may have executed

```
Order creation request timed out
```

Action:

```
Query order status first
```

### Case 3: Operation definitely succeeded but later task failed

```
Payment succeeded
Order creation failed
```

Action:

```
Compensate payment
```

### Case 4: Operation is irreversible

```
Email already delivered
```

Action:

```
Send correction or escalate
```

# 18. CWD compensation architecture

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_12f_%22%20width%3D%222453.231201171875%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%22346.5%22%20viewBox%3D%224%204%202453.231201171875%20346.5%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_12f_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_12f_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_12f_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_12f_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_12f_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_12f_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_12f_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_12f_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_12f_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_12f_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_12f_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_12f_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12f_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12f_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_12f_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_12f_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_12f_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_12f_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_12f_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_12f_%20.label%20text%2C%23mermaid-_r_12f_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_12f_%20.node%20rect%2C%23mermaid-_r_12f_%20.node%20circle%2C%23mermaid-_r_12f_%20.node%20ellipse%2C%23mermaid-_r_12f_%20.node%20polygon%2C%23mermaid-_r_12f_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_12f_%20.rough-node%20.label%20text%2C%23mermaid-_r_12f_%20.node%20.label%20text%2C%23mermaid-_r_12f_%20.image-shape%20.label%2C%23mermaid-_r_12f_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_12f_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_12f_%20.rough-node%20.label%2C%23mermaid-_r_12f_%20.node%20.label%2C%23mermaid-_r_12f_%20.image-shape%20.label%2C%23mermaid-_r_12f_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_12f_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_12f_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12f_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_12f_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_12f_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_12f_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_12f_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_12f_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_12f_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_12f_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_12f_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_12f_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_12f_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_12f_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_12f_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_12f_%20.icon-shape%2C%23mermaid-_r_12f_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_12f_%20.icon-shape%20p%2C%23mermaid-_r_12f_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_12f_%20.icon-shape%20rect%2C%23mermaid-_r_12f_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_12f_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_12f_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_12f_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_12f_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_12f_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_12f_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_12f_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_12f_%20.node%20rect%2C%23mermaid-_r_12f_%20.node%20circle%2C%23mermaid-_r_12f_%20.node%20ellipse%2C%23mermaid-_r_12f_%20.node%20polygon%2C%23mermaid-_r_12f_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_12f_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_12f_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_12f_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_12f_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_12f_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_12f_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_12f__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_12f__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_12f__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_12f__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_12f__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_12f__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(94.13626861572266%2C%2069\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-82.13626861572266%22%20y%3D%22-30%22%20width%3D%22164.2725372314453%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EUser%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Request%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(349.8822479248047%2C%2069\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-78.38908767700195%22%20y%3D%22-30%22%20width%3D%22156.7781753540039%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECoordinator%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(645.891960144043%2C%2069\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-70.8653335571289%22%20y%3D%22-30%22%20width%3D%22141.7306671142578%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDelegator%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(926.2594757080078%2C%2069\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-96.14251708984375%22%20y%3D%22-30%22%20width%3D%22192.2850341796875%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EForward%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Workers%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(1200.1388244628906%2C%2079\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-94.4011116027832%22%20y%3D%22-30%22%20width%3D%22188.8022232055664%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EExternal%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Systems%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(1504.9700012207031%2C%2079\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-122.72188568115234%22%20y%3D%22-30%22%20width%3D%22245.4437713623047%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPersisted%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Execution%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20State%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-G-11%22%20transform%3D%22translate\(1770.0822372436523%2C%2079\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-97.70361709594727%22%20y%3D%22-30%22%20width%3D%22195.40723419189453%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorkflow%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failure%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-H-13%22%20transform%3D%22translate\(2312.999069213867%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-104.70752716064453%22%20y%3D%22-30%22%20width%3D%22209.41505432128906%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EComplete%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20workflow%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-I-15%22%20transform%3D%22translate\(2328.7613983154297%2C%20312.5\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-120.46986389160156%22%20y%3D%22-30%22%20width%3D%22240.93972778320312%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECompensation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Manager%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-17%22%20transform%3D%22translate\(349.8822479248047%2C%20312.5\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-133.60971069335938%22%20y%3D%22-30%22%20width%3D%22267.21942138671875%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ELoad%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20completed%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20side%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20effects%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-K-19%22%20transform%3D%22translate\(645.891960144043%2C%20252.5\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-122.4000015258789%22%20y%3D%22-30%22%20width%3D%22244.8000030517578%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EBuild%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20compensation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20plan%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-L-21%22%20transform%3D%22translate\(926.2594757080078%2C%20252.5\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-117.96752166748047%22%20y%3D%22-30%22%20width%3D%22235.93504333496094%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECompensation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Workers%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-M-25%22%20transform%3D%22translate\(1210.894187927246%2C%20262.5\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-126.66720581054688%22%20y%3D%22-30%22%20width%3D%22253.33441162109375%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECompensation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20State%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Store%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-N-27%22%20transform%3D%22translate\(1504.9700012207031%2C%20262.5\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-127.40862274169922%22%20y%3D%22-30%22%20width%3D%22254.81724548339844%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EAll%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20corrections%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20confirmed%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-O-29%22%20transform%3D%22translate\(2011.0671081542969%2C%20272.5\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-103.28125%22%20y%3D%22-30%22%20width%3D%22206.5625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EMark%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20compensated%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-P-31%22%20transform%3D%22translate\(2038.0386962890625%2C%20172.5\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-130.25283813476562%22%20y%3D%22-30%22%20width%3D%22260.50567626953125%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%2C%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20reconcile%2C%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20escalate%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M176.2725372314453%2C69L259.4931640625%2C69%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6MTc2LjI3MjUzNzIzMTQ0NTMsInkiOjY5fSx7IngiOjI2My40OTMxNjQwNjI1LCJ5Ijo2OX1d%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M428.2713317871094%2C69L563.0266265869141%2C69%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6NDI4LjI3MTMzMTc4NzEwOTQsInkiOjY5fSx7IngiOjU2Ny4wMjY2MjY1ODY5MTQxLCJ5Ijo2OX1d%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M716.7572937011719%2C69L818.1169586181641%2C69%22%20id%3D%22L_C_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_D_0%22%20data-points%3D%22W3sieCI6NzE2Ljc1NzI5MzcwMTE3MTksInkiOjY5fSx7IngiOjgyMi4xMTY5NTg2MTgxNjQxLCJ5Ijo2OX1d%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1022.4019927978516%2C69L1093.7377166748047%2C69%22%20id%3D%22L_D_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_E_0%22%20data-points%3D%22W3sieCI6MTAyMi40MDE5OTI3OTc4NTE2LCJ5Ijo2OX0seyJ4IjoxMDk3LjczNzcxNjY3NDgwNDcsInkiOjY5fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1294.5399322509766%2C79L1370.2481155395508%2C79%22%20id%3D%22L_E_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_E_F_0%22%20data-points%3D%22W3sieCI6MTI5NC41Mzk5MzIyNTA5NzY2LCJ5Ijo3OX0seyJ4IjoxMzc0LjI0ODExNTUzOTU1MDgsInkiOjc5fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1627.6918869018555%2C79L1660.3786163330078%2C79%22%20id%3D%22L_F_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_G_0%22%20data-points%3D%22W3sieCI6MTYyNy42OTE4ODY5MDE4NTU1LCJ5Ijo3OX0seyJ4IjoxNjY0LjM3ODYxNjMzMzAwNzgsInkiOjc5fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1867.7858581542969%2C68.99999999999999L1880.7147903424313%2C69Q1887.7858581542969%2C69%201887.7858581542969%2C61.928932188134524L1887.7858581542969%2C48.78295602529465Q1887.7858581542969%2C47%201888.8716445919238%2C45.58578643762691L1888.8716445919238%2C45.58578643762691Q1889.9574310295507%2C44.17157287525381%201891.3716445919238%2C43.085786437626915L1891.3716445919238%2C43.08578643762691Q1892.7858581542969%2C42%201894.5688141795915%2C42L2196.291534423828%2C42%22%20id%3D%22L_G_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_H_0%22%20data-points%3D%22W3sieCI6MTg2Ny43ODU4NTgxNTQyOTY5LCJ5Ijo2OC45OTk5OTk5OTk5OTk5OX0seyJ4IjoxODg3Ljc4NTg1ODE1NDI5NjksInkiOjY5fSx7IngiOjE4ODcuNzg1ODU4MTU0Mjk2OSwieSI6NDJ9LHsieCI6MjIwMC4yOTE1MzQ0MjM4MjgsInkiOjQyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1867.7858581542969%2C89.00000000000001L2181.220466611963%2C89Q2188.291534423828%2C89%202188.291534423828%2C96.07106781186548L2188.291534423828%2C295.71704397470535Q2188.291534423828%2C297.5%202189.377320861455%2C298.9142135623731L2189.377320861455%2C298.9142135623731Q2190.463107299082%2C300.3284271247462%202191.877320861455%2C301.4142135623731L2191.877320861455%2C301.4142135623731Q2193.291534423828%2C302.5%202195.074490449123%2C302.5L2198.291534423828%2C302.5%22%20id%3D%22L_G_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_I_0%22%20data-points%3D%22W3sieCI6MTg2Ny43ODU4NTgxNTQyOTY5LCJ5Ijo4OS4wMDAwMDAwMDAwMDAwMX0seyJ4IjoyMTg4LjI5MTUzNDQyMzgyOCwieSI6ODl9LHsieCI6MjE4OC4yOTE1MzQ0MjM4MjgsInkiOjMwMi41fSx7IngiOjIyMDIuMjkxNTM0NDIzODI4LCJ5IjozMDIuNX1d%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M2208.291534423828%2C322.5L2038.0386962890625%2C322.5L1770.0822372436523%2C322.5L1504.9700012207031%2C322.5L1210.894187927246%2C322.5L926.2594757080078%2C322.5L645.891960144043%2C322.5L495.49195861816406%2C322.5%22%20id%3D%22L_I_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_J_0%22%20data-points%3D%22W3sieCI6MjIwOC4yOTE1MzQ0MjM4MjgsInkiOjMyMi41fSx7IngiOjIwMzguMDM4Njk2Mjg5MDYyNSwieSI6MzIyLjV9LHsieCI6MTc3MC4wODIyMzcyNDM2NTIzLCJ5IjozMjIuNX0seyJ4IjoxNTA0Ljk3MDAwMTIyMDcwMzEsInkiOjMyMi41fSx7IngiOjEyMTAuODk0MTg3OTI3MjQ2LCJ5IjozMjIuNX0seyJ4Ijo5MjYuMjU5NDc1NzA4MDA3OCwieSI6MzIyLjV9LHsieCI6NjQ1Ljg5MTk2MDE0NDA0MywieSI6MzIyLjV9LHsieCI6NDkxLjQ5MTk1ODYxODE2NDA2LCJ5IjozMjIuNX1d%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M483.49195861816406%2C302.5L496.7090025928694%2C302.5Q498.49195861816406%2C302.5%20499.90617218053717%2C301.4142135623731L499.90617218053717%2C301.4142135623731Q501.3203857429103%2C300.3284271247462%20502.40617218053717%2C298.9142135623731L502.40617218053717%2C298.9142135623731Q503.49195861816406%2C297.5%20503.49195861816406%2C295.71704397470535L503.49195861816406%2C259.28295602529465Q503.49195861816406%2C257.5%20504.57774505579096%2C256.0857864376269L504.57774505579096%2C256.0857864376269Q505.66353149341785%2C254.67157287525382%20507.07774505579096%2C253.58578643762692L507.07774505579096%2C253.5857864376269Q508.49195861816406%2C252.5%20510.2749146434587%2C252.5L513.4919586181641%2C252.5%22%20id%3D%22L_J_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_J_K_0%22%20data-points%3D%22W3sieCI6NDgzLjQ5MTk1ODYxODE2NDA2LCJ5IjozMDIuNX0seyJ4Ijo1MDMuNDkxOTU4NjE4MTY0MDYsInkiOjMwMi41fSx7IngiOjUwMy40OTE5NTg2MTgxNjQwNiwieSI6MjUyLjV9LHsieCI6NTE3LjQ5MTk1ODYxODE2NDEsInkiOjI1Mi41fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M768.2919616699219%2C252.5L796.2919616699219%2C252.5%22%20id%3D%22L_K_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_K_L_0%22%20data-points%3D%22W3sieCI6NzY4LjI5MTk2MTY2OTkyMTksInkiOjI1Mi41fSx7IngiOjgwMC4yOTE5NjE2Njk5MjE5LCJ5IjoyNTIuNX1d%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1044.2269897460938%2C242.5L1057.444033720799%2C242.5Q1059.2269897460938%2C242.5%201060.6412033084669%2C241.4142135623731L1060.6412033084669%2C241.41421356237308Q1062.05541687084%2C240.32842712474618%201063.1412033084669%2C238.9142135623731L1063.1412033084669%2C238.9142135623731Q1064.2269897460938%2C237.5%201064.2269897460938%2C235.71704397470535L1064.2269897460938%2C95.78295602529465Q1064.2269897460938%2C94%201065.3127761837206%2C92.58578643762691L1065.3127761837206%2C92.58578643762691Q1066.3985626213475%2C91.17157287525382%201067.8127761837206%2C90.08578643762692L1067.8127761837206%2C90.08578643762691Q1069.2269897460938%2C89%201071.0099457713884%2C89L1093.7377166748047%2C89%22%20id%3D%22L_L_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_E_0%22%20data-points%3D%22W3sieCI6MTA0NC4yMjY5ODk3NDYwOTM4LCJ5IjoyNDIuNX0seyJ4IjoxMDY0LjIyNjk4OTc0NjA5MzgsInkiOjI0Mi41fSx7IngiOjEwNjQuMjI2OTg5NzQ2MDkzOCwieSI6ODl9LHsieCI6MTA5Ny43Mzc3MTY2NzQ4MDQ3LCJ5Ijo4OX1d%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1044.2269897460938%2C262.5L1072.2269897460938%2C262.5%22%20id%3D%22L_L_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_M_0%22%20data-points%3D%22W3sieCI6MTA0NC4yMjY5ODk3NDYwOTM4LCJ5IjoyNjIuNX0seyJ4IjoxMDc2LjIyNjk4OTc0NjA5MzgsInkiOjI2Mi41fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1337.5613861083984%2C262.5L1365.5613861083984%2C262.5%22%20id%3D%22L_M_N_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_M_N_0%22%20data-points%3D%22W3sieCI6MTMzNy41NjEzODYxMDgzOTg0LCJ5IjoyNjIuNX0seyJ4IjoxMzY5LjU2MTM4NjEwODM5ODQsInkiOjI2Mi41fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1632.3786163330078%2C272.5L1895.7858581542969%2C272.5%22%20id%3D%22L_N_O_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_N_O_0%22%20data-points%3D%22W3sieCI6MTYzMi4zNzg2MTYzMzMwMDc4LCJ5IjoyNzIuNX0seyJ4IjoxODk5Ljc4NTg1ODE1NDI5NjksInkiOjI3Mi41fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1632.3786163330078%2C252.5L1645.5956603077132%2C252.5Q1647.3786163330078%2C252.5%201648.792829895381%2C251.4142135623731L1648.792829895381%2C251.41421356237308Q1650.207043457754%2C250.32842712474618%201651.292829895381%2C248.9142135623731L1651.292829895381%2C248.9142135623731Q1652.3786163330078%2C247.5%201652.3786163330078%2C245.71704397470535L1652.3786163330078%2C179.28295602529465Q1652.3786163330078%2C177.5%201653.4644027706347%2C176.0857864376269L1653.4644027706347%2C176.0857864376269Q1654.5501892082616%2C174.67157287525382%201655.9644027706347%2C173.58578643762692L1655.9644027706347%2C173.5857864376269Q1657.3786163330078%2C172.5%201659.1615723583025%2C172.5L1895.7858581542969%2C172.5%22%20id%3D%22L_N_P_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_N_P_0%22%20data-points%3D%22W3sieCI6MTYzMi4zNzg2MTYzMzMwMDc4LCJ5IjoyNTIuNX0seyJ4IjoxNjUyLjM3ODYxNjMzMzAwNzgsInkiOjI1Mi41fSx7IngiOjE2NTIuMzc4NjE2MzMzMDA3OCwieSI6MTcyLjV9LHsieCI6MTg5OS43ODU4NTgxNTQyOTY5LCJ5IjoxNzIuNX1d%22%20marker-end%3D%22url\(%23mermaid-_r_12f__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_D_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_E_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_E_F_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_G_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(2038.0386962890625%2C%2041.5\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_H_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(2038.0386962890625%2C%2088.5\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_I_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_J_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_J_K_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_K_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_E_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_M_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_M_N_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(1770.0822372436523%2C%20272\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_N_O_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(1770.0822372436523%2C%20172\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_N_P_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

The Compensation Manager may be implemented as part of the Coordinator or as a dedicated recovery component.

# 19. Practical Python compensation manager

Python

Run

```
from dataclasses import dataclass
from typing import Awaitable, Callable


@dataclass
class CompletedAction:
    action_id: str
    resource_id: str
    compensate: Callable[[str], Awaitable[None]]
    status: str = "completed"


class CompensationManager:
    def __init__(self, state_store):
        self.state_store = state_store

    async def compensate(
        self,
        workflow_id: str,
        completed_actions: list[CompletedAction],
    ):
        await self.state_store.save({
            "workflow_id": workflow_id,
            "status": "compensating",
        })

        # Reverse order, unless business dependencies require another order.
        for action in reversed(completed_actions):
            if action.status == "compensated":
                continue

            try:
                await action.compensate(action.resource_id)

                action.status = "compensated"

                await self.state_store.save({
                    "workflow_id": workflow_id,
                    "action_id": action.action_id,
                    "status": "compensated",
                })

            except Exception as error:
                await self.state_store.save({
                    "workflow_id": workflow_id,
                    "action_id": action.action_id,
                    "status": "compensation_failed",
                    "error": str(error),
                })

                return {
                    "status": "manual_review_required",
                    "failed_compensation": action.action_id,
                }

        await self.state_store.save({
            "workflow_id": workflow_id,
            "status": "compensated",
        })

        return {
            "status": "compensated",
            "workflow_id": workflow_id,
        }
```

This is a simplified example. Production code should add:

* Idempotency keys

* Compensation retries

* Timeouts

* Dependency status reconciliation

* Concurrency control

* Durable queues

* Audit events

* Dead-letter handling

* Human escalation

# 20. Important design principles

## Do not assume compensation always succeeds

A compensating action is another distributed operation and can fail.

## Persist before executing

Store the intended compensation plan before beginning recovery.

## Use idempotent compensation

Repeated recovery attempts must not create duplicate refunds, cancellations, or releases.

## Preserve original context

Keep the original request ID, workflow ID, task IDs, and external resource IDs.

## Separate technical failure from business failure

A timeout may mean the operation is still running. Query the external state before deciding to compensate.

## Prefer business-correct recovery over technical rollback

The goal is not merely to restore database values. The goal is to restore a valid business state.

## Support human intervention

Some inconsistencies cannot be safely resolved automatically.

# 21. Interview-ready explanation

> CWD uses compensation patterns, particularly Saga-style recovery, for workflows that span multiple independent systems. Each successful forward action records its output and a corresponding corrective action. If a later task fails, the Coordinator loads the persisted execution state, identifies completed side effects, and executes compensations—usually in reverse dependency order. Compensation actions use their own retries, timeouts, and idempotency keys. When an operation may have completed remotely, CWD reconciles its status before retrying or compensating. If an operation cannot be fully reversed, CWD uses forward recovery, corrective notifications, asynchronous reconciliation, or human escalation. This allows CWD to recover from partial failures without pretending that distributed operations support one global rollback.

## Practical exercise

Design a compensation plan for:

```
1. Create customer account
2. Create subscription
3. Charge payment
4. Provision resources
5. Send welcome email
```

Assume provisioning fails after payment succeeds.

Your plan should identify:

* Which actions must be compensated

* The compensation order

* Which actions are irreversible

* Required idempotency keys

* How to handle an uncertain payment status

* What happens if the refund fails

* What state the Coordinator persists

* When the workflow is marked `COMPENSATED` versus `MANUAL_REVIEW_REQUIRED`

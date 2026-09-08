# Timeout Management Across CWD

Timeout management ensures that an agent, LLM call, tool, API, database query, or message operation cannot block a workflow indefinitely.

In CWD, every external operation should have a clear time budget, a cancellation strategy, and a recovery action.

## 1. Why timeout management is important

Without timeouts, a single unavailable dependency can block the entire workflow:

```
User Request
    ↓
Coordinator
    ↓
Worker
    ↓
LLM call hangs for 10 minutes
    ↓
Worker remains occupied
    ↓
Coordinator waits
    ↓
Other tasks are delayed
    ↓
User request eventually times out
```

Timeouts prevent this by limiting how long each operation may run.

```
Operation starts
    ↓
Deadline assigned
    ↓
Operation executes
    ↓
Deadline reached
    ↓
Cancel or terminate operation
    ↓
Persist timeout state
    ↓
Retry, fallback, compensate, or escalate
```

# 2. Timeout types

Timeouts should exist at multiple levels rather than using one global timeout.

|
Timeout

|

Purpose

|
| --- | --- |
|

Connection timeout

|

Maximum time to establish a connection

|
|

Read timeout

|

Maximum time waiting for response data

|
|

Write timeout

|

Maximum time sending a request

|
|

Request timeout

|

Maximum time for one API or tool request

|
|

LLM timeout

|

Maximum time waiting for model completion

|
|

Worker timeout

|

Maximum time for one Worker task

|
|

Agent timeout

|

Maximum time for one agent execution

|
|

Workflow timeout

|

Maximum time for the complete request

|
|

Queue timeout

|

Maximum time a message may wait

|
|

Shutdown timeout

|

Maximum time allowed for graceful cancellation

|

Example:

```
Workflow timeout: 120 seconds
    └── Agent timeout: 90 seconds
         └── Worker timeout: 60 seconds
              └── LLM timeout: 30 seconds
                   └── MCP tool timeout: 10 seconds
```

The lower-level timeout should normally be shorter than the remaining parent deadline.

# 3. Overall timeout hierarchy

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_p7_%22%20width%3D%22799.78759765625%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%221233.199951171875%22%20viewBox%3D%224%204%20799.78759765625%201233.199951171875%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_p7_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_p7_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_p7_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_p7_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_p7_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_p7_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_p7_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_p7_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_p7_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_p7_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_p7_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_p7_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_p7_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_p7_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_p7_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_p7_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_p7_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_p7_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_p7_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_p7_%20.label%20text%2C%23mermaid-_r_p7_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_p7_%20.node%20rect%2C%23mermaid-_r_p7_%20.node%20circle%2C%23mermaid-_r_p7_%20.node%20ellipse%2C%23mermaid-_r_p7_%20.node%20polygon%2C%23mermaid-_r_p7_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_p7_%20.rough-node%20.label%20text%2C%23mermaid-_r_p7_%20.node%20.label%20text%2C%23mermaid-_r_p7_%20.image-shape%20.label%2C%23mermaid-_r_p7_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_p7_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_p7_%20.rough-node%20.label%2C%23mermaid-_r_p7_%20.node%20.label%2C%23mermaid-_r_p7_%20.image-shape%20.label%2C%23mermaid-_r_p7_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_p7_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_p7_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_p7_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_p7_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_p7_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_p7_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_p7_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_p7_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_p7_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_p7_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_p7_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_p7_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_p7_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_p7_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_p7_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_p7_%20.icon-shape%2C%23mermaid-_r_p7_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_p7_%20.icon-shape%20p%2C%23mermaid-_r_p7_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_p7_%20.icon-shape%20rect%2C%23mermaid-_r_p7_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_p7_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_p7_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_p7_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_p7_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_p7_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_p7_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_p7_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_p7_%20.node%20rect%2C%23mermaid-_r_p7_%20.node%20circle%2C%23mermaid-_r_p7_%20.node%20ellipse%2C%23mermaid-_r_p7_%20.node%20polygon%2C%23mermaid-_r_p7_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_p7_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_p7_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_p7_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_p7_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_p7_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_p7_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_p7__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_p7__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_p7__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_p7__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_p7__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_p7__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(147.3868865966797%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-97.53236389160156%22%20y%3D%22-30%22%20width%3D%22195.06472778320312%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EIncoming%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20request%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(147.3868865966797%2C%20142\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-102.49580383300781%22%20y%3D%22-30%22%20width%3D%22204.99160766601562%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorkflow%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20deadline%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(147.3868865966797%2C%20242\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-135.38689422607422%22%20y%3D%22-30%22%20width%3D%22270.77378845214844%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECoordinator%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20timeout%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20budget%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(147.3868865966797%2C%20342\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-127.86189270019531%22%20y%3D%22-30%22%20width%3D%22255.72378540039062%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDelegator%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20timeout%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20budget%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(147.3868865966797%2C%20442\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-119.3681411743164%22%20y%3D%22-30%22%20width%3D%22238.7362823486328%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorker%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20timeout%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20budget%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(147.3868865966797%2C%20542\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-129.91596221923828%22%20y%3D%22-30%22%20width%3D%22259.83192443847656%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EExternal%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20operation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20timeout%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-G-11%22%20transform%3D%22translate\(69.4373046875%2C%20682\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-50.73750019073486%22%20y%3D%22-30%22%20width%3D%22101.47500038146973%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ELLM%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-H-13%22%20transform%3D%22translate\(228.69496841430663%2C%20682\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-68.52016830444336%22%20y%3D%22-30%22%20width%3D%22137.04033660888672%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EMCP%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20tool%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-I-15%22%20transform%3D%22translate\(428.92763442993163%2C%20682\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-91.7125015258789%22%20y%3D%22-30%22%20width%3D%22183.4250030517578%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDatabase%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20API%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-17%22%20transform%3D%22translate\(652.551245880127%2C%20682\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-91.9111099243164%22%20y%3D%22-30%22%20width%3D%22183.8222198486328%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EMessage%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20broker%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-K-19%22%20transform%3D%22translate\(252.7094123840332%2C%20802\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-120.07221221923828%22%20y%3D%22-30%22%20width%3D%22240.14442443847656%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReturn%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20result%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20timeout%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-L-27%22%20transform%3D%22translate\(252.7094123840332%2C%20902\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-77.5898551940918%22%20y%3D%22-30%22%20width%3D%22155.1797103881836%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPersist%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20state%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-M-29%22%20transform%3D%22translate\(252.7094123840332%2C%201002\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-91.31875228881836%22%20y%3D%22-30%22%20width%3D%22182.63750457763672%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERecovery%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20action%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-N-31%22%20transform%3D%22translate\(207.05003814697264%2C%201193.599998474121\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-115.33125305175781%22%20y%3D%22-35.599998474121094%22%20width%3D%22230.66250610351562%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20within%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20remaining%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Ebudget%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-O-33%22%20transform%3D%22translate\(472.087857055664%2C%201193.599998474121\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-109.70657348632812%22%20y%3D%22-35.599998474121094%22%20width%3D%22219.41314697265625%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EAlternate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20provider%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorker%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-P-35%22%20transform%3D%22translate\(708.7910049438476%2C%201188\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-86.99658203125%22%20y%3D%22-30%22%20width%3D%22173.9931640625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFail%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20escalate%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M147.3868865966797%2C72L147.3868865966797%2C100%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6MTQ3LjM4Njg4NjU5NjY3OTcsInkiOjcyfSx7IngiOjE0Ny4zODY4ODY1OTY2Nzk3LCJ5IjoxMDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M147.3868865966797%2C172L147.3868865966797%2C200%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6MTQ3LjM4Njg4NjU5NjY3OTcsInkiOjE3Mn0seyJ4IjoxNDcuMzg2ODg2NTk2Njc5NywieSI6MjA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M147.3868865966797%2C272L147.3868865966797%2C300%22%20id%3D%22L_C_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_D_0%22%20data-points%3D%22W3sieCI6MTQ3LjM4Njg4NjU5NjY3OTcsInkiOjI3Mn0seyJ4IjoxNDcuMzg2ODg2NTk2Njc5NywieSI6MzA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M147.3868865966797%2C372L147.3868865966797%2C400%22%20id%3D%22L_D_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_E_0%22%20data-points%3D%22W3sieCI6MTQ3LjM4Njg4NjU5NjY3OTcsInkiOjM3Mn0seyJ4IjoxNDcuMzg2ODg2NTk2Njc5NywieSI6NDA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M147.3868865966797%2C472L147.3868865966797%2C500%22%20id%3D%22L_E_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_E_F_0%22%20data-points%3D%22W3sieCI6MTQ3LjM4Njg4NjU5NjY3OTcsInkiOjQ3Mn0seyJ4IjoxNDcuMzg2ODg2NTk2Njc5NywieSI6NTA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M69.43730468750009%2C572L69.43730468750002%2C640%22%20id%3D%22L_F_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_G_0%22%20data-points%3D%22W3sieCI6NjkuNDM3MzA0Njg3NTAwMDksInkiOjU3Mn0seyJ4Ijo2OS40MzczMDQ2ODc1MDAwMiwieSI6NjQ0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M121.4036926269531%2C572L121.40369262695313%2C624.9289321881345Q121.40369262695313%2C632%20128.4747604388186%2C632L221.91201238901198%2C632Q223.69496841430663%2C632%20225.10918197667974%2C633.0857864376269L225.10918197667974%2C633.0857864376269Q226.5233955390528%2C634.1715728752538%20227.6091819766797%2C635.5857864376269L227.60918197667974%2C635.5857864376269Q228.69496841430663%2C637%20228.69496841430663%2C638.7829560252947L228.69496841430663%2C642%22%20id%3D%22L_F_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_H_0%22%20data-points%3D%22W3sieCI6MTIxLjQwMzY5MjYyNjk1MzEsInkiOjU3Mn0seyJ4IjoxMjEuNDAzNjkyNjI2OTUzMTMsInkiOjYzMn0seyJ4IjoyMjguNjk0OTY4NDE0MzA2NjMsInkiOjYzMn0seyJ4IjoyMjguNjk0OTY4NDE0MzA2NjMsInkiOjY0Nn1d%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M173.3700805664063%2C572L173.37008056640627%2C604.9289321881346Q173.37008056640627%2C612%20180.44114837827175%2C612L422.144678404637%2C612Q423.92763442993163%2C612%20425.34184799230474%2C613.0857864376269L425.34184799230474%2C613.0857864376269Q426.75606155467784%2C614.1715728752538%20427.84184799230474%2C615.5857864376269L427.84184799230474%2C615.5857864376269Q428.92763442993163%2C617%20428.92763442993163%2C618.7829560252947L428.92763442993163%2C640%22%20id%3D%22L_F_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_I_0%22%20data-points%3D%22W3sieCI6MTczLjM3MDA4MDU2NjQwNjMsInkiOjU3Mn0seyJ4IjoxNzMuMzcwMDgwNTY2NDA2MjcsInkiOjYxMn0seyJ4Ijo0MjguOTI3NjM0NDI5OTMxNjMsInkiOjYxMn0seyJ4Ijo0MjguOTI3NjM0NDI5OTMxNjMsInkiOjY0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M225.3364685058593%2C572L225.33646850585936%2C584.9289321881345Q225.3364685058594%2C592%20232.4075363177249%2C592L645.7682898548323%2C592Q647.551245880127%2C592%20648.9654594425001%2C593.0857864376269L648.9654594425001%2C593.0857864376269Q650.3796730048732%2C594.1715728752538%20651.4654594425001%2C595.5857864376269L651.4654594425001%2C595.5857864376269Q652.551245880127%2C597%20652.551245880127%2C598.7829560252947L652.551245880127%2C640%22%20id%3D%22L_F_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_J_0%22%20data-points%3D%22W3sieCI6MjI1LjMzNjQ2ODUwNTg1OTMsInkiOjU3Mn0seyJ4IjoyMjUuMzM2NDY4NTA1ODU5NCwieSI6NTkyfSx7IngiOjY1Mi41NTEyNDU4ODAxMjcsInkiOjU5Mn0seyJ4Ijo2NTIuNTUxMjQ1ODgwMTI3LCJ5Ijo2NDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M69.4373046875%2C712L69.4373046875%2C725.2170439747053Q69.4373046875%2C727%2070.52309112512691%2C728.4142135623731L70.52309112512692%2C728.4142135623731Q71.60887756275382%2C729.8284271247462%2073.02309112512691%2C730.9142135623731L73.02309112512691%2C730.9142135623731Q74.4373046875%2C732%2076.22026071279465%2C732L173.88312444955886%2C732Q175.66608047485352%2C732%20177.08029403722662%2C733.0857864376269L177.08029403722662%2C733.0857864376269Q178.4945075995997%2C734.1715728752538%20179.5802940372266%2C735.5857864376269L179.58029403722662%2C735.5857864376269Q180.66608047485352%2C737%20180.66608047485352%2C738.7829560252947L180.66608047485352%2C760%22%20id%3D%22L_G_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_K_0%22%20data-points%3D%22W3sieCI6NjkuNDM3MzA0Njg3NSwieSI6NzEyfSx7IngiOjY5LjQzNzMwNDY4NzUsInkiOjczMn0seyJ4IjoxODAuNjY2MDgwNDc0ODUzNTIsInkiOjczMn0seyJ4IjoxODAuNjY2MDgwNDc0ODUzNTIsInkiOjc2NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M228.69496841430663%2C712L228.69496841430663%2C760%22%20id%3D%22L_H_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_H_K_0%22%20data-points%3D%22W3sieCI6MjI4LjY5NDk2ODQxNDMwNjYzLCJ5Ijo3MTJ9LHsieCI6MjI4LjY5NDk2ODQxNDMwNjYzLCJ5Ijo3NjR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M428.92763442993163%2C712L428.92763442993163%2C725.2170439747053Q428.92763442993163%2C727%20427.84184799230474%2C728.4142135623731L427.84184799230474%2C728.4142135623731Q426.75606155467784%2C729.8284271247462%20425.34184799230474%2C730.9142135623731L425.34184799230474%2C730.9142135623731Q423.92763442993163%2C732%20422.144678404637%2C732L283.5068123790544%2C732Q281.72385635375974%2C732%20280.30964279138664%2C733.0857864376269L280.30964279138664%2C733.0857864376269Q278.89542922901353%2C734.1715728752538%20277.80964279138664%2C735.5857864376269L277.80964279138664%2C735.5857864376269Q276.72385635375974%2C737%20276.72385635375974%2C738.7829560252947L276.72385635375974%2C760%22%20id%3D%22L_I_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_K_0%22%20data-points%3D%22W3sieCI6NDI4LjkyNzYzNDQyOTkzMTYzLCJ5Ijo3MTJ9LHsieCI6NDI4LjkyNzYzNDQyOTkzMTYzLCJ5Ijo3MzJ9LHsieCI6Mjc2LjcyMzg1NjM1Mzc1OTc0LCJ5Ijo3MzJ9LHsieCI6Mjc2LjcyMzg1NjM1Mzc1OTc0LCJ5Ijo3NjR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M652.551245880127%2C712L652.551245880127%2C745.2170439747053Q652.551245880127%2C747%20651.4654594425001%2C748.4142135623731L651.4654594425001%2C748.4142135623731Q650.3796730048732%2C749.8284271247462%20648.9654594425001%2C750.9142135623731L648.9654594425001%2C750.9142135623731Q647.551245880127%2C752%20645.7682898548323%2C752L331.53570031850757%2C752Q329.7527442932129%2C752%20328.3385307308398%2C753.0857864376269L328.3385307308398%2C753.0857864376269Q326.9243171684667%2C754.1715728752538%20325.8385307308398%2C755.5857864376269L325.8385307308398%2C755.5857864376269Q324.7527442932129%2C757%20324.7527442932129%2C758.7829560252947L324.7527442932129%2C762%22%20id%3D%22L_J_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_J_K_0%22%20data-points%3D%22W3sieCI6NjUyLjU1MTI0NTg4MDEyNywieSI6NzEyfSx7IngiOjY1Mi41NTEyNDU4ODAxMjcsInkiOjc1Mn0seyJ4IjozMjQuNzUyNzQ0MjkzMjEyOSwieSI6NzUyfSx7IngiOjMyNC43NTI3NDQyOTMyMTI5LCJ5Ijo3NjZ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M252.7094123840332%2C832L252.7094123840332%2C860%22%20id%3D%22L_K_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_K_L_0%22%20data-points%3D%22W3sieCI6MjUyLjcwOTQxMjM4NDAzMzIsInkiOjgzMn0seyJ4IjoyNTIuNzA5NDEyMzg0MDMzMiwieSI6ODY0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M252.7094123840332%2C932L252.7094123840332%2C960%22%20id%3D%22L_L_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_M_0%22%20data-points%3D%22W3sieCI6MjUyLjcwOTQxMjM4NDAzMzIsInkiOjkzMn0seyJ4IjoyNTIuNzA5NDEyMzg0MDMzMiwieSI6OTY0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M207.05003814697253%2C1032L207.05003814697264%2C1146%22%20id%3D%22L_M_N_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_M_N_0%22%20data-points%3D%22W3sieCI6MjA3LjA1MDAzODE0Njk3MjUzLCJ5IjoxMDMyfSx7IngiOjIwNy4wNTAwMzgxNDY5NzI2NCwieSI6MTE1MH1d%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M252.7094123840332%2C1032L252.7094123840332%2C1065.2170439747053Q252.7094123840332%2C1067%20253.79519882166008%2C1068.414213562373L253.79519882166008%2C1068.414213562373Q254.88098525928697%2C1069.8284271247462%20256.29519882166005%2C1070.914213562373L256.29519882166005%2C1070.914213562373Q257.70941238403316%2C1072%20259.4923684093278%2C1072L465.30490103036936%2C1072Q467.087857055664%2C1072%20468.5020706180371%2C1073.085786437627L468.5020706180371%2C1073.085786437627Q469.91628418041023%2C1074.1715728752538%20471.0020706180371%2C1075.585786437627L471.0020706180371%2C1075.585786437627Q472.087857055664%2C1077%20472.087857055664%2C1078.7829560252947L472.087857055664%2C1146%22%20id%3D%22L_M_O_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_M_O_0%22%20data-points%3D%22W3sieCI6MjUyLjcwOTQxMjM4NDAzMzIsInkiOjEwMzJ9LHsieCI6MjUyLjcwOTQxMjM4NDAzMzIsInkiOjEwNzJ9LHsieCI6NDcyLjA4Nzg1NzA1NTY2NCwieSI6MTA3Mn0seyJ4Ijo0NzIuMDg3ODU3MDU1NjY0LCJ5IjoxMTUwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M298.3687866210938%2C1032L298.36878662109376%2C1044.9289321881345Q298.3687866210937%2C1052%20305.4398544329592%2C1052L702.008048918553%2C1052Q703.7910049438476%2C1052%20705.2052185062207%2C1053.085786437627L705.2052185062207%2C1053.085786437627Q706.6194320685938%2C1054.1715728752538%20707.7052185062207%2C1055.585786437627L707.7052185062207%2C1055.585786437627Q708.7910049438476%2C1057%20708.7910049438476%2C1058.7829560252947L708.7910049438476%2C1146%22%20id%3D%22L_M_P_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_M_P_0%22%20data-points%3D%22W3sieCI6Mjk4LjM2ODc4NjYyMTA5MzgsInkiOjEwMzJ9LHsieCI6Mjk4LjM2ODc4NjYyMTA5MzcsInkiOjEwNTJ9LHsieCI6NzA4Ljc5MTAwNDk0Mzg0NzYsInkiOjEwNTJ9LHsieCI6NzA4Ljc5MTAwNDk0Mzg0NzYsInkiOjExNTB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_p7__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_D_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_E_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_E_F_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_G_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_H_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_I_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_J_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_K_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_H_K_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_K_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_J_K_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_K_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_M_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(206.98436431884764%2C%201105\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_M_N_0%22%20transform%3D%22translate\(-27.934326171875%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2279.86865234375%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetryable%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(472.0331275939941%2C%201105\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_M_O_0%22%20transform%3D%22translate\(-23.445270538330078%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2270.89054107666016%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFallback%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(708.5270050048828%2C%201105\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_M_P_0%22%20transform%3D%22translate\(-31.736000061035156%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2287.47200012207031%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20budget%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

A child operation must not receive more time than the parent workflow has remaining.

# 4. Deadline propagation

A timeout is often configured as a duration:

```
timeout = 30 seconds
```

A deadline is an absolute time by which the operation must finish:

```
deadline = 21:35:00
```

Deadlines are safer in distributed workflows because every component can calculate the remaining time.

Python

Run

```
from datetime import datetime, timedelta, timezone


def remaining_seconds(deadline: datetime) -> float:
    now = datetime.now(timezone.utc)
    return max(0.0, (deadline - now).total_seconds())


workflow_deadline = (
    datetime.now(timezone.utc) + timedelta(seconds=120)
)

remaining = remaining_seconds(workflow_deadline)
print(f"Remaining budget: {remaining:.2f} seconds")
```

The Coordinator passes the deadline to the Delegator and Workers:

Python

Run

```
task_context = {
    "request_id": "req-1001",
    "workflow_id": "wf-2001",
    "deadline": workflow_deadline.isoformat(),
}
```

Each component calculates its own remaining budget instead of starting a fresh 30-second timer.

# 5. Timeout management across CWD components

## 5.1 Coordinator

The Coordinator controls the overall workflow deadline.

Responsibilities:

* Assign the initial request deadline

* Track elapsed execution time

* Prevent new work when the deadline is nearly exhausted

* Cancel or stop waiting for timed-out tasks

* Persist timeout status

* Resume or recover the workflow when appropriate

Example:

```
Workflow deadline = 120 seconds

At 110 seconds:
    Do not start a new 30-second operation.
    Return partial result, fallback, or timeout response.
```

The Coordinator should not wait forever for a Worker that has already exceeded its task budget.

## 5.2 Delegator

The Delegator assigns time budgets to domain tasks.

For example:

```
Customer-support workflow: 90 seconds

Order lookup: 20 seconds
Knowledge retrieval: 25 seconds
Response generation: 30 seconds
Notification: 10 seconds
```

The Delegator should also consider dependencies:

```
Order lookup fails
    ↓
Notification task has no valid order status
    ↓
Do not execute notification
    ↓
Mark dependent task as blocked
```

This prevents downstream tasks from waiting indefinitely for a prerequisite.

## 5.3 Worker agents

Each Worker should have a task-level timeout.

Python

Run

```
import asyncio


async def run_worker_task(task):
    try:
        return await asyncio.wait_for(
            execute_task(task),
            timeout=30,
        )
    except asyncio.TimeoutError:
        return {
            "status": "timed_out",
            "task_id": task["task_id"],
            "reason": "Worker execution exceeded 30 seconds",
        }
```

A Worker timeout should be recorded as a structured state transition:

```
RUNNING
   ↓
TIMEOUT_DETECTED
   ↓
CANCELLATION_REQUESTED
   ↓
CANCELLED or UNKNOWN
   ↓
RETRY / REROUTE / ESCALATE
```

Important: a timeout does not always prove that the remote operation stopped. The remote service may still be processing the request.

# 6. LLM timeout management

LLM calls may take longer because of:

* Large prompts

* Large output limits

* Provider congestion

* Streaming interruptions

* Tool-calling loops

* Model-specific latency

* Provider-side rate limiting

A CWD LLM policy should include:

```
Connection timeout
Read timeout
Total request timeout
Maximum output tokens
Maximum tool-call iterations
Workflow deadline
```

Example:

Python

Run

```
import asyncio


async def call_llm_with_timeout(llm_client, prompt, timeout=30):
    try:
        response = await asyncio.wait_for(
            llm_client.generate(prompt),
            timeout=timeout,
        )
        return response

    except asyncio.TimeoutError:
        return {
            "status": "timed_out",
            "error_type": "llm_timeout",
        }
```

## Streaming LLM calls

For streaming responses, use separate limits:

```
Initial response timeout:
    Maximum time before the first token

Idle stream timeout:
    Maximum time between received tokens

Total generation timeout:
    Maximum time for the complete response
```

Example:

```
No first token for 10 seconds → timeout
No token received for 8 seconds → timeout
Total generation exceeds 45 seconds → timeout
```

A streaming timeout should not automatically mean the entire workflow is lost. CWD can:

1. Preserve the partial output.

2. Record the provider and model.

3. Retry with a smaller prompt.

4. Switch to a faster model.

5. Return a partial response if acceptable.

# 7. MCP tool timeout management

MCP tools may call:

* Enterprise APIs

* Databases

* File systems

* Search systems

* SaaS applications

* Internal services

Every MCP invocation should have a tool-specific timeout.

Python

Run

```
async def execute_mcp_tool(mcp_client, tool_name, arguments):
    return await asyncio.wait_for(
        mcp_client.call_tool(
            tool_name,
            arguments,
        ),
        timeout=15,
    )
```

A tool timeout should include useful metadata:

Python

Run

```
{
    "tool_name": "get_order_status",
    "server_name": "order-management-mcp",
    "request_id": "req-1001",
    "task_id": "task-3001",
    "timeout_seconds": 15,
    "elapsed_seconds": 15.2,
    "status": "timed_out",
}
```

## Tool-specific timeout policies

|
Tool type

|

Example timeout

|
| --- | --- |
|

Cache lookup

|

1–2 seconds

|
|

Internal database query

|

5–10 seconds

|
|

CRM lookup

|

10–15 seconds

|
|

External search API

|

15–20 seconds

|
|

Report generation

|

30–120 seconds

|
|

File processing

|

Based on file size and task type

|

These are illustrative policies, not universal values. Actual limits should be based on measured service latency and business requirements.

# 8. Data-source and database timeouts

Data sources can become slow because of:

* Missing indexes

* Lock contention

* Large result sets

* Network congestion

* Connection pool exhaustion

* Expensive joins

* Unavailable replicas

Use separate timeouts for:

```
Connection acquisition
Connection establishment
Query execution
Result reading
Transaction completion
```

Example:

Python

Run

```
async def fetch_customer(pool, customer_id):
    async with pool.acquire(timeout=3) as connection:
        return await connection.fetchrow(
            """
            SELECT id, name, status
            FROM customers
            WHERE id = $1
            """,
            customer_id,
            timeout=5,
        )
```

A database timeout should not automatically trigger a duplicate write. For writes, CWD should determine whether the transaction committed before retrying.

# 9. API timeout management

External APIs should use:

* Connection timeout

* Read timeout

* Total request deadline

* Retry policy

* Circuit breaker

* Idempotency key for writes

Example:

Python

Run

```
import httpx


async def call_external_api(url: str):
    timeout = httpx.Timeout(
        connect=3.0,
        read=10.0,
        write=5.0,
        pool=2.0,
    )

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()
```

For an API that creates a resource:

```
POST request times out
    ↓
Unknown whether resource was created
    ↓
Query using idempotency key or request ID
    ↓
If already created → reuse existing result
If not created → retry safely
```

This avoids duplicate orders, payments, tickets, or notifications.

# 10. Messaging system timeouts

Messaging systems introduce several different time limits:

|
Timeout

|

Meaning

|
| --- | --- |
|

Publish timeout

|

Maximum time to publish a message

|
|

Queue wait timeout

|

Maximum time a task may wait

|
|

Visibility timeout

|

Time a consumer owns a message

|
|

Processing timeout

|

Maximum time to process a message

|
|

Acknowledgment timeout

|

Maximum time to acknowledge completion

|
|

Consumer heartbeat timeout

|

Detects dead consumers

|

Example:

```
Message received
    ↓
Worker lease = 60 seconds
    ↓
Worker processing timeout = 45 seconds
    ↓
If Worker fails:
    message becomes available again
```

The visibility timeout should be longer than the expected processing time, or it should be extended while work is still active.

Otherwise, another Worker may receive the same message while the first Worker is still processing it.

# 11. Cancellation is different from timeout

A timeout means:

> “The caller will no longer wait.”

Cancellation means:

> “The running operation should stop.”

These are not always equivalent.

```
CWD timeout occurs
    ↓
Cancellation signal sent
    ↓
Local task stops
    ↓
Remote API may still be running
```

Therefore, CWD should support:

* Cooperative cancellation

* Cancellation tokens

* Abortable HTTP requests

* Worker process termination

* Tool cancellation where supported

* Cleanup handlers

* Idempotency protection

* Status reconciliation for uncertain operations

Example:

Python

Run

```
async def run_task(task, cancel_event):
    while not cancel_event.is_set():
        await process_next_step()

    await cleanup_resources()
```

For non-cancellable external operations, CWD should mark the task as:

```
UNKNOWN_COMPLETION
```

and reconcile its status before retrying.

# 12. Timeout handling with `asyncio`

A reusable timeout wrapper can preserve the request context and return a structured result.

Python

Run

```
import asyncio
from typing import Any, Awaitable, Callable


async def execute_with_timeout(
    operation: Callable[[], Awaitable[Any]],
    timeout_seconds: float,
    context: dict,
) -> dict:
    try:
        result = await asyncio.wait_for(
            operation(),
            timeout=timeout_seconds,
        )

        return {
            "status": "completed",
            "result": result,
            "context": context,
        }

    except asyncio.TimeoutError:
        return {
            "status": "timed_out",
            "error_type": "timeout",
            "timeout_seconds": timeout_seconds,
            "context": context,
        }

    except asyncio.CancelledError:
        return {
            "status": "cancelled",
            "error_type": "cancellation",
            "context": context,
        }
```

Usage:

Python

Run

```
context = {
    "request_id": "req-1001",
    "workflow_id": "wf-2001",
    "task_id": "task-3001",
    "operation": "knowledge_search",
}

result = await execute_with_timeout(
    operation=lambda: search_knowledge_base("delivery policy"),
    timeout_seconds=10,
    context=context,
)
```

# 13. Timeout-aware Coordinator

Python

Run

```
import asyncio
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone


@dataclass
class ExecutionContext:
    request_id: str
    workflow_id: str
    deadline: datetime

    def remaining_seconds(self) -> float:
        now = datetime.now(timezone.utc)
        return max(0.0, (self.deadline - now).total_seconds())


class Coordinator:
    def __init__(self, state_store):
        self.state_store = state_store

    async def execute(self, context: ExecutionContext):
        await self.state_store.save({
            "request_id": context.request_id,
            "workflow_id": context.workflow_id,
            "status": "running",
            "deadline": context.deadline.isoformat(),
        })

        try:
            result = await self.run_workflow(context)

            await self.state_store.save({
                "request_id": context.request_id,
                "workflow_id": context.workflow_id,
                "status": "completed",
                "result": result,
            })

            return result

        except asyncio.TimeoutError:
            await self.state_store.save({
                "request_id": context.request_id,
                "workflow_id": context.workflow_id,
                "status": "timed_out",
            })

            return {
                "status": "timed_out",
                "request_id": context.request_id,
            }

    async def run_workflow(self, context):
        remaining = context.remaining_seconds()

        if remaining <= 0:
            raise asyncio.TimeoutError()

        return await asyncio.wait_for(
            self.execute_steps(context),
            timeout=remaining,
        )

    async def execute_steps(self, context):
        # Each step should also receive the same deadline.
        return {
            "message": "Workflow completed",
            "request_id": context.request_id,
        }
```

The key principle is that the workflow deadline is established once and propagated through all execution layers.

# 14. Timeout recovery strategies

When a timeout occurs, CWD should choose an action based on the operation.

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_pb_%22%20width%3D%22633.1846923828125%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%221382%22%20viewBox%3D%224%204%20633.1846923828125%201382%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_pb_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_pb_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_pb_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_pb_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_pb_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_pb_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_pb_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_pb_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_pb_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_pb_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_pb_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_pb_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_pb_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_pb_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_pb_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_pb_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_pb_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_pb_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_pb_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_pb_%20.label%20text%2C%23mermaid-_r_pb_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_pb_%20.node%20rect%2C%23mermaid-_r_pb_%20.node%20circle%2C%23mermaid-_r_pb_%20.node%20ellipse%2C%23mermaid-_r_pb_%20.node%20polygon%2C%23mermaid-_r_pb_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_pb_%20.rough-node%20.label%20text%2C%23mermaid-_r_pb_%20.node%20.label%20text%2C%23mermaid-_r_pb_%20.image-shape%20.label%2C%23mermaid-_r_pb_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_pb_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_pb_%20.rough-node%20.label%2C%23mermaid-_r_pb_%20.node%20.label%2C%23mermaid-_r_pb_%20.image-shape%20.label%2C%23mermaid-_r_pb_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_pb_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_pb_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_pb_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_pb_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_pb_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_pb_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_pb_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_pb_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_pb_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_pb_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_pb_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_pb_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_pb_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_pb_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_pb_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_pb_%20.icon-shape%2C%23mermaid-_r_pb_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_pb_%20.icon-shape%20p%2C%23mermaid-_r_pb_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_pb_%20.icon-shape%20rect%2C%23mermaid-_r_pb_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_pb_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_pb_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_pb_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_pb_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_pb_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_pb_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_pb_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_pb_%20.node%20rect%2C%23mermaid-_r_pb_%20.node%20circle%2C%23mermaid-_r_pb_%20.node%20ellipse%2C%23mermaid-_r_pb_%20.node%20polygon%2C%23mermaid-_r_pb_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_pb_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_pb_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_pb_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_pb_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_pb_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_pb_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_pb__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_pb__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_pb__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_pb__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_pb__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_pb__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(492.1682942708333%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-97.65625381469727%22%20y%3D%22-30%22%20width%3D%22195.31250762939453%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETimeout%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20detected%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(492.1682942708333%2C%20142\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-109.76954650878906%22%20y%3D%22-30%22%20width%3D%22219.53909301757812%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPersist%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20timeout%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20event%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(492.1682942708333%2C%20247.5999984741211\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-110.54375457763672%22%20y%3D%22-35.599998474121094%22%20width%3D%22221.08750915527344%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EOperation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20completed%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Eremotely%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(236.58698018391925%2C%20716.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-126.7431411743164%22%20y%3D%22-30%22%20width%3D%22253.4862823486328%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReconcile%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20reuse%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20result%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(357.25155385335285%2C%20444.7999954223633\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-129.18861389160156%22%20y%3D%22-35.599998474121094%22%20width%3D%22258.3772277832031%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECheck%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20status%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20using%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20request%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Eor%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20idempotency%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20key%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(511.4126561482747%2C%20721.9999923706055\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-108.08252716064453%22%20y%3D%22-35.599998474121094%22%20width%3D%22216.16505432128906%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERemaining%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20workflow%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Ebudget%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-G-11%22%20transform%3D%22translate\(357.25155385335285%2C%20550.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-83.69314193725586%22%20y%3D%22-30%22%20width%3D%22167.38628387451172%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EResult%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20found%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-H-17%22%20transform%3D%22translate\(392.49792226155597%2C%20893.5999908447266\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-74.09454345703125%22%20y%3D%22-30%22%20width%3D%22148.1890869140625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20safe%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-I-19%22%20transform%3D%22translate\(158.05828603108722%2C%201065.1999893188477\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-108.89375305175781%22%20y%3D%22-35.599998474121094%22%20width%3D%22217.78750610351562%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20with%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20remaining%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Edeadline%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-21%22%20transform%3D%22translate\(417.1961034138997%2C%201065.1999893188477\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-110.24407196044922%22%20y%3D%22-35.599998474121094%22%20width%3D%22220.48814392089844%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EUse%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20compensation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Eescalation%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-K-23%22%20transform%3D%22translate\(506.5679219563802%2C%201342.3999862670898\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-122.61673736572266%22%20y%3D%22-35.599998474121094%22%20width%3D%22245.2334747314453%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReturn%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20timeout%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20partial%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Eresult%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-L-25%22%20transform%3D%22translate\(158.05828603108722%2C%201170.7999877929688\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-91.23189926147461%22%20y%3D%22-30%22%20width%3D%22182.46379852294922%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20succeeds%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-M-27%22%20transform%3D%22translate\(125.9749984741211%2C%201342.3999862670898\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-113.97500610351562%22%20y%3D%22-35.599998474121094%22%20width%3D%22227.95001220703125%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPersist%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20checkpoint%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Econtinue%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M492.1682942708333%2C72L492.1682942708333%2C100%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6NDkyLjE2ODI5NDI3MDgzMzMsInkiOjcyfSx7IngiOjQ5Mi4xNjgyOTQyNzA4MzMzLCJ5IjoxMDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M492.1682942708333%2C172L492.1682942708333%2C200%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6NDkyLjE2ODI5NDI3MDgzMzMsInkiOjE3Mn0seyJ4Ijo0OTIuMTY4Mjk0MjcwODMzMywieSI6MjA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M436.8964207967122%2C283.1999969482422L436.8964207967122%2C296.41704092294754Q436.8964207967122%2C298.1999969482422%20435.8106343590853%2C299.6142105106153L435.8106343590853%2C299.6142105106153Q434.72484792145843%2C301.0284240729884%20433.3106343590853%2C302.1142105106153L433.3106343590853%2C302.1142105106153Q431.8964207967122%2C303.1999969482422%20430.11346477141757%2C303.1999969482422L173.35197661448734%2C303.1999969482422Q171.5690205891927%2C303.1999969482422%20170.15480702681958%2C304.2857833858691L170.15480702681958%2C304.2857833858691Q168.7405934644465%2C305.371569823496%20167.6548070268196%2C306.7857833858691L167.65480702681958%2C306.7857833858691Q166.5690205891927%2C308.1999969482422%20166.5690205891927%2C309.98295297353684L166.5690205891927%2C356.1999969482422L166.5690205891927%2C550.3999938964844L166.5690205891927%2C633.3999938964844L166.5690205891927%2C659.6170378711897Q166.5690205891927%2C661.3999938964844%20167.65480702681958%2C662.8142074588575L167.6548070268196%2C662.8142074588575Q168.7405934644465%2C664.2284210212306%20170.15480702681958%2C665.3142074588575L170.15480702681958%2C665.3142074588575Q171.5690205891927%2C666.3999938964844%20173.35197661448734%2C666.3999938964844L187.55631043385245%2C666.3999938964844Q189.3392664591471%2C666.3999938964844%20190.7534800215202%2C667.4857803341113L190.7534800215202%2C667.4857803341113Q192.16769358389328%2C668.5715667717382%20193.25348002152018%2C669.9857803341113L193.2534800215202%2C669.9857803341113Q194.3392664591471%2C671.3999938964844%20194.3392664591471%2C673.182949921779L194.3392664591471%2C676.3999938964844%22%20id%3D%22L_C_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_D_0%22%20data-points%3D%22W3sieCI6NDM2Ljg5NjQyMDc5NjcxMjIsInkiOjI4My4xOTk5OTY5NDgyNDIyfSx7IngiOjQzNi44OTY0MjA3OTY3MTIyLCJ5IjozMDMuMTk5OTk2OTQ4MjQyMn0seyJ4IjoxNjYuNTY5MDIwNTg5MTkyNywieSI6MzAzLjE5OTk5Njk0ODI0MjJ9LHsieCI6MTY2LjU2OTAyMDU4OTE5MjcsInkiOjM1Ni4xOTk5OTY5NDgyNDIyfSx7IngiOjE2Ni41NjkwMjA1ODkxOTI3LCJ5Ijo1NTAuMzk5OTkzODk2NDg0NH0seyJ4IjoxNjYuNTY5MDIwNTg5MTkyNywieSI6NjMzLjM5OTk5Mzg5NjQ4NDR9LHsieCI6MTY2LjU2OTAyMDU4OTE5MjcsInkiOjY2Ni4zOTk5OTM4OTY0ODQ0fSx7IngiOjE5NC4zMzkyNjY0NTkxNDcxLCJ5Ijo2NjYuMzk5OTkzODk2NDg0NH0seyJ4IjoxOTQuMzM5MjY2NDU5MTQ3MSwieSI6NjgwLjM5OTk5Mzg5NjQ4NDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M492.1682942708333%2C283.1999969482422L492.1682942708333%2C316.41704092294754Q492.1682942708333%2C318.1999969482422%20491.0825078332064%2C319.6142105106153L491.0825078332064%2C319.6142105106153Q489.9967213955795%2C321.0284240729884%20488.5825078332064%2C322.1142105106153L488.5825078332064%2C322.1142105106153Q487.1682942708333%2C323.1999969482422%20485.38533824553866%2C323.1999969482422L364.0345098786475%2C323.1999969482422Q362.25155385335285%2C323.1999969482422%20360.83734029097974%2C324.2857833858691L360.83734029097974%2C324.2857833858691Q359.42312672860663%2C325.371569823496%20358.33734029097974%2C326.7857833858691L358.33734029097974%2C326.7857833858691Q357.25155385335285%2C328.1999969482422%20357.25155385335285%2C329.98295297353684L357.25155385335285%2C397.1999969482422%22%20id%3D%22L_C_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_E_0%22%20data-points%3D%22W3sieCI6NDkyLjE2ODI5NDI3MDgzMzMsInkiOjI4My4xOTk5OTY5NDgyNDIyfSx7IngiOjQ5Mi4xNjgyOTQyNzA4MzMzLCJ5IjozMjMuMTk5OTk2OTQ4MjQyMn0seyJ4IjozNTcuMjUxNTUzODUzMzUyODUsInkiOjMyMy4xOTk5OTY5NDgyNDIyfSx7IngiOjM1Ny4yNTE1NTM4NTMzNTI4NSwieSI6NDAxLjE5OTk5Njk0ODI0MjJ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M547.4401677449544%2C283.1999969482422L547.4401677449544%2C356.1999969482422L547.4401677449544%2C550.3999938964844L547.4401677449544%2C633.3999938964844L547.4401677449544%2C674.3999938964844%22%20id%3D%22L_C_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_F_0%22%20data-points%3D%22W3sieCI6NTQ3LjQ0MDE2Nzc0NDk1NDQsInkiOjI4My4xOTk5OTY5NDgyNDIyfSx7IngiOjU0Ny40NDAxNjc3NDQ5NTQ0LCJ5IjozNTYuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo1NDcuNDQwMTY3NzQ0OTU0NCwieSI6NTUwLjM5OTk5Mzg5NjQ4NDR9LHsieCI6NTQ3LjQ0MDE2Nzc0NDk1NDQsInkiOjYzMy4zOTk5OTM4OTY0ODQ0fSx7IngiOjU0Ny40NDAxNjc3NDQ5NTQ0LCJ5Ijo2NzguMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M357.25155385335285%2C480.3999938964844L357.25155385335285%2C508.3999938964844%22%20id%3D%22L_E_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_E_G_0%22%20data-points%3D%22W3sieCI6MzU3LjI1MTU1Mzg1MzM1Mjg1LCJ5Ijo0ODAuMzk5OTkzODk2NDg0NH0seyJ4IjozNTcuMjUxNTUzODUzMzUyODUsInkiOjUxMi4zOTk5OTM4OTY0ODQ0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M329.35384114583337%2C580.3999938964844L329.3538411458333%2C593.3289260846188Q329.3538411458333%2C600.3999938964844%20322.28277333396784%2C600.3999938964844L285.61764993398606%2C600.3999938964844Q283.8346939086914%2C600.3999938964844%20282.4204803463183%2C601.4857803341113L282.4204803463183%2C601.4857803341113Q281.0062667839452%2C602.5715667717382%20279.9204803463183%2C603.9857803341113L279.9204803463183%2C603.9857803341113Q278.8346939086914%2C605.3999938964844%20278.8346939086914%2C607.182949921779L278.8346939086914%2C674.3999938964844%22%20id%3D%22L_G_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_D_0%22%20data-points%3D%22W3sieCI6MzI5LjM1Mzg0MTE0NTgzMzM3LCJ5Ijo1ODAuMzk5OTkzODk2NDg0NH0seyJ4IjozMjkuMzUzODQxMTQ1ODMzMywieSI6NjAwLjM5OTk5Mzg5NjQ4NDR9LHsieCI6Mjc4LjgzNDY5MzkwODY5MTQsInkiOjYwMC4zOTk5OTM4OTY0ODQ0fSx7IngiOjI3OC44MzQ2OTM5MDg2OTE0LCJ5Ijo2NzguMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M385.1492665608723%2C580.3999938964844L385.1492665608724%2C659.3289260846188Q385.1492665608724%2C666.3999938964844%20392.22033437273785%2C666.3999938964844L468.6021885263004%2C666.3999938964844Q470.38514455159503%2C666.3999938964844%20471.79935811396814%2C667.4857803341113L471.79935811396814%2C667.4857803341113Q473.21357167634125%2C668.5715667717382%20474.29935811396814%2C669.9857803341113L474.29935811396814%2C669.9857803341113Q475.38514455159503%2C671.3999938964844%20475.38514455159503%2C673.182949921779L475.38514455159503%2C676.3999938964844%22%20id%3D%22L_G_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_F_0%22%20data-points%3D%22W3sieCI6Mzg1LjE0OTI2NjU2MDg3MjMsInkiOjU4MC4zOTk5OTM4OTY0ODQ0fSx7IngiOjM4NS4xNDkyNjY1NjA4NzI0LCJ5Ijo2NjYuMzk5OTkzODk2NDg0NH0seyJ4Ijo0NzUuMzg1MTQ0NTUxNTk1MDMsInkiOjY2Ni4zOTk5OTM4OTY0ODQ0fSx7IngiOjQ3NS4zODUxNDQ1NTE1OTUwMywieSI6NjgwLjM5OTk5Mzg5NjQ4NDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M475.3851445515951%2C757.5999908447266L475.38514455159503%2C770.528923032861Q475.38514455159503%2C777.5999908447266%20468.31407673972956%2C777.5999908447266L399.2808782868506%2C777.5999908447266Q397.49792226155597%2C777.5999908447266%20396.08370869918286%2C778.6857772823535L396.08370869918286%2C778.6857772823535Q394.66949513680976%2C779.7715637199803%20393.58370869918286%2C781.1857772823535L393.58370869918286%2C781.1857772823535Q392.49792226155597%2C782.5999908447266%20392.49792226155597%2C784.3829468700212L392.49792226155597%2C851.5999908447266%22%20id%3D%22L_F_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_H_0%22%20data-points%3D%22W3sieCI6NDc1LjM4NTE0NDU1MTU5NTEsInkiOjc1Ny41OTk5OTA4NDQ3MjY2fSx7IngiOjQ3NS4zODUxNDQ1NTE1OTUwMywieSI6Nzc3LjU5OTk5MDg0NDcyNjZ9LHsieCI6MzkyLjQ5NzkyMjI2MTU1NTk3LCJ5Ijo3NzcuNTk5OTkwODQ0NzI2Nn0seyJ4IjozOTIuNDk3OTIyMjYxNTU1OTcsInkiOjg1NS41OTk5OTA4NDQ3MjY2fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M367.7997411092122%2C923.5999908447266L367.7997411092122%2C936.8170348194319Q367.7997411092122%2C938.5999908447266%20366.7139546715853%2C940.0142044070997L366.7139546715853%2C940.0142044070997Q365.62816823395843%2C941.4284179694728%20364.2139546715853%2C942.5142044070997L364.2139546715853%2C942.5142044070997Q362.7997411092122%2C943.5999908447266%20361.01678508391757%2C943.5999908447266L164.84124205638187%2C943.5999908447266Q163.05828603108722%2C943.5999908447266%20161.6440724687141%2C944.6857772823535L161.6440724687141%2C944.6857772823535Q160.22985890634104%2C945.7715637199803%20159.14407246871414%2C947.1857772823535L159.1440724687141%2C947.1857772823535Q158.05828603108722%2C948.5999908447266%20158.05828603108722%2C950.3829468700212L158.05828603108722%2C1017.5999908447266%22%20id%3D%22L_H_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_H_I_0%22%20data-points%3D%22W3sieCI6MzY3Ljc5OTc0MTEwOTIxMjIsInkiOjkyMy41OTk5OTA4NDQ3MjY2fSx7IngiOjM2Ny43OTk3NDExMDkyMTIyLCJ5Ijo5NDMuNTk5OTkwODQ0NzI2Nn0seyJ4IjoxNTguMDU4Mjg2MDMxMDg3MjIsInkiOjk0My41OTk5OTA4NDQ3MjY2fSx7IngiOjE1OC4wNTgyODYwMzEwODcyMiwieSI6MTAyMS41OTk5OTA4NDQ3MjY2fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M417.1961034138997%2C923.5999908447266L417.1961034138997%2C1017.5999908447266%22%20id%3D%22L_H_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_H_J_0%22%20data-points%3D%22W3sieCI6NDE3LjE5NjEwMzQxMzg5OTcsInkiOjkyMy41OTk5OTA4NDQ3MjY2fSx7IngiOjQxNy4xOTYxMDM0MTM4OTk3LCJ5IjoxMDIxLjU5OTk5MDg0NDcyNjZ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M547.4401677449544%2C757.5999908447266L547.4401677449544%2C810.5999908447266L547.4401677449544%2C893.5999908447266L547.4401677449544%2C1065.1999893188477L547.4401677449544%2C1170.7999877929688L547.4401677449544%2C1253.7999877929688L547.4401677449544%2C1294.7999877929688%22%20id%3D%22L_F_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_K_0%22%20data-points%3D%22W3sieCI6NTQ3LjQ0MDE2Nzc0NDk1NDQsInkiOjc1Ny41OTk5OTA4NDQ3MjY2fSx7IngiOjU0Ny40NDAxNjc3NDQ5NTQ0LCJ5Ijo4MTAuNTk5OTkwODQ0NzI2Nn0seyJ4Ijo1NDcuNDQwMTY3NzQ0OTU0NCwieSI6ODkzLjU5OTk5MDg0NDcyNjZ9LHsieCI6NTQ3LjQ0MDE2Nzc0NDk1NDQsInkiOjEwNjUuMTk5OTg5MzE4ODQ3N30seyJ4Ijo1NDcuNDQwMTY3NzQ0OTU0NCwieSI6MTE3MC43OTk5ODc3OTI5Njg4fSx7IngiOjU0Ny40NDAxNjc3NDQ5NTQ0LCJ5IjoxMjUzLjc5OTk4Nzc5Mjk2ODh9LHsieCI6NTQ3LjQ0MDE2Nzc0NDk1NDQsInkiOjEyOTguNzk5OTg3NzkyOTY4OH1d%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M158.05828603108722%2C1100.7999877929688L158.05828603108722%2C1128.7999877929688%22%20id%3D%22L_I_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_L_0%22%20data-points%3D%22W3sieCI6MTU4LjA1ODI4NjAzMTA4NzIyLCJ5IjoxMTAwLjc5OTk4Nzc5Mjk2ODh9LHsieCI6MTU4LjA1ODI4NjAzMTA4NzIyLCJ5IjoxMTMyLjc5OTk4Nzc5Mjk2ODh9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M127.6476542154947%2C1200.7999877929688L127.64765421549478%2C1219.963659922282Q127.64765421549478%2C1220.7999877929688%20126.81132634480794%2C1220.7999877929688L126.81132634480794%2C1220.7999877929688Q125.9749984741211%2C1220.7999877929688%20125.9749984741211%2C1221.6363156636555L125.9749984741211%2C1294.7999877929688%22%20id%3D%22L_L_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_M_0%22%20data-points%3D%22W3sieCI6MTI3LjY0NzY1NDIxNTQ5NDcsInkiOjEyMDAuNzk5OTg3NzkyOTY4OH0seyJ4IjoxMjcuNjQ3NjU0MjE1NDk0NzgsInkiOjEyMjAuNzk5OTg3NzkyOTY4OH0seyJ4IjoxMjUuOTc0OTk4NDc0MTIxMSwieSI6MTIyMC43OTk5ODc3OTI5Njg4fSx7IngiOjEyNS45NzQ5OTg0NzQxMjExLCJ5IjoxMjk4Ljc5OTk4Nzc5Mjk2ODh9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M188.46891784667977%2C1200.7999877929688L188.4689178466797%2C1279.7289199811032Q188.4689178466797%2C1286.7999877929688%20195.53998565854516%2C1286.7999877929688L458.9127201425113%2C1286.7999877929688Q460.69567616780597%2C1286.7999877929688%20462.1098897301791%2C1287.8857742305956L462.1098897301791%2C1287.8857742305956Q463.5241032925522%2C1288.9715606682225%20464.6098897301791%2C1290.3857742305956L464.6098897301791%2C1290.3857742305956Q465.69567616780597%2C1291.7999877929688%20465.69567616780597%2C1293.5829438182634L465.69567616780597%2C1296.7999877929688%22%20id%3D%22L_L_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_K_0%22%20data-points%3D%22W3sieCI6MTg4LjQ2ODkxNzg0NjY3OTc3LCJ5IjoxMjAwLjc5OTk4Nzc5Mjk2ODh9LHsieCI6MTg4LjQ2ODkxNzg0NjY3OTcsInkiOjEyODYuNzk5OTg3NzkyOTY4OH0seyJ4Ijo0NjUuNjk1Njc2MTY3ODA1OTcsInkiOjEyODYuNzk5OTg3NzkyOTY4OH0seyJ4Ijo0NjUuNjk1Njc2MTY3ODA1OTcsInkiOjEzMDAuNzk5OTg3NzkyOTY4OH1d%22%20marker-end%3D%22url\(%23mermaid-_r_pb__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(166.315980275472%2C%20444.7999954223633\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_D_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(357.13280232747394%2C%20356.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_E_0%22%20transform%3D%22translate\(-27.881248474121094%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2279.76250076293945%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EUnknown%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(547.3862546284993%2C%20444.7999954223633\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_F_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_E_G_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(278.5816535949707%2C%20633.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_D_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(385.0953534444173%2C%20633.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_F_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(392.24488194783527%2C%20810.5999908447266\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_H_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(157.80524571736652%2C%20976.5999908447266\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_H_I_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(417.14219029744464%2C%20976.5999908447266\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_H_J_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(547.3862546284993%2C%20976.5999908447266\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_K_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(125.72195816040039%2C%201253.7999877929688\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_M_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(188.4150047302246%2C%201253.7999877929688\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_K_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

Possible recovery actions:

* Retry the same operation

* Use exponential backoff

* Switch to an alternate provider

* Route to another Worker

* Return cached data

* Reduce prompt or query size

* Skip an optional task

* Return a partial response

* Mark the workflow for asynchronous completion

* Escalate to a human

* Reconcile an uncertain side effect

# 15. Optional versus critical tasks

Not every task should block the workflow.

## Critical task

The workflow cannot produce a valid result without it.

```
Order lookup
Payment authorization
Required identity verification
```

A timeout may fail the workflow or trigger a fallback.

## Optional task

The workflow can continue without it.

```
Analytics event
Recommendation enrichment
Nonessential notification
Audit enrichment
```

A timeout may be recorded and handled asynchronously.

```
Main response completed
    ↓
Analytics event timed out
    ↓
Do not block user response
    ↓
Queue event for later processing
```

This is called graceful degradation.

# 16. Timeout budgets and parallel execution

If independent tasks run sequentially, their timeout budgets add up:

```
Task A: 20 seconds
Task B: 20 seconds
Task C: 20 seconds

Sequential total: up to 60 seconds
```

If they run in parallel:

```
Task A ─┐
Task B ─┼── Parallel execution
Task C ─┘

Total: approximately 20 seconds
```

Example:

Python

Run

```
results = await asyncio.gather(
    asyncio.wait_for(fetch_order(), timeout=10),
    asyncio.wait_for(search_policy(), timeout=10),
    asyncio.wait_for(get_customer_profile(), timeout=10),
    return_exceptions=True,
)
```

CWD should use parallel execution where tasks are independent, while still enforcing a parent deadline.

# 17. Observability for timeouts

CWD dashboards should expose:

* Timeout count by component

* Timeout rate by operation

* Average and percentile latency

* Remaining workflow budget

* Number of cancelled tasks

* Number of uncertain completions

* Retry-after-timeout count

* Worker timeout distribution

* LLM time-to-first-token

* LLM total generation time

* MCP tool latency

* Queue wait time

* Database query latency

* Workflow deadline-exceeded count

Example event:

JSON

```
{
  "event": "task_timeout",
  "request_id": "req-1001",
  "workflow_id": "wf-2001",
  "task_id": "task-3001",
  "component": "mcp_tool",
  "operation": "get_order_status",
  "timeout_seconds": 15,
  "elapsed_seconds": 15.1,
  "remaining_workflow_seconds": 42,
  "retryable": true,
  "recovery_action": "retry",
  "trace_id": "trace-9001"
}
```

This allows CWD to distinguish:

```
Slow LLM
Slow MCP tool
Slow database
Queue backlog
Worker starvation
Coordinator delay
External API outage
```

# 18. Recommended timeout policy for CWD

```
1. Assign a workflow deadline at request intake.
2. Propagate the deadline through Coordinator, Delegator, and Workers.
3. Configure separate connection, read, request, and processing timeouts.
4. Set shorter timeouts for low-latency operations.
5. Use task-specific budgets for long-running operations.
6. Cancel local work when the deadline is exceeded.
7. Reconcile remote operations whose completion status is unknown.
8. Use idempotency keys before retrying side-effecting operations.
9. Do not let optional tasks block the main workflow.
10. Persist timeout events and execution state.
11. Use fallback, rerouting, partial results, or asynchronous continuation.
12. Enforce a final workflow deadline at the Coordinator.
```

## Interview-ready explanation

> CWD uses hierarchical timeout management to prevent long-running agents and external dependencies from blocking workflows. A workflow deadline is created at request intake and propagated through the Coordinator, Delegator, Workers, LLM calls, MCP tools, APIs, databases, and messaging systems. Each operation has its own connection, read, execution, and cancellation limits, while respecting the remaining parent deadline. When a timeout occurs, CWD persists the execution state, classifies whether the remote operation completed, and chooses retry, fallback, rerouting, compensation, asynchronous continuation, or escalation. Idempotency keys protect side-effecting operations from duplicate execution, and observability metrics identify latency bottlenecks and recurring timeout failures.

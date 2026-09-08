## Delegator Failure Detection & Recovery in CWD

Advanced · ~60 minutes

The Delegator is the component that turns a domain-level task into executable work and assigns it to the right Worker. Its failure is especially important because it sits between the Coordinator and the Worker pool.

> Core principle: A Delegator failure must not erase the business task, lose its execution state, or cause the same domain operation to be assigned incorrectly.

The goal is not simply to restart the Delegator. It is to recover the orchestration decision and continue the workflow safely.

### 1. What the Delegator is responsible for

In CWD, the Delegator typically manages:

* Domain-level task orchestration: Understand what business capability is required.

* Worker selection: Choose a Worker with the right capability and availability.

* Task assignment: Send the task to the selected Worker.

* Execution tracking: Track whether the assignment is pending, running, completed, or failed.

* Failure handling: Retry, reroute, or escalate when assignment or execution fails.

* Execution continuity: Preserve the relationship between the original task and its assigned work.

### Example

```
Customer Support Request
        |
        v
Coordinator
        |
        v
Delegator
        |
        +--> "Order lookup" → Order Worker
        |
        +--> "Knowledge search" → Knowledge Worker
        |
        +--> "Send notification" → Notification Worker
```

The Delegator is not merely a load balancer. It must preserve the meaning of the business task while deciding how that task is executed.

## 2. The complete Delegator failure lifecycle

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_du_%22%20width%3D%22953.2965087890625%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%221696.4000244140625%22%20viewBox%3D%224%204%20953.2965087890625%201696.4000244140625%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_du_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_du_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_du_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_du_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_du_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_du_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_du_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_du_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_du_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_du_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_du_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_du_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_du_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_du_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_du_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_du_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_du_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_du_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_du_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_du_%20.label%20text%2C%23mermaid-_r_du_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_du_%20.node%20rect%2C%23mermaid-_r_du_%20.node%20circle%2C%23mermaid-_r_du_%20.node%20ellipse%2C%23mermaid-_r_du_%20.node%20polygon%2C%23mermaid-_r_du_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_du_%20.rough-node%20.label%20text%2C%23mermaid-_r_du_%20.node%20.label%20text%2C%23mermaid-_r_du_%20.image-shape%20.label%2C%23mermaid-_r_du_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_du_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_du_%20.rough-node%20.label%2C%23mermaid-_r_du_%20.node%20.label%2C%23mermaid-_r_du_%20.image-shape%20.label%2C%23mermaid-_r_du_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_du_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_du_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_du_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_du_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_du_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_du_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_du_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_du_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_du_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_du_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_du_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_du_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_du_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_du_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_du_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_du_%20.icon-shape%2C%23mermaid-_r_du_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_du_%20.icon-shape%20p%2C%23mermaid-_r_du_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_du_%20.icon-shape%20rect%2C%23mermaid-_r_du_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_du_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_du_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_du_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_du_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_du_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_du_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_du_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_du_%20.node%20rect%2C%23mermaid-_r_du_%20.node%20circle%2C%23mermaid-_r_du_%20.node%20ellipse%2C%23mermaid-_r_du_%20.node%20polygon%2C%23mermaid-_r_du_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_du_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_du_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_du_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_du_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_du_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_du_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_du__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_du__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_du__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_du__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_du__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_du__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(245.85907491048178%2C%20513.5999984741211\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-133.2375030517578%22%20y%3D%22-35.599998474121094%22%20width%3D%22266.4750061035156%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECoordinator%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20creates%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20domain%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Etask%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(245.85907491048178%2C%20619.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-116.64360809326172%22%20y%3D%22-30%22%20width%3D%22233.28721618652344%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDelegator%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20receives%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20task%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(245.85907491048178%2C%20719.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-88.22735595703125%22%20y%3D%22-30%22%20width%3D%22176.4547119140625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ELoad%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20task%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20state%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(245.85907491048178%2C%20819.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-125.76580047607422%22%20y%3D%22-30%22%20width%3D%22251.53160095214844%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ESelect%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20compatible%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Worker%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(279.4879913330078%2C%20919.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-100.88674926757812%22%20y%3D%22-30%22%20width%3D%22201.77349853515625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPersist%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20assignment%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(279.4879913330078%2C%201019.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-82.61860656738281%22%20y%3D%22-30%22%20width%3D%22165.23721313476562%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDispatch%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20task%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-G-11%22%20transform%3D%22translate\(279.4879913330078%2C%201119.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-117.88768768310547%22%20y%3D%22-30%22%20width%3D%22235.77537536621094%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EAssignment%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20successful%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-H-13%22%20transform%3D%22translate\(408.40846252441406%2C%201285.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-117.54375457763672%22%20y%3D%22-30%22%20width%3D%22235.08750915527344%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETrack%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Worker%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20execution%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-I-15%22%20transform%3D%22translate\(131.43235778808594%2C%201285.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-119.43236541748047%22%20y%3D%22-30%22%20width%3D%22238.86473083496094%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDetect%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Delegator%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failure%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-17%22%20transform%3D%22translate\(120.3094431559245%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-86.06361389160156%22%20y%3D%22-30%22%20width%3D%22172.12722778320312%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EClassify%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failure%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-K-19%22%20transform%3D%22translate\(574.9284311930339%2C%20142\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-81.94158935546875%22%20y%3D%22-30%22%20width%3D%22163.8831787109375%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERecoverable%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-L-21%22%20transform%3D%22translate\(547.6145680745443%2C%20308\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-125.49205780029297%22%20y%3D%22-30%22%20width%3D%22250.98411560058594%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20restart%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Delegator%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-M-23%22%20transform%3D%22translate\(830.4566167195638%2C%20308\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-117.35000610351562%22%20y%3D%22-30%22%20width%3D%22234.70001220703125%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EMark%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20assignment%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failed%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-N-25%22%20transform%3D%22translate\(547.6145680745443%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-98.9273567199707%22%20y%3D%22-30%22%20width%3D%22197.8547134399414%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERecover%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20task%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20state%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-O-27%22%20transform%3D%22translate\(547.6145680745443%2C%20513.5999984741211\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-128.51799774169922%22%20y%3D%22-30%22%20width%3D%22257.03599548339844%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECheck%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20existing%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20assignment%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-P-29%22%20transform%3D%22translate\(547.6145680745443%2C%20619.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-114.30065155029297%22%20y%3D%22-30%22%20width%3D%22228.60130310058594%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETask%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20already%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20assigned%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-Q-31%22%20transform%3D%22translate\(509.51435343424487%2C%20819.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-93.85000228881836%22%20y%3D%22-30%22%20width%3D%22187.70000457763672%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EResume%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20tracking%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-R-33%22%20transform%3D%22translate\(769.1301447550456%2C%20819.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-125.76580047607422%22%20y%3D%22-30%22%20width%3D%22251.53160095214844%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ESelect%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20compatible%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Worker%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-S-37%22%20transform%3D%22translate\(408.40846252441406%2C%201385.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-104.87346649169922%22%20y%3D%22-30%22%20width%3D%22209.74693298339844%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorker%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20completed%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-T-39%22%20transform%3D%22translate\(373.45064290364587%2C%201551.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-125.0243911743164%22%20y%3D%22-30%22%20width%3D%22250.0487823486328%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EValidate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20report%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20result%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-U-41%22%20transform%3D%22translate\(653.6345952351888%2C%201551.1999969482422\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-115.15955352783203%22%20y%3D%22-30%22%20width%3D%22230.31910705566406%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20reroute%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Worker%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-V-43%22%20transform%3D%22translate\(411.49278513590497%2C%201656.7999954223633\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-114.12642669677734%22%20y%3D%22-35.599998474121094%22%20width%3D%22228.2528533935547%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECoordinator%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20continues%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Eworkflow%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-W-47%22%20transform%3D%22translate\(830.4566167195638%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-118.83985900878906%22%20y%3D%22-30%22%20width%3D%22237.67971801757812%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EEscalate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20recover%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20later%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M245.85907491048178%2C549.1999969482422L245.85907491048178%2C577.1999969482422%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6MjQ1Ljg1OTA3NDkxMDQ4MTc4LCJ5Ijo1NDkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoyNDUuODU5MDc0OTEwNDgxNzgsInkiOjU4MS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M245.85907491048178%2C649.1999969482422L245.85907491048178%2C677.1999969482422%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6MjQ1Ljg1OTA3NDkxMDQ4MTc4LCJ5Ijo2NDkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoyNDUuODU5MDc0OTEwNDgxNzgsInkiOjY4MS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M245.85907491048178%2C749.1999969482422L245.85907491048178%2C777.1999969482422%22%20id%3D%22L_C_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_D_0%22%20data-points%3D%22W3sieCI6MjQ1Ljg1OTA3NDkxMDQ4MTc4LCJ5Ijo3NDkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoyNDUuODU5MDc0OTEwNDgxNzgsInkiOjc4MS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M245.85907491048178%2C849.1999969482422L245.85907491048178%2C877.1999969482422%22%20id%3D%22L_D_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_E_0%22%20data-points%3D%22W3sieCI6MjQ1Ljg1OTA3NDkxMDQ4MTc4LCJ5Ijo4NDkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoyNDUuODU5MDc0OTEwNDgxNzgsInkiOjg4MS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M279.4879913330078%2C949.1999969482422L279.4879913330078%2C977.1999969482422%22%20id%3D%22L_E_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_E_F_0%22%20data-points%3D%22W3sieCI6Mjc5LjQ4Nzk5MTMzMzAwNzgsInkiOjk0OS4xOTk5OTY5NDgyNDIyfSx7IngiOjI3OS40ODc5OTEzMzMwMDc4LCJ5Ijo5ODEuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M279.4879913330078%2C1049.1999969482422L279.4879913330078%2C1077.1999969482422%22%20id%3D%22L_F_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_G_0%22%20data-points%3D%22W3sieCI6Mjc5LjQ4Nzk5MTMzMzAwNzgsInkiOjEwNDkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoyNzkuNDg3OTkxMzMzMDA3OCwieSI6MTA4MS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M318.7838846842448%2C1149.1999969482422L318.7838846842448%2C1162.4170409229475Q318.7838846842448%2C1164.1999969482422%20319.8696711218717%2C1165.6142105106153L319.8696711218717%2C1165.6142105106153Q320.9554575594986%2C1167.0284240729884%20322.3696711218717%2C1168.1142105106153L322.3696711218717%2C1168.1142105106153Q323.7838846842448%2C1169.1999969482422%20325.56684070953946%2C1169.1999969482422L401.6255064991194%2C1169.1999969482422Q403.40846252441406%2C1169.1999969482422%20404.82267608678717%2C1170.285783385869L404.82267608678717%2C1170.285783385869Q406.2368896491603%2C1171.371569823496%20407.32267608678717%2C1172.785783385869L407.32267608678717%2C1172.785783385869Q408.40846252441406%2C1174.1999969482422%20408.40846252441406%2C1175.9829529735368L408.40846252441406%2C1243.1999969482422%22%20id%3D%22L_G_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_H_0%22%20data-points%3D%22W3sieCI6MzE4Ljc4Mzg4NDY4NDI0NDgsInkiOjExNDkuMTk5OTk2OTQ4MjQyMn0seyJ4IjozMTguNzgzODg0Njg0MjQ0OCwieSI6MTE2OS4xOTk5OTY5NDgyNDIyfSx7IngiOjQwOC40MDg0NjI1MjQ0MTQwNiwieSI6MTE2OS4xOTk5OTY5NDgyNDIyfSx7IngiOjQwOC40MDg0NjI1MjQ0MTQwNiwieSI6MTI0Ny4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M240.19209798177081%2C1149.1999969482422L240.19209798177084%2C1228.1289291363767Q240.19209798177084%2C1235.1999969482422%20233.12103016990537%2C1235.1999969482422L178.0260997427426%2C1235.1999969482422Q176.24314371744794%2C1235.1999969482422%20174.82893015507483%2C1236.285783385869L174.82893015507483%2C1236.285783385869Q173.41471659270175%2C1237.371569823496%20172.32893015507486%2C1238.785783385869L172.32893015507483%2C1238.785783385869Q171.24314371744794%2C1240.1999969482422%20171.24314371744794%2C1241.9829529735368L171.24314371744794%2C1245.1999969482422%22%20id%3D%22L_G_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_I_0%22%20data-points%3D%22W3sieCI6MjQwLjE5MjA5Nzk4MTc3MDgxLCJ5IjoxMTQ5LjE5OTk5Njk0ODI0MjJ9LHsieCI6MjQwLjE5MjA5Nzk4MTc3MDg0LCJ5IjoxMjM1LjE5OTk5Njk0ODI0MjJ9LHsieCI6MTcxLjI0MzE0MzcxNzQ0Nzk0LCJ5IjoxMjM1LjE5OTk5Njk0ODI0MjJ9LHsieCI6MTcxLjI0MzE0MzcxNzQ0Nzk0LCJ5IjoxMjQ5LjE5OTk5Njk0ODI0MjJ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M91.6215718587239%2C1255.1999969482422L91.62157185872397%2C1202.1999969482422L91.62157185872397%2C1119.1999969482422L91.62157185872397%2C1019.1999969482422L91.62157185872397%2C919.1999969482422L91.62157185872397%2C819.1999969482422L91.62157185872397%2C719.1999969482422L91.62157185872397%2C619.1999969482422L91.62157185872397%2C513.5999984741211L91.62157185872397%2C408L91.62157185872397%2C308L91.62157185872397%2C225L91.62157185872397%2C142L91.62157185872397%2C84%22%20id%3D%22L_I_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_J_0%22%20data-points%3D%22W3sieCI6OTEuNjIxNTcxODU4NzIzOSwieSI6MTI1NS4xOTk5OTY5NDgyNDIyfSx7IngiOjkxLjYyMTU3MTg1ODcyMzk3LCJ5IjoxMjAyLjE5OTk5Njk0ODI0MjJ9LHsieCI6OTEuNjIxNTcxODU4NzIzOTcsInkiOjExMTkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo5MS42MjE1NzE4NTg3MjM5NywieSI6MTAxOS4xOTk5OTY5NDgyNDIyfSx7IngiOjkxLjYyMTU3MTg1ODcyMzk3LCJ5Ijo5MTkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo5MS42MjE1NzE4NTg3MjM5NywieSI6ODE5LjE5OTk5Njk0ODI0MjJ9LHsieCI6OTEuNjIxNTcxODU4NzIzOTcsInkiOjcxOS4xOTk5OTY5NDgyNDIyfSx7IngiOjkxLjYyMTU3MTg1ODcyMzk3LCJ5Ijo2MTkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo5MS42MjE1NzE4NTg3MjM5NywieSI6NTEzLjU5OTk5ODQ3NDEyMTF9LHsieCI6OTEuNjIxNTcxODU4NzIzOTcsInkiOjQwOH0seyJ4Ijo5MS42MjE1NzE4NTg3MjM5NywieSI6MzA4fSx7IngiOjkxLjYyMTU3MTg1ODcyMzk3LCJ5IjoyMjV9LHsieCI6OTEuNjIxNTcxODU4NzIzOTcsInkiOjE0Mn0seyJ4Ijo5MS42MjE1NzE4NTg3MjM5NywieSI6ODB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M148.997314453125%2C72L148.997314453125%2C85.21704397470535Q148.997314453125%2C87%20150.0831008907519%2C88.41421356237309L150.0831008907519%2C88.41421356237309Q151.16888732837882%2C89.82842712474618%20152.5831008907519%2C90.91421356237309L152.5831008907519%2C90.91421356237309Q153.997314453125%2C92%20155.78027047841965%2C92L568.1454751677393%2C92Q569.9284311930339%2C92%20571.342644755407%2C93.08578643762691L571.342644755407%2C93.08578643762692Q572.7568583177801%2C94.17157287525382%20573.842644755407%2C95.58578643762691L573.842644755407%2C95.58578643762691Q574.9284311930339%2C97%20574.9284311930339%2C98.78295602529465L574.9284311930339%2C102%22%20id%3D%22L_J_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_J_K_0%22%20data-points%3D%22W3sieCI6MTQ4Ljk5NzMxNDQ1MzEyNSwieSI6NzJ9LHsieCI6MTQ4Ljk5NzMxNDQ1MzEyNSwieSI6OTJ9LHsieCI6NTc0LjkyODQzMTE5MzAzMzksInkiOjkyfSx7IngiOjU3NC45Mjg0MzExOTMwMzM5LCJ5IjoxMDZ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M547.6145680745443%2C172L547.6145680745443%2C266%22%20id%3D%22L_K_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_K_L_0%22%20data-points%3D%22W3sieCI6NTQ3LjYxNDU2ODA3NDU0NDMsInkiOjE3Mn0seyJ4Ijo1NDcuNjE0NTY4MDc0NTQ0MywieSI6MjcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M602.2422943115236%2C172L602.2422943115236%2C185.21704397470535Q602.2422943115236%2C187%20603.3280807491504%2C188.4142135623731L603.3280807491504%2C188.4142135623731Q604.4138671867773%2C189.82842712474618%20605.8280807491504%2C190.91421356237308L605.8280807491504%2C190.9142135623731Q607.2422943115236%2C192%20609.0252503368182%2C192L823.6736606942692%2C192Q825.4566167195638%2C192%20826.870830281937%2C193.0857864376269L826.870830281937%2C193.08578643762692Q828.28504384431%2C194.17157287525382%20829.370830281937%2C195.5857864376269L829.370830281937%2C195.5857864376269Q830.4566167195638%2C197%20830.4566167195638%2C198.78295602529465L830.4566167195638%2C266%22%20id%3D%22L_K_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_K_M_0%22%20data-points%3D%22W3sieCI6NjAyLjI0MjI5NDMxMTUyMzYsInkiOjE3Mn0seyJ4Ijo2MDIuMjQyMjk0MzExNTIzNiwieSI6MTkyfSx7IngiOjgzMC40NTY2MTY3MTk1NjM4LCJ5IjoxOTJ9LHsieCI6ODMwLjQ1NjYxNjcxOTU2MzgsInkiOjI3MH1d%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M547.6145680745443%2C338L547.6145680745443%2C366%22%20id%3D%22L_L_N_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_N_0%22%20data-points%3D%22W3sieCI6NTQ3LjYxNDU2ODA3NDU0NDMsInkiOjMzOH0seyJ4Ijo1NDcuNjE0NTY4MDc0NTQ0MywieSI6MzcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M547.6145680745443%2C438L547.6145680745443%2C471.5999984741211%22%20id%3D%22L_N_O_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_N_O_0%22%20data-points%3D%22W3sieCI6NTQ3LjYxNDU2ODA3NDU0NDMsInkiOjQzOH0seyJ4Ijo1NDcuNjE0NTY4MDc0NTQ0MywieSI6NDc1LjU5OTk5ODQ3NDEyMTF9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M547.6145680745443%2C543.5999984741211L547.6145680745443%2C577.1999969482422%22%20id%3D%22L_O_P_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_P_0%22%20data-points%3D%22W3sieCI6NTQ3LjYxNDU2ODA3NDU0NDMsInkiOjU0My41OTk5OTg0NzQxMjExfSx7IngiOjU0Ny42MTQ1NjgwNzQ1NDQzLCJ5Ijo1ODEuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M509.51435343424487%2C649.1999969482422L509.51435343424487%2C777.1999969482422%22%20id%3D%22L_P_Q_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_P_Q_0%22%20data-points%3D%22W3sieCI6NTA5LjUxNDM1MzQzNDI0NDg3LCJ5Ijo2NDkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo1MDkuNTE0MzUzNDM0MjQ0ODcsInkiOjc4MS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M585.7147827148438%2C649.1999969482422L585.7147827148438%2C662.4170409229475Q585.7147827148438%2C664.1999969482422%20586.8005691524706%2C665.6142105106153L586.8005691524706%2C665.6142105106153Q587.8863555900975%2C667.0284240729884%20589.3005691524706%2C668.1142105106153L589.3005691524706%2C668.1142105106153Q590.7147827148438%2C669.1999969482422%20592.4977387401384%2C669.1999969482422L762.347188729751%2C669.1999969482422Q764.1301447550456%2C669.1999969482422%20765.5443583174188%2C670.2857833858691L765.5443583174188%2C670.2857833858691Q766.9585718797919%2C671.371569823496%20768.0443583174188%2C672.7857833858691L768.0443583174188%2C672.7857833858691Q769.1301447550456%2C674.1999969482422%20769.1301447550456%2C675.9829529735368L769.1301447550456%2C777.1999969482422%22%20id%3D%22L_P_R_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_P_R_0%22%20data-points%3D%22W3sieCI6NTg1LjcxNDc4MjcxNDg0MzgsInkiOjY0OS4xOTk5OTY5NDgyNDIyfSx7IngiOjU4NS43MTQ3ODI3MTQ4NDM4LCJ5Ijo2NjkuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo3NjkuMTMwMTQ0NzU1MDQ1NiwieSI6NjY5LjE5OTk5Njk0ODI0MjJ9LHsieCI6NzY5LjEzMDE0NDc1NTA0NTYsInkiOjc4MS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M769.1301447550456%2C849.1999969482422L769.1301447550456%2C862.4170409229475Q769.1301447550456%2C864.1999969482422%20768.0443583174188%2C865.6142105106153L768.0443583174188%2C865.6142105106153Q766.9585718797919%2C867.0284240729884%20765.5443583174188%2C868.1142105106153L765.5443583174188%2C868.1142105106153Q764.1301447550456%2C869.1999969482422%20762.347188729751%2C869.1999969482422L319.8998637808285%2C869.1999969482422Q318.1169077555339%2C869.1999969482422%20316.70269419316077%2C870.2857833858691L316.70269419316077%2C870.2857833858691Q315.28848063078766%2C871.371569823496%20314.20269419316077%2C872.7857833858691L314.20269419316077%2C872.7857833858691Q313.1169077555339%2C874.1999969482422%20313.1169077555339%2C875.9829529735368L313.1169077555339%2C879.1999969482422%22%20id%3D%22L_R_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_R_E_0%22%20data-points%3D%22W3sieCI6NzY5LjEzMDE0NDc1NTA0NTYsInkiOjg0OS4xOTk5OTY5NDgyNDIyfSx7IngiOjc2OS4xMzAxNDQ3NTUwNDU2LCJ5Ijo4NjkuMTk5OTk2OTQ4MjQyMn0seyJ4IjozMTMuMTE2OTA3NzU1NTMzOSwieSI6ODY5LjE5OTk5Njk0ODI0MjJ9LHsieCI6MzEzLjExNjkwNzc1NTUzMzksInkiOjg4My4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M408.40846252441406%2C1315.1999969482422L408.40846252441406%2C1343.1999969482422%22%20id%3D%22L_H_S_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_H_S_0%22%20data-points%3D%22W3sieCI6NDA4LjQwODQ2MjUyNDQxNDA2LCJ5IjoxMzE1LjE5OTk5Njk0ODI0MjJ9LHsieCI6NDA4LjQwODQ2MjUyNDQxNDA2LCJ5IjoxMzQ3LjE5OTk5Njk0ODI0MjJ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M373.4506429036459%2C1415.1999969482422L373.45064290364587%2C1509.1999969482422%22%20id%3D%22L_S_T_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_S_T_0%22%20data-points%3D%22W3sieCI6MzczLjQ1MDY0MjkwMzY0NTksInkiOjE0MTUuMTk5OTk2OTQ4MjQyMn0seyJ4IjozNzMuNDUwNjQyOTAzNjQ1ODcsInkiOjE1MTMuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M443.3662821451822%2C1415.1999969482422L443.36628214518225%2C1428.1289291363767Q443.3662821451823%2C1435.1999969482422%20450.4373499570478%2C1435.1999969482422L646.8516392098942%2C1435.1999969482422Q648.6345952351888%2C1435.1999969482422%20650.048808797562%2C1436.285783385869L650.048808797562%2C1436.285783385869Q651.463022359935%2C1437.371569823496%20652.548808797562%2C1438.785783385869L652.548808797562%2C1438.785783385869Q653.6345952351888%2C1440.1999969482422%20653.6345952351888%2C1441.9829529735368L653.6345952351888%2C1509.1999969482422%22%20id%3D%22L_S_U_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_S_U_0%22%20data-points%3D%22W3sieCI6NDQzLjM2NjI4MjE0NTE4MjIsInkiOjE0MTUuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo0NDMuMzY2MjgyMTQ1MTgyMywieSI6MTQzNS4xOTk5OTY5NDgyNDIyfSx7IngiOjY1My42MzQ1OTUyMzUxODg4LCJ5IjoxNDM1LjE5OTk5Njk0ODI0MjJ9LHsieCI6NjUzLjYzNDU5NTIzNTE4ODgsInkiOjE1MTMuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M373.45064290364587%2C1581.1999969482422L373.45064290364587%2C1609.1999969482422%22%20id%3D%22L_T_V_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_T_V_0%22%20data-points%3D%22W3sieCI6MzczLjQ1MDY0MjkwMzY0NTg3LCJ5IjoxNTgxLjE5OTk5Njk0ODI0MjJ9LHsieCI6MzczLjQ1MDY0MjkwMzY0NTg3LCJ5IjoxNjEzLjE5OTk5Njk0ODI0MjJ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M653.6345952351888%2C1581.1999969482422L653.6345952351888%2C1594.4170409229475Q653.6345952351888%2C1596.1999969482422%20652.548808797562%2C1597.6142105106153L652.548808797562%2C1597.6142105106153Q651.463022359935%2C1599.0284240729884%20650.048808797562%2C1600.1142105106153L650.048808797562%2C1600.1142105106153Q648.6345952351888%2C1601.1999969482422%20646.8516392098942%2C1601.1999969482422L456.3178833934587%2C1601.1999969482422Q454.53492736816406%2C1601.1999969482422%20453.12071380579096%2C1602.285783385869L453.12071380579096%2C1602.285783385869Q451.70650024341785%2C1603.371569823496%20450.62071380579096%2C1604.785783385869L450.62071380579096%2C1604.785783385869Q449.53492736816406%2C1606.1999969482422%20449.53492736816406%2C1607.9829529735368L449.53492736816406%2C1611.1999969482422%22%20id%3D%22L_U_V_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_U_V_0%22%20data-points%3D%22W3sieCI6NjUzLjYzNDU5NTIzNTE4ODgsInkiOjE1ODEuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo2NTMuNjM0NTk1MjM1MTg4OCwieSI6MTYwMS4xOTk5OTY5NDgyNDIyfSx7IngiOjQ0OS41MzQ5MjczNjgxNjQwNiwieSI6MTYwMS4xOTk5OTY5NDgyNDIyfSx7IngiOjQ0OS41MzQ5MjczNjgxNjQwNiwieSI6MTYxNS4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M830.4566167195638%2C338L830.4566167195638%2C366%22%20id%3D%22L_M_W_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_M_W_0%22%20data-points%3D%22W3sieCI6ODMwLjQ1NjYxNjcxOTU2MzgsInkiOjMzOH0seyJ4Ijo4MzAuNDU2NjE2NzE5NTYzOCwieSI6MzcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_du__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_D_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_E_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_E_F_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_G_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(408.15542221069336%2C%201202.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_H_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(240.13818486531576%2C%201202.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_I_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_J_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_J_K_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(547.3615277608236%2C%20225\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_K_L_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(830.4027036031088%2C%20225\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_K_M_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_N_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_N_O_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_P_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(509.26131312052416%2C%20719.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_P_Q_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(769.0762316385906%2C%20719.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_P_R_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_R_E_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_H_S_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(373.19760258992517%2C%201468.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_S_T_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(653.5806821187338%2C%201468.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_S_U_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_T_V_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_U_V_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_M_W_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

The key recovery step is:

> Recover the task state before making a new assignment.


## 3. How Delegator failures are detected

A Delegator can fail in several different ways. CWD should distinguish the Delegator process failing from the Delegator making an unsuccessful orchestration decision.

|
Detection mechanism

|

What it detects

|

Example

|
| --- | --- | --- |
|

Health checks

|

Delegator process is unavailable

|

Readiness check fails

|
|

Execution status

|

Task assignment is stuck or incomplete

|

Task remains `ASSIGNING`

|
|

Timeouts

|

Assignment or dispatch takes too long

|

Worker assignment exceeds deadline

|
|

Exceptions

|

Explicit orchestration errors

|

Worker registry lookup fails

|
|

Telemetry

|

Abnormal orchestration behavior

|

Assignment latency suddenly increases

|
|

Messaging signals

|

Dispatch or acknowledgment problems

|

Task message is not acknowledged

|

### Example: Delegator becomes unavailable

```
Coordinator
    |
    v
Delegator
    |
    X
Process crashes
    |
    v
Health check fails
    |
    v
Coordinator detects Delegator unavailable
    |
    v
New assignments are paused
    |
    v
Existing task state is preserved
    |
    v
Delegator restarts
    |
    v
Recover pending assignments
```

Important: The Coordinator should not assume that every task assigned to the Delegator was lost. It should inspect the durable task state and determine what actually happened.

## 4. Domain-level task orchestration must survive

This is the most important concept in your question.

Suppose the user asks:

> “Find my order status and notify me if it is delayed.”

The Coordinator may create a domain-level task:

```
Task ID: task-123
Domain: Order Support
Goal: Find order status and notify customer
```

The Delegator breaks it into executable work:

```
Task ID: task-123
    |
    +--> Subtask A: Retrieve order status
    |
    +--> Subtask B: Check delay condition
    |
    +--> Subtask C: Send notification
```

Now imagine the Delegator crashes after assigning Subtask A.

### Unsafe recovery

```
Delegator crashes
    |
    v
New Delegator starts
    |
    v
Recreates all subtasks
    |
    v
Assigns everything again
```

This can cause duplicate work or duplicate notifications.

### Safe recovery

```
Delegator crashes
    |
    v
Coordinator preserves Task ID: task-123
    |
    v
New Delegator loads task state
    |
    v
Checks existing assignments
    |
    v
Subtask A already assigned
    |
    v
Resume tracking Subtask A
    |
    v
Assign only missing work
```

The domain task remains the source of truth. The Delegator is responsible for execution, not for redefining the business objective during recovery.

## 5. Worker selection must remain domain-aware

The Delegator should not simply select the first available Worker.

It should consider:

* Required capability.

* Worker health and readiness.

* Task priority.

* Current workload.

* Supported tools and dependencies.

* Data access permissions.

* Model capabilities.

* Retry and recovery compatibility.

### Example

```
Domain task:
"Analyze customer credit risk"

Available Workers:
    |
    +--> Customer Support Worker ✓
    |
    +--> Credit Risk Worker ✗ unavailable
    |
    +--> Financial Analysis Worker ✓
```

The Delegator should select the Financial Analysis Worker only if it supports the required credit-risk task. Otherwise, it should queue the task or escalate.

Important: A healthy Worker is not automatically a suitable Worker.

## 6. Task state: The Delegator must know what happened

A reliable Delegator needs durable task state.

### Example task state

Python

Run

```
task_state = {
    "task_id": "task-123",
    "domain": "order_support",
    "goal": "Find order status",
    "status": "assigned",
    "selected_worker": "order-worker-1",
    "assignment_id": "assign-456",
    "attempt": 1,
    "checkpoint": "order_lookup_started",
    "result": None
}
```

This allows the Delegator to distinguish:

```
PENDING
    → Not yet assigned

ASSIGNED
    → Worker selected and assignment recorded

RUNNING
    → Worker has started execution

COMPLETED
    → Result received and validated

FAILED
    → Execution failed

RECOVERING
    → Recovery is in progress

ESCALATED
    → Automated recovery is not possible
```

### Why this matters

If the Delegator restarts and sees:

```
Task: task-123
Status: ASSIGNED
Worker: order-worker-1
```

It should not automatically create a new assignment. It should first determine whether the original assignment is still active, completed, or failed.

## 7. Execution continuity: Preserve the original task identity

Execution continuity means that a task remains the same logical execution even if the Delegator restarts or the Worker changes.

### Example

```
Original task:
task-123

Delegator A
    |
    v
Order Worker A
    |
    X
Worker crashes
    |
    v
Delegator B
    |
    v
Order Worker B
    |
    v
Same task: task-123
```

The Worker may change, but the domain task identity should remain stable.

This is important for:

* Tracking.

* Auditing.

* Retry limits.

* Idempotency.

* Result correlation.

* Business-level reporting.

## 8. Recovery strategy 1: Retry the Delegator operation

Use when the Delegator encounters a transient failure while selecting or dispatching a Worker.

### Example

```
Delegator
    |
    v
Worker Registry
    |
    X
Temporary connection failure
    |
    v
Retry registry lookup
    |
    ✓
Worker selected
    |
    v
Task dispatched
```

Typical retryable failures:

* Temporary registry unavailability.

* Messaging timeout.

* Temporary database connection failure.

* Transient service error.

Important: Retry the orchestration operation, not necessarily the entire business task.

## 9. Recovery strategy 2: Restart and recover the Delegator

If the Delegator process crashes, the deployment platform may restart it.

But restarting the process is only the first step.

```
Delegator crashes
        |
        v
Process restarted
        |
        v
Load pending task assignments
        |
        v
Check durable execution state
        |
        v
Resume orchestration
```

The recovery process should identify:

* Tasks waiting for assignment.

* Tasks assigned but not acknowledged.

* Tasks currently running.

* Tasks with expired deadlines.

* Tasks that completed while the Delegator was unavailable.

The restart restores the service; the state recovery restores the workflow.

## 10. Recovery strategy 3: Alternate Worker selection

If the selected Worker is unavailable, the Delegator can select another compatible Worker.

```
Delegator
    |
    v
Order Worker A
    |
    X
Unavailable
    |
    v
Check Worker registry
    |
    v
Order Worker B
    |
    ✓
Compatible and healthy
    |
    v
Resume or safely retry task
```

### Example

|
Worker

|

Capability

|

Status

|
| --- | --- | --- |
|

`order-worker-1`

|

Order lookup

|

Failed

|
|

`order-worker-2`

|

Order lookup

|

Healthy

|
|

`knowledge-worker-1`

|

Knowledge search

|

Healthy

|

The Delegator should select `order-worker-2`, not `knowledge-worker-1`.

Rerouting must preserve the domain capability.

## 11. Recovery strategy 4: Checkpointing

Checkpointing allows the Delegator to recover from the last known safe state.

### Example

```
Domain task: Generate customer report

Step 1: Retrieve data       ✓
Step 2: Analyze data        ✓
Step 3: Generate report     ✗
```

The Delegator should preserve:

Python

Run

```
checkpoint = {
    "task_id": "task-123",
    "completed_steps": [
        "retrieve_data",
        "analyze_data"
    ],
    "next_step": "generate_report",
    "status": "recovering"
}
```

After recovery:

```
Delegator restarts
    |
    v
Loads checkpoint
    |
    v
Selects compatible Report Worker
    |
    v
Resumes from generate_report
```

This prevents unnecessary repetition of completed work.

## 12. Recovery strategy 5: Failure isolation

The Delegator must prevent its failure from affecting unrelated workflows.

### Example

```
Coordinator
    |
    +--> Delegator A: Order Support
    |
    +--> Delegator B: Document Processing
    |
    +--> Delegator C: Risk Analysis
```

If Delegator A fails:

```
Order Support orchestration
    |
    X
Delegator A unavailable
```

The other domain workflows should continue if their own dependencies remain healthy.

### Isolation mechanisms

* Separate task queues.

* Independent execution state.

* Bounded concurrency.

* Per-domain retry budgets.

* Separate Worker pools where appropriate.

* Circuit breakers for failing dependencies.

* Independent recovery workflows.

Failure isolation prevents one domain’s orchestration problem from becoming a platform-wide outage.

## 13. Advanced scenario: Delegator crashes after assignment

This is a very important distributed-systems problem.

### Scenario

```
1. Coordinator creates task-123
2. Delegator selects Order Worker A
3. Delegator sends task to Worker A
4. Worker A receives task
5. Delegator crashes before recording completion
```

Now the system must determine:

> “Did the task actually execute, or did only the assignment message get sent?”

### Safe recovery

```
Delegator restarts
    |
    v
Load task-123
    |
    v
Check assignment state
    |
    v
Check Worker acknowledgment / execution status
    |
    v
Check idempotency / side-effect state
    |
    v
Resume tracking OR safely retry
```

Never assume that a missing response means the task never executed.

## 14. End-to-end example: Customer Support Agent

### Scenario: Delegator fails while routing an order request

```
User
  |
  v
Gateway
  |
  v
Coordinator
  |
  v
Domain Task Created
  |
  v
Delegator
  |
  v
Select Order Worker
  |
  X
Delegator crashes
  |
  v
Coordinator detects failure
  |
  v
Task remains PENDING / RECOVERING
  |
  v
Delegator restarts
  |
  v
Load task state
  |
  v
Check previous assignment
  |
  +--> Assignment completed
  |        |
  |        v
  |   Continue workflow
  |
  +--> Assignment failed
  |        |
  |        v
  |   Select alternate Worker
  |
  +--> Assignment uncertain
           |
           v
      Check execution state
           |
           v
      Resume or reconcile
```

The important point is that the Coordinator continues to own the workflow state, while the Delegator recovers the execution decision.

## 15. Delegator vs Coordinator vs Worker

|
Component

|

Primary responsibility

|

Failure recovery focus

|
| --- | --- | --- |
|

Coordinator

|

Overall workflow state and lifecycle

|

Resume workflow, preserve domain task

|
|

Delegator

|

Task orchestration and Worker selection

|

Recover assignments, reroute compatible work

|
|

Worker

|

Execute specialized task

|

Retry local work, checkpoint progress

|
|

Messaging

|

Deliver tasks and results

|

Redelivery, acknowledgment, idempotency

|
|

Registry

|

Worker capabilities and health

|

Discover healthy compatible Workers

|

### Simple example

```
Coordinator:
"Customer needs order status."

Delegator:
"Which Worker should handle order lookup?"

Worker:
"I will call the order API."

Messaging:
"Deliver the task and result."

Coordinator:
"Task completed; continue workflow."
```

If the Delegator fails, the Coordinator should not lose the original business request.

## 16. Interview-ready explanation

> Delegator Failure Handling in CWD is the capability that ensures domain-level task orchestration continues even when the Delegator becomes unavailable or an assignment fails. The Delegator detects failures through health checks, execution status, timeouts, exceptions, and telemetry. The Coordinator preserves the domain task and workflow state, while the Delegator recovers pending assignments, checks whether previous work was completed, and selects compatible healthy Workers when rerouting is required. Checkpointing preserves progress, idempotency prevents duplicate side effects, and failure isolation prevents one domain’s orchestration failure from affecting unrelated workflows. The key is to recover the orchestration decision and execution continuity, not simply restart the Delegator.

## 17. Practical exercise

Design the recovery strategy for this workflow:

```
User
  ↓
Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
Order Worker
  ↓
CRM Tool
  ↓
LLM
  ↓
Response
```

Answer these questions:

1. How does CWD know the Delegator is healthy?

2. What happens if the Delegator crashes after selecting a Worker?

3. How does the Coordinator preserve the original domain task?

4. How does the Delegator recover pending assignments?

5. How does it know whether the Worker already executed the task?

6. When should it retry the same assignment?

7. When should it select an alternate Worker?

8. How does it preserve task state across a Delegator restart?

9. How does it prevent duplicate CRM updates?

10. How does failure isolation protect other domain workflows?

Main takeaway: Delegator reliability is about preserving domain intent, recovering task assignments, selecting the right Worker, and continuing execution without losing state or duplicating work.

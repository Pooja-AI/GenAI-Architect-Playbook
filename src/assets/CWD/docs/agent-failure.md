## Agent Failure Detection & Recovery in CWD

Advanced · ~60 minutes

The goal is to understand how CWD knows an agent has failed, determines whether the failure is recoverable, and decides whether to retry, resume, reroute, or escalate.

> Core principle: An agent should never be considered healthy merely because its process is running. CWD must verify that it is alive, responsive, executing correctly, and producing valid results.

### 1. The complete failure-handling lifecycle

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_9k_%22%20width%3D%221165.5677490234375%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%221068%22%20viewBox%3D%224%204%201165.5677490234375%201068%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_9k_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_9k_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_9k_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_9k_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_9k_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_9k_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_9k_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_9k_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_9k_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_9k_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_9k_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_9k_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_9k_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_9k_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_9k_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_9k_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_9k_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_9k_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_9k_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_9k_%20.label%20text%2C%23mermaid-_r_9k_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_9k_%20.node%20rect%2C%23mermaid-_r_9k_%20.node%20circle%2C%23mermaid-_r_9k_%20.node%20ellipse%2C%23mermaid-_r_9k_%20.node%20polygon%2C%23mermaid-_r_9k_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_9k_%20.rough-node%20.label%20text%2C%23mermaid-_r_9k_%20.node%20.label%20text%2C%23mermaid-_r_9k_%20.image-shape%20.label%2C%23mermaid-_r_9k_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_9k_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_9k_%20.rough-node%20.label%2C%23mermaid-_r_9k_%20.node%20.label%2C%23mermaid-_r_9k_%20.image-shape%20.label%2C%23mermaid-_r_9k_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_9k_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_9k_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_9k_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_9k_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_9k_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_9k_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_9k_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_9k_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_9k_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_9k_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_9k_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_9k_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_9k_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_9k_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_9k_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_9k_%20.icon-shape%2C%23mermaid-_r_9k_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_9k_%20.icon-shape%20p%2C%23mermaid-_r_9k_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_9k_%20.icon-shape%20rect%2C%23mermaid-_r_9k_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_9k_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_9k_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_9k_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_9k_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_9k_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_9k_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_9k_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_9k_%20.node%20rect%2C%23mermaid-_r_9k_%20.node%20circle%2C%23mermaid-_r_9k_%20.node%20ellipse%2C%23mermaid-_r_9k_%20.node%20polygon%2C%23mermaid-_r_9k_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_9k_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_9k_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_9k_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_9k_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_9k_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_9k_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_9k__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_9k__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_9k__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_9k__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_9k__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_9k__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(854.8332672119141%2C%20202\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-103.78111267089844%22%20y%3D%22-30%22%20width%3D%22207.56222534179688%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EAgent%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20receives%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20task%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(854.8332672119141%2C%20302\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-81.2164192199707%22%20y%3D%22-30%22%20width%3D%22162.4328384399414%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EHealth%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20check%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(854.8332672119141%2C%20402\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-66.33157920837402%22%20y%3D%22-30%22%20width%3D%22132.66315841674805%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EHealthy%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(876.9437942504883%2C%20568\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-95.81190490722656%22%20y%3D%22-30%22%20width%3D%22191.62380981445312%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EMark%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20unavailable%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(876.9437942504883%2C%20668\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-124.48829650878906%22%20y%3D%22-30%22%20width%3D%22248.97659301757812%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReroute%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20to%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20another%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20agent%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(578.8111038208008%2C%20568\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-79.18110656738281%22%20y%3D%22-30%22%20width%3D%22158.36221313476562%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EExecute%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20task%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-G-11%22%20transform%3D%22translate\(578.8111038208008%2C%20668\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-133.64440155029297%22%20y%3D%22-30%22%20width%3D%22267.28880310058594%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECollect%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20status%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20telemetry%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-H-13%22%20transform%3D%22translate\(578.8111038208008%2C%20768\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-94.99908828735352%22%20y%3D%22-30%22%20width%3D%22189.99817657470703%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFailure%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20detected%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-I-15%22%20transform%3D%22translate\(610.4774678548176%2C%20934\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-85.8993911743164%22%20y%3D%22-30%22%20width%3D%22171.7987823486328%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EValidate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20result%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-17%22%20transform%3D%22translate\(610.4774678548176%2C%201034\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-93.39374923706055%22%20y%3D%22-30%22%20width%3D%22186.7874984741211%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EMark%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20completed%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-K-19%22%20transform%3D%22translate\(398.5144627888998%2C%20934\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-86.06361389160156%22%20y%3D%22-30%22%20width%3D%22172.12722778320312%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EClassify%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failure%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-L-21%22%20transform%3D%22translate\(1014.1810353597006%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-81.94158935546875%22%20y%3D%22-30%22%20width%3D%22163.8831787109375%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERecoverable%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-M-23%22%20transform%3D%22translate\(310.3223114013672%2C%20302\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-99.95423889160156%22%20y%3D%22-30%22%20width%3D%22199.90847778320312%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20with%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20backoff%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-N-25%22%20transform%3D%22translate\(578.8111038208008%2C%20402\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-123.21487426757812%22%20y%3D%22-30%22%20width%3D%22246.42974853515625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EResume%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20from%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20checkpoint%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-O-27%22%20transform%3D%22translate\(241.5790685017904%2C%20568\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-100.95580291748047%22%20y%3D%22-30%22%20width%3D%22201.91160583496094%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFallback%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20reroute%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-P-29%22%20transform%3D%22translate\(1068.8087615966797%2C%20302\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-92.75908279418945%22%20y%3D%22-30%22%20width%3D%22185.5181655883789%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFail%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20escalate%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-Q-31%22%20transform%3D%22translate\(310.3223114013672%2C%20402\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-105.27392578125%22%20y%3D%22-30%22%20width%3D%22210.5478515625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20limit%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20reached%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-R-39%22%20transform%3D%22translate\(241.5790685017904%2C%20668\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-115.13361358642578%22%20y%3D%22-30%22%20width%3D%22230.26722717285156%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EUpdate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20workflow%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20state%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-S-41%22%20transform%3D%22translate\(241.5790685017904%2C%20768\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-107.23408508300781%22%20y%3D%22-30%22%20width%3D%22214.46817016601562%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EContinue%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20escalate%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M854.8332672119141%2C232L854.8332672119141%2C260%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6ODU0LjgzMzI2NzIxMTkxNDEsInkiOjIzMn0seyJ4Ijo4NTQuODMzMjY3MjExOTE0MSwieSI6MjY0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M854.8332672119141%2C332L854.8332672119141%2C360%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6ODU0LjgzMzI2NzIxMTkxNDEsInkiOjMzMn0seyJ4Ijo4NTQuODMzMjY3MjExOTE0MSwieSI6MzY0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M876.9437942504883%2C432L876.9437942504883%2C526%22%20id%3D%22L_C_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_D_0%22%20data-points%3D%22W3sieCI6ODc2Ljk0Mzc5NDI1MDQ4ODMsInkiOjQzMn0seyJ4Ijo4NzYuOTQzNzk0MjUwNDg4MywieSI6NTMwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M876.9437942504883%2C598L876.9437942504883%2C626%22%20id%3D%22L_D_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_E_0%22%20data-points%3D%22W3sieCI6ODc2Ljk0Mzc5NDI1MDQ4ODMsInkiOjU5OH0seyJ4Ijo4NzYuOTQzNzk0MjUwNDg4MywieSI6NjMwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M832.7227401733398%2C432L832.7227401733398%2C445.21704397470535Q832.7227401733398%2C447%20831.636953735713%2C448.4142135623731L831.636953735713%2C448.4142135623731Q830.551167298086%2C449.8284271247462%20829.136953735713%2C450.9142135623731L829.136953735713%2C450.9142135623731Q827.7227401733398%2C452%20825.9397841480452%2C452L821.2328309032243%2C452Q819.4498748779297%2C452%20818.0356613155566%2C453.0857864376269L818.0356613155566%2C453.0857864376269Q816.6214477531835%2C454.1715728752538%20815.5356613155566%2C455.5857864376269L815.5356613155566%2C455.5857864376269Q814.4498748779297%2C457%20814.4498748779297%2C458.78295602529465L814.4498748779297%2C511.21704397470535Q814.4498748779297%2C513%20813.3640884403028%2C514.4142135623731L813.3640884403028%2C514.4142135623731Q812.2783020026759%2C515.8284271247462%20810.8640884403028%2C516.9142135623731L810.8640884403028%2C516.9142135623731Q809.4498748779297%2C518%20807.666918852635%2C518L625.1846131297868%2C518Q623.4016571044922%2C518%20621.9874435421191%2C519.0857864376269L621.9874435421191%2C519.0857864376269Q620.573229979746%2C520.1715728752538%20619.4874435421191%2C521.5857864376269L619.4874435421191%2C521.5857864376269Q618.4016571044922%2C523%20618.4016571044922%2C524.7829560252947L618.4016571044922%2C528%22%20id%3D%22L_C_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_F_0%22%20data-points%3D%22W3sieCI6ODMyLjcyMjc0MDE3MzMzOTgsInkiOjQzMn0seyJ4Ijo4MzIuNzIyNzQwMTczMzM5OCwieSI6NDUyfSx7IngiOjgxNC40NDk4NzQ4Nzc5Mjk3LCJ5Ijo0NTJ9LHsieCI6ODE0LjQ0OTg3NDg3NzkyOTcsInkiOjUxOH0seyJ4Ijo2MTguNDAxNjU3MTA0NDkyMiwieSI6NTE4fSx7IngiOjYxOC40MDE2NTcxMDQ0OTIyLCJ5Ijo1MzJ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M578.8111038208008%2C598L578.8111038208008%2C626%22%20id%3D%22L_F_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_G_0%22%20data-points%3D%22W3sieCI6NTc4LjgxMTEwMzgyMDgwMDgsInkiOjU5OH0seyJ4Ijo1NzguODExMTAzODIwODAwOCwieSI6NjMwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M578.8111038208008%2C698L578.8111038208008%2C726%22%20id%3D%22L_G_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_H_0%22%20data-points%3D%22W3sieCI6NTc4LjgxMTEwMzgyMDgwMDgsInkiOjY5OH0seyJ4Ijo1NzguODExMTAzODIwODAwOCwieSI6NzMwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M610.4774678548176%2C798L610.4774678548176%2C892%22%20id%3D%22L_H_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_H_I_0%22%20data-points%3D%22W3sieCI6NjEwLjQ3NzQ2Nzg1NDgxNzYsInkiOjc5OH0seyJ4Ijo2MTAuNDc3NDY3ODU0ODE3NiwieSI6ODk2fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M610.4774678548176%2C964L610.4774678548176%2C992%22%20id%3D%22L_I_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_J_0%22%20data-points%3D%22W3sieCI6NjEwLjQ3NzQ2Nzg1NDgxNzYsInkiOjk2NH0seyJ4Ijo2MTAuNDc3NDY3ODU0ODE3NiwieSI6OTk2fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M547.1447397867839%2C798L547.1447397867839%2C811.2170439747053Q547.1447397867839%2C813%20546.058953349157%2C814.4142135623731L546.058953349157%2C814.4142135623731Q544.9731669115301%2C815.8284271247462%20543.558953349157%2C816.9142135623731L543.558953349157%2C816.9142135623731Q542.1447397867839%2C818%20540.3617837614893%2C818L434.2734018979658%2C818Q427.20233408610034%2C818%20427.20233408610034%2C825.0710678118655L427.2023340861003%2C892%22%20id%3D%22L_H_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_H_K_0%22%20data-points%3D%22W3sieCI6NTQ3LjE0NDczOTc4Njc4MzksInkiOjc5OH0seyJ4Ijo1NDcuMTQ0NzM5Nzg2NzgzOSwieSI6ODE4fSx7IngiOjQyNy4yMDIzMzQwODYxMDAzNCwieSI6ODE4fSx7IngiOjQyNy4yMDIzMzQwODYxMDAzLCJ5Ijo4OTZ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M369.8265914916992%2C904L369.8265914916992%2C890.7829560252947Q369.8265914916992%2C889%20368.7408050540723%2C887.5857864376269L368.7408050540723%2C887.5857864376269Q367.65501861644543%2C886.1715728752538%20366.2408050540723%2C885.0857864376269L366.2408050540723%2C885.0857864376269Q364.8265914916992%2C884%20363.04363546640457%2C884L18.782956025294652%2C884Q17%2C884%2015.585786437626904%2C882.9142135623731L15.585786437626904%2C882.9142135623731Q14.17157287525381%2C881.8284271247462%2013.085786437626915%2C880.4142135623731L13.085786437626904%2C880.4142135623731Q12%2C879%2012%2C877.2170439747053L12%2C851L12%2C768L12%2C668L12%2C568L12%2C485L12%2C402L12%2C302L12%2C202L12%2C98.78295602529465Q12%2C97%2013.085786437626904%2C95.58578643762691L13.085786437626904%2C95.58578643762691Q14.17157287525381%2C94.17157287525382%2015.585786437626902%2C93.08578643762691L15.585786437626904%2C93.08578643762691Q17%2C92%2018.78295602529466%2C92L952.7703530974268%2C92Q954.5533091227214%2C92%20955.9675226850945%2C90.91421356237309L955.9675226850945%2C90.91421356237308Q957.3817362474676%2C89.82842712474618%20958.4675226850945%2C88.41421356237309L958.4675226850945%2C88.41421356237309Q959.5533091227214%2C87%20959.5533091227214%2C85.21704397470535L959.5533091227214%2C82%22%20id%3D%22L_K_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_K_L_0%22%20data-points%3D%22W3sieCI6MzY5LjgyNjU5MTQ5MTY5OTIsInkiOjkwNH0seyJ4IjozNjkuODI2NTkxNDkxNjk5MiwieSI6ODg0fSx7IngiOjEyLCJ5Ijo4ODR9LHsieCI6MTIsInkiOjg1MX0seyJ4IjoxMiwieSI6NzY4fSx7IngiOjEyLCJ5Ijo2Njh9LHsieCI6MTIsInkiOjU2OH0seyJ4IjoxMiwieSI6NDg1fSx7IngiOjEyLCJ5Ijo0MDJ9LHsieCI6MTIsInkiOjMwMn0seyJ4IjoxMiwieSI6MjAyfSx7IngiOjEyLCJ5Ijo5Mn0seyJ4Ijo5NTkuNTUzMzA5MTIyNzIxNCwieSI6OTJ9LHsieCI6OTU5LjU1MzMwOTEyMjcyMTQsInkiOjc4fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1014.1810353597006%2C72L1014.1810353597006%2C125.21704397470535Q1014.1810353597006%2C127%201013.0952489220737%2C128.4142135623731L1013.0952489220737%2C128.4142135623731Q1012.0094624844468%2C129.82842712474618%201010.5952489220737%2C130.91421356237308L1010.5952489220737%2C130.9142135623731Q1009.1810353597006%2C132%201007.3980793344059%2C132L317.10526742666184%2C132Q315.3223114013672%2C132%20313.9080978389941%2C133.0857864376269L313.9080978389941%2C133.08578643762692Q312.493884276621%2C134.17157287525382%20311.4080978389941%2C135.5857864376269L311.4080978389941%2C135.5857864376269Q310.3223114013672%2C137%20310.3223114013672%2C138.78295602529465L310.3223114013672%2C260%22%20id%3D%22L_L_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_M_0%22%20data-points%3D%22W3sieCI6MTAxNC4xODEwMzUzNTk3MDA2LCJ5Ijo3Mn0seyJ4IjoxMDE0LjE4MTAzNTM1OTcwMDYsInkiOjEzMn0seyJ4IjozMTAuMzIyMzExNDAxMzY3MiwieSI6MTMyfSx7IngiOjMxMC4zMjIzMTE0MDEzNjcyLCJ5IjoyNjR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1041.4948984781902%2C72L1041.4948984781902%2C145.21704397470535Q1041.4948984781902%2C147%201040.4091120405633%2C148.4142135623731L1040.4091120405633%2C148.4142135623731Q1039.3233256029364%2C149.82842712474618%201037.9091120405633%2C150.91421356237308L1037.9091120405633%2C150.9142135623731Q1036.4948984781902%2C152%201034.7119424528955%2C152L585.5940598460954%2C152Q583.8111038208008%2C152%20582.3968902584277%2C153.0857864376269L582.3968902584277%2C153.08578643762692Q580.9826766960546%2C154.17157287525382%20579.8968902584277%2C155.5857864376269L579.8968902584277%2C155.5857864376269Q578.8111038208008%2C157%20578.8111038208008%2C158.78295602529465L578.8111038208008%2C302L578.8111038208008%2C360%22%20id%3D%22L_L_N_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_N_0%22%20data-points%3D%22W3sieCI6MTA0MS40OTQ4OTg0NzgxOTAyLCJ5Ijo3Mn0seyJ4IjoxMDQxLjQ5NDg5ODQ3ODE5MDIsInkiOjE1Mn0seyJ4Ijo1NzguODExMTAzODIwODAwOCwieSI6MTUyfSx7IngiOjU3OC44MTExMDM4MjA4MDA4LCJ5IjozMDJ9LHsieCI6NTc4LjgxMTEwMzgyMDgwMDgsInkiOjM2NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M986.8671722412109%2C72L986.8671722412109%2C105.21704397470535Q986.8671722412109%2C107%20985.781385803584%2C108.41421356237309L985.781385803584%2C108.41421356237309Q984.6955993659572%2C109.82842712474618%20983.281385803584%2C110.91421356237308L983.281385803584%2C110.91421356237309Q981.8671722412109%2C112%20980.0842162159163%2C112L108.78295602529465%2C112Q107%2C112%20105.58578643762691%2C113.08578643762691L105.58578643762691%2C113.08578643762691Q104.17157287525382%2C114.17157287525382%20103.08578643762691%2C115.58578643762691L103.08578643762691%2C115.58578643762691Q102%2C117%20102%2C118.78295602529465L102%2C202L102%2C402L102%2C485L102%2C511.21704397470535Q102%2C513%20103.08578643762691%2C514.4142135623731L103.08578643762692%2C514.4142135623731Q104.17157287525382%2C515.8284271247462%20105.58578643762691%2C516.9142135623731L105.58578643762691%2C516.9142135623731Q107%2C518%20108.78295602529465%2C518L201.14417817066897%2C518Q202.92713419596362%2C518%20204.34134775833672%2C519.0857864376269L204.34134775833672%2C519.0857864376269Q205.7555613207098%2C520.1715728752538%20206.8413477583367%2C521.5857864376269L206.84134775833672%2C521.5857864376269Q207.92713419596362%2C523%20207.92713419596362%2C524.7829560252947L207.92713419596362%2C528%22%20id%3D%22L_L_O_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_O_0%22%20data-points%3D%22W3sieCI6OTg2Ljg2NzE3MjI0MTIxMDksInkiOjcyfSx7IngiOjk4Ni44NjcxNzIyNDEyMTA5LCJ5IjoxMTJ9LHsieCI6MTAyLCJ5IjoxMTJ9LHsieCI6MTAyLCJ5IjoyMDJ9LHsieCI6MTAyLCJ5Ijo0MDJ9LHsieCI6MTAyLCJ5Ijo0ODV9LHsieCI6MTAyLCJ5Ijo1MTh9LHsieCI6MjA3LjkyNzEzNDE5NTk2MzYyLCJ5Ijo1MTh9LHsieCI6MjA3LjkyNzEzNDE5NTk2MzYyLCJ5Ijo1MzJ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1068.8087615966797%2C72L1068.8087615966797%2C260%22%20id%3D%22L_L_P_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_P_0%22%20data-points%3D%22W3sieCI6MTA2OC44MDg3NjE1OTY2Nzk3LCJ5Ijo3Mn0seyJ4IjoxMDY4LjgwODc2MTU5NjY3OTcsInkiOjI2NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M310.3223114013672%2C332L310.3223114013672%2C360%22%20id%3D%22L_M_Q_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_M_Q_0%22%20data-points%3D%22W3sieCI6MzEwLjMyMjMxMTQwMTM2NzIsInkiOjMzMn0seyJ4IjozMTAuMzIyMzExNDAxMzY3MiwieSI6MzY0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M345.4136199951172%2C432L345.4136199951172%2C511.21704397470535Q345.4136199951172%2C513%20346.4994064327441%2C514.4142135623731L346.4994064327441%2C514.4142135623731Q347.585192870371%2C515.8284271247462%20348.9994064327441%2C516.9142135623731L348.9994064327441%2C516.9142135623731Q350.4136199951172%2C518%20352.19657602041184%2C518L532.4375945118147%2C518Q534.2205505371094%2C518%20535.6347640994825%2C519.0857864376269L535.6347640994825%2C519.0857864376269Q537.0489776618556%2C520.1715728752538%20538.1347640994825%2C521.5857864376269L538.1347640994825%2C521.5857864376269Q539.2205505371094%2C523%20539.2205505371094%2C524.7829560252947L539.2205505371094%2C528%22%20id%3D%22L_Q_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_Q_F_0%22%20data-points%3D%22W3sieCI6MzQ1LjQxMzYxOTk5NTExNzIsInkiOjQzMn0seyJ4IjozNDUuNDEzNjE5OTk1MTE3MiwieSI6NTE4fSx7IngiOjUzOS4yMjA1NTA1MzcxMDk0LCJ5Ijo1MTh9LHsieCI6NTM5LjIyMDU1MDUzNzEwOTQsInkiOjUzMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M275.2310028076172%2C432L275.2310028076173%2C526%22%20id%3D%22L_Q_O_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_Q_O_0%22%20data-points%3D%22W3sieCI6Mjc1LjIzMTAwMjgwNzYxNzIsInkiOjQzMn0seyJ4IjoyNzUuMjMxMDAyODA3NjE3MywieSI6NTMwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M578.8111038208008%2C432L578.8111038208008%2C485L578.8111038208008%2C526%22%20id%3D%22L_N_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_N_F_0%22%20data-points%3D%22W3sieCI6NTc4LjgxMTEwMzgyMDgwMDgsInkiOjQzMn0seyJ4Ijo1NzguODExMTAzODIwODAwOCwieSI6NDg1fSx7IngiOjU3OC44MTExMDM4MjA4MDA4LCJ5Ijo1MzB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M241.5790685017904%2C598L241.5790685017904%2C626%22%20id%3D%22L_O_R_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_R_0%22%20data-points%3D%22W3sieCI6MjQxLjU3OTA2ODUwMTc5MDQsInkiOjU5OH0seyJ4IjoyNDEuNTc5MDY4NTAxNzkwNCwieSI6NjMwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M241.5790685017904%2C698L241.5790685017904%2C726%22%20id%3D%22L_R_S_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_R_S_0%22%20data-points%3D%22W3sieCI6MjQxLjU3OTA2ODUwMTc5MDQsInkiOjY5OH0seyJ4IjoyNDEuNTc5MDY4NTAxNzkwNCwieSI6NzMwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_9k__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(876.8898811340332%2C%20485\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_D_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_E_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(814.196834564209%2C%20485\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_F_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_G_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_H_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(610.4235547383626%2C%20851\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_H_I_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_J_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(426.94929377237963%2C%20851\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_H_K_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_K_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(310.29638290405273%2C%20202\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_M_0%22%20transform%3D%22translate\(-26.474071502685547%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2276.94814682006836%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETransient%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(578.5236053466797%2C%20202\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_N_0%22%20transform%3D%22translate\(-33.212501525878906%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2290.42500305175781%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EInterrupted%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(101.68403625488281%2C%20302\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_O_0%22%20transform%3D%22translate\(-56.68403625488281%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%22137.36808013916016%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDependency%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failure%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(1068.5164756774902%2C%20202\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_P_0%22%20transform%3D%22translate\(-31.707714080810547%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2287.41543197631836%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPermanent%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_M_Q_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(345.3597068786621%2C%20485\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_Q_F_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(274.9779624938966%2C%20485\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_Q_O_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_N_F_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_R_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_R_S_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

This is the difference between detecting an error and managing a reliable agent execution.

## 2. How CWD detects agent failures

CWD should use multiple detection mechanisms together. No single signal is sufficient.

Health checks

Determine whether the agent is alive and ready to accept work.

Execution status

Track whether a task is running, completed, failed, or stuck.

Timeouts

Detect agents that do not respond within an expected deadline.

Exceptions

Capture explicit failures from code, tools, and dependencies.

Telemetry

Identify abnormal latency, error rates, resource usage, and execution behavior.

### 3. Health checks: Is the agent available?

A health check answers:

> “Can this agent accept and process work right now?”

There are usually three levels:

|
Check

|

What it verifies

|

Example

|
| --- | --- | --- |
|

Liveness

|

Is the process alive?

|

Agent responds to `/health/live`.

|
|

Readiness

|

Can it accept work?

|

Required dependencies are available.

|
|

Functional health

|

Can it perform its actual task?

|

Agent completes a lightweight test operation.

|

Example:

```
Agent process running
        |
        v
Liveness check ✓
        |
        v
Readiness check
        |
        +--> LLM unavailable ✗
        |
        v
Agent marked NOT READY
        |
        v
Delegator stops assigning new tasks
```

Important: A running process can still be unhealthy. For example, an agent may be alive but unable to call its LLM or database.

### 4. Execution status: What happened to the task?

Health checks tell us whether the agent is available. Execution status tells us what happened to a specific task.

A typical lifecycle is:

```
PENDING
   |
   v
RUNNING
   |
   +--> COMPLETED
   |
   +--> FAILED
   |
   +--> TIMED_OUT
   |
   +--> CANCELLED
   |
   +--> RECOVERING
   |
   +--> ESCALATED
```

Each execution should have a unique identifier.

Python

Run

```
class ExecutionStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    TIMED_OUT = "timed_out"
    RECOVERING = "recovering"
    ESCALATED = "escalated"
```

The Coordinator uses this state to decide whether to continue, retry, or recover.


### 5. Timeouts: Detect agents that are stuck

A timeout occurs when an agent does not complete an operation within an expected time.

CWD should use different timeout levels, because a slow LLM call is different from a completely unresponsive worker.

|
Timeout

|

Detects

|

Example

|
| --- | --- | --- |
|

Tool timeout

|

External API is too slow

|

CRM call exceeds 10 seconds

|
|

LLM timeout

|

Model inference is too slow

|

Generation exceeds 30 seconds

|
|

Task timeout

|

Worker exceeds its execution budget

|

Report generation exceeds 2 minutes

|
|

Workflow timeout

|

Entire workflow exceeds its deadline

|

Customer request exceeds 5 minutes

|
|

Heartbeat timeout

|

Agent stops reporting progress

|

No heartbeat for 30 seconds

|

### Example: Heartbeat-based detection

```
Worker starts task
        |
        v
Heartbeat every 10 seconds
        |
        v
Coordinator receives heartbeat ✓
        |
        v
Worker stops responding
        |
        v
Heartbeat timeout
        |
        v
Mark execution as SUSPECTED_FAILURE
        |
        v
Check whether worker is still processing
        |
        v
Recover or reroute
```

Important: A missing heartbeat does not always mean the task failed. The worker may still be processing. CWD should avoid immediately starting a duplicate execution without checking the execution state.

## 6. Exceptions: Detect explicit failures

Exceptions are failures reported by the application or its dependencies.

### Example

Python

Run

```
async def execute_agent(task):
    try:
        result = await call_llm(task)
        return validate_result(result)

    except TimeoutError:
        raise AgentFailure(
            code="LLM_TIMEOUT",
            retryable=True
        )

    except ValueError:
        raise AgentFailure(
            code="INVALID_INPUT",
            retryable=False
        )

    except Exception as exc:
        raise AgentFailure(
            code="UNEXPECTED_ERROR",
            retryable=False
        ) from exc
```

The important part is classifying the exception.

```
LLM timeout       → Retry
Invalid input     → Fail fast
Authentication    → Escalate / configuration fix
Unexpected crash  → Recover / investigate
```

A raw exception such as `ConnectionError` is not enough. CWD should convert it into a structured failure that the Coordinator can understand.

## 7. Telemetry: Detect abnormal behavior

Telemetry helps CWD detect failures that may not produce an exception.

For example:

* An agent returns successful responses, but latency keeps increasing.

* A worker is alive, but its queue is growing.

* An LLM returns valid output, but token usage suddenly spikes.

* A tool succeeds, but its error rate is unusually high.

* A worker repeatedly retries the same task.

### Important telemetry signals

|
Signal

|

What it tells you

|
| --- | --- |
|

Error rate

|

How often executions fail

|
|

Latency

|

How long tasks take

|
|

Throughput

|

How many tasks are completed

|
|

Queue depth

|

Whether work is accumulating

|
|

Retry count

|

Whether recovery is succeeding

|
|

Heartbeat age

|

Whether the worker is responsive

|
|

Token usage

|

Whether LLM execution is becoming expensive

|
|

Resource usage

|

Whether CPU, memory, or connections are exhausted

|

### Example

```
Agent A
  Success rate: 99%
  Average latency: 2 seconds

Agent B
  Success rate: 99%
  Average latency: 45 seconds
  Retry count: Increasing
  Queue depth: Increasing
```

Agent B may not be “failed” in the traditional sense, but it is degraded. CWD should detect this before it becomes a complete outage.

## 8. Failure classification: The decision point

Once CWD detects a failure, the Coordinator should classify it.

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_b5_%22%20width%3D%221517.034423828125%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%22442%22%20viewBox%3D%224%204%201517.034423828125%20442%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_b5_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_b5_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_b5_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_b5_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_b5_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_b5_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_b5_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_b5_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_b5_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_b5_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_b5_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_b5_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_b5_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_b5_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_b5_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_b5_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_b5_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_b5_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_b5_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_b5_%20.label%20text%2C%23mermaid-_r_b5_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_b5_%20.node%20rect%2C%23mermaid-_r_b5_%20.node%20circle%2C%23mermaid-_r_b5_%20.node%20ellipse%2C%23mermaid-_r_b5_%20.node%20polygon%2C%23mermaid-_r_b5_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_b5_%20.rough-node%20.label%20text%2C%23mermaid-_r_b5_%20.node%20.label%20text%2C%23mermaid-_r_b5_%20.image-shape%20.label%2C%23mermaid-_r_b5_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_b5_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_b5_%20.rough-node%20.label%2C%23mermaid-_r_b5_%20.node%20.label%2C%23mermaid-_r_b5_%20.image-shape%20.label%2C%23mermaid-_r_b5_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_b5_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_b5_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_b5_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_b5_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_b5_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_b5_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_b5_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_b5_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_b5_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_b5_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_b5_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_b5_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_b5_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_b5_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_b5_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_b5_%20.icon-shape%2C%23mermaid-_r_b5_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_b5_%20.icon-shape%20p%2C%23mermaid-_r_b5_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_b5_%20.icon-shape%20rect%2C%23mermaid-_r_b5_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_b5_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_b5_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_b5_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_b5_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_b5_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_b5_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_b5_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_b5_%20.node%20rect%2C%23mermaid-_r_b5_%20.node%20circle%2C%23mermaid-_r_b5_%20.node%20ellipse%2C%23mermaid-_r_b5_%20.node%20polygon%2C%23mermaid-_r_b5_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_b5_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_b5_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_b5_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_b5_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_b5_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_b5_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_b5__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_b5__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_b5__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_b5__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_b5__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_b5__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(126.82134819030762%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-91.40000534057617%22%20y%3D%22-30%22%20width%3D%22182.80001068115234%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFailure%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20detected%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(126.82134819030762%2C%20142\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-79.82657623291016%22%20y%3D%22-30%22%20width%3D%22159.6531524658203%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFailure%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20type%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(66.951416015625%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-54.951416015625%22%20y%3D%22-30%22%20width%3D%22109.90283203125%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(273.96768951416016%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-112.06485748291016%22%20y%3D%22-30%22%20width%3D%22224.1297149658203%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECheck%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20execution%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20state%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(489.67177963256836%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-63.63923454284668%22%20y%3D%22-30%22%20width%3D%22127.27846908569336%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReroute%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(713.9980621337891%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-120.68704986572266%22%20y%3D%22-30%22%20width%3D%22241.3740997314453%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFallback%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20circuit%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20breaker%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-G-11%22%20transform%3D%22translate\(974.2927856445312%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-99.60766983032227%22%20y%3D%22-30%22%20width%3D%22199.21533966064453%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERepair%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20retry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20fail%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-H-13%22%20transform%3D%22translate\(1177.817195892334%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-63.9167366027832%22%20y%3D%22-30%22%20width%3D%22127.8334732055664%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EEscalate%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-I-15%22%20transform%3D%22translate\(1397.3841171264648%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-115.65018463134766%22%20y%3D%22-30%22%20width%3D%22231.3003692626953%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERecord%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20investigate%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M126.82134819030762%2C72L126.82134819030762%2C100%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6MTI2LjgyMTM0ODE5MDMwNzYyLCJ5Ijo3Mn0seyJ4IjoxMjYuODIxMzQ4MTkwMzA3NjIsInkiOjEwNH1d%22%20marker-end%3D%22url\(%23mermaid-_r_b5__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M66.95141601562501%2C172L66.951416015625%2C366%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6NjYuOTUxNDE2MDE1NjI1MDEsInkiOjE3Mn0seyJ4Ijo2Ni45NTE0MTYwMTU2MjUsInkiOjM3MH1d%22%20marker-end%3D%22url\(%23mermaid-_r_b5__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M86.90806007385254%2C172L86.90806007385254%2C285.21704397470535Q86.90806007385254%2C287%2087.99384651147945%2C288.4142135623731L87.99384651147946%2C288.4142135623731Q89.07963294910635%2C289.8284271247462%2090.49384651147945%2C290.9142135623731L90.49384651147945%2C290.9142135623731Q91.90806007385254%2C292%2093.69101609914719%2C292L267.1847334888655%2C292Q268.96768951416016%2C292%20270.38190307653326%2C293.0857864376269L270.38190307653326%2C293.0857864376269Q271.79611663890637%2C294.1715728752538%20272.88190307653326%2C295.5857864376269L272.88190307653326%2C295.5857864376269Q273.96768951416016%2C297%20273.96768951416016%2C298.78295602529465L273.96768951416016%2C366%22%20id%3D%22L_B_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_D_0%22%20data-points%3D%22W3sieCI6ODYuOTA4MDYwMDczODUyNTQsInkiOjE3Mn0seyJ4Ijo4Ni45MDgwNjAwNzM4NTI1NCwieSI6MjkyfSx7IngiOjI3My45Njc2ODk1MTQxNjAxNiwieSI6MjkyfSx7IngiOjI3My45Njc2ODk1MTQxNjAxNiwieSI6MzcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_b5__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M106.86470413208008%2C172L106.86470413208008%2C265.21704397470535Q106.86470413208008%2C267%20107.95049056970699%2C268.4142135623731L107.950490569707%2C268.4142135623731Q109.0362770073339%2C269.8284271247462%20110.45049056970699%2C270.9142135623731L110.45049056970699%2C270.9142135623731Q111.86470413208008%2C272%20113.64766015737473%2C272L482.8888236072737%2C272Q484.67177963256836%2C272%20486.08599319494147%2C273.0857864376269L486.08599319494147%2C273.0857864376269Q487.5002067573146%2C274.1715728752538%20488.58599319494147%2C275.5857864376269L488.58599319494147%2C275.5857864376269Q489.67177963256836%2C277%20489.67177963256836%2C278.78295602529465L489.67177963256836%2C366%22%20id%3D%22L_B_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_E_0%22%20data-points%3D%22W3sieCI6MTA2Ljg2NDcwNDEzMjA4MDA4LCJ5IjoxNzJ9LHsieCI6MTA2Ljg2NDcwNDEzMjA4MDA4LCJ5IjoyNzJ9LHsieCI6NDg5LjY3MTc3OTYzMjU2ODM2LCJ5IjoyNzJ9LHsieCI6NDg5LjY3MTc3OTYzMjU2ODM2LCJ5IjozNzB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_b5__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M126.82134819030762%2C172L126.82134819030762%2C245.21704397470535Q126.82134819030762%2C247%20127.90713462793452%2C248.4142135623731L127.90713462793452%2C248.4142135623731Q128.99292106556143%2C249.82842712474618%20130.4071346279345%2C250.9142135623731L130.4071346279345%2C250.9142135623731Q131.82134819030762%2C252%20133.60430421560227%2C252L707.2151061084944%2C252Q708.9980621337891%2C252%20710.4122756961622%2C253.0857864376269L710.4122756961622%2C253.08578643762692Q711.8264892585353%2C254.17157287525382%20712.9122756961622%2C255.5857864376269L712.9122756961622%2C255.5857864376269Q713.9980621337891%2C257%20713.9980621337891%2C258.78295602529465L713.9980621337891%2C366%22%20id%3D%22L_B_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_F_0%22%20data-points%3D%22W3sieCI6MTI2LjgyMTM0ODE5MDMwNzYyLCJ5IjoxNzJ9LHsieCI6MTI2LjgyMTM0ODE5MDMwNzYyLCJ5IjoyNTJ9LHsieCI6NzEzLjk5ODA2MjEzMzc4OTEsInkiOjI1Mn0seyJ4Ijo3MTMuOTk4MDYyMTMzNzg5MSwieSI6MzcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_b5__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M146.77799224853516%2C172L146.77799224853516%2C225.21704397470535Q146.77799224853516%2C227%20147.86377868616205%2C228.4142135623731L147.86377868616205%2C228.4142135623731Q148.94956512378897%2C229.82842712474618%20150.36377868616205%2C230.9142135623731L150.36377868616205%2C230.9142135623731Q151.77799224853516%2C232%20153.5609482738298%2C232L967.5098296192366%2C232Q969.2927856445312%2C232%20970.7069992069044%2C233.0857864376269L970.7069992069044%2C233.08578643762692Q972.1212127692775%2C234.17157287525382%20973.2069992069044%2C235.5857864376269L973.2069992069044%2C235.5857864376269Q974.2927856445312%2C237%20974.2927856445312%2C238.78295602529465L974.2927856445312%2C366%22%20id%3D%22L_B_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_G_0%22%20data-points%3D%22W3sieCI6MTQ2Ljc3Nzk5MjI0ODUzNTE2LCJ5IjoxNzJ9LHsieCI6MTQ2Ljc3Nzk5MjI0ODUzNTE2LCJ5IjoyMzJ9LHsieCI6OTc0LjI5Mjc4NTY0NDUzMTIsInkiOjIzMn0seyJ4Ijo5NzQuMjkyNzg1NjQ0NTMxMiwieSI6MzcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_b5__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M166.7346363067627%2C172L166.7346363067627%2C205.21704397470535Q166.7346363067627%2C207%20167.8204227443896%2C208.4142135623731L167.8204227443896%2C208.4142135623731Q168.9062091820165%2C209.82842712474618%20170.3204227443896%2C210.9142135623731L170.3204227443896%2C210.9142135623731Q171.7346363067627%2C212%20173.51759233205735%2C212L1171.0342398670393%2C212Q1172.817195892334%2C212%201174.231409454707%2C213.0857864376269L1174.231409454707%2C213.08578643762692Q1175.6456230170802%2C214.17157287525382%201176.731409454707%2C215.5857864376269L1176.731409454707%2C215.5857864376269Q1177.817195892334%2C217%201177.817195892334%2C218.78295602529465L1177.817195892334%2C366%22%20id%3D%22L_B_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_H_0%22%20data-points%3D%22W3sieCI6MTY2LjczNDYzNjMwNjc2MjcsInkiOjE3Mn0seyJ4IjoxNjYuNzM0NjM2MzA2NzYyNywieSI6MjEyfSx7IngiOjExNzcuODE3MTk1ODkyMzM0LCJ5IjoyMTJ9LHsieCI6MTE3Ny44MTcxOTU4OTIzMzQsInkiOjM3MH1d%22%20marker-end%3D%22url\(%23mermaid-_r_b5__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M186.69128036499023%2C172L186.69128036499023%2C185.21704397470535Q186.69128036499023%2C187%20187.77706680261713%2C188.4142135623731L187.77706680261713%2C188.4142135623731Q188.86285324024405%2C189.82842712474618%20190.27706680261713%2C190.9142135623731L190.27706680261713%2C190.9142135623731Q191.69128036499023%2C192%20193.4742363902849%2C192L1390.6011611011702%2C192Q1392.3841171264648%2C192%201393.798330688838%2C193.0857864376269L1393.798330688838%2C193.08578643762692Q1395.212544251211%2C194.17157287525382%201396.298330688838%2C195.5857864376269L1396.298330688838%2C195.5857864376269Q1397.3841171264648%2C197%201397.3841171264648%2C198.78295602529465L1397.3841171264648%2C366%22%20id%3D%22L_B_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_I_0%22%20data-points%3D%22W3sieCI6MTg2LjY5MTI4MDM2NDk5MDIzLCJ5IjoxNzJ9LHsieCI6MTg2LjY5MTI4MDM2NDk5MDIzLCJ5IjoxOTJ9LHsieCI6MTM5Ny4zODQxMTcxMjY0NjQ4LCJ5IjoxOTJ9LHsieCI6MTM5Ny4zODQxMTcxMjY0NjQ4LCJ5IjozNzB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_b5__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(66.92548751831055%2C%20325\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(-26.474071502685547%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2276.94814682006836%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETransient%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(273.79690170288086%2C%20325\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_D_0%22%20transform%3D%22translate\(-24.329212188720703%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2272.6584243774414%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETimeout%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(489.3015480041504%2C%20325\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_E_0%22%20transform%3D%22translate\(-55.82976818084717%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%22137.25953674316406%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorker%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20unavailable%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(713.8153305053711%2C%20325\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_F_0%22%20transform%3D%22translate\(-71.31726837158203%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%22166.63453674316406%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDependency%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20unavailable%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(974.2780990600586%2C%20325\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_G_0%22%20transform%3D%22translate\(-40.985313415527344%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%22105.97062683105469%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EInvalid%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20output%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(1177.5249099731445%2C%20325\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_H_0%22%20transform%3D%22translate\(-31.707714080810547%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2287.41543197631836%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPermanent%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(1397.265365600586%2C%20325\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_I_0%22%20transform%3D%22translate\(-27.881248474121094%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2279.76250076293945%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EUnknown%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

### Example classification

|
Failure

|

Classification

|

Recovery

|
| --- | --- | --- |
|

LLM `503`

|

Transient

|

Retry with backoff

|
|

Worker process crashed

|

Execution failure

|

Restart / resume

|
|

CRM timeout

|

Dependency failure

|

Retry or fallback

|
|

Invalid tool arguments

|

Validation failure

|

Repair or fail

|
|

Invalid API key

|

Permanent

|

Escalate

|
|

Duplicate message

|

Delivery issue

|

Idempotency check

|
|

Agent queue overloaded

|

Resource issue

|

Backpressure / reroute

|

## 9. How failed agents are recovered

Recovery depends on what failed and whether the task already produced side effects.

### Recovery strategy 1: Retry the same agent

Use when the failure is likely temporary.

```
Worker A
   |
   X
LLM timeout
   |
   v
Retry attempt 1
   |
   X
LLM timeout
   |
   v
Retry attempt 2
   |
   ✓
Task completed
```

Best for: temporary network errors, rate limits, transient provider failures.

Avoid: infinite retries.

### Recovery strategy 2: Resume from checkpoint

Use when the agent or process crashes during a long-running workflow.

```
Workflow
   |
   v
Step 1: Retrieve data ✓
   |
   v
Step 2: Analyze data ✓
   |
   v
Step 3: Generate report ✗
   |
   v
Worker crashes
   |
   v
Coordinator restarts execution
   |
   v
Resume from Step 3
```

This avoids repeating completed work unnecessarily.

Example: If a Worker has already retrieved and analyzed customer data, CWD should not repeat those steps just because report generation failed.

### Recovery strategy 3: Reroute to another agent

Use when the original agent is unavailable, overloaded, or repeatedly failing.

```
Coordinator
    |
    v
Delegator
    |
    v
Worker A
    |
    X
Unavailable
    |
    v
Health check fails
    |
    v
Delegator selects Worker B
    |
    v
Worker B completes task
```

Example: If the primary Customer Support Agent is unavailable, the Delegator may route the task to a healthy backup agent with the same capabilities.

Important: The backup agent must be compatible with the task. Rerouting should not send a financial-analysis task to an unrelated agent.

### Recovery strategy 4: Restart the failed agent

Use when the process itself has crashed or become unhealthy.

```
Worker A
   |
   X
Process crash
   |
   v
Health check fails
   |
   v
Orchestrator restarts Worker A
   |
   v
Worker becomes ready
   |
   v
Coordinator resumes task
```

The restart mechanism may be provided by the deployment platform, such as Kubernetes, but the workflow recovery decision belongs to CWD.

### Recovery strategy 5: Fallback dependency

Sometimes the agent is healthy, but one of its dependencies is not.

```
Worker
   |
   v
Primary LLM
   |
   X
Unavailable
   |
   v
Fallback LLM
   |
   ✓
Continue
```

Or:

```
Worker
   |
   v
Primary Data Source
   |
   X
Unavailable
   |
   v
Cached / Secondary Source
   |
   ✓
Continue with appropriate limitations
```

A fallback should be used only when it can safely produce the required result.

## 10. The difference between agent health and task recovery

This is a very important advanced concept.

Agent health

“Can this agent accept work?”

Determined by health checks, readiness, heartbeats, and telemetry.

Task recovery

“What should happen to this execution?”

Determined by execution state, checkpoints, retries, and side effects.

### Example

```
Agent A is unhealthy
        |
        v
Task 123 was already completed
        |
        v
Do NOT rerun Task 123
        |
        v
Only route NEW tasks elsewhere
```

Conversely:

```
Agent A is healthy
        |
        v
Task 123 failed due to invalid input
        |
        v
Do NOT reroute blindly
        |
        v
Fix input or escalate
```

Health determines availability. Execution state determines recovery.

## 11. End-to-end example: Customer Support Agent

### Scenario: The Order API fails

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
Delegator
  |
  v
Order Worker
  |
  v
Order API
  |
  X
Timeout
  |
  v
Worker catches exception
  |
  v
Reports structured failure
  |
  v
Coordinator classifies:
TRANSIENT
  |
  v
Retry with backoff
  |
  X
Timeout again
  |
  v
Circuit breaker opens
  |
  v
Delegator checks alternatives
  |
  +--> Cached order status available
  |        |
  |        v
  |   Return cached result
  |
  +--> No reliable fallback
           |
           v
      Escalate to human
```

### What telemetry should show

```
Execution ID: exec-123
Agent: Order Worker
Status: recovering
Failure: ORDER_API_TIMEOUT
Retry count: 2
Fallback: attempted
Final result: escalated
```

This gives operations a complete explanation of what happened.

## 12. Implementation pattern in CWD

A practical architecture separates detection, classification, and recovery.

Python

Run

```
class AgentRecoveryManager:

    async def handle_failure(self, execution, error):

        failure = classify_failure(error)

        if failure.retryable:
            return await self.retry(execution)

        if failure.timeout:
            return await self.check_execution_state(execution)

        if failure.worker_unavailable:
            return await self.reroute(execution)

        if failure.dependency_unavailable:
            return await self.fallback(execution)

        return await self.escalate(execution, failure)
```

The exact implementation may vary, but the responsibility should remain clear:

```
Detection
   ↓
Classification
   ↓
Recovery decision
   ↓
State update
   ↓
Retry / Resume / Reroute / Escalate
```

## 13. What should happen when all recovery attempts fail?

CWD should not continue retrying forever.

```
Task fails
   |
   v
Retry 1
   |
   v
Retry 2
   |
   v
Retry 3
   |
   X
Still failing
   |
   v
Mark execution FAILED
   |
   v
Persist failure details
   |
   v
Alert operations
   |
   v
Escalate or compensate
```

The final state should be explicit:

* `FAILED`

* `TIMED_OUT`

* `ESCALATED`

* `NEEDS_RECONCILIATION`

Not simply “the agent stopped responding.”

## 14. Interview-ready explanation

> Agent Failure Detection & Recovery in CWD is the capability that ensures agent executions remain reliable even when workers, LLMs, tools, or dependencies fail. CWD detects failures through health checks, execution status, timeouts, exceptions, and telemetry. The Coordinator classifies the failure and decides whether to retry, resume from a checkpoint, reroute to a healthy agent, use a fallback dependency, or escalate. The Delegator isolates unavailable workers and selects suitable alternatives, while Workers report structured failures and preserve execution state. Health checks determine whether an agent is available; execution state determines how a task should be recovered. This allows CWD to recover from failures without duplicating side effects or losing workflow progress.

## 15. Practical exercise

Design the failure-handling strategy for this workflow:

```
User
  ↓
Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
Customer Support Agent
  ↓
CRM Tool
  ↓
LLM
  ↓
Response
```

Answer these questions:

1. How does CWD know the Customer Support Agent is alive?

2. How does it know the agent is ready to accept work?

3. What happens if the agent stops sending heartbeats?

4. What happens if the CRM API times out?

5. What happens if the LLM returns invalid JSON?

6. What happens if the agent process crashes?

7. How does the Coordinator resume the task?

8. When should the Delegator reroute the task?

9. How does CWD prevent duplicate CRM updates?

10. What happens when all retries fail?

Main takeaway: Agent reliability is not just about detecting that an agent failed. It is about knowing what failed, preserving execution state, selecting the correct recovery strategy, and ensuring the workflow reaches a controlled final state.

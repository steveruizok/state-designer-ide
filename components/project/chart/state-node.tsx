import * as React from "react"

import { S, useStateDesigner } from "@state-designer/react"

import NodeEvents from "./node-events"
import NodeHeading from "./node-heading"
import highlightsState from "states/highlights"
import sortBy from "lodash/sortBy"
import { styled } from "components/theme"

interface StateNodeProps {
  node: S.State<any, any>
}

export default function StateNode({ node }: StateNodeProps) {
  const rContainer = React.useRef<HTMLDivElement>(null)
  const local = useStateDesigner(highlightsState)
  const highlight = local.data.path === node.path
  const isRoot = node.parentType === null
  const childNodes = sortBy(
    Object.values(node.states || {}),
    (n: S.State<any, any>) => !n.isInitial,
  )
  const highlitChildIndex = childNodes.findIndex(
    (c) => local.data.path === c.path,
  )

  // Events
  const events = Object.entries(node.on)

  if (node.onEvent) {
    events.unshift(["onEvent", node.onEvent])
  }

  if (node.onExit) {
    events.unshift(["onExit", node.onExit])
  }

  if (node.onEnter) {
    events.unshift(["onEnter", node.onEnter])
  }

  // Send ref to highlights state and canvas on mount
  React.useEffect(() => {
    local.send("MOUNTED_NODE", { path: node.path, ref: rContainer })
    return () => local.send("UNMOUNTED_NODE", { path: node.path })
  }, [node])

  return (
    <NodeContainer
      ref={rContainer}
      data-type="node-container"
      onMouseOver={(e) => {
        e.stopPropagation()
        if (isRoot) return
        local.send("HIGHLIT_STATE", {
          stateName: node.name,
          shiftKey: e.shiftKey,
          path: node.path,
        })
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        local.send("CLEARED_STATE_HIGHLIGHT", { stateName: node.name })
      }}
      data-node={node.type}
      data-active={node.active.toString()}
      childOf={node.parentType || "root"}
      nodeLevel={isRoot ? "root" : "child"}
      data-highlight={highlight}
    >
      {isRoot ? <RootNodeHeading /> : <NodeHeading node={node} />}
      {events.length > 0 && <NodeEvents node={node} events={events} />}
      {(isRoot && events.length === 0) ||
        (childNodes.length > 0 && (
          <Divider
            state={isRoot ? "inactive" : node.active ? "active" : "inactive"}
          />
        ))}
      <ChildNodesContainer type={node.type}>
        {node.type === "parallel"
          ? childNodes.map((child, i) => {
              const hideDivider =
                highlitChildIndex > -1 &&
                (i === highlitChildIndex || i === highlitChildIndex - 1)

              return (
                <React.Fragment key={i}>
                  <StateNode node={child} />
                  {i < childNodes.length - 1 && (
                    <ParallelDivider
                      visibility={hideDivider ? "hidden" : "visible"}
                      state={node.active ? "active" : "inactive"}
                    />
                  )}
                </React.Fragment>
              )
            })
          : childNodes.map((child, i) => (
              <StateNode key={child.path} node={child} />
            ))}
      </ChildNodesContainer>
    </NodeContainer>
  )
}

const RootNodeHeading = styled.div({
  pt: "$1",
})

export const NodeContainer = styled.div({
  color: "$text",
  fontFamily: "$monospace",
  fontSize: "$1",
  borderRadius: 12,
  bg: "$node",
  "&:hover > div > *[data-hidey='true']": {
    visibility: "visible",
  },
  "&[data-highlight=true]": {
    borderColor: "$accent",
  },
  "&[data-active=true]": {
    borderColor: "$active",
    "&[data-highlight=true]": {
      borderColor: "$accent",
    },
  },
  variants: {
    childOf: {
      leaf: {},
      branch: {
        bg: "$node",
        m: "$1",
        border: "2px solid $active",
        borderRadius: 12,
        overflow: "hidden",
        height: "fit-content",
        borderColor: "$inactive",
        minWidth: 96,
      },
      parallel: {
        border: "2px solid transparent",
        width: "fit-content",
        bg: "transparent",
        "&:nth-of-type(1)": {
          borderRadius: "12px 0px 0px 12px",
          // borderRightStyle: "dashed",
        },
        "&:nth-child(n+2):nth-last-child(n+2) ": {
          borderRadius: 0,
          // borderLeftStyle: "dashed",
          // borderRightStyle: "dashed",
        },
        "&:nth-last-of-type(1)": {
          // borderLeftStyle: "dashed",
          borderRadius: "0px 12px 12px 0px",
        },
        "&[data-active=true]": {
          borderColor: "transparent",
          "&[data-highlight=true]": {
            borderColor: "$accent",
          },
        },
      },
      root: {
        borderColor: "$inactive",
        "&[data-highlight=true]": {
          borderColor: "$accent",
        },
      },
    },
    nodeLevel: {
      child: {},
      root: {
        p: "$1",
        bg: "$root",
        // border: "1px solid $active",
        borderRadius: 12,
        boxShadow: "0px 0px 12px -2px $shadow",
      },
    },
  },
})

export const ChildNodesContainer = styled.div({
  p: "$0",
  variants: {
    type: {
      leaf: {},
      branch: {
        display: "flex",
        flexWrap: "wrap",
      },
      parallel: {
        display: "grid",
        width: "fit-content",
        gridAutoColumns: "fit-content",
        gap: 0,
        gridAutoFlow: "column",
        overflow: "hidden",
        position: "relative",
      },
    },
  },
})

export const ParallelDivider = styled.div({
  alignSelf: "stretch",
  height: "100%",
  borderLeft: "1px solid dashed",
  variants: {
    state: {
      active: {
        borderColor: "$active",
      },
      inactive: {
        borderColor: "$inactive",
      },
    },
    visibility: {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
      },
    },
  },
})

export const Divider = styled.hr({
  border: 0,
  borderBottom: "1px solid currentColor",
  mt: "$0",
  mb: 0,
  variants: {
    state: {
      active: {
        borderColor: "$text",
      },
      inactive: {
        borderColor: "$inactive",
      },
    },
  },
})

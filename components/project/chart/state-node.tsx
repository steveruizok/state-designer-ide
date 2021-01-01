import { S, useStateDesigner } from "@state-designer/react"
import { styled } from "components/theme"
import sortBy from "lodash/sortBy"
import * as React from "react"
import highlightsState from "states/highlights"
import { getNodeEvents } from "utils"

import NodeEvents from "./node-events"
import NodeHeading from "./node-heading"

interface StateNodeProps {
  node: S.State<any, any>
}

export default function StateNode({ node }: StateNodeProps) {
  const rContainer = React.useRef<HTMLDivElement>(null)
  const localHighlight = useStateDesigner(highlightsState)

  const isRoot = node.parentType === null

  const isHighlit =
    localHighlight.values.highlitStates.find(
      ({ name }) => name === node.name,
    ) !== undefined

  const childNodes = sortBy(
    Object.values(node.states || {}),
    (n: S.State<any, any>) => !n.isInitial,
  )

  // For parallel nodes, find out which children are highlighted
  // so that we can hide the dividers next to those nodes.
  const hiddenDividerIndices = new Set<number>([])

  if (node.type === "parallel") {
    const highlitNodePaths = Object.keys(localHighlight.data.states)

    childNodes.forEach((childNode, i) => {
      if (highlitNodePaths.includes(childNode.path)) {
        hiddenDividerIndices.add(i)
        hiddenDividerIndices.add(i - 1)
        hiddenDividerIndices.add(i + 1)
      }
    })
  }

  // Events
  const events = getNodeEvents(node)

  // Send ref to highlights state and canvas on mount
  React.useEffect(() => {
    highlightsState.send("MOUNTED_NODE", { path: node.path, ref: rContainer })
    return () => highlightsState.send("UNMOUNTED_NODE", { path: node.path })
  }, [node])

  return (
    <NodeContainer
      ref={rContainer}
      data-type="node-container"
      onPointerEnter={(e) => {
        highlightsState.send("HIGHLIT_STATE", {
          stateName: node.name,
          shiftKey: e.shiftKey,
          path: node.path,
        })
      }}
      onPointerLeave={(e) => {
        highlightsState.send("CLEARED_STATE_HIGHLIGHT", {
          stateName: node.name,
          path: node.path,
        })
      }}
      data-node={node.type}
      data-active={node.active.toString()}
      childOf={node.parentType || "root"}
      nodeLevel={isRoot ? "root" : "child"}
      data-highlight={isHighlit}
    >
      {isRoot ? (
        events.length > 0 ? (
          <NodeHeading node={node} />
        ) : // <RootNodeHeading />
        null
      ) : (
        <NodeHeading node={node} />
      )}
      {events.length > 0 && <NodeEvents node={node} events={events} />}
      {events.length > 0 && childNodes.length > 0 && (
        <Divider
          state={isRoot ? "inactive" : node.active ? "active" : "inactive"}
        />
      )}
      <ChildNodesContainer type={node.type}>
        {node.type === "parallel"
          ? childNodes.map((child, i) => {
              const hideDivider = hiddenDividerIndices.has(i)

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
    borderColor: "$accentInactive",
  },
  "&[data-active=true]": {
    borderColor: "$active",
  },
  "&[data-active=true][data-highlight=true]": {
    borderColor: "$accent",
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
          borderRadius: "0px 0px 0px 12px",
        },
        "&:nth-child(n+2):nth-last-child(n+2) ": {
          borderRadius: 0,
        },
        "&:nth-last-of-type(1)": {
          borderRadius: "0px 0px 12px 0px",
        },
        "&[data-active=true]": {
          borderColor: "transparent",
        },
        "&[data-active=true][data-highlight=true]": {
          borderColor: "$accent",
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
        m: "-$1",
        gridAutoFlow: "column",
        overflow: "hidden",
        position: "relative",
      },
    },
  },
})

export const ParallelDivider = styled.div({
  alignSelf: "stretch",
  borderLeft: "1px solid dashed",
  variants: {
    state: {
      active: {
        borderColor: "$inactive",
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
  mt: 0,
  mb: "$0",
  mx: "-$1",
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

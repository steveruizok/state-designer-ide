import * as React from "react"
import sortBy from "lodash/sortBy"
import { S, useStateDesigner } from "@state-designer/react"
import ParallelNode from "./parallel-node"
import BranchNode from "./branch-node"
import LeafNode from "./leaf-node"
import highlightsState from "states/highlights"
import { styled } from "components/theme"
import NodeHeading from "./node-heading"
import NodeEvents from "./node-events"
import {
  NodeContainer,
  ChildNodesContainer,
  Divider,
  ParallelDivider,
} from "./styled"

interface StateNodeProps {
  node: S.State<any, any>
}

const NodeComponent = {
  parallel: ParallelNode,
  branch: BranchNode,
  leaf: LeafNode,
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

  // Alert canvas on mount
  React.useEffect(() => {
    local.send("MOUNTED_NODE", { path: node.path, ref: rContainer })
  }, [node])

  const Component = NodeComponent[node.type]

  console.log(events)

  return (
    <StateNodeContainer
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
    >
      <NodeContainer
        childOf={node.parentType || "root"}
        nodeLevel={isRoot ? "root" : "child"}
        nodeState={node.active ? "active" : "inactive"}
        state={
          isRoot
            ? highlight
              ? "root-highlight"
              : "root"
            : highlight
            ? "highlight"
            : "normal"
        }
      >
        {!isRoot && <NodeHeading node={node} />}
        {events.length > 0 && (
          <>
            <NodeEvents node={node} events={events} />

            <Divider state={node.active ? "active" : "inactive"} />
          </>
        )}
        <ChildNodesContainer type={node.type}>
          {node.type === "parallel"
            ? childNodes.map((child, i) => {
                return (
                  <React.Fragment key={i}>
                    <StateNode node={child} />
                    {i < childNodes.length - 1 && (
                      <ParallelDivider
                        state={node.active ? "active" : "inactive"}
                      />
                    )}
                  </React.Fragment>
                )
              })
            : childNodes.map((child, i) => <StateNode key={i} node={child} />)}
        </ChildNodesContainer>
      </NodeContainer>
      {/* <Component
        node={node}
        isRoot={isRoot}
        highlight={highlight}
        events={events}
        nodes={childNodes}
      /> */}
    </StateNodeContainer>
  )
}

const StateNodeContainer = styled.div({
  display: "flex",
  minWidth: "fit-content",
})

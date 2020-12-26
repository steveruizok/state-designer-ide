import * as React from "react"
import sortBy from "lodash/sortBy"
import { S } from "@state-designer/react"
import { NodeContainer, ChildNodesContainer, Divider } from "./styled"
import NodeHeading from "./node-heading"
import StateNode from "./state-node"
import NodeEvents from "./node-events"

interface NodeProps {
  node: S.State<any, any>
  highlight: boolean
  isRoot: boolean
  events: [string, S.EventHandler<any>][]
  nodes: S.State<any, any>[]
}

export default function BranchNode({
  node,
  isRoot,
  events,
  nodes,
  highlight,
}: NodeProps) {
  return (
    <NodeContainer
      childOf={node.parentType || "branch"}
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
      {events.length > 0 && <NodeEvents node={node} events={events} />}
      {(!isRoot || events.length) > 0 && (
        <Divider state={node.active ? "active" : "inactive"} />
      )}
      <ChildNodesContainer type="branch">
        {nodes.map((child, i) => (
          <StateNode key={i} node={child} />
        ))}
      </ChildNodesContainer>
    </NodeContainer>
  )
}

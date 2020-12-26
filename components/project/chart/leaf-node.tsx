import * as React from "react"
import { S } from "@state-designer/react"
import NodeHeading from "./node-heading"
import NodeEvents from "./node-events"
import { NodeContainer } from "./styled"

interface NodeProps {
  node: S.State<any, any>
  highlight: boolean
  isRoot: boolean
  events: [string, S.EventHandler<any>][]
  nodes: S.State<any, any>[]
}

export default function LeafNode({
  node,
  events,
  isRoot,
  nodes,
  highlight,
}: NodeProps) {
  return (
    <NodeContainer
      childOf={node.parentType || "root"}
      nodeLevel={node.parentType ? "child" : "root"}
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
      <NodeHeading node={node} />
      <NodeEvents node={node} events={events} />
    </NodeContainer>
  )
}

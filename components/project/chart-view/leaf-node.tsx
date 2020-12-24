import * as React from "react"
import { S } from "@state-designer/react"
import NodeHeading from "./node-heading"
import NodeEvents from "./node-events"
import { NodeContainer, Divider } from "./styled"

interface NodeProps {
  node: S.State<any, any>
  highlight: boolean
}

export default function LeafNode({ node, highlight }: NodeProps) {
  return (
    <NodeContainer
      childOf={node.parentType}
      nodeLevel="child"
      nodeState={node.active ? "active" : "inactive"}
      state={highlight ? "highlight" : "normal"}
    >
      <NodeHeading node={node} />
      <NodeEvents node={node} />
    </NodeContainer>
  )
}

import * as React from "react"
import { S } from "@state-designer/react"
import NodeHeading from "./node-heading"
import NodeEvents from "./node-events"
import { NodeContainer, Divider } from "./styled"

interface LeafNodeProps {
  node: S.State<any, any>
}
export default function LeafNode({ node }: LeafNodeProps) {
  return (
    <NodeContainer
      childOf={node.parentType}
      data-isroot={false}
      data-isactive={node.active}
    >
      <NodeHeading node={node} />
      <NodeEvents node={node} />
    </NodeContainer>
  )
}

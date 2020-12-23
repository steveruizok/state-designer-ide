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
}

export default function BranchNode({ node, highlight }: NodeProps) {
  const childNodes = Object.values(node.states)

  function getSortedBranchChildNodes(nodes: S.State<any, any>[]) {
    return sortBy(nodes, (n) => !n.isInitial)
  }

  return (
    <NodeContainer
      childOf={node.parentType || "branch"}
      data-isroot={node.parentType === null}
      data-isactive={node.active}
      state={highlight ? "highlight" : "normal"}
    >
      <NodeHeading node={node} />
      <NodeEvents node={node} />
      <Divider state={node.active ? "active" : "inactive"} />
      <ChildNodesContainer type="branch">
        {getSortedBranchChildNodes(childNodes).map((child, i) => (
          <StateNode key={i} node={child} />
        ))}
      </ChildNodesContainer>
    </NodeContainer>
  )
}

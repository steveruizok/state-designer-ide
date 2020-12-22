import * as React from "react"
import sortBy from "lodash/sortBy"
import { S } from "@state-designer/react"
import { NodeContainer, ChildNodesContainer } from "./styled"
import NodeHeading from "./node-heading"
import StateNode from "./state-node"
import NodeEvents from "./node-events"

const BranchNode: React.FC<{ node: S.State<any, any> }> = ({ node }) => {
  const childNodes = Object.values(node.states)

  function getSortedBranchChildNodes(nodes: S.State<any, any>[]) {
    return sortBy(nodes, (n) => !n.isInitial)
  }

  return (
    <NodeContainer
      childOf={node.parentType || "branch"}
      data-isroot={node.parentType === null}
      data-isactive={node.active}
    >
      <NodeHeading node={node} />
      <NodeEvents node={node} />
      <ChildNodesContainer type="branch">
        {getSortedBranchChildNodes(childNodes).map((child, i) => (
          <StateNode key={i} node={child} />
        ))}
      </ChildNodesContainer>
    </NodeContainer>
  )
}

export default BranchNode

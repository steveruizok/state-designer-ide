import * as React from "react"
import { S } from "@state-designer/react"
import NodeHeading from "./node-heading"
import { NodeContainer, ChildNodesContainer, Divider } from "./styled"
import StateNode from "./state-node"
import { ParallelDivider } from "./styled"
import { styled } from "components/theme"
import NodeEvents from "./node-events"

interface NodeProps {
  node: S.State<any, any>
  highlight: boolean
}

export default function ParallelNode({ node, highlight }: NodeProps) {
  const childNodes = Object.values(node.states)

  return (
    <NodeContainer
      childOf={node.parentType || "branch"}
      nodeLevel={node.parentType === null ? "root" : "child"}
      nodeState={node.active ? "active" : "inactive"}
      state={highlight ? "highlight" : "normal"}
    >
      <NodeHeading node={node} />
      <NodeEvents node={node} />
      <Divider state={node.active ? "active" : "inactive"} />
      <ChildNodesContainer type="parallel">
        {childNodes.map((child, i) => {
          return (
            <React.Fragment key={i}>
              <StateNode node={child} />
              {i < childNodes.length - 1 && (
                <ParallelDivider state={node.active ? "active" : "inactive"} />
              )}
            </React.Fragment>
          )
        })}
      </ChildNodesContainer>
    </NodeContainer>
  )
}

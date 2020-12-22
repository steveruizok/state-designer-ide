import * as React from "react"
import { S } from "@state-designer/react"
import NodeHeading from "./node-heading"
import { NodeContainer, ChildNodesContainer } from "./styled"
import StateNode from "./state-node"
import { ParallelDivider } from "./styled"
import { styled } from "components/theme"
import NodeEvents from "./node-events"

interface ParallelNodeProps {
  node: S.State<any, any>
}

export default function ParallelNode({ node }: ParallelNodeProps) {
  const childNodes = Object.values(node.states)

  return (
    <NodeContainer
      childOf={node.parentType || "branch"}
      data-isroot={node.parentType === null}
      data-isactive={node.active}
    >
      <NodeHeading node={node} />
      <NodeEvents node={node} />
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

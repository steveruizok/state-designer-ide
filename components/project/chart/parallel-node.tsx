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
  isRoot: boolean
  events: [string, S.EventHandler<any>][]
  nodes: S.State<any, any>[]
}

export default function ParallelNode({
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
      <NodeHeading node={node} />
      <NodeEvents node={node} events={events} />
      <Divider state={node.active ? "active" : "inactive"} />
      <ChildNodesContainer type="parallel">
        {nodes.map((child, i) => {
          return (
            <React.Fragment key={i}>
              <StateNode node={child} />
              {i < nodes.length - 1 && (
                <ParallelDivider state={node.active ? "active" : "inactive"} />
              )}
            </React.Fragment>
          )
        })}
      </ChildNodesContainer>
    </NodeContainer>
  )
}

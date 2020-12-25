import * as React from "react"
import { S, useStateDesigner } from "@state-designer/react"
import ParallelNode from "./parallel-node"
import BranchNode from "./branch-node"
import LeafNode from "./leaf-node"
import highlightsState from "states/highlights"
import { styled } from "components/theme"

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

  React.useEffect(() => {
    local.send("MOUNTED_NODE", { path: node.path, ref: rContainer })
  }, [node])

  const Component = NodeComponent[node.type]

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
      <Component node={node} highlight={highlight} />
    </StateNodeContainer>
  )
}

const StateNodeContainer = styled.div({
  display: "flex",
  minWidth: "fit-content",
})

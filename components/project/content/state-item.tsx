import { S, useStateDesigner } from "@state-designer/react"
import { range } from "components/static/utils"
import * as React from "react"
import { Circle, Disc, MinusCircle } from "react-feather"
import highlightsState from "states/highlights"
import projectState from "states/project"

import { Button, ContentItem } from "./shared"

interface StateItemProps {
  node: S.State<any, any>
  zap: boolean
}

export default function StateItem({ node, zap }: StateItemProps) {
  useStateDesigner(projectState.data.captive)

  return (
    <ContentItem
      title={`Zoom to ${node.name}`}
      onClick={() => projectState.send("SELECTED_NODE", { id: node.path })}
      onMouseEnter={(e) => {
        highlightsState.send("HIGHLIT_STATE", {
          stateName: node.name,
          shiftKey: e.shiftKey,
          path: node.path,
        })
      }}
      onMouseLeave={(e) => {
        highlightsState.send("CLEARED_STATE_HIGHLIGHT", {
          stateName: node.name,
          path: node.path,
        })
      }}
    >
      <Button data-active={node.active.toString()}>
        {range(node.depth).map((i) => (
          <Circle key={i} size="5" fill="currentColor" />
        ))}
        {node.isInitial ? (
          <Disc size="12" strokeWidth={3} />
        ) : node.parentType === "branch" ? (
          <Circle size="12" strokeWidth={3} />
        ) : (
          <MinusCircle
            size="12"
            strokeWidth={3}
            style={{
              transform: "rotate(90deg)",
            }}
          />
        )}
        {node.name}
      </Button>
    </ContentItem>
  )
}

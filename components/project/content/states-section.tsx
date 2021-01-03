import { useStateDesigner } from "@state-designer/react"
import * as React from "react"
import highlightsState from "states/highlights"
import projectState from "states/project"
import { getFlatStates } from "utils"

import { ContentSection, ContentTitle } from "./shared"
import StateItem from "./state-item"

interface StatesSectionProps {}

export default function StatesSection({}: StatesSectionProps) {
  const local = useStateDesigner(projectState)

  const { captive } = local.data
  const states = getFlatStates(captive.stateTree)
  const [zap, setZap] = React.useState(false)

  return (
    <>
      <ContentTitle>States</ContentTitle>
      <ContentSection
        onMouseLeave={(e) => {
          highlightsState.send("CLEARED_HIGHLIGHTS")
        }}
      >
        {states.map((node, i) => (
          <StateItem key={i} node={node} zap={zap} />
        ))}
      </ContentSection>
    </>
  )
}

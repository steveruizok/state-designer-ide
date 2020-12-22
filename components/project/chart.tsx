import { useStateDesigner } from "@state-designer/react"
import projectState from "./state"
import { styled } from "components/theme"
import ChartView from "components/project/chart-view"

export default function Chart() {
  const local = useStateDesigner(projectState)

  return (
    <ChartContainer>
      {local.isIn("loading") ? (
        <div />
      ) : (
        <ChartView state={local.data.captive} />
      )}
    </ChartContainer>
  )
}

const ChartContainer = styled.div({
  position: "relative",
  gridArea: "chart",
  display: "grid",
  borderRight: "2px solid $border",
})

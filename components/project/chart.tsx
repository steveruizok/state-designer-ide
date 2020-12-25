import { useStateDesigner } from "@state-designer/react"
import projectState from "../../states/project"
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
  bg: "$border",
  height: "100%",
  width: "100%",
  borderRight: "2px solid $borderContrast",
})

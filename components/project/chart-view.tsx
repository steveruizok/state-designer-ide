import ChartView from "components/project/chart"
import Loading from "components/loading"
import projectState from "states/project"
import { styled } from "components/theme"
import { useStateDesigner } from "@state-designer/react"

export default function Chart() {
  const local = useStateDesigner(projectState)

  return (
    <ChartContainer>
      {local.isIn("loading") ? (
        <Loading />
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
  borderTop: "2px solid $border",
})

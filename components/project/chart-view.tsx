import { useStateDesigner } from "@state-designer/react"
import ChartView from "components/project/chart"
import Loading from "components/project/loading"
import { styled } from "components/theme"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import projectState from "states/project"

export default function Chart() {
  const local = useStateDesigner(projectState)

  return (
    <ChartContainer>
      {local.isIn("loading") ? (
        <Loading />
      ) : (
        <AnimateSharedLayout>
          <AnimatePresence>
            <ChartView state={local.data.captive} />
          </AnimatePresence>
        </AnimateSharedLayout>
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

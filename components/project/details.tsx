import * as React from "react"
import { styled, Button, Text, TitleRow } from "components/theme"
import projectState from "./state"
import { useStateDesigner } from "@state-designer/react"
import { DragHandleVertical } from "./drag-handles"
import { ui, setWrapDetails } from "lib/local-data"

interface DetailsProps {
  children: React.ReactNode
}

export const DETAILS_ROW_HEIGHT = 320

export default function Details() {
  const local = useStateDesigner(projectState)
  const captive = useStateDesigner(local.data.captive)
  const [isWrapped, setIsWrapped] = React.useState(ui.wrapDetails)

  function toggleWrap() {
    setIsWrapped(!isWrapped)
    setWrapDetails(!isWrapped)
  }

  return (
    <DetailsContainer>
      <TitleRow>
        <Text>Details</Text>
        <Button onClick={toggleWrap}>Wrap</Button>
      </TitleRow>
      {local.isIn("loading") ? (
        <div />
      ) : (
        <DetailsText wrapping={isWrapped ? "wrap" : "nowrap"}>
          <code>{JSON.stringify(captive.data, null, 2)}</code>
        </DetailsText>
      )}
      <DragHandleVertical
        height={DETAILS_ROW_HEIGHT}
        top={300}
        bottom={DETAILS_ROW_HEIGHT - 40}
        offset="detail"
        align="bottom"
      />
    </DetailsContainer>
  )
}

const DetailsContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "auto 1fr",
  gridArea: "details",
  position: "relative",
  borderTop: "2px solid $border",
  borderRight: "2px solid $border",
})

const DetailsText = styled.pre({
  overflowY: "scroll",
  m: 0,
  py: "$2",
  px: "$1",
  height: "100%",
  overflowX: "scroll",
  variants: {
    wrapping: {
      nowrap: {},
      wrap: {
        whiteSpace: "pre-wrap",
      },
    },
  },
})

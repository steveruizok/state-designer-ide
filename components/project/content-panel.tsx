import { S, useStateDesigner } from "@state-designer/react"
import { styled } from "components/theme"
import { motionValues } from "lib/local-data"
import * as React from "react"
import EventsSection from "./content/events-section"
import Payloads from "./content/payloads"
import StatesSection from "./content/states-section"
import { DragHandleHorizontal } from "./drag-handles"
import uiState from "states/ui"

export const CONTENT_COL_WIDTH = 200

interface ContentProps {}

export default function Content({}: ContentProps) {
  const {
    data: {
      content: { visible },
    },
  } = useStateDesigner(uiState)

  return (
    <ContentContainer state={visible ? "open" : "closed"}>
      {visible && (
        <>
          <StatesSection />
          <EventsSection />
          <Payloads />
          <DragHandleHorizontal
            motionValue={motionValues.content}
            align="left"
            width={CONTENT_COL_WIDTH}
            left={60}
            right={100}
            offset="content"
          />
        </>
      )}
    </ContentContainer>
  )
}

export const ContentContainer = styled.div({
  userSelect: "none",
  gridArea: "content",
  position: "relative",
  display: "grid",
  gridTemplateRows: "auto fit-content fit-content 1fr auto",
  borderRight: "2px solid $border",
  borderTop: "2px solid $border",
  overflow: "hidden",
  variants: {
    state: {
      open: {
        width: `calc(${CONTENT_COL_WIDTH}px + var(--content-offset))`,
      },
      closed: {
        width: `0px`,
      },
    },
  },
})

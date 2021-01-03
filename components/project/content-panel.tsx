import { S, useStateDesigner } from "@state-designer/react"
import { motionValues } from "lib/local-data"
import * as React from "react"
import projectState from "states/project"
import { getFlatStates } from "utils"

import EventsSection from "./content/events-section"
import Payloads from "./content/payloads"
import { ContentContainer } from "./content/shared"
import StatesSection from "./content/states-section"
import { DragHandleHorizontal } from "./drag-handles"

export const CONTENT_COL_WIDTH = 200

interface ContentProps {}

export default function Content({}: ContentProps) {
  return (
    <ContentContainer>
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
    </ContentContainer>
  )
}

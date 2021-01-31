import { useStateDesigner } from "@state-designer/react"
import * as React from "react"
import highlightsState from "states/highlights"
import projectState from "states/project"
import { EventDetails } from "types"
import { getFlatStates } from "utils"

import EventItem from "./event-item"
import { ContentWrapper, ContentSection, ContentTitle } from "./shared"

const AUTOEVENT_NAMES = ["onEnter", "onExit", "onEvent"]

interface StatesSectionProps {}

export default function EventsSection({}: StatesSectionProps) {
  const local = useStateDesigner(projectState)
  const events = Object.entries(local.data.eventMap).filter(
    ([name]) => !AUTOEVENT_NAMES.includes(name),
  )

  const [zap, setZap] = React.useState(false)

  return (
    <ContentWrapper>
      <ContentTitle>Events</ContentTitle>
      <ContentSection
        onMouseLeave={(e) => {
          highlightsState.send("CLEARED_HIGHLIGHTS")
        }}
      >
        {events.map(([eventName, event], i) => (
          <EventItem key={i} eventName={eventName} event={event} zap={zap} />
        ))}
      </ContentSection>
    </ContentWrapper>
  )
}

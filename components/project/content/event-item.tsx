import { useStateDesigner } from "@state-designer/react"
import * as React from "react"
import highlightsState from "states/highlights"
import payloadsState from "states/payloads"
import projectState from "states/project"
import { EventDetails } from "types"

import { Button, ContentItem } from "./shared"

interface EventItemProps {
  eventName: string
  event: EventDetails
  zap: boolean
}

export default function EventItem({ eventName, event, zap }: EventItemProps) {
  useStateDesigner(payloadsState)
  const local = useStateDesigner(projectState.data.captive)
  const rTimeout = React.useRef<any>(null)
  const [isHighlit, setIsHighlit] = React.useState(false)

  const payload = Function(
    "Static",
    `return ${payloadsState.data.payloads[eventName]}`,
  )(projectState.data.static)

  // Can any of the states handle the event?
  const canBeHandled = projectState.data.captive.can(eventName, payload)

  // The button is zapped if it was the most recent event fired
  React.useEffect(() => {
    if (zap) {
      if (local.log[0] === eventName) {
        setIsHighlit(true)
        rTimeout.current = requestAnimationFrame(() => setIsHighlit(false))
      }
    }
  }, [zap, local.log])

  React.useEffect(() => {
    return () => clearTimeout(rTimeout.current)
  }, [])

  // 2 Get the payload associated with this event.
  // 3 Disable the button if the event cannot be handled with payload.

  function sendHighlightEvent(shiftKey = false) {
    highlightsState.send("HIGHLIT_EVENT", {
      eventName,
      canBeHandled,
      statePaths: Array.from(event.states.values()).map((state) => ({
        statePath: state.path,
        active: state.active,
      })),
      targets: event.targets
        .filter((target) => target.from.active)
        .map((target) => ({
          from: target.from.path,
          to: target.to.path,
        })),
      shiftKey,
    })
  }

  return (
    <ContentItem
      onClick={() => {
        if (!canBeHandled) return
        projectState.data.captive.send(eventName, payload)
        projectState.data.captive.getUpdate(({ active }) =>
          highlightsState.send("CHANGED_ACTIVE_STATES", { active }),
        )
        requestAnimationFrame(() => sendHighlightEvent())
      }}
      onMouseEnter={(e) => {
        sendHighlightEvent(e.shiftKey)
      }}
      onMouseLeave={() =>
        highlightsState.send("CLEARED_EVENT_HIGHLIGHT", { eventName })
      }
    >
      <Button
        zapped={isHighlit ? "on" : "off"}
        data-active={canBeHandled.toString()}
      >
        {eventName}
      </Button>
    </ContentItem>
  )
}

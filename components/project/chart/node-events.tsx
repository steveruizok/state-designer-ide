import { S, useStateDesigner } from "@state-designer/react"
import { Button, styled } from "components/theme"
import * as React from "react"
import highlightsState from "states/highlights"
import ProjectState from "states/project"
import { EventDetails } from "types"

interface NodeEventsProps {
  node: S.State<any, any>
  events: [string, S.EventHandler<any>][]
}

function NodeEvents({ node, events }: NodeEventsProps) {
  const local = useStateDesigner(ProjectState)
  const highlights = useStateDesigner(highlightsState)
  const captiveData = local.data.captive.data

  const { highlitEventName } = highlights.values
  const { eventMap } = local.data

  return (
    <NodeEventsContainer type={node.type}>
      {events.map(([name, handlers], i) => {
        const payloadStringValue = "nothing" //local.data.code.payloads[name]

        let payload: any

        if (!!payloadStringValue) {
          try {
            const fn = Function("Static", `return ${payloadStringValue}`)
            payload = fn(local.data.code.static)
          } catch (e) {}
        }

        const isActive = node.active

        let canHandleEvent = true

        try {
          canHandleEvent = local.data.captive.can(name, payload)
        } catch (e) {
          throw new Error("error while testing event")
        }

        const isDisabled = !isActive || !canHandleEvent

        return (
          <EventButton
            key={i}
            eventName={name}
            node={node}
            payload={payload}
            isDisabled={isDisabled}
            isActive={isActive}
            isHighlit={highlitEventName === name}
            event={eventMap[name]}
          />
        )
      })}
    </NodeEventsContainer>
  )
}
export default NodeEvents

const EventButton: React.FC<{
  eventName: string
  node: S.State<any, any>
  payload: any
  isHighlit: boolean
  isDisabled: boolean
  isActive: boolean
  event: EventDetails
}> = ({ eventName, event, node, payload, isHighlit, isDisabled, isActive }) => {
  const rButton = React.useRef<HTMLButtonElement>(null)
  const { captive } = ProjectState.data

  React.useEffect(() => {
    highlightsState.send("MOUNTED_EVENT_BUTTON", {
      id: node.path + "_" + eventName,
      ref: rButton,
    })
    return () =>
      highlightsState.send("UNMOUNTED_EVENT_BUTTON", {
        id: node.path + "_" + eventName,
        ref: rButton,
      })
  }, [])

  function sendHighlightEvent(shiftKey = false) {
    highlightsState.send("HIGHLIT_EVENT", {
      eventName,
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
    <Button
      ref={rButton}
      variant="nodeEvent"
      highlight={isHighlit ? "on" : "off"}
      data-disabled={isDisabled.toString()}
      title={
        !isDisabled
          ? `Click to send the ${eventName} event`
          : !isActive
          ? "The state cannot handle this event while it is inactive."
          : "The state cannot handle this event due to its current payload."
      }
      onClick={() => {
        captive.send(eventName, payload)
        captive.getUpdate(({ active }) =>
          highlightsState.send("CHANGED_ACTIVE_STATES", { active }),
        )
        requestAnimationFrame(() => sendHighlightEvent())
      }}
      onMouseOver={(e) => {
        e.stopPropagation()
        sendHighlightEvent(e.shiftKey)
      }}
      onMouseLeave={() =>
        requestAnimationFrame(() =>
          highlightsState.send("CLEARED_EVENT_HIGHLIGHT", {
            eventName,
            statePath: node.path,
          }),
        )
      }
    >
      {eventName}
    </Button>
  )
}

const NodeEventsContainer = styled.div({
  px: "$0",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  maxWidth: 400,
  gap: 1,
  variants: {
    type: {
      leaf: {
        pb: "$0",
      },
      branch: {},
      parallel: {},
    },
  },
})

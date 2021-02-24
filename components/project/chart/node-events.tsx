import { S, useStateDesigner } from "@state-designer/react"
import { Button, styled } from "components/theme"
import * as React from "react"
import highlightsState from "states/highlights"
import payloadsState from "states/payloads"
import projectState from "states/project"
import { EventDetails } from "types"

interface NodeEventsProps {
  node: S.State<any>
  events: [string, S.EventHandler<any>][]
}

function NodeEvents({ node, events }: NodeEventsProps) {
  const local = useStateDesigner(projectState)
  useStateDesigner(payloadsState)
  const highlights = useStateDesigner(highlightsState)

  const { highlitEventName } = highlights.values
  const { eventMap } = local.data

  return (
    <NodeEventsContainer type={node.type}>
      {events.map(([name, handlers], i) => {
        const payload = Function(
          "Static",
          `return ${payloadsState.data.payloads[name]}`,
        )(projectState.data.static)

        const isActive = node.active

        let canBeHandled = true

        try {
          canBeHandled = local.data.captive.can(name, payload)
        } catch (e) {
          throw new Error("error while testing event")
        }

        return (
          <EventButton
            key={i}
            eventName={name}
            node={node}
            payload={payload}
            canBeHandled={canBeHandled}
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
  node: S.State<any>
  payload: any
  isHighlit: boolean
  canBeHandled: boolean
  isActive: boolean
  event: EventDetails
}> = ({
  eventName,
  event,
  node,
  payload,
  isHighlit,
  canBeHandled,
  isActive,
}) => {
  const rButton = React.useRef<HTMLButtonElement>(null)
  const { captive } = projectState.data

  React.useEffect(() => {
    highlightsState.send("MOUNTED_EVENT_BUTTON", {
      id: node.path + "_" + eventName,
      ref: rButton,
    })

    return () => {
      highlightsState.send("UNMOUNTED_EVENT_BUTTON", {
        id: node.path + "_" + eventName,
        ref: rButton,
      })
    }
  }, [])

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

  const isDisabled = !(isActive && canBeHandled)

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
          ? `Click to send the ${eventName} event. The ${node.name} will not handle this event while it is inactive, but it may be handled elsewhere.`
          : `Click to send the ${eventName} event. The ${node.name} will not handle this event due to its current payload, but it may be handled elsewhere.`
      }
      onClick={() => {
        captive.send(eventName, payload)
        captive.getUpdate(({ active }) =>
          highlightsState.send("CHANGED_ACTIVE_STATES", { active }),
        )
        requestAnimationFrame(() => sendHighlightEvent())
      }}
      onMouseEnter={(e) => {
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
  flexGrow: 2,
  gap: "$0",
  variants: {
    type: {
      leaf: {
        pb: "$0",
      },
      branch: {
        pb: "$1",
      },
      parallel: {
        pb: "$1",
      },
    },
  },
})

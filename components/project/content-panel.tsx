import { S, useStateDesigner } from "@state-designer/react"
import { range } from "components/static/utils"
import { styled } from "components/theme"
import { motionValues } from "lib/local-data"
import * as React from "react"
import { Circle, Disc, MinusCircle } from "react-feather"
import highlightsState from "states/highlights"
import payloadsState from "states/payloads"
import projectState from "states/project"
import { EventDetails } from "types"

import { DragHandleHorizontal } from "./drag-handles"

export const CONTENT_COL_WIDTH = 200

interface ContentProps {}

export default function Content({}: ContentProps) {
  const local = useStateDesigner(projectState)

  const { captive, eventMap } = local.data

  const states = getFlatStates(captive.stateTree)
  const events = Object.entries(eventMap)
  // Includes duplicates (same event on different states)
  // const allEvents = getAllEvents(captive.stateTree)

  const [zapStates, setZapStates] = React.useState(false)
  const [zapEvents, setZapEvents] = React.useState(false)
  const [selectedEvent, setSelectedEvent] = React.useState<string>(
    events[0] ? events[0][0] : "",
  )

  return (
    <ContentContainer>
      <ContentTitle align="top">States</ContentTitle>
      <ContentSection>
        {states.map((node, i) => (
          <StateItem key={i} node={node} highlight={zapStates && node.active} />
        ))}
      </ContentSection>
      <ContentTitle align="top">Events</ContentTitle>
      <ContentSection>
        {events.map(([eventName, event], i) => (
          <EventItem key={i} eventName={eventName} event={event} />
        ))}
      </ContentSection>
      <Spacer />
      <Payloads events={events} />
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

interface PayloadsProps {
  events: [string, EventDetails][]
}

function Payloads({ events }: PayloadsProps) {
  const localPayloads = useStateDesigner(payloadsState)
  const [selected, setSelected] = React.useState(
    events[0]?.[0] || "Select an Event",
  )
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    setValue(localPayloads.data.payloads[selected] || "")
  }, [selected])

  React.useEffect(() => {
    setValue(payloadsState.data.payloads[selected])
  }, [payloadsState.data.payloads])

  function handleChange(code: string) {
    setValue(code)
    try {
      Function("Static", `return ${code}`)(projectState.data.static)
      setError("")
      const { pid, oid } = projectState.data

      payloadsState.send("UPDATED_PAYLOAD", {
        eventName: selected,
        code,
        pid,
        oid,
      })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <PayloadsContainer>
      <ContentTitle align="bottom">Event Payloads</ContentTitle>
      <Select
        value={selected}
        onChange={(e) => {
          setSelected(e.currentTarget.value)
        }}
      >
        <option>Select an Event</option>
        {events.map(([eventName]) => (
          <option key={eventName}>{eventName}</option>
        ))}
      </Select>
      <TextArea
        disabled={selected === "Select an Event"}
        autoCapitalize="false"
        autoComplete="false"
        placeholder="Enter a payload of data to send with the event."
        value={value}
        onChange={(e) => handleChange(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault()
          }
        }}
      />
      <ErrorOverlay>{error}</ErrorOverlay>
    </PayloadsContainer>
  )
}

const PayloadsContainer = styled.div({
  display: "grid",
  gridTemplateRows: "40px 40px 200px",
  gap: "$1",
  position: "relative",
})

const TextArea = styled.textarea({
  bg: "$muted",
  border: "none",
  outline: "none",
  py: "$2",
  px: "$1",
  fontFamily: "$monospace",
  fontSize: "$1",
  color: "$text",
  resize: "none",
  overflow: "scroll",
  "&:disabled": {
    opacity: 0.3,
  },
})

const Select = styled.select({
  bg: "transparent",
  border: "none",
  color: "$text",
  px: 0,
  mx: "$1",
  outline: "none",
  fontSize: "$1",
  fontFamily: "$body",
  fontWeight: "bold",
})

const ErrorOverlay = styled.div({
  position: "absolute",
  bottom: 40,
  width: "100%",
  pointerEvents: "none",
  fontFamily: "$monospace",
  fontSize: "$0",
  px: "$1",
  py: "$2",
  color: "$accent",
})

interface StateItemProps {
  node: S.State<any, any>
  highlight: boolean
}

function StateItem({ node, highlight }: StateItemProps) {
  useStateDesigner(projectState.data.captive)
  const localHighlight = useStateDesigner(highlightsState)

  const isHighlit =
    localHighlight.values.highlitStates.find(
      ({ name }) => name === node.name,
    ) !== undefined

  return (
    <ContentItem
      title={`Zoom to ${node.name}`}
      onClick={() => projectState.send("SELECTED_NODE", { id: node.path })}
      onMouseOver={(e) => {
        highlightsState.send("HIGHLIT_STATE", {
          stateName: node.name,
          shiftKey: e.shiftKey,
          path: node.path,
        })
      }}
      onMouseLeave={(e) => {
        highlightsState.send("CLEARED_STATE_HIGHLIGHT", {
          stateName: node.name,
          path: node.path,
        })
      }}
    >
      <Button data-active={node.active.toString()}>
        {range(node.depth).map((i) => (
          <Circle key={i} size="5" fill="currentColor" />
        ))}
        {node.isInitial ? (
          <Disc size="12" strokeWidth={3} />
        ) : node.parentType === "branch" ? (
          <Circle size="12" strokeWidth={3} />
        ) : (
          <MinusCircle
            size="12"
            strokeWidth={3}
            style={{
              transform: "rotate(90deg)",
            }}
          />
        )}
        {node.name}
      </Button>
    </ContentItem>
  )
}

interface EventItemProps {
  eventName: string
  event: EventDetails
}

function EventItem({ eventName, event }: EventItemProps) {
  useStateDesigner(payloadsState)
  const local = useStateDesigner(projectState.data.captive)
  const rTimeout = React.useRef<any>(null)
  const [isHighlit, setIsHighlit] = React.useState(false)

  // Can any of the states handle the event?
  const canBeHandled = projectState.data.captive.can(
    eventName,
    payloadsState.data.payloads[eventName],
  )

  // The button is zapped if it was the most recent event fired
  React.useEffect(() => {
    if (local.log[0] === eventName) {
      setIsHighlit(true)
      rTimeout.current = requestAnimationFrame(() => setIsHighlit(false))
    }
  }, [local.log])

  React.useEffect(() => {
    return () => clearTimeout(rTimeout.current)
  }, [])

  // 2 Get the payload associated with this event.
  // 3 Disable the button if the event cannot be handled with payload.

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
    <ContentItem
      onClick={() => {
        // local.send("FIRED_CAPTIVE_EVENT", { eventName })
        if (!canBeHandled) return
        projectState.data.captive.send(
          eventName,
          payloadsState.data.payloads[eventName],
        )
        projectState.data.captive.getUpdate(({ active }) =>
          highlightsState.send("CHANGED_ACTIVE_STATES", { active }),
        )
        requestAnimationFrame(() => sendHighlightEvent())
      }}
      onMouseOver={(e) => sendHighlightEvent(e.shiftKey)}
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

const Button = styled.button({
  color: "$text",
  fontSize: "$1",
  fontWeight: "bold",
  fontFamily: "$body",
  lineHeight: "$ui",
  bg: "transparent",
  px: "$1",
  height: 36,
  m: 0,
  flexGrow: 2,
  border: "none",
  outline: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  svg: {
    mr: "$0",
  },
  "&[data-active=false]": {
    opacity: 0.5,
  },
  "&[data-highlight=true]": {
    bg: "$codeHl",
  },
  variants: {
    display: {
      wide: {
        width: "100%",
        justifyContent: "center",
        "&:active": {
          bg: "$muted",
        },
        "&:hover": {
          color: "$accent",
        },
        "&:disabled": {
          opacity: 0.5,
        },
      },
    },
    zapped: {
      on: {
        transition: "none",
        color: "$accent",
      },
      off: {
        transition: "color .5s ease-out .1s",
        color: "$text",
      },
    },
  },
})

const ContentItem = styled.li({
  display: "flex",
  p: 0,
  m: 0,
  "&:hover": {
    bg: "$codeHl",
  },
})

const Spacer = styled.div({
  flexGrow: 2,
})

const ContentContainer = styled.div({
  gridArea: "content",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gridTemplateRows: 40,
  borderRight: "2px solid $border",
})

const ContentTitle = styled.div({
  display: "flex",
  fontSize: "$1",
  alignItems: "center",
  bg: "$muted",
  p: "$1",
  height: 40,
  color: "$text",
  variants: {
    align: {
      top: {
        borderTop: "2px solid $border",
        borderBottom: "1px solid $shadow",
      },
      bottom: {
        borderTop: "2px solid $border",
        borderBottom: "1px solid $shadow",
      },
    },
  },
})

const ContentSection = styled.ul({
  m: 0,
  pl: 0,
})

/* --------------------- Helpers -------------------- */

export function getFlatStates(state: S.State<any, any>): S.State<any, any>[] {
  return [state, ...Object.values(state.states).flatMap(getFlatStates)]
}

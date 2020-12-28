import { S, useStateDesigner } from "@state-designer/react"
import { range } from "components/static/utils"
import { styled } from "components/theme"
import { motionValues } from "lib/local-data"
import * as React from "react"
import { Circle, Disc, MinusCircle } from "react-feather"
import highlightsState from "states/highlights"
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
      <ContentTitle align="bottom">Event Payloads</ContentTitle>
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
  const local = useStateDesigner(projectState.data.captive)
  const rTimeout = React.useRef<any>(null)
  const [isHighlit, setIsHighlit] = React.useState(false)

  // The button is active if one or more state on which it occurs is active.
  // const isActive = Array.from(event.states.values()).some((node) => node.active)

  // Can any of the states handle the event?
  const canBeHandled = projectState.data.captive.can(eventName)

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
        projectState.data.captive.send(eventName)
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

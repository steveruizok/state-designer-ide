import * as React from "react"
import { range } from "components/static/utils"
import { styled } from "components/theme"
import { Circle, Disc, MinusCircle } from "react-feather"
import { S, useStateDesigner } from "@state-designer/react"
import projectState from "components/project/state"
import { Highlights } from "components/project/highlights"

interface ContentProps {
  children: React.ReactNode
}

export default function Content({ children }: ContentProps) {
  const local = useStateDesigner(projectState)
  const captive = local.data.captive

  const allEvents = getAllEvents(captive.stateTree)
  const events = getEventsByState(allEvents)
  const states = getFlatStates(captive.stateTree)

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
        <ul>{}</ul>
      </ContentSection>
      <Spacer />
      <ContentTitle align="bottom">Event Payloads</ContentTitle>
      {children}
    </ContentContainer>
  )
}

interface StateItemProps {
  node: S.State<any, any>
  highlight: boolean
}

function StateItem({ node, highlight }: StateItemProps) {
  return (
    <ContentItem
      title={`Zoom to ${node.name}`}
      onClick={() => projectState.send("SELECTED_NODE", { id: node.path })}
      onMouseEnter={(e) =>
        Highlights.send("HIGHLIT_STATE", {
          stateName: node.name,
          shiftKey: e.shiftKey,
          path: node.path,
        })
      }
      onMouseLeave={(e) => {
        Highlights.send("CLEARED_STATE_HIGHLIGHT", {
          stateName: node.name,
        })
      }}
    >
      <Button state={node.active ? "active" : "inactive"}>
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
  name: string
}

function EventItem({ name }: EventItemProps) {
  return (
    <ContentItem>
      <Button>{name}</Button>
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
  "&:hover": {
    bg: "$shadowLight",
  },
  svg: {
    mr: "$0",
  },
  variants: {
    state: {
      active: {
        opacity: 1,
      },
      inactive: {
        opacity: 0.5,
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
  return [state].concat(...Object.values(state.states).map(getFlatStates))
}

export function getAllEvents(state: S.State<any, any>): string[][] {
  const localEvents: string[][] = []

  localEvents.push(...Object.keys(state.on).map((k) => [state.name, k]))

  for (let child of Object.values(state.states)) {
    localEvents.push(...getAllEvents(child))
  }

  return localEvents
}

export function getEventsByState(events: string[][]): [string, string[]][] {
  const dict: Record<string, string[]> = {}

  for (let [stateName, event] of events) {
    const prior = dict[event]
    if (prior === undefined) {
      dict[event] = [stateName]
    } else {
      dict[event].push(stateName)
    }
  }

  return Object.entries(dict)
}

import { useStateDesigner } from "@state-designer/react"
import { DragHandleVertical } from "components/project/drag-handles"
import { IconButton, Select, Text, styled } from "components/theme"
import { animate } from "framer-motion"
import { motionValues, ui } from "lib/local-data"
import * as React from "react"
import { ChevronDown, ChevronUp } from "react-feather"
import payloadsState from "states/payloads"
import projectState from "states/project"
import { EventDetails } from "types"

const initialOffset = ui.panelOffsets.payloads

const AUTOEVENT_NAMES = ["onEnter", "onExit", "onEvent"]

export const PAYLOADS_ROW_HEIGHT = 40

interface PayloadsProps {}

export default function Payloads({}: PayloadsProps) {
  const local = useStateDesigner(projectState)
  const events = Object.entries(local.data.eventMap).filter(
    ([name]) => !AUTOEVENT_NAMES.includes(name),
  )

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

  const [expanded, setExpanded] = React.useState(
    PAYLOADS_ROW_HEIGHT - initialOffset > 40,
  )

  // Set exampled on initial mount (for hot reloads / concurrent)
  React.useEffect(() => {
    setExpanded(PAYLOADS_ROW_HEIGHT - initialOffset > 40)
  }, [])

  // When the motion value changes, update the expanded state if needed
  React.useEffect(() => {
    return motionValues.payloads.onChange((offset) => {
      const isAtMinHeight = PAYLOADS_ROW_HEIGHT - initialOffset - offset <= 40
      if (!expanded && !isAtMinHeight) {
        setExpanded(true)
      } else if (expanded && isAtMinHeight) {
        setExpanded(false)
      }
    })
  }, [expanded])

  // Animate the drag handle to the closed or open offset
  function toggleExpanded() {
    motionValues.payloads.stop()
    animate(
      motionValues.payloads,
      expanded ? -initialOffset : -280 - initialOffset,
      {
        type: "spring",
        damping: 40,
        stiffness: 440,
      },
    )
  }

  return (
    <PayloadsContainer>
      <ContentTitle>
        <Text variant="ui">Event Payloads</Text>
        <IconButton
          title={expanded ? "Collapse panel" : "Expand panel"}
          onClick={toggleExpanded}
        >
          {expanded ? <ChevronDown /> : <ChevronUp />}
        </IconButton>
      </ContentTitle>
      <Select
        css={SelectCss}
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
      <DragHandleVertical
        motionValue={motionValues.payloads}
        height={PAYLOADS_ROW_HEIGHT}
        top={400}
        bottom={PAYLOADS_ROW_HEIGHT - 40}
        offset="payloads"
        align="bottom"
      />
    </PayloadsContainer>
  )
}

const PayloadsContainer = styled.div({
  display: "grid",
  gridTemplateRows: "40px 40px 1fr",
  position: "relative",
  height: `calc(${PAYLOADS_ROW_HEIGHT}px - var(--payloads-offset))`,
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

const ContentTitle = styled.div({
  display: "flex",
  fontSize: "$1",
  alignItems: "center",
  bg: "$muted",
  p: "$1",
  pr: "$0",
  height: 40,
  color: "$text",
  borderBottom: "1px solid $shadow",
  whiteSpace: "nowrap",
  "& p": {
    flexGrow: 1,
  },
})

const SelectCss = {
  p: 0,
  mx: "$1",
  mr: "12px",
}

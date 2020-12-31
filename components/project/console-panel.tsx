import { createState, useStateDesigner } from "@state-designer/react"
import {
  IconButton,
  TabButton,
  TabsContainer,
  TitleRow,
  styled,
} from "components/theme"
import { animate } from "framer-motion"
import { motionValues, ui } from "lib/local-data"
import * as React from "react"
import { ChevronDown, ChevronUp, Copy } from "react-feather"
import consoleState from "states/console"
import toastState from "states/toast"

import { DragHandleVertical } from "./drag-handles"

const initialOffset = ui.panelOffsets.console

export const CONSOLE_ROW_HEIGHT = 320

interface ConsoleProps {}

export default function Console({}: ConsoleProps) {
  const local = useStateDesigner(consoleState)
  const { value } = local.values

  const [expanded, setExpanded] = React.useState(
    CONSOLE_ROW_HEIGHT - initialOffset > 40,
  )

  // Copy the editor's current text to the clipboard
  function copyCurrent() {
    const elm = document.createElement("textarea")
    document.body.appendChild(elm)
    elm.value = value
    elm.select()
    document.execCommand("copy")
    document.body.removeChild(elm)
    toastState.send("ADDED_TOAST", { message: "Copied to Clipboard" })
  }

  // Set exampled on initial mount (for hot reloads / concurrent)
  React.useEffect(() => {
    setExpanded(CONSOLE_ROW_HEIGHT - initialOffset > 40)
  }, [])

  // When the motion value changes, update the expanded state if needed
  React.useEffect(() => {
    return motionValues.console.onChange((offset) => {
      const isAtMinHeight = CONSOLE_ROW_HEIGHT - initialOffset - offset <= 40
      if (!expanded && !isAtMinHeight) {
        setExpanded(true)
      } else if (expanded && isAtMinHeight) {
        setExpanded(false)
      }
    })
  }, [expanded])

  // Animate the drag handle to the closed or open offset
  function toggleExpanded() {
    motionValues.console.stop()
    animate(
      motionValues.console,
      expanded ? CONSOLE_ROW_HEIGHT - 40 - initialOffset : -initialOffset,
      {
        type: "spring",
        damping: 40,
        stiffness: 440,
      },
    )
  }

  const rCodeScroll = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const elm = rCodeScroll.current!
    elm.scrollTo(0, elm.scrollHeight)
  }, [value])

  return (
    <ConsoleContainer>
      <TitleRow onDoubleClick={toggleExpanded}>
        <TabsContainer>
          <TabButton variant="details" title="Console" activeState={"active"}>
            Console
          </TabButton>
        </TabsContainer>
        <IconButton
          data-hidey="true"
          title="Copy to clipboard"
          onClick={copyCurrent}
        >
          <Copy />
        </IconButton>
        <IconButton
          title={expanded ? "Collapse panel" : "Expand panel"}
          onClick={toggleExpanded}
        >
          {expanded ? <ChevronDown /> : <ChevronUp />}
        </IconButton>
      </TitleRow>
      <CodeWrapper ref={rCodeScroll}>
        <pre>
          <code>{value}</code>
        </pre>
      </CodeWrapper>
      <DragHandleVertical
        motionValue={motionValues.console}
        height={CONSOLE_ROW_HEIGHT}
        top={300}
        bottom={CONSOLE_ROW_HEIGHT - 40}
        offset="console"
        align="bottom"
      />
    </ConsoleContainer>
  )
}

const ConsoleContainer = styled.div({
  display: "grid",
  position: "absolute",
  bottom: 0,
  height: `calc(${CONSOLE_ROW_HEIGHT}px - var(--console-offset))`,
  gridTemplateColumns: "minmax(0, 1fr)",
  gridTemplateRows: "auto 1fr",
  minWidth: 0,
  width: "calc(100% + 2px)",
  zIndex: 900,
  bg: "$codeBg",
})

const CodeWrapper = styled.div({
  display: "flex",
  alignItems: "flex-end",
  overflow: "scroll",
  "& pre": {
    bg: "$codeBg",
    p: "$2",
    m: 0,
  },
  "& code": {
    fontFamily: "$monospace",
    lineHeight: "$body",
    fontSize: "$1",
    fontWeight: 400,
  },
})

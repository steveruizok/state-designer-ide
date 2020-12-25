import * as React from "react"
import { animate } from "framer-motion"
import { createState, useStateDesigner } from "@state-designer/react"
import {
  styled,
  IconButton,
  TabButton,
  TabsContainer,
  TitleRow,
} from "components/theme"
import { Copy, ChevronDown, ChevronUp } from "react-feather"
import { DragHandleVertical } from "./drag-handles"
import { ui, motionValues } from "lib/local-data"
import toastState from "states/toast"

export const consoleState = createState({
  data: {
    logs: [] as string[],
  },
  on: {
    LOGGED: "addLog",
    RESET: "clearLogs",
  },
  actions: {
    addLog(data, payload: { source: string; message: string }) {
      data.logs.push("› " + payload.message)
    },
    clearLogs(data) {
      data.logs = []
    },
  },
})

const initialOffset = ui.panelOffsets.console

export const CONSOLE_ROW_HEIGHT = 320

interface ConsoleProps {}

export default function Console({}: ConsoleProps) {
  const local = useStateDesigner(consoleState)
  const [expanded, setExpanded] = React.useState(
    CONSOLE_ROW_HEIGHT - initialOffset > 40,
  )

  const { logs } = local.data
  const code = logs.join("\n")

  // Copy the editor's current text to the clipboard
  function copyCurrent() {
    const elm = document.createElement("textarea")
    document.body.appendChild(elm)
    elm.value = code
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

  return (
    <ConsoleContainer>
      <TitleRow>
        <TabsContainer>
          <TabButton
            variant="details"
            activeState={"active"}
            onDoubleClick={toggleExpanded}
          >
            Console
          </TabButton>
        </TabsContainer>
        <IconButton data-hidey="true" onClick={copyCurrent}>
          <Copy />
        </IconButton>
        <IconButton onClick={toggleExpanded}>
          {expanded ? <ChevronDown /> : <ChevronUp />}
        </IconButton>
      </TitleRow>
      <CodeContainer>
        <code>{code}</code>
      </CodeContainer>
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
  zIndex: 99,
})

const CodeContainer = styled.pre({
  overflow: "scroll",
  bg: "$codeBg",
  p: "$2",
  m: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  "& code": {
    fontFamily: "$monospace",
    lineHeight: "$body",
    fontSize: 13,
    fontWeight: 400,
  },
})

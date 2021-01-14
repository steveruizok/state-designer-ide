import * as React from "react"

import { AlignLeft, ChevronDown, ChevronUp, Copy } from "react-feather"
import {
  IconButton,
  TabButton,
  TabsContainer,
  TitleRow,
  styled,
} from "components/theme"
import { motionValues, saveWrapDetails, ui } from "lib/local-data"

import { DragHandleVertical } from "./drag-handles"
import { animate } from "framer-motion"
import projectState from "states/project"
import toastState from "states/toast"
import { useStateDesigner } from "@state-designer/react"

interface DetailsProps {}

const initialOffset = ui.panelOffsets.detail

export const DETAILS_ROW_HEIGHT = 320

export default function Details({}: DetailsProps) {
  const local = useStateDesigner(projectState)
  const captive = useStateDesigner(local.data.captive)
  const [expanded, setExpanded] = React.useState(
    DETAILS_ROW_HEIGHT - initialOffset > 40,
  )
  const [activeTab, setActiveTab] = React.useState(ui.details.activeTab)
  const [isWrapped, setIsWrapped] = React.useState(ui.details.wrap)
  const rCodeScroll = React.useRef<HTMLDivElement>(null)
  const code = JSON.stringify(
    activeTab === "data" ? captive.data : captive.values,
    null,
    2,
  )

  // Handle editor changes when the user changes tabs
  function handleTabChange(tab: "data" | "values") {
    setActiveTab(tab)
  }

  // Toggle whether the editor should wrap its content
  function toggleWrap() {
    setIsWrapped(!isWrapped)
    saveWrapDetails(!isWrapped)
  }

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

  function handleHeightChange(offset: number) {
    const isAtMinHeight = DETAILS_ROW_HEIGHT - initialOffset - offset <= 40
    if (!expanded && !isAtMinHeight) {
      setExpanded(true)
    } else if (expanded && isAtMinHeight) {
      setExpanded(false)
    }
  }

  // Set exampled on initial mount (for hot reloads / concurrent)
  React.useEffect(() => {
    handleHeightChange(motionValues.detail.get())
  }, [])

  // When the motion value changes, update the expanded state if needed
  React.useEffect(() => {
    return motionValues.detail.onChange(handleHeightChange)
  }, [expanded])

  // Animate the drag handle to the closed or open offset
  function toggleExpanded() {
    motionValues.detail.stop()
    animate(
      motionValues.detail,
      expanded ? DETAILS_ROW_HEIGHT - 40 - initialOffset : -initialOffset,
      {
        type: "spring",
        damping: 40,
        stiffness: 440,
      },
    )
  }

  return (
    <DetailsContainer>
      <TitleRow onDoubleClick={toggleExpanded}>
        <TabsContainer>
          <TabButton
            variant="details"
            title="Details"
            activeState={activeTab === "data" ? "active" : "inactive"}
            onClick={() => handleTabChange("data")}
          >
            Data
          </TabButton>
          <TabButton
            variant="details"
            title="Values"
            activeState={activeTab === "values" ? "active" : "inactive"}
            onClick={() => handleTabChange("values")}
          >
            Values
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
          data-hidey="true"
          title="Toggle word wrap"
          onClick={toggleWrap}
        >
          <AlignLeft />
        </IconButton>
        <IconButton
          title={expanded ? "Collapse panel" : "Expand panel"}
          onClick={toggleExpanded}
        >
          {expanded ? <ChevronDown /> : <ChevronUp />}
        </IconButton>
      </TitleRow>
      <CodeWrapper ref={rCodeScroll} wrap={isWrapped}>
        <pre>
          <code>{code}</code>
        </pre>
      </CodeWrapper>
      <DragHandleVertical
        motionValue={motionValues.detail}
        height={DETAILS_ROW_HEIGHT}
        top={300}
        bottom={DETAILS_ROW_HEIGHT - 40}
        offset="detail"
        align="bottom"
      />
    </DetailsContainer>
  )
}

const DetailsContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gridTemplateRows: "auto 1fr",
  gridArea: "details",
  minWidth: 0,
  position: "relative",
  borderRight: "2px solid $border",
  bg: "$codeBg",
})

const CodeWrapper = styled.div({
  display: "flex",
  overflowX: "scroll",
  overflowY: "scroll",
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
  variants: {
    wrap: {
      true: {
        "& pre": {
          whiteSpace: "pre-wrap",
        },
      },
    },
  },
})

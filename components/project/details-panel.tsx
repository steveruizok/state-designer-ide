import * as React from "react"
import { animate } from "framer-motion"
import { useStateDesigner } from "@state-designer/react"
import { useFile, useMonacoContext } from "use-monaco"
import useCustomEditor from "hooks/useCustomEditor"
import {
  styled,
  IconButton,
  TabsContainer,
  TabButton,
  TitleRow,
} from "components/theme"
import useTheme from "hooks/useTheme"
import { Copy, AlignLeft, ChevronDown, ChevronUp } from "react-feather"
import projectState from "states/project"
import { DragHandleVertical } from "./drag-handles"
import { ui, saveWrapDetails, motionValues } from "lib/local-data"
import toastState from "states/toast"
import useMotionResizeObserver from "use-motion-resize-observer"

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
  const [viewStates, setViewStates] = React.useState<Record<string, any>>({
    data: null,
    view: null,
  })

  const { monaco } = useMonacoContext()

  const dataModel = useFile({
    path: "data.json",
    monaco,
    defaultContents: JSON.stringify(captive.data, null, 2),
    language: "json",
  })

  const valuesModel = useFile({
    path: "values.json",
    monaco,
    defaultContents: JSON.stringify(captive.values, null, 2),
    language: "json",
  })

  const { editor, containerRef } = useCustomEditor(
    monaco,
    dataModel,
    true,
    isWrapped,
    (editor) => {
      setTimeout(() => {
        editor.setSelection(new monaco.Selection(0, 0, 0, 0))
      }, 1000)
    },
    () => editor.setSelection(new monaco.Selection(0, 0, 0, 0)),
  )

  // Handle editor changes when the user changes tabs
  function handleTabChange(tab: "data" | "values") {
    // Save the viewstate
    setViewStates({
      ...viewStates,
      [activeTab]: editor.saveViewState(),
    })

    // Set the new model
    if (tab === "data") {
      editor.setModel(dataModel)
    } else if (tab === "values") {
      editor.setModel(valuesModel)
    }

    // Restore view state
    if (viewStates[tab]) {
      editor.restoreViewState(viewStates[tab])
    }

    // Update the state
    setActiveTab(tab)
  }

  // Toggle whether the editor should wrap its content
  function toggleWrap() {
    setIsWrapped(!isWrapped)
    saveWrapDetails(!isWrapped)
  }

  // Copy the editor's current text to the clipboard
  function copyCurrent() {
    const code = editor.getModel().getValue()
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
    setExpanded(DETAILS_ROW_HEIGHT - initialOffset > 40)
  }, [])

  // When the motion value changes, update the expanded state if needed
  React.useEffect(() => {
    return motionValues.detail.onChange((offset) => {
      const isAtMinHeight = DETAILS_ROW_HEIGHT - initialOffset - offset <= 40
      if (!expanded && !isAtMinHeight) {
        setExpanded(true)
      } else if (expanded && isAtMinHeight) {
        setExpanded(false)
      }
    })
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
      <TitleRow>
        <TabsContainer>
          <TabButton
            variant="details"
            activeState={activeTab === "data" ? "active" : "inactive"}
            onClick={() => handleTabChange("data")}
            onDoubleClick={toggleExpanded}
          >
            Data
          </TabButton>
          <TabButton
            variant="details"
            activeState={activeTab === "values" ? "active" : "inactive"}
            onClick={() => handleTabChange("values")}
            onDoubleClick={toggleExpanded}
          >
            Values
          </TabButton>
        </TabsContainer>
        <IconButton data-hidey="true" onClick={copyCurrent}>
          <Copy />
        </IconButton>
        <IconButton
          data-hidey={isWrapped ? "false" : "true"}
          onClick={toggleWrap}
        >
          <AlignLeft />
        </IconButton>
        <IconButton onClick={toggleExpanded}>
          {expanded ? <ChevronDown /> : <ChevronUp />}
        </IconButton>
      </TitleRow>
      <CodeContainer ref={containerRef} />
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
  borderLeft: "2px solid $border",
  borderRight: "2px solid $border",
})

const CodeContainer = styled.div({
  overflow: "hidden",
})

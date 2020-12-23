import * as React from "react"
import debounce from "lodash/debounce"
import { useStateDesigner } from "@state-designer/react"
import { useMonacoEditor } from "use-monaco"
import { styled, IconButton, TabButton, Text, TitleRow } from "components/theme"
import { Copy, AlignLeft } from "react-feather"
import projectState from "./state"
import { DragHandleVertical } from "./drag-handles"
import { ui, setWrapDetails } from "lib/local-data"
import useMotionResizeObserver from "use-motion-resize-observer"

interface DetailsProps {}

export const DETAILS_ROW_HEIGHT = 320

export default function Details({}: DetailsProps) {
  const local = useStateDesigner(projectState)
  const captive = useStateDesigner(local.data.captive)
  const rTimeout = React.useRef<any>()
  const [isWrapped, setIsWrapped] = React.useState(ui.wrapDetails)
  const [justCopied, setJustCopied] = React.useState(false)

  const { containerRef, editor } = useMonacoEditor({
    defaultContents: JSON.stringify(captive.data, null, 2),
    theme: "vs-light",
    plugins: {
      prettier: ["json"],
    },
    options: {
      fontSize: 13,
      showUnused: false,
      quickSuggestions: false,
      fontFamily: "Fira Code",
      fontWeight: "500",
      minimap: { enabled: false },
      smoothScrolling: true,
      lineDecorationsWidth: 4,
      fontLigatures: true,
      cursorBlinking: "smooth",
      lineNumbers: "off",
      wordWrap: isWrapped ? "on" : "off",
      scrollBeyondLastLine: false,
      readOnly: true,
      glyphMargin: false,
      lightbulb: { enabled: false },
      lineNumbersMinChars: 0,
    },
    language: "json",
    editorDidMount: (editor, monaco) => {
      editor.onKeyDown((e) => {
        if (e.metaKey) {
          if (e.code === "KeyA") {
            const range = editor.getModel().getFullModelRange()
            editor.setSelection(range)
          }
        }
      })
    },
  })

  const resizeEditor = React.useCallback(
    debounce(() => {
      console.log("resizing")
      editor?.layout()
    }, 48),
    [editor],
  )

  const { ref: resizeRef } = useMotionResizeObserver<HTMLDivElement>({
    onResize: () => resizeEditor(),
  })

  function toggleWrap() {
    setIsWrapped(!isWrapped)
    setWrapDetails(!isWrapped)
  }

  function copyCurrent() {
    const code = editor.getModel().getValue()
    const elm = document.createElement("input")
    elm.value = code
    elm.select()
    document.execCommand("copy")
    elm.remove()
    setJustCopied(true)
    rTimeout.current = setTimeout(() => setJustCopied(false), 1000)
  }

  React.useEffect(() => {
    return () => clearTimeout(rTimeout.current)
  }, [])

  return (
    <DetailsContainer ref={resizeRef}>
      <TitleRow>
        <TabButton>Data</TabButton>
        <TabButton>Values</TabButton>
        <IconButton data-hidey="true" onClick={copyCurrent}>
          <Copy />
        </IconButton>
        <IconButton data-hidey="true" onClick={toggleWrap}>
          <AlignLeft />
        </IconButton>
      </TitleRow>
      <CodeContainer ref={containerRef} />
      <DragHandleVertical
        height={DETAILS_ROW_HEIGHT}
        top={300}
        bottom={DETAILS_ROW_HEIGHT - 40}
        offset="detail"
        align="bottom"
        onMove={resizeEditor}
      />
    </DetailsContainer>
  )
}

const DetailsContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "auto 1fr",
  gridArea: "details",
  position: "relative",
  borderTop: "2px solid $border",
  borderRight: "2px solid $border",
  overflowX: "hidden",
})

const CodeContainer = styled.div({
  overflow: "hidden",
})

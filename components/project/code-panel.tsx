import { useStateDesigner } from "@state-designer/react"
import { IconButton, TabButton, styled } from "components/theme"
import useCustomEditor from "hooks/useCustomEditor"
import { motionValues, ui } from "lib/local-data"
import {
  useMonacoContext,
  useTextModel,
} from "node_modules/use-monaco/dist/cjs/use-monaco"
import * as React from "react"
import { AlertCircle, RefreshCcw, Save } from "react-feather"
import codePanelState from "states/code-panel"
import highlightsState from "states/highlights"
import projectState from "states/project"
import { CodeEditorTab } from "types"

import { DragHandleHorizontal } from "./drag-handles"
import { CODE_COL_WIDTH } from "./index"

interface CodePanelProps {
  uid?: string
  pid: string
  oid: string
}

export default function CodePanel({ uid, pid, oid }: CodePanelProps) {
  // Local state
  const local = useStateDesigner(codePanelState)

  const { monaco } = useMonacoContext()

  const stateModel = useTextModel({
    path: "state.tsx",
    monaco,
    defaultContents: "",
    language: "typescript",
  })

  const viewModel = useTextModel({
    path: "view.tsx",
    monaco,
    defaultContents: "",
    language: "typescript",
  })

  const staticModel = useTextModel({
    path: "static.tsx",
    monaco,
    defaultContents: "",
    language: "typescript",
  })

  const { editor, containerRef } = useCustomEditor(
    monaco,
    stateModel,
    oid !== uid,
    false,
    undefined,
    (code) => {
      local.send("CHANGED_CODE", { code, oid, pid })
    },
  )

  // Highlights
  const rPreviousDecorations = React.useRef<any[]>([])

  // Subscribe to highlights state
  React.useEffect(() => {
    return highlightsState.onUpdate(
      ({ data: { state, event, scrollToLine } }) => {
        if (local.data.activeTab !== "state") return
        if (!editor) return
        const previous = rPreviousDecorations.current
        const search = state || event
        const code = editor.getValue()

        if (search === null) {
          rPreviousDecorations.current = editor.deltaDecorations(previous, [])
        } else {
          const searchString = search + ":"
          const lines = code.split("\n")
          const ranges: number[][] = []

          if (searchString === "root:") {
            ranges[0] = [0, 1, lines.length - 1, 1]
          } else {
            let rangeIndex = 0,
              startSpaces = 0,
              state = "searchingForStart"

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i]
              if (state === "searchingForStart") {
                if (line.includes(" " + searchString)) {
                  startSpaces = line.search(/\S/)
                  state = "searchingForEnd"
                  ranges[rangeIndex] = [i + 1, 1]
                }
              } else if (state === "searchingForEnd") {
                if (i === 0) continue
                const spaces = line.search(/\S/)
                const range = ranges[rangeIndex]

                if (spaces <= startSpaces) {
                  range.push(spaces < startSpaces || i === range[0] ? i : i + 1)
                  range.push(1)
                  rangeIndex++
                  state = "searchingForStart"
                }
              }
            }
          }

          const hlRanges = ranges.map(([a, b, c, d]) => ({
            range: new monaco.Range(a, b, c, d),
            options: {
              isWholeLine: true,
              linesDecorationsClassName: "lineCodeHighlight",
              inlineClassName: "inlineCodeHighlight",
              marginClassName: "marginCodeHighlight",
            },
          }))

          if (scrollToLine && hlRanges.length > 0) {
            editor.revealLineInCenter(hlRanges[0].range.startLineNumber - 1, 0)
          }

          const decorations = editor.deltaDecorations(previous, hlRanges)

          rPreviousDecorations.current = decorations
        }
      },
    )
  }, [editor, monaco])

  // Setup save action and load up the state machine
  React.useEffect(() => {
    if (!(monaco && editor)) return

    editor.onKeyDown((e) => {
      if (e.metaKey) {
        if (e.code === "KeyS") {
          e.preventDefault()
          if (error) return
          if (uid !== oid) return // Unsafe!

          editor
            .getAction("editor.action.formatDocument")
            .run()
            .then(() => local.send("SAVED_CODE"))
        }
      }
    })

    local.send("LOADED", {
      monaco,
      editor,
      models: {
        state: stateModel,
        view: viewModel,
        static: staticModel,
      },
      activeTab: ui.code.activeTab,
    })
  }, [monaco, editor])

  const { code } = local.data

  const activeTab: CodeEditorTab = local.whenIn({
    "tab.state": "state",
    "tab.view": "view",
    "tab.static": "static",
    default: "state",
  })

  const error = code[activeTab].error
  const dirty = local.isIn("hasChanges")

  React.useEffect(() => {
    // return projectState.onUpdate((update) => {
    monaco.languages.typescript?.exposeGlobal(
      `import { createState as _createState } from 'state-designer';`,

      `
        const _state = _${local.data.code.state.clean}
        
        export const state: typeof _state;
      `,
    )
    // })
  }, [local.data.code.state.clean])

  return (
    <CodeContainer>
      <Tabs>
        <TabButton
          onClick={() => local.send("SELECTED_STATE_TAB")}
          variant="code"
          activeState={local.isIn("tab.state") ? "active" : "inactive"}
          codeState={code.state.clean === code.state.dirty ? "clean" : "dirty"}
        >
          State
        </TabButton>
        <TabButton
          onClick={() => local.send("SELECTED_VIEW_TAB")}
          variant="code"
          activeState={local.isIn("tab.view") ? "active" : "inactive"}
          codeState={code.view.clean === code.view.dirty ? "clean" : "dirty"}
        >
          View
        </TabButton>
        <TabButton
          onClick={() => local.send("SELECTED_STATIC_TAB")}
          variant="code"
          activeState={local.isIn("tab.static") ? "active" : "inactive"}
          codeState={
            code.static.clean === code.static.dirty ? "clean" : "dirty"
          }
        >
          Static
        </TabButton>
      </Tabs>
      <EditorContainer
        ref={containerRef}
        visibility={local.isIn("loading") ? "hidden" : "visible"}
      />
      <CodeEditorControls>
        <ErrorMessage>
          {error && (
            <>
              <AlertCircle size={16} />
              {error}
            </>
          )}
        </ErrorMessage>
        <IconButton disabled={!dirty} onClick={() => local.send("RESET_CODE")}>
          <RefreshCcw />
        </IconButton>
        <IconButton
          disabled={!local.can("SAVED_CODE")}
          onClick={async () => {
            if (error) return
            if (uid !== oid) return // Unsafe!

            editor
              .getAction("editor.action.formatDocument")
              .run()
              .then(() => {
                const code = editor.getValue()
                local.send("SAVED_CODE", { code, oid, pid })
              })
          }}
        >
          <Save />
        </IconButton>
      </CodeEditorControls>
      <DragHandleHorizontal
        motionValue={motionValues.code}
        align="right"
        width={CODE_COL_WIDTH}
        left={300}
        right={280}
        offset="code"
      />
    </CodeContainer>
  )
}

const CodeContainer = styled.div({
  position: "relative",
  gridArea: "code",
  display: "grid",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  gridTemplateColumns: "minmax(0, 1fr)",
  gridTemplateRows: `40px 1fr 40px`,
  borderTop: "2px solid $border",
  borderLeft: "2px solid $border",
  overflow: "hidden",
})

const EditorContainer = styled.div({
  borderBottom: "2px solid $border",
  variants: {
    visibility: {
      hidden: {
        pointerEvents: "none",
        userSelect: "none",
        opacity: 0.1,
      },
      visible: {
        opacity: 1,
      },
    },
  },
  ".inlineCodeHighlight": {
    "&::after": {
      content: "''",
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      width: "100%",
      bg: "$codeHl",
      zIndex: -1,
    },
  },
  ".marginCodeHighlight": {
    bg: "$codeHl",
    position: "relative",
  },
})

const CodeEditorControls = styled.div({
  height: 40,
  bg: "$muted",
  display: "grid",
  gridTemplateColumns: "1fr auto auto",
  gridAutoFlow: "column",
  alignItems: "center",
})

const ErrorMessage = styled.div({
  px: "$1",
  flexGrow: 2,
  display: "flex",
  alignItems: "center",
  fontSize: "$0",
  color: "$Red",
  overflow: "hidden",
  whiteSpace: "nowrap",
  borderRadius: 4,
  svg: {
    mr: "$1",
  },
})

const Tabs = styled.div({
  overflow: "hidden",
  display: "flex",
  bg: "$muted",
  borderBottom: "1px solid $shadow",
  p: "$0",
})

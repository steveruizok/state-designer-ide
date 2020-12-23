// @refresh reset
import * as React from "react"
import prettier from "prettier/standalone"
import parser from "prettier/parser-typescript"
import debounce from "lodash/debounce"
import { styled, IconButton, TabButton } from "components/theme"
import { Save, RefreshCcw, AlertCircle } from "react-feather"
import { useMonaco, useEditor, useFile } from "use-monaco"
import themes from "use-monaco/themes"
import { CodeEditorTab } from "types"
import { DragHandleHorizontal } from "./drag-handles"
import { CODE_COL_WIDTH } from "./index"
import { useStateDesigner, createState } from "@state-designer/react"
import { saveProjectCode } from "lib/database"
import { ui, saveCodeTab, motionValues } from "lib/local-data"
import { codeValidators, codeFormatValidators } from "lib/eval"
import { Highlights } from "components/project/highlights"
import useMotionResizeObserver from "use-motion-resize-observer"

const EDITOR_TABS = ["state", "view", "static"]

export const codePanelState = createState({
  data: {
    activeTab: "state" as CodeEditorTab,
    monaco: null as any,
    editor: null as any,
    models: {
      state: null as any,
      view: null as any,
      static: null as any,
    },
    viewStates: {
      state: {
        clean: null as any,
        dirty: null as any,
      },
      view: {
        clean: null as any,
        dirty: null as any,
      },
      static: {
        clean: null as any,
        dirty: null as any,
      },
    },
    code: {
      state: {
        dirty: "",
        clean: "",
        error: "",
      },
      view: {
        dirty: "",
        clean: "",
        error: "",
      },
      static: {
        dirty: "",
        clean: "",
        error: "",
      },
    },
  },
  on: {
    LOADED: "loadData",
    UNLOADED: { to: ["loading", "noError"] },
    SOURCE_UPDATED: ["updateFromDatabase"],
    CHANGED_CODE: { secretlyDo: "updateDirtyCode" },
    RESET_CODE: ["resetCode", "restoreActiveTabCleanViewState"],
  },
  states: {
    error: {
      initial: "noError",
      states: {
        noError: {
          on: {
            CHANGED_CODE: {
              if: "errorInCurrentTab",
              to: "hasError",
            },
            SAVED_CODE: ["saveCode", "saveCurrentCleanViewState"],
          },
        },
        hasError: {
          on: {
            CHANGED_CODE: {
              unless: "errorInCurrentTab",
              to: "noError",
            },
          },
        },
      },
    },
    tab: {
      initial: "loading",
      states: {
        loading: {
          on: {
            SOURCE_LOADED: [
              {
                unless: "hasEditor",
                break: true,
              },
              "initialLoadFromDatabase",
              "updateModels",
              {
                if: "initialTabIsState",
                to: "state",
              },
              {
                if: "initialTabIsView",
                to: "view",
              },
              {
                if: "initialTabIsStatic",
                to: "static",
              },
            ],
          },
        },
        state: {
          onEnter: [
            "setStateActiveTab",
            "restoreActiveTabDirtyViewState",
            {
              if: "errorInCurrentTab",
              to: "hasError",
              else: { to: "noError" },
            },
          ],
          onExit: "saveCurrentViewState",
          on: {
            SELECTED_VIEW_TAB: { to: "tab.view" },
            SELECTED_STATIC_TAB: { to: "tab.static" },
          },
        },
        view: {
          onEnter: [
            "setViewActiveTab",
            "restoreActiveTabDirtyViewState",
            {
              if: "errorInCurrentTab",
              to: "hasError",
              else: { to: "noError" },
            },
          ],
          onExit: "saveCurrentViewState",
          on: {
            SELECTED_STATE_TAB: { to: "tab.state" },
            SELECTED_STATIC_TAB: { to: "tab.static" },
          },
        },
        static: {
          onEnter: [
            "setStaticActiveTab",
            "restoreActiveTabDirtyViewState",
            {
              if: "errorInCurrentTab",
              to: "hasError",
              else: { to: "noError" },
            },
          ],
          onExit: "saveCurrentViewState",
          on: {
            SELECTED_STATE_TAB: { to: "tab.state" },
            SELECTED_VIEW_TAB: { to: "tab.view" },
          },
        },
      },
    },
  },
  conditions: {
    initialTabIsState(_, payload) {
      return ui.code.activeTab === "state"
    },
    initialTabIsView(_, payload) {
      return ui.code.activeTab === "view"
    },
    initialTabIsStatic(_, payload) {
      return ui.code.activeTab === "static"
    },
    errorInCurrentTab(data) {
      return data.code[data.activeTab].error !== ""
    },
    hasEditor(data) {
      return !!data.editor
    },
    noStateError(data) {
      return data.code.state.error === ""
    },
    noViewError(data) {
      return data.code.view.error === ""
    },
    noStaticError(data) {
      return data.code.static.error === ""
    },
  },
  actions: {
    // Data
    loadData(data, payload = {}) {
      const { monaco, editor, models } = payload
      data.models = models
      data.monaco = monaco
      data.editor = editor
    },
    initialLoadFromDatabase(data, payload = {}) {
      EDITOR_TABS.forEach((tab) => {
        data.code[tab].clean = payload[tab]
        data.code[tab].dirty = payload[tab]
      })
    },
    updateFromDatabase(data, payload = {}) {
      EDITOR_TABS.forEach((tab) => {
        data.code[tab].clean = payload[tab]
      })
    },
    updateModels(data) {
      EDITOR_TABS.forEach((tab) => {
        data.models[tab].setValue(data.code[tab].clean)
      })
    },
    updateCleanViewStates(data) {
      EDITOR_TABS.forEach((tab) => {
        data.viewStates[tab].clean.setValue(data.code[tab].clean)
      })
    },
    setStateActiveTab(data) {
      data.activeTab = "state"
      saveCodeTab("state")
    },
    setViewActiveTab(data) {
      data.activeTab = "view"
      saveCodeTab("view")
    },
    setStaticActiveTab(data) {
      data.activeTab = "static"
      saveCodeTab("static")
    },
    saveCurrentCleanViewState(data) {
      const { viewStates, activeTab, editor } = data
      viewStates[activeTab].dirty = editor.saveViewState()
    },
    saveCurrentViewState(data) {
      const { activeTab, editor, viewStates } = data
      viewStates[activeTab].dirty = editor.saveViewState()
    },
    restoreActiveTabDirtyViewState(data) {
      const { activeTab, editor, models, viewStates } = data
      editor.setModel(models[activeTab])
      editor.focus()
      editor.restoreViewState(viewStates[activeTab].dirty)
    },
    restoreActiveTabCleanViewState(data) {
      const { activeTab, editor, models, viewStates } = data
      editor.setModel(models[activeTab])
      editor.focus()
      editor.restoreViewState(viewStates[activeTab].clean)
    },
    updateDirtyCode(data, payload: { code: string }) {
      const { models, code, activeTab } = data
      if (!codeFormatValidators[activeTab](payload.code)) {
        models[activeTab].undo()
      } else {
        code[activeTab].dirty = payload.code
        const validator = codeValidators[activeTab]
        if (validator) {
          code[activeTab].error = validator(
            code[activeTab].dirty,
            code.static.dirty,
          )
        }
      }
    },
    setErrorInCurrentTab(data) {
      const { activeTab } = data
      data.code[activeTab].error = data.code[activeTab].error
    },
    resetCode(data) {
      const { code, activeTab, models } = data
      const model = models[activeTab]
      model.setValue(code[activeTab].clean)
    },
    saveCode(data, payload: { oid: string; pid: string }) {
      const { activeTab } = data
      const { oid, pid } = payload
      saveProjectCode(pid, oid, activeTab, data.code[activeTab].dirty)
    },
  },
})

interface CodePanelProps {
  uid?: string
  pid: string
  oid: string
}

export default function CodePanel({ uid, pid, oid }: CodePanelProps) {
  // Local state
  const local = useStateDesigner(codePanelState)

  const { monaco } = useMonaco({
    plugins: {
      prettier: ["typescript"],
      typings: true,
      theme: { themes },
    },
    theme: "vs-light",
  })

  const stateModel = useFile({
    path: "state.js",
    monaco,
    defaultContents: "",
    language: "typescript",
  })

  const viewModel = useFile({
    path: "view.js",
    monaco,
    defaultContents: "",
    language: "typescript",
  })

  const staticModel = useFile({
    path: "static.js",
    monaco,
    defaultContents: "",
    language: "typescript",
  })

  const { editor, containerRef } = useEditor({
    monaco,
    model: stateModel,
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
      scrollBeyondLastLine: false,
    },
    editorDidMount: (editor) => {
      editor.updateOptions({
        readOnly: oid !== uid,
      })
    },
    onChange: (code) => local.send("CHANGED_CODE", { code }),
  })

  // Highlights
  const rPreviousDecorations = React.useRef<any[]>([])

  // Subscribe to highlights state
  React.useEffect(() => {
    return Highlights.onUpdate(({ data: { state, event, scrollToLine } }) => {
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
            inlineClassName: "inlineCodeHighlight",
            marginClassName: "lineCodeHighlight",
          },
        }))

        if (scrollToLine && hlRanges.length > 0) {
          editor.revealLineInCenter(hlRanges[0].range.startLineNumber - 1, 0)
        }

        const decorations = editor.deltaDecorations(previous, hlRanges)

        rPreviousDecorations.current = decorations
      }
    })
  }, [editor, monaco])

  // Resizing
  const resizeEditor = React.useCallback(
    debounce(() => {
      editor?.layout()
    }, 48),
    [editor],
  )

  const { ref: resizeRef } = useMotionResizeObserver<HTMLDivElement>({
    onResize: () => resizeEditor(),
  })

  React.useEffect(() => {
    if (!(monaco && editor)) return

    // setup prettier formatter
    const prettierFormatter = {
      provideDocumentFormattingEdits(model) {
        try {
          const text = prettier.format(model.getValue(), {
            parser: "typescript",
            plugins: [parser],
            semi: false,
            trailingComma: "es5",
            tabWidth: 2,
          })

          const range = model.getFullModelRange()

          return [{ range, text }]
        } catch (e) {
          return []
        }
      },
    }
    monaco.languages.registerDocumentFormattingEditProvider(
      "javascript",
      prettierFormatter,
    )
    monaco.languages.registerDocumentFormattingEditProvider(
      "typescript",
      prettierFormatter,
    )

    editor.onKeyDown((e) => {
      if (e.metaKey) {
        if (e.code === "KeyS") {
          e.preventDefault()
          if (error) return
          if (uid !== oid) return // Unsafe!

          editor
            .getAction("editor.action.formatDocument")
            .run()
            .then(() => {
              const code = editor.getValue()
              local.send("SAVED_CODE", { code, oid, pid })
            })
        } else if (e.code === "KeyA") {
          const range = editor.getModel().getFullModelRange()
          editor.setSelection(range)
        }
      }
    })

    // Load up the state machine
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

  React.useEffect(() => {
    if (editor) {
      editor.updateOptions({
        readOnly: oid !== uid,
      })
    }
  }, [editor, oid, uid])

  const { code } = local.data

  const activeTab: CodeEditorTab = local.whenIn({
    "tab.state": "state",
    "tab.view": "view",
    "tab.static": "static",
    default: "state",
  })

  const error = code[activeTab].error
  const dirty = code[activeTab].dirty !== code[activeTab].clean

  return (
    <CodeContainer ref={resizeRef}>
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
})

const EditorContainer = styled.div({
  overflow: "hidden",
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
    py: "2px",
    px: 0,
    bg: "$codeHl",
    fontWeight: "bold",
  },
  ".lineCodeHighlight": {
    bg: "$codeHl",
  },
})

const CodeEditorControls = styled.div({
  borderTop: "2px solid $border",
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

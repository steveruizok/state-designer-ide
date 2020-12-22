// @refresh reset
import * as React from "react"
import debounce from "lodash/debounce"
import { styled, IconButton } from "components/theme"
import { Save, RefreshCcw, AlertCircle } from "react-feather"
import { useMonacoEditor, useMonaco, useEditor, useFile } from "use-monaco"
import themes from "use-monaco/themes"
import { DragHandleHorizontal } from "./drag-handles"
import { projectState, CODE_COL_WIDTH } from "./index"
import { useStateDesigner, createState } from "@state-designer/react"
import {
  saveProjectStateCode,
  saveProjectViewCode,
  saveProjectStaticCode,
} from "lib/database"

export const codePanelState = createState({
  data: {
    monaco: null as any,
    editor: null as any,
    models: {
      state: null as any,
      view: null as any,
      static: null as any,
    },
    viewStates: {
      state: null as any,
      view: null as any,
      static: null as any,
    },
    code: {
      state: {
        dirty: "",
        clean: "",
        error: "",
        unsaved: false,
      },
      view: {
        dirty: "",
        clean: "",
        error: "",
        unsaved: false,
      },
      static: {
        dirty: "",
        clean: "",
        error: "",
        unsaved: false,
      },
    },
  },
  on: {
    LOADED: "loadData",
    RESIZED_PANEL: "resizeEditor",
    SOURCE_UPDATED: ["updateFromDatabase"],
  },
  states: {
    tab: {
      initial: "loading",
      states: {
        loading: {
          on: {
            SOURCE_LOADED: {
              if: "hasEditor",
              do: ["initialLoadFromDatabase", "updateModels", "formatEditor"],
              to: "state",
            },
          },
        },
        state: {
          onEnter: ["loadStateTabViewState", "formatEditor"],
          onExit: "saveStateTabViewState",
          on: {
            SELECTED_VIEW_TAB: { to: "tab.view" },
            SELECTED_STATIC_TAB: { to: "tab.static" },
            CHANGED_CODE: { do: ["updateStateDirtyCode"] },
            SAVED_CODE: { if: "noStateError", do: "saveStateCode" },
          },
        },
        view: {
          onEnter: ["loadViewTabViewState", "formatEditor"],
          onExit: "saveViewTabViewState",
          on: {
            SELECTED_STATE_TAB: { to: "tab.state" },
            SELECTED_STATIC_TAB: { to: "tab.static" },
            CHANGED_CODE: { do: ["updateViewDirtyCode"] },
            SAVED_CODE: { if: "noViewError", do: "saveViewCode" },
          },
        },
        static: {
          onEnter: ["loadStaticTabViewState", "formatEditor"],
          onExit: "saveStaticTabViewState",
          on: {
            SELECTED_STATE_TAB: { to: "tab.state" },
            SELECTED_VIEW_TAB: { to: "tab.view" },
            CHANGED_CODE: { do: ["updateStaticDirtyCode"] },
            SAVED_CODE: { if: "noStaticError", do: "saveStaticCode" },
          },
        },
      },
    },
  },
  conditions: {
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
    initialLoadFromDatabase(data, { source }) {
      data.code.state.clean = JSON.parse(source.code)
      data.code.state.dirty = data.code.state.clean
      data.code.view.clean = JSON.parse(source.jsx)
      data.code.view.dirty = data.code.view.clean
      data.code.static.clean = JSON.parse(source.statics)
      data.code.static.dirty = data.code.static.clean
    },
    updateFromDatabase(data, { source }) {
      data.code.state.clean = JSON.parse(source.code)
      data.code.view.clean = JSON.parse(source.jsx)
      data.code.static.clean = JSON.parse(source.statics)
    },
    updateModels(data) {
      data.models.state.setValue(data.code.state.clean)
      data.models.view.setValue(data.code.view.clean)
      data.models.static.setValue(data.code.static.clean)
    },
    // Resizing
    resizeEditor(data) {
      const { editor } = data
      editor.layout()
    },
    // View States
    loadStateTabViewState(data) {
      const { editor, models, viewStates } = data
      editor.setModel(models.state)
      editor.restoreViewState(viewStates.state)
    },
    loadViewTabViewState(data) {
      const { editor, models, viewStates } = data
      editor.setModel(models.view)
      editor.restoreViewState(viewStates.view)
    },
    loadStaticTabViewState(data) {
      const { editor, models, viewStates } = data
      editor.setModel(models.static)
      editor.restoreViewState(viewStates.static)
    },
    saveStateTabViewState(data) {
      const { editor, viewStates } = data
      const viewState = editor.saveViewState()
      viewStates.state = viewState
    },
    saveViewTabViewState(data) {
      const { editor, viewStates } = data
      const viewState = editor.saveViewState()
      viewStates.view = viewState
    },
    saveStaticTabViewState(data) {
      const { editor, viewStates } = data
      const viewState = editor.saveViewState()
      viewStates.static = viewState
    },
    formatEditor(data) {
      const { editor } = data
      editor.getAction("editor.action.formatDocument").run()
    },
    // Code Changes
    updateStateDirtyCode(data, payload: { code: string }) {
      data.code.state.dirty = payload.code
      // data.code.state.error = validateStateCode(code)
      data.code.state.unsaved = true
    },
    updateViewDirtyCode(data, payload: { code: string }) {
      data.code.view.dirty = payload.code
      // data.code.state.error = validateViewCode(code)
      data.code.view.unsaved = true
    },
    updateStaticDirtyCode(data, payload: { code: string }) {
      data.code.static.dirty = payload.code
      // data.code.state.error = validateStaticCode(code)
      data.code.static.unsaved = true
    },
    // Save Changes
    saveStateCode(data, payload: { oid: string; pid: string }) {
      const { oid, pid } = payload
      saveProjectStateCode(pid, oid, data.code.state.dirty)
    },
    saveViewCode(data, payload: { oid: string; pid: string }) {
      const { oid, pid } = payload
      saveProjectViewCode(pid, oid, data.code.view.dirty)
    },
    saveStaticCode(data, payload: { oid: string; pid: string }) {
      const { oid, pid } = payload
      saveProjectStaticCode(pid, oid, data.code.static.dirty)
    },
  },
})

// const stateEditorState = createEditorState(() => true)
// const viewEditorState = createEditorState(() => true)
// const staticEditorState = createEditorState(() => true)

interface CodePanelProps {
  uid?: string
  pid: string
  oid: string
}

export default function CodePanel({ uid, pid, oid }: CodePanelProps) {
  // Local state
  const local = useStateDesigner(codePanelState)
  // const localStateEditorState = useStateDesigner(stateEditorState)
  // const localViewEditorState = useStateDesigner(viewEditorState)
  // const localStaticEditorState = useStateDesigner(staticEditorState)

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
  })

  const viewModel = useFile({
    path: "view.js",
    monaco,
    defaultContents: "",
  })

  const staticModel = useFile({
    path: "static.js",
    monaco,
    defaultContents: "",
  })

  const { editor, containerRef } = useEditor({
    monaco,
    model: stateModel,
    options: {
      fontSize: 13,
      readOnly: oid !== uid,
      showUnused: false,
      quickSuggestions: false,
      fontFamily: "Fira Code",
      fontWeight: "normal",
      minimap: { enabled: false },
      smoothScrolling: true,
      lineDecorationsWidth: 4,
      fontLigatures: true,
      cursorBlinking: "smooth",
      lineNumbers: "off",
    },
    onChange: (code) => local.send("CHANGED_CODE", { code }),
  })

  const resizeEditor = React.useCallback(
    debounce(() => local.send("RESIZED_PANEL"), 48),
    []
  )

  React.useEffect(() => {
    if (!(monaco && editor)) return

    // stateEditorState.send("LOADED_MODEL", { model: stateModel })
    // viewEditorState.send("LOADED_MODEL", { model: viewModel })
    // staticEditorState.send("LOADED_MODEL", { model: staticModel })

    editor.onKeyDown((e) => {
      if (e.metaKey && e.code === "KeyS") {
        e.preventDefault()
        if (uid !== oid) return // Unsafe!
        editor
          .getAction("editor.action.formatDocument")
          .run()
          .then(() => {
            const currentValue = editor.getValue()
            local.send("SAVED_CODE", { code: currentValue, oid, pid })
          })
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
    })
  }, [monaco, editor])

  React.useEffect(() => {
    if (editor) {
      editor.updateOptions({ readOnly: oid !== uid })
    }
  }, [oid, uid])

  const { code } = local.data

  return (
    <CodeContainer>
      <Tabs>
        <TabButton
          onClick={() => local.send("SELECTED_STATE_TAB")}
          activeState={local.isIn("tab.state") ? "active" : "inactive"}
          codeState={code.state.clean === code.state.dirty ? "clean" : "dirty"}
        >
          State
        </TabButton>
        <TabButton
          onClick={() => local.send("SELECTED_VIEW_TAB")}
          activeState={local.isIn("tab.view") ? "active" : "inactive"}
          codeState={code.view.clean === code.view.dirty ? "clean" : "dirty"}
        >
          View
        </TabButton>
        <TabButton
          onClick={() => local.send("SELECTED_STATIC_TAB")}
          activeState={local.isIn("tab.static") ? "active" : "inactive"}
          codeState={
            code.static.clean === code.static.dirty ? "clean" : "dirty"
          }
        >
          Static
        </TabButton>
      </Tabs>
      <EditorContainer ref={containerRef} />
      <Status>
        <ErrorMessage>
          <AlertCircle size={16} />
          ...
        </ErrorMessage>
        <IconButton>
          <RefreshCcw />
        </IconButton>
        <IconButton>
          <Save />
        </IconButton>
      </Status>
      <DragHandleHorizontal
        align="right"
        width={CODE_COL_WIDTH}
        left={300}
        right={280}
        offset="code"
        onMove={resizeEditor}
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
  overflow: "hidden",
  gridAutoColumns: "1fr",
  gridTemplateRows: `40px 1fr 40px`,
  borderLeft: "2px solid $border",
})

const Tabs = styled.div({
  display: "flex",
  borderBottom: "2px solid $border",
})

const TabButton = styled.button({
  cursor: "pointer",
  color: "$text",
  fontFamily: "$body",
  fontWeight: "$2",
  display: "flex",
  flexGrow: 2,
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  background: "transparent",
  border: "none",
  outline: "none",
  "&:hover": {
    opacity: 1,
    bg: "$muted",
  },
  pl: "$2",
  variants: {
    activeState: {
      active: {
        opacity: 1,
      },
      inactive: {
        opacity: 0.5,
      },
    },
    codeState: {
      clean: {
        "&::after": {
          content: "'•'",
          color: "transparent",
          marginLeft: "$0",
        },
      },
      dirty: {
        "&::after": {
          content: "'•'",
          color: "$text",
          marginLeft: "$0",
        },
      },
    },
  },
})

const Status = styled.div({
  borderTop: "2px solid $border",
  display: "flex",
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

const EditorContainer = styled.div({
  height: "100%",
  width: "100%",
  overflow: "hidden",
})

// const CodeEditor: React.FC<{
//   value: string
//   clean: string
//   onSave: (code: string) => void
//   canSave: () => boolean
//   onChange: (value: string) => void
//   editorDidMount: (value: string, editor: any) => void
//   validate?: (code: string) => boolean
//   fontSize?: number
//   readOnly?: boolean
//   height?: string
//   width?: string
//   theme?: string
//   language?: string
// }> = ({
//   value,
//   clean,
//   validate,
//   canSave,
//   onChange,
//   onSave,
//   editorDidMount,
//   fontSize = 13,
//   readOnly = false,
//   ...props
// }) => {
//   React.useEffect(() => {
//     if (typeof window !== "undefined") {
//       initMonaco()
//     }
//   }, [])

//   const rPreviousValue = React.useRef(value)
//   const rEditor = React.useRef<any>()

//   // We might be updating from firebase changes
//   React.useEffect(() => {
//     const editor = rEditor.current
//     if (!editor) return
//     const currentValue = editor.getValue()

//     // We've updated from firebase changes
//     if (clean !== currentValue) {
//       editor.setValue(clean)
//     } else {
//       // We've updated from saved local changes, so noop
//     }
//   }, [clean])

//   const handleEditorDidMount = (getValue, editor) => {
//     rEditor.current = editor
//     const model = editor.getModel()

//     model.setValue(value)
//     model.updateOptions({ tabSize: 2 })

//     // Update current value when the model changes
//     editor.onDidChangeModelContent(() => {
//       const currentValue = editor.getValue()

//       const previousValue = rPreviousValue.current
//       const isValid = validate ? validate(currentValue) : true

//       if (isValid) {
//         onChange(currentValue)
//         rPreviousValue.current = currentValue
//       } else {
//         // User's change was invalid, so undo the change
//         if (currentValue === previousValue) return
//         const model = editor.getModel()
//         model.undo()
//       }
//     })

//     // Add a buffer to the top of the editor
//     editor.changeViewZones((changeAccessor) => {
//       const domNode = document && document.createElement("div")
//       changeAccessor.addZone({
//         afterLineNumber: 0,
//         heightInLines: 1,
//         domNode: domNode,
//       })
//     })

//     // Save event
//     editor.onKeyDown(async (e: KeyboardEvent) => {
//       if (e.metaKey && e.code === "KeyS") {
//         e.preventDefault()

//         let currentValue = editor.getValue()

//         const isValid = validate ? validate(currentValue) : true

//         if (isValid && canSave()) {
//           // Run prettier
//           await editor.getAction("editor.action.formatDocument").run()

//           // Then update previous value
//           currentValue = editor.getValue()
//           rPreviousValue.current = currentValue

//           // And run onSave
//           onSave(currentValue)
//         }
//       }
//     })

//     editorDidMount(getValue, editor)
//   }

//   return (
//     <Editor
//       {...props}
//       language="javascript"
//       theme="light"
//       options={{
//         fontSize,
//         readOnly,
//         showUnused: false,
//         quickSuggestions: false,
//         fontFamily: "Fira Code",
//         fontWeight: "normal",
//         minimap: { enabled: false },
//         smoothScrolling: true,
//         lineDecorationsWidth: 4,
//         fontLigatures: true,
//         cursorBlinking: "smooth",
//         lineNumbers: "off",
//       }}
//       editorDidMount={handleEditorDidMount}
//     />
//   )
// }

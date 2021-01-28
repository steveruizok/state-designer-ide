import * as React from "react"

import { AlertCircle, RefreshCcw, Save } from "react-feather"
import { IconButton, TabButton, styled } from "components/theme"
import { motionValues, ui } from "lib/local-data"
import {
  useMonacoContext,
  useTextModel,
} from "node_modules/use-monaco/dist/cjs/use-monaco"

import { CODE_COL_WIDTH } from "./index"
import { DragHandleHorizontal } from "./drag-handles"
import codePanelState from "states/code-panel"
import useCustomEditor from "hooks/useCustomEditor"
import { useStateDesigner } from "@state-designer/react"

interface CodePanelProps {
  uid?: string
  pid: string
  oid: string
}

export default function CodePanel({ uid, pid, oid }: CodePanelProps) {
  // Local state
  const local = useStateDesigner(codePanelState)

  const { code, fontSize, minimap, wordWrap } = local.data
  const { error, isDirty } = local.values
  const hasError = !!error

  // Monaco Stuff

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

  function handleChange(code: string) {
    codePanelState.send("CHANGED_CODE", { code, oid, pid })
  }

  const { editor, containerRef } = useCustomEditor({
    monaco,
    model: stateModel,
    readOnly: oid !== uid,
    wordWrap,
    minimap,
    fontSize,
    onChange: handleChange,
  })

  // Setup save action and load up the state machine

  React.useEffect(() => {
    if (!(monaco && editor)) return

    editor.onKeyDown((e) => {
      if (e.metaKey) {
        if (e.code === "Digit0") {
          e.preventDefault()
          local.send("RESET_FONT_SIZE")
        }
        if (e.code === "Equal") {
          e.preventDefault()
          local.send("INCREASED_FONT_SIZE")
        }
        if (e.code === "Minus") {
          e.preventDefault()
          local.send("DECREASED_FONT_SIZE")
        }
        if (e.code === "KeyS") {
          e.preventDefault()
          if (hasError) return
          if (uid !== oid) return // Unsafe!
          local.send("SAVED_CODE", { oid, pid })
        }
      }
    })

    codePanelState.send("LOADED", {
      monaco,
      editor,
      models: {
        state: stateModel,
        view: viewModel,
        static: staticModel,
      },
      activeTab: ui.code.activeTab,
    })

    return () => codePanelState.send("UNLOADED")
  }, [monaco, editor, oid, pid])

  return (
    <CodeContainer>
      <Tabs>
        <TabButton
          onClick={() => codePanelState.send("SELECTED_STATE_TAB")}
          variant="code"
          title="State"
          activeState={local.isIn("tab.state") ? "active" : "inactive"}
          codeState={code.state.clean === code.state.dirty ? "clean" : "dirty"}
        >
          State
        </TabButton>
        <TabButton
          onClick={() => codePanelState.send("SELECTED_VIEW_TAB")}
          variant="code"
          title="View"
          activeState={local.isIn("tab.view") ? "active" : "inactive"}
          codeState={code.view.clean === code.view.dirty ? "clean" : "dirty"}
        >
          View
        </TabButton>
        <TabButton
          onClick={() => codePanelState.send("SELECTED_STATIC_TAB")}
          variant="code"
          title="Static"
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
        <ErrorMessage title={code[local.data.activeTab].error}>
          {hasError && (
            <>
              <AlertCircle size={16} />
              {code[local.data.activeTab].error}
            </>
          )}
        </ErrorMessage>
        <IconButton
          disabled={!isDirty}
          title="Reset Changes"
          onClick={() => local.send("RESET_CODE")}
        >
          <RefreshCcw />
        </IconButton>
        <IconButton
          disabled={!local.can("SAVED_CODE")}
          title="Save Changes"
          onClick={async () => {
            if (hasError) return
            if (uid !== oid) return // Unsafe!

            editor
              .getAction("editor.action.formatDocument")
              .run()
              .then(() => local.send("SAVED_CODE", { oid, pid }))
          }}
        >
          <Save />
        </IconButton>
      </CodeEditorControls>
      <DragHandleHorizontal
        motionValue={motionValues.code}
        align="right"
        width={CODE_COL_WIDTH}
        left={720}
        right={280}
        offset="code"
      />
    </CodeContainer>
  )
}

const EditorContainer = styled.div({
  bg: "$codeBg",
  borderBottom: "2px solid $border",
  overflow: "hidden",
  height: "100%",
  width: "100%",
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
  ".lineStateBlockCodeHl": {},
  ".inlineStateBlockCodeHl": {
    textDecoration: "underline",
  },
  ".marginStateBlockCodeHl": {},
  ".minimap-shadow-visible": { display: "none" },
  ".minimap-shadow-hidden": { display: "none" },
})

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
  // overflow: "hidden",
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
  color: "$accent",
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
  pr: 0,
})

import { codeFormatValidators, codeValidators } from "lib/eval"
import {
  decreaseFontSize,
  increaseFontSize,
  resetFontSize,
  saveCodeTab,
  ui,
} from "lib/local-data"

import { CodeEditorTab } from "types"
import { createState } from "@state-designer/react"
import liveViewState from "./live-view"
import { saveProjectCode } from "lib/database"

const EDITOR_TABS = ["state", "view", "static"]
let INITIAL_FONT_SIZE = 13
let INITIAL_TAB = "state"

if (typeof window !== "undefined") {
  const savedUI = window.localStorage.getItem(`sd_ui`)
  if (savedUI !== null) {
    const saved = JSON.parse(savedUI)
    INITIAL_FONT_SIZE = saved.code.fontSize
    INITIAL_TAB = saved.code.activeTab
  }
}

const codePanelState = createState({
  data: {
    prevDecorations: [] as any[],
    fontSize: INITIAL_FONT_SIZE,
    activeTab: INITIAL_TAB as CodeEditorTab,
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
    UNLOADED: { to: ["loading"] },
    SOURCE_UPDATED: ["updateFromDatabase", "notifyLiveViewClean"],
    CHANGED_CODE: ["updateDirtyCode", "highlightBlockTitles"],
    RESET_CODE: [
      "resetCode",
      "restoreActiveTabCleanViewState",
      "highlightBlockTitles",
    ],
    INCREASED_FONT_SIZE: "increaseFontSize",
    DECREASED_FONT_SIZE: "decreaseFontSize",
    RESET_FONT_SIZE: "resetFontSize",
    CHANGED_HIGHLIGHTS: "highlightHoveredBlocks",
    CLEARED_HIGHLIGHTS: "clearHighlights",
  },
  states: {
    editor: {
      initial: "editing",
      states: {
        editing: {
          on: {
            SAVED_CODE: {
              unless: "errorInCurrentTab",
              to: "waitingToSave",
            },
          },
        },
        waitingToSave: {
          onEnter: [
            "formatCode",
            {
              wait: 0.25,
              to: "saving",
            },
          ],
          on: {
            CHANGED_CODE: {
              to: "saving",
            },
          },
        },
        saving: {
          onEnter: {
            do: ["saveCodeToFirebase", "saveCurrentCleanViewState"],
            to: ["editing"],
          },
        },
      },
    },
    tab: {
      initial: "loading",
      states: {
        loading: {
          on: {
            LOADED: [
              "loadData",
              {
                if: "hasSource",
                to: "starting",
              },
            ],
            SOURCE_LOADED: [
              "initialLoadFromDatabase",
              {
                if: "hasEditor",
                to: "starting",
              },
            ],
          },
        },
        starting: {
          onEnter: [
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
        state: {
          onEnter: [
            "setStateActiveTab",
            "restoreActiveTabDirtyViewState",
            "highlightBlockTitles",
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
            "highlightBlockTitles",
          ],
          onExit: "saveCurrentViewState",
          on: {
            CHANGED_CODE: { secretlyDo: "notifyLiveViewDirty" },
            SELECTED_STATE_TAB: { to: "tab.state" },
            SELECTED_STATIC_TAB: { to: "tab.static" },
          },
        },
        static: {
          onEnter: [
            "setStaticActiveTab",
            "restoreActiveTabDirtyViewState",
            "highlightBlockTitles",
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
    hasSource(data) {
      return data.code[EDITOR_TABS[0]].clean !== ""
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
    codeMatchesClean(data) {
      const { activeTab } = data
      return data.code[activeTab].clean === data.code[activeTab].dirty
    },
  },
  actions: {
    // Data
    loadData(data, payload = {}) {
      const { monaco, editor, models } = payload
      if (!editor) {
        return
      }

      data.models = models
      data.monaco = monaco
      data.editor = editor

      if (editor) {
        editor.updateOptions({
          fontSize: data.fontSize,
        })
      }
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
    formatCode(data) {
      data.editor.getAction("editor.action.formatDocument").run()
    },
    saveCodeToFirebase(
      data,
      payload: { oid: string; pid: string; code: string },
    ) {
      const { code, activeTab } = data
      const { oid, pid } = payload
      code[activeTab].clean = code[activeTab].dirty
      saveProjectCode(pid, oid, activeTab, code[activeTab].dirty)
    },
    // Live View
    notifyLiveViewDirty(data) {
      liveViewState.send("CHANGED_CODE", {
        code: data.code.view.dirty,
        shouldLog: false,
      })
    },
    notifyLiveViewClean(data) {
      liveViewState.send("CHANGED_CODE", {
        code: data.code.view.clean,
        shouldLog: true,
      })
    },
    // Font Size
    increaseFontSize(data) {
      const { editor } = data
      if (!editor) return
      const next = increaseFontSize()
      editor.updateOptions({
        fontSize: next,
      })
    },
    decreaseFontSize(data) {
      const { editor } = data
      if (!editor) return
      const next = decreaseFontSize()
      data.fontSize = next
      editor.updateOptions({
        fontSize: next,
      })
    },
    resetFontSize(data) {
      const { editor } = data
      if (!editor) return
      const next = resetFontSize()
      data.fontSize = next
      editor.updateOptions({
        fontSize: next,
      })
    },
    highlightBlockTitles(data) {
      const { monaco, editor, prevDecorations } = data
      if (!editor) {
        return
      }

      const hlRanges: any[] = []
      const elines = editor.getModel().getLinesContent()
      const blockTests = {
        actions: /^(\s*)actions\: {/,
        conditions: /^(\s*)conditions\: {/,
        data: /^(\s*)data\: {/,
        values: /^(\s*)values\: {/,
        results: /^(\s*)results\: {/,
      }

      for (let i = 0; i < elines.length; i++) {
        const line = elines[i]
        for (let key in blockTests) {
          if (blockTests[key].exec(line)) {
            hlRanges.push({
              range: new monaco.Range(i + 1, 3, i + 1, key.length + 3),
              options: {
                isWholeLine: false,
                linesDecorationsClassName: "lineStateBlockCodeHl",
                inlineClassName: "inlineStateBlockCodeHl",
                marginClassName: "marginStateBlockCodeHl",
              },
            })
          }
        }
      }

      data.prevDecorations = editor.deltaDecorations(prevDecorations, hlRanges)
    },
    highlightHoveredBlocks(
      data,
      { search, scrollToLine }: { search: string; scrollToLine: boolean },
    ) {
      const { monaco, editor, prevDecorations } = data
      if (!editor) {
        return
      }
      const code = editor.getValue()

      if (search === null || search === "root") {
        data.prevDecorations = editor.deltaDecorations(prevDecorations, [])
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

        data.prevDecorations = editor.deltaDecorations(
          prevDecorations,
          hlRanges,
        )
      }
    },
    clearHighlights(data) {
      const { editor, prevDecorations } = data
      data.prevDecorations = editor.deltaDecorations(prevDecorations, [])
    },
  },
  values: {
    error(data) {
      const { activeTab, code } = data
      return code[activeTab].error
    },
    isDirty(data) {
      const { activeTab, code } = data
      return code[activeTab].clean === code[activeTab].dirty
    },
  },
})

export default codePanelState

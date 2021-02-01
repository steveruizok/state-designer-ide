import type * as monacoApi from "monaco-editor"
import db from "utils/firestore"
import { codeFormatValidators, codeValidators } from "lib/eval"
import {
  decreaseFontSize,
  increaseFontSize,
  resetFontSize,
  saveCodeTab,
  updateUI,
  ui,
} from "lib/local-data"

import { CodeEditorTab } from "types"
import { createState } from "@state-designer/react"
import liveViewState from "./live-view"
import projectState from "./project"

type Monaco = typeof monacoApi

const EDITOR_TABS = ["state", "view", "static"]

let INITIAL = {
  minimap: true,
  wordWrap: false,
  fontSize: 13,
  tab: "state" as CodeEditorTab,
}

if (typeof window !== "undefined") {
  const savedUI = window.localStorage.getItem(`sd_ui`)
  if (savedUI !== null) {
    const saved = JSON.parse(savedUI)
    INITIAL = { ...INITIAL, ...saved.code }
  }
}

const codePanelState = createState({
  data: {
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
    prevDecorations: [] as any[],
    wordWrap: INITIAL.wordWrap,
    minimap: INITIAL.minimap,
    fontSize: INITIAL.fontSize,
    activeTab: INITIAL.tab,
    monaco: null as Monaco,
    editor: null as monacoApi.editor.ICodeEditor,
    models: {
      state: null as monacoApi.editor.ITextModel,
      view: null as monacoApi.editor.ITextModel,
      static: null as monacoApi.editor.ITextModel,
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
  },
  on: {
    UNLOADED: { do: "cleanup", to: "loading" },
    SOURCE_UPDATED: ["updateFromDatabase", "notifyLiveViewClean"],
    CHANGED_CODE: ["updateDirtyCode", "highlightBlockTitles", "clearViewError"],
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
    TOGGLED_WORD_WRAP: "toggleWordWrap",
    TOGGLED_MINIMAP: "toggleMinimap",
    FOUND_VIEW_ERROR: "setViewError",
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
            LOADED: "loadData",
            SOURCE_UPDATED: "initialLoadFromDatabase",
          },
          initial: "stageA",
          states: {
            stageA: {
              on: {
                LOADED: { to: "stageB" },
                SOURCE_UPDATED: { to: "stageB" },
              },
            },
            stageB: {
              on: {
                LOADED: { to: "stageC" },
                SOURCE_UPDATED: { to: "stageC" },
              },
            },
            stageC: {
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
          },
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
    loadData(
      data,
      payload: {
        monaco: Monaco
        editor: monacoApi.editor.ICodeEditor
        models: {
          state: monacoApi.editor.ITextModel
          view: monacoApi.editor.ITextModel
          static: monacoApi.editor.ITextModel
        }
      },
    ) {
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
        data.models[tab]?.setValue(data.code[tab].clean)
      })
    },
    updateCleanViewStates(data) {
      EDITOR_TABS.forEach((tab) => {
        data.viewStates[tab]?.clean.setValue(data.code[tab].clean)
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
        // @ts-ignore
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
    setViewError(data, { error }) {
      data.code.view.error = error
    },
    clearViewError(data) {
      data.code.view.error = ""
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
    saveCodeToFirebase(data) {
      const { code, activeTab } = data
      const { oid, pid } = projectState.data
      code[activeTab].clean = code[activeTab].dirty

      db.collection("users")
        .doc(oid)
        .collection("projects")
        .doc(pid)
        .update({
          [`code.${activeTab}`]: code[activeTab].dirty,
          payloads: ui.payloads,
          lastModified: new Date().toUTCString(),
        })
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
      data.fontSize = next
    },
    decreaseFontSize(data) {
      const { editor } = data
      if (!editor) return
      const next = decreaseFontSize()
      data.fontSize = next
    },
    resetFontSize(data) {
      const { editor } = data
      if (!editor) return
      const next = resetFontSize()
      data.fontSize = next
    },
    // Word Wrap
    toggleWordWrap(data) {
      data.wordWrap = !data.wordWrap
      updateUI({ code: { ...ui.code, wordWrap: data.wordWrap } })
    },
    toggleMinimap(data) {
      data.minimap = !data.minimap
      updateUI({ code: { ...ui.code, minimap: data.minimap } })
    },
    // Highlights
    highlightBlockTitles(data) {
      const { monaco, editor, prevDecorations } = data
      if (!editor) {
        return
      }

      if (data.activeTab !== "state") {
        data.prevDecorations = editor.deltaDecorations(prevDecorations, [])
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

      if (data.activeTab !== "state" || search === null || search === "root") {
        data.prevDecorations = editor.deltaDecorations(prevDecorations, [])
        return
      }

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

      data.prevDecorations = editor.deltaDecorations(prevDecorations, hlRanges)
    },
    clearHighlights(data) {
      const { editor, prevDecorations } = data
      data.prevDecorations = editor.deltaDecorations(prevDecorations, [])
    },
    // Cleanup
    cleanup(data) {
      for (let tab of EDITOR_TABS) {
        if (data.models[tab]) {
          data.models[tab].setValue("")
          data.code[tab].clean = ""
          data.code[tab].dirty = ""
          data.code[tab].error = ""
        }
      }
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

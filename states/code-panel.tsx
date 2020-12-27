import { createState } from "@state-designer/react"
import { saveProjectCode } from "lib/database"
import { codeFormatValidators, codeValidators } from "lib/eval"
import { saveCodeTab, ui } from "lib/local-data"
import { CodeEditorTab } from "types"

import liveViewState from "./live-view"

const EDITOR_TABS = ["state", "view", "static"]

const codePanelState = createState({
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
    LOADED: ["loadData", "notifyLiveViewClean"],
    UNLOADED: { to: ["loading"] },
    SOURCE_UPDATED: ["updateFromDatabase"],
    CHANGED_CODE: "updateDirtyCode",
    RESET_CODE: ["resetCode", "restoreActiveTabCleanViewState"],
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
          onEnter: {
            wait: 0.5,
            to: "saving",
          },
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
          onEnter: ["setStateActiveTab", "restoreActiveTabDirtyViewState"],
          onExit: "saveCurrentViewState",
          on: {
            SELECTED_VIEW_TAB: { to: "tab.view" },
            SELECTED_STATIC_TAB: { to: "tab.static" },
          },
        },
        view: {
          onEnter: ["setViewActiveTab", "restoreActiveTabDirtyViewState"],
          onExit: "saveCurrentViewState",
          on: {
            CHANGED_CODE: { secretlyDo: "notifyLiveViewDirty" },
            SELECTED_STATE_TAB: { to: "tab.state" },
            SELECTED_STATIC_TAB: { to: "tab.static" },
          },
        },
        static: {
          onEnter: ["setStaticActiveTab", "restoreActiveTabDirtyViewState"],
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
    codeMatchesClean(data) {
      const { activeTab } = data
      return data.code[activeTab].clean === data.code[activeTab].dirty
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
      liveViewState.send("CHANGED_CODE", { code: data.code.view.dirty })
    },
    notifyLiveViewClean(data) {
      liveViewState.send("CHANGED_CODE", { code: data.code.view.clean })
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

// codePanelState.onUpdate((d) => console.log(d.active))

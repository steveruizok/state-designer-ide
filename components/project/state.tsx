import { createState } from "@state-designer/react"
import { codePanelState } from "./code"
import { consoleState } from "./console"
import { getStaticValues, getCaptiveState } from "lib/eval"

const projectState = createState({
  data: {
    oid: "",
    pid: "",
    name: "",
    code: {
      state: "",
      view: "",
      static: "",
    },
    static: undefined as any,
    captive: createState({}),
  },
  on: {
    SOURCE_UPDATED: [
      "updateFromDatabase",
      "updateCodePanelState",
      "resetConsole",
      "createStatic",
      "createCaptiveState",
    ],
  },
  initial: "loading",
  states: {
    loading: {
      on: {
        SOURCE_UPDATED: {
          to: "ready",
        },
      },
    },
    ready: {
      on: {
        UNLOADED: { to: "loading" },
      },
    },
  },
  actions: {
    updateFromDatabase(data, { source }) {
      const stateCode = JSON.parse(source.code)
      const viewCode = JSON.parse(source.jsx)
      const staticCode = JSON.parse(source.statics)
      const name = source.name

      data.code.state = stateCode
      data.code.view = viewCode
      data.code.static = staticCode
      data.name = name

      codePanelState.send("SOURCE_LOADED", {
        state: data.code.state,
        view: data.code.view,
        static: data.code.static,
      })
    },
    updateCodePanelState(data) {
      codePanelState.send("SOURCE_UPDATED", {
        state: data.code.state,
        view: data.code.view,
        static: data.code.static,
      })
    },
    createStatic(data) {
      try {
        data.static = getStaticValues(data.code.static)
      } catch (err) {
        console.error("Error building statics!", err.message)
      }
    },
    createCaptiveState(data) {
      try {
        data.captive = getCaptiveState(data.code.state, data.code.static)
      } catch (err) {
        console.error("Error building captive state!", err.message)
      }
    },
    resetConsole(data) {
      consoleState.send("RESET")
    },
  },
})

export default projectState

import { createState } from "@state-designer/react"
import { getCaptiveState, getStaticValues } from "lib/eval"

import codePanelState from "./code-panel"
import consoleState from "./console"

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
  initial: "loading",
  states: {
    loading: {
      on: {
        SOURCE_UPDATED: [
          {
            do: [
              "updateFromDatabase",
              "updateCodePanelState",
              "resetConsole",
              "createStatic",
              "createCaptiveState",
            ],
          },
          { wait: 1, to: "ready" },
        ],
      },
    },
    ready: {
      on: {
        SOURCE_UPDATED: [
          "updateFromDatabase",
          "updateCodePanelState",
          "resetConsole",
          "createStatic",
          "createCaptiveState",
        ],
        UNLOADED: { to: "loading" },
      },
    },
  },
  actions: {
    updateFromDatabase(data, { source }) {
      const name = source.name
      const stateCode = source.code.state
      const viewCode = source.code.view
      const staticCode = source.code.static

      data.code.state = stateCode
      data.code.view = viewCode
      data.code.static = staticCode
      data.name = name

      codePanelState.send("SOURCE_LOADED", {
        state: stateCode,
        view: viewCode,
        static: staticCode,
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

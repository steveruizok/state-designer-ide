import { createState } from "@state-designer/react"

const consoleState = createState({
  data: {
    logs: [] as string[],
    error: null as string | null,
  },
  on: {
    LOGGED: "addLog",
    RESET: "clearLogs",
    CHANGED_ERROR: {
      if: "errorIsChanged",
      do: "setError",
    },
    CLEAR_ERROR: {
      do: "clearError",
    },
  },
  conditions: {
    errorIsChanged(data, { error }) {
      return data.error !== error
    },
  },
  actions: {
    addLog(data, payload: { source: string; message: string }) {
      data.logs.push("› " + payload.message)
    },
    clearLogs(data) {
      data.logs = []
    },
    setError(data, { error }) {
      data.error = error
    },
    clearError(data) {
      data.error = null
    },
  },
  values: {
    value(data) {
      const { logs } = data
      return logs.join("\n")
    },
  },
})

export default consoleState

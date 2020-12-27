import { createState } from "@state-designer/react"

const consoleState = createState({
  data: {
    logs: [] as string[],
  },
  on: {
    LOGGED: "addLog",
    RESET: "clearLogs",
  },
  actions: {
    addLog(data, payload: { source: string; message: string }) {
      data.logs.push("› " + payload.message)
    },
    clearLogs(data) {
      console.log("resetting")
      data.logs = []
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

import { createState } from "@state-designer/react"

const liveViewState = createState({
  data: {
    resets: 0,
    code: "",
    shouldLog: false,
  },
  on: {
    CHANGED_CODE: "setCode",
    FOCUSED_REACT_VIEW: "enableLogging",
    BLURRED_REACT_VIEW: "disableLogging",
    RESET_VIEW: "incrementResets",
  },
  actions: {
    enableLogging(data) {
      data.shouldLog = true
    },
    disableLogging(data) {
      data.shouldLog = false
    },
    setCode(data, payload: { code: string; shouldLog: boolean }) {
      data.code = payload.code
      data.shouldLog = payload.shouldLog
    },
    incrementResets(data) {
      data.resets++
    },
  },
})

export default liveViewState

import { createState } from "@state-designer/react"

const liveViewState = createState({
  data: {
    code: "",
    shouldLog: false,
  },
  on: {
    CHANGED_CODE: "setCode",
    FOCUSED_REACT_VIEW: "enableLogging",
    BLURRED_REACT_VIEW: "disableLogging",
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
  },
})

export default liveViewState

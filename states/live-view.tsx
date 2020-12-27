import { createState } from "@state-designer/react"

const liveViewState = createState({
  data: {
    code: "",
    shouldLog: false,
  },
  on: {
    CHANGED_CODE: "setCode",
  },
  actions: {
    setCode(data, payload: { code: string; shouldLog: boolean }) {
      data.code = payload.code
      data.shouldLog = payload.shouldLog
    },
  },
})

export default liveViewState

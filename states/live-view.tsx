import { createState } from "@state-designer/react"

const liveViewState = createState({
  data: {
    code: "",
  },
  on: {
    CHANGED_CODE: "setCode",
  },
  actions: {
    setCode(data, payload) {
      data.code = payload.code
    },
  },
})

export default liveViewState

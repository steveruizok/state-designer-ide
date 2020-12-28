import { createState } from "@state-designer/react"
import { savePayloads } from "lib/database"
import { saveLocalPayloads } from "lib/local-data"

let INITIAL_PAYLOADS = {} as Record<string, string>

if (typeof window !== "undefined") {
  const savedUI = window.localStorage.getItem(`sd_ui`)
  if (savedUI !== null) {
    const saved = JSON.parse(savedUI)
    INITIAL_PAYLOADS = saved.payloads
  }
}

const payloadsState = createState({
  data: {
    payloads: INITIAL_PAYLOADS,
  },
  on: {
    UPDATED_FROM_SOURCE: "updateFromSource",
    UPDATED_PAYLOAD: ["updatePayload", "saveToDatabase"],
  },
  actions: {
    updateFromSource(data, { source }) {
      data.payloads = source.payloads
    },
    updatePayload(data, { eventName, code }) {
      data.payloads[eventName] = code
    },
    saveToDatabase(data, { oid, pid }) {
      saveLocalPayloads({ ...data.payloads })
      // savePayloads(pid, oid, { ...data.payloads })
    },
    resetPayloads(data) {
      data.payloads = {}
    },
  },
  values: {},
})

export default payloadsState

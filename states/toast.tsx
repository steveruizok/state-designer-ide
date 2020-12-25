import uniqueId from "lodash/uniqueId"
import { createState } from "@state-designer/react"
import { ToastMessage } from "types"

const toastState = createState({
  data: {
    toasts: {} as Record<string, ToastMessage>,
  },
  on: {
    ADDED_TOAST: "showToast",
    DISMISSED_TOAST: "dismissToast",
  },
  actions: {
    showToast(data, payload: { message: string }) {
      const { message } = payload
      const id = uniqueId()
      data.toasts[id] = { id, message }
    },
    dismissToast(data, payload: { id: string }) {
      const { id } = payload
      delete data.toasts[id]
    },
  },
})

export default toastState

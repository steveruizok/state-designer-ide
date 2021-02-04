import { createState } from "@state-designer/react"

let INITIAL = {
  version: 0,
  captive: {
    attemptRestore: true,
  },
  details: {
    activeTab: "data",
    wrap: false,
  },
  console: {
    activeTab: "console",
    wrap: false,
  },
  content: {
    visible: true,
  },
  code: {
    fontSize: 13,
    minimap: true,
    wordWrap: false,
    activeTab: "state",
  },
  panelOffsets: {
    payloads: 0,
    content: 0,
    main: 0,
    code: 0,
    detail: 0,
    console: 0,
  },
  payloads: {},
  theme: "dark" as "dark" | "light",
}

if (typeof window !== "undefined") {
  const savedUI = window.localStorage.getItem(`sd_ui`)
  if (savedUI !== null) {
    const saved = JSON.parse(savedUI)
    if (saved.version === INITIAL.version) {
      INITIAL = { ...INITIAL, ...saved }
    }
  }
}

const uiState = createState({
  data: INITIAL,
  on: {
    TOGGLED_CONTENT_PANEL: ["toggleContentPanel"],
    TOGGLED_ATTEMPT_RESTORE_STATE: "toggleAttemptRestoreState",
  },
  actions: {
    toggleContentPanel(data) {
      data.content.visible = !data.content.visible
    },
    toggleAttemptRestoreState(data) {
      data.captive.attemptRestore = !data.captive.attemptRestore
    },
  },
})

uiState.onUpdate((update) => {
  window.localStorage.setItem(`sd_ui`, JSON.stringify(update.data))
})

export default uiState

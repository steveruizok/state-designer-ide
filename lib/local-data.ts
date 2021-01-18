import { createState } from "@state-designer/react"
import { darkTheme, lightTheme } from "components/theme"
import { MotionValue, motionValue } from "framer-motion"
import { CodeEditorTab, LayoutOffset } from "types"

export const ui = {
  details: {
    activeTab: "data",
    wrap: false,
  },
  console: {
    activeTab: "console",
    wrap: false,
  },
  content: {},
  code: {
    fontSize: 13,
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

const unsubs: Record<string, any> = {}

export const themeState = createState({
  data: {
    theme: ui.theme,
  },
  on: {
    TOGGLED: ["toggleTheme", "updateTheme"],
    SET_THEME: ["setTheme", "updateTheme"],
    SET_INITIAL_THEME: "setTheme",
  },
  actions: {
    toggleTheme(data) {
      data.theme = data.theme === "dark" ? "light" : "dark"
    },
    setTheme(data, payload: { theme: "dark" | "light" }) {
      data.theme = payload.theme
    },
    updateTheme(data) {
      setTheme(data.theme)
    },
  },
})

export const motionValues: Record<LayoutOffset, MotionValue<number>> = {
  content: motionValue(0),
  payloads: motionValue(0),
  main: motionValue(0),
  code: motionValue(0),
  detail: motionValue(0),
  console: motionValue(0),
}

// Update offets from local storage
function loadLocalUI() {
  const savedUI = window.localStorage.getItem(`sd_ui`)
  if (savedUI !== null) {
    // Set saved data to ui
    const saved = JSON.parse(savedUI)
    Object.assign(ui, saved)
  }

  // Update panel offsets
  updatePanelOffsets()
  updateCssVariables()

  // Update theme
  if (typeof document !== "undefined") {
    document.body.className = ui.theme === "dark" ? darkTheme : lightTheme
  }

  if (themeState) {
    themeState.send("SET_INITIAL_THEME", { theme: ui.theme })
  }
}

export function updatePanelOffsets() {
  for (let key in ui.panelOffsets) {
    const initial = ui.panelOffsets[key]

    if (unsubs[key]) {
      unsubs[key]()
    }

    unsubs[key] = motionValues[key].onChange((v: number) =>
      savePanelOffset(key as LayoutOffset, initial + v),
    )

    motionValues[key].set(0)
  }
}

export function loadPanelOffsets() {
  loadLocalUI()
}

export function resetOffsets() {
  const { panelOffsets } = ui
  for (let key in ui.panelOffsets) {
    motionValues[key].set(motionValues[key].get() - panelOffsets[key])
    panelOffsets[key] = 0
  }
  updateCssVariables()
  saveUI()
}

// Update CSS variables with local storage offsets
function updateCssVariables() {
  const { panelOffsets } = ui
  for (let key in panelOffsets) {
    document.documentElement.style.setProperty(
      `--${key}-offset`,
      panelOffsets[key] + "px",
    )
  }
}

// Save current offsets to local storage
function saveUI() {
  window.localStorage.setItem(`sd_ui`, JSON.stringify(ui))
}

// Panel Offsetss

export function savePanelOffset(offset: LayoutOffset, value: number) {
  ui.panelOffsets[offset] = value
  updateCssVariables()
  saveUI()
}

// Details

export function saveWrapDetails(value: boolean) {
  ui.details.wrap = value
  saveUI()
}

export function saveDetailsTab(value: "data" | "values") {
  ui.details.activeTab = value
  saveUI()
}

export function saveConsoleTab(value: "console" | "error") {
  ui.console.activeTab = value
  saveUI()
}

// Code

export function saveCodeTab(value: CodeEditorTab) {
  ui.code.activeTab = value
  saveUI()
}

export function decreaseFontSize() {
  if (ui.code.fontSize > 8) {
    ui.code.fontSize--
  }
  saveUI()
  return ui.code.fontSize
}

export function increaseFontSize() {
  if (ui.code.fontSize < 32) {
    ui.code.fontSize++
  }
  saveUI()
  return ui.code.fontSize
}

export function resetFontSize() {
  ui.code.fontSize = 13
  saveUI()
  return ui.code.fontSize
}

// Payloads

export function saveLocalPayloads(payloads: Record<string, string>) {
  ui.payloads = payloads
  saveUI()
}

// Theme

export function setTheme(theme: "dark" | "light") {
  ui.theme = theme
  document.body.className = ui.theme === "dark" ? darkTheme : lightTheme
  saveUI()
  return ui.theme
}

export function toggleTheme() {
  const next = ui.theme === "light" ? "dark" : "light"
  return setTheme(next)
}

// Setup

export function setupUI() {
  if (typeof document === "undefined") return
  if (typeof window === "undefined") return
  loadLocalUI()
}

// For initial page load

if (typeof document !== "undefined" && typeof window !== "undefined") {
  loadLocalUI()
}

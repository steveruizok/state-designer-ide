import { LayoutOffset, CodeEditorTab } from "types"
import { motionValue, MotionValue } from "framer-motion"
import { lightTheme, darkTheme } from "components/theme"
import themeState from "states/theme"

export const ui = {
  details: {
    activeTab: "data",
    wrap: false,
  },
  content: {
    payloadsOpen: false,
  },
  code: {
    activeTab: "state",
  },
  panelOffsets: {
    content: 0,
    main: 0,
    code: 0,
    detail: 0,
    console: 0,
  },
  theme: "light" as "dark" | "light",
}

export const motionValues: Record<LayoutOffset, MotionValue<number>> = {
  content: motionValue(0),
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

    // Update panel offsets
    for (let key in ui.panelOffsets) {
      const initial = ui.panelOffsets[key]
      motionValues[key].set(0)
      motionValues[key].onChange((v: number) =>
        savePanelOffset(key as LayoutOffset, initial + v),
      )
    }

    // Update theme
    if (typeof document !== "undefined") {
      document.body.className = ui.theme === "dark" ? darkTheme : lightTheme
    }

    if (themeState) {
      themeState.send("SET_INITIAL_THEME", { theme: ui.theme })
    }
  }
}

export function resetOffsets() {
  const { panelOffsets } = ui
  for (let key in ui.panelOffsets) {
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

// Code

export function saveCodeTab(value: CodeEditorTab) {
  ui.code.activeTab = value
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
  updateCssVariables()
}

// For initial page load

if (typeof document !== "undefined" && typeof window !== "undefined") {
  loadLocalUI()
  updateCssVariables()
}

import { LayoutOffset } from "types"

export const ui = {
  wrapDetails: false,
  payloadsOpen: false,
  activeTab: "state",
  panelOffsets: {
    content: 0,
    main: 0,
    code: 0,
    detail: 0,
    console: 0,
  },
}

// Update offets from local storage
function loadLocalUI() {
  const savedUI = window.localStorage.getItem(`sd_ui`)
  if (savedUI !== null) {
    const saved = JSON.parse(savedUI)
    Object.assign(ui, saved)
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

// Set a panel offset
export function setPanelOffset(offset: LayoutOffset, value: number) {
  ui.panelOffsets[offset] = value
  updateCssVariables()
  saveUI()
}

// Set details wrapping
export function setWrapDetails(value: boolean) {
  ui.wrapDetails = value
  saveUI()
}

export function setupUI() {
  if (typeof document === "undefined") return
  if (typeof window === "undefined") return
  loadLocalUI()
  updateCssVariables()
}

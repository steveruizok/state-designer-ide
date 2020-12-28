import { createState } from "@state-designer/react"
import { ui } from "lib/local-data"
import { DetailsTab } from "types"

let INITIAL_FONT_SIZE = 13
let INITIAL_TAB = "data"
let INITIAL_WRAPPED = false

if (typeof window !== "undefined") {
  const savedUI = window.localStorage.getItem(`sd_ui`)
  if (savedUI !== null) {
    const saved = JSON.parse(savedUI)
    INITIAL_FONT_SIZE = saved.code.fontSize
    INITIAL_TAB = saved.details.activeTab
    INITIAL_WRAPPED = saved.details.wrap
  }
}

export default createState({
  data: {
    fontSize: INITIAL_FONT_SIZE,
    activeTab: INITIAL_TAB as DetailsTab,
    wrap: INITIAL_WRAPPED,
    viewStates: {
      data: null,
      values: null,
    },
  },
  on: {
    LOADED: {},
  },
  states: {
    display: {
      initial: "expanded",
      states: {
        expanded: {},
        collapsed: {},
      },
    },
    wrapping: {
      initial: INITIAL_WRAPPED ? "wrapped" : "scrolling",
      states: {
        wrapped: {},
        scrolling: {},
      },
    },
    tab: {
      initial: INITIAL_TAB,
      states: {
        data: {},
        values: {},
      },
    },
  },
  actions: {
    setActiveTab(data) {},
    expand(data) {},
    collapse(data) {},
    // Font Size
    increaseFontSize(data) {},
    decreaseFontSize(data) {},
  },
})

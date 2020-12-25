import { ui, setTheme } from "lib/local-data"
import { createState } from "@state-designer/react"

const themeState = createState({
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

export default themeState

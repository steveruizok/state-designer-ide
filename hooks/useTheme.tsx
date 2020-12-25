import * as React from "react"
import themeState from "states/theme"
import { useStateDesigner } from "@state-designer/react"

export default function useTheme() {
  const local = useStateDesigner(themeState)

  const toggle = React.useCallback(() => {
    themeState.send("TOGGLED")
  }, [])

  return { theme: local.data.theme, toggle }
}

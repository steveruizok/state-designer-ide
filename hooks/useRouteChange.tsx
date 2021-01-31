import * as React from "react"
import { useRouter } from "next/router"
import codePanelState from "states/code-panel"

export default function useRouteChange() {
  const { events } = useRouter()
  React.useEffect(() => {
    function handleRouteChange() {
      codePanelState.send("UNLOADED")
    }

    events.on("routeChangeStart", handleRouteChange)
    return () => events.off("routeChangeStart", handleRouteChange)
  }, [])
}

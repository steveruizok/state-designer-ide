import * as React from "react"
import Loading from "components/loading"
import projectState from "states/project"
import { useStateDesigner } from "@state-designer/react"
import ReactView from "components/project/react-view"
import ErrorBoundary from "components/project/error-boundary"

interface LiveViewProps {
  showResetState?: boolean
  showConsole?: boolean
}

export default function LiveView({
  showResetState = false,
  showConsole = true,
}: LiveViewProps) {
  const local = useStateDesigner(projectState)
  return local.isIn("ready") ? (
    <ErrorBoundary>
      <ReactView showResetState={showResetState} showConsole={showConsole} />
    </ErrorBoundary>
  ) : (
    <Loading />
  )
}

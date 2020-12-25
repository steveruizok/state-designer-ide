import * as React from "react"
import * as Motion from "framer-motion"
import { S, useStateDesigner } from "@state-designer/react"
import { motion } from "framer-motion"
import Colors from "components/static/colors"
import * as Utils from "components/static/utils"
import * as Icons from "react-feather"
import { styled, css, Text, Button } from "components/theme"
import { LiveProvider, LiveError, LivePreview } from "react-live"
import liveViewState from "states/live-view"

const Components = {
  Button,
  Text,
}

// Wrap Theme-UI components in Framer Motion
const WithMotionComponents = Object.fromEntries(
  Object.entries(Components).map(([k, v]) => {
    return [k, motion.custom(v as any)]
  }),
)

const Preview: React.FC<{
  ready: boolean
  code: string
  statics: { [key: string]: any }
  state: S.DesignedState<any, any>
  theme: { [key: string]: any }
}> = ({ ready, code, state, statics, theme }) => {
  return (
    <LiveProvider
      code={code + "\n\nrender(<Component/>)"}
      noInline={true}
      scope={{
        ...Motion,
        ...WithMotionComponents,
        Icons,
        Utils,
        Colors,
        ColorMode: theme,
        useStateDesigner,
        Static: statics,
        state,
        styled,
        css,
      }}
    >
      <PreviewScrollContainer>
        <PreviewInnerContainer>
          {ready && <LivePreview />}
        </PreviewInnerContainer>
        <StyledLiveError
          style={{
            visibility: code ? "visible" : "hidden",
          }}
        />
      </PreviewScrollContainer>
    </LiveProvider>
  )
}

const PreviewScrollContainer = styled.div({
  width: "100%",
  height: "100%",
  overflow: "scroll",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const PreviewInnerContainer = styled.div({
  p: 2,
  fontSize: 16,
  position: "relative",
  maxHeight: "100%",
  width: "100%",
  maxWidth: "100%",
  overflow: "scroll",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
})

const StyledLiveError = styled(LiveError, {
  position: "absolute",
  bottom: 0,
  left: 0,
  m: 0,
  padding: 2,
  width: "100%",
  fontSize: 1,
  height: "min-content",
  fontFamily: "monospace",
  bg: "scrim",
})

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    errorMessage: "",
  }

  constructor(props) {
    super(props)
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log("Error in Preview:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

const MemoizedPreview = React.memo(Preview)

const SafePreview = (props) => (
  <ErrorBoundary>
    <MemoizedPreview {...props} />
  </ErrorBoundary>
)

export default SafePreview

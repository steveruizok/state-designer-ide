import { S, useStateDesigner } from "@state-designer/react"
import Loading from "components/project/loading"
import Colors from "components/static/colors"
import * as Utils from "components/static/utils"
import {
  Box,
  Flex,
  Grid,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Input,
  PlainButton,
  PlainIconButton,
  Text,
  css,
  styled,
} from "components/theme"
import * as Motion from "framer-motion"
import { motion } from "framer-motion"
import useTheme from "hooks/useTheme"
import { printFromView } from "lib/eval"
import * as React from "react"
import * as Icons from "react-feather"
import { LiveError, LivePreview, LiveProvider } from "react-live"
import liveViewState from "states/live-view"
import projectState from "states/project"

const Components = {
  Box,
  Grid,
  Flex,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Input,
  IconButton: PlainIconButton,
  Button: PlainButton,
  Text,
}

// Wrap Theme-UI components in Framer Motion
const WithMotionComponents = Object.fromEntries(
  Object.entries(Components).map(([k, v]) => {
    return [k, motion.custom(v as any)]
  }),
)

const Preview: React.FC<{}> = () => {
  const local = useStateDesigner(projectState)
  const localEditor = useStateDesigner(liveViewState)
  const theme = useTheme()

  const state = local.data.captive
  const dirtyViewCode = localEditor.data.code
  const staticCode = local.data.static

  return (
    <LiveViewWrapper>
      {local.isIn("ready") ? (
        <LiveProvider
          code={dirtyViewCode + "\n\nrender(<Component/>)"}
          noInline={true}
          scope={{
            ...Motion,
            ...WithMotionComponents,
            Icons,
            Utils,
            Colors,
            ColorMode: theme,
            useStateDesigner,
            Static: staticCode,
            state,
            styled,
            print: printFromView,
            log: printFromView,
            css,
          }}
        >
          <PreviewScrollContainer>
            <PreviewInnerContainer>
              <LivePreview />
            </PreviewInnerContainer>
            <StyledLiveError />
          </PreviewScrollContainer>
        </LiveProvider>
      ) : (
        <Loading />
      )}
    </LiveViewWrapper>
  )
}

const LiveViewWrapper = styled.div({
  width: "100%",
  height: "100%",
  pb: "40px",
})

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

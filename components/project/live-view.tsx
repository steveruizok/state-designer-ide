import { useStateDesigner } from "@state-designer/react"
import Loading from "components/loading"
import Colors from "components/static/colors"
import * as Utils from "components/static/utils"
import {
  Box,
  Checkbox,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Input,
  Label,
  PlainButton,
  PlainIconButton,
  Text,
  css,
  styled,
} from "components/theme"
import * as Motion from "framer-motion"
import { motion } from "framer-motion"
import useTheme from "hooks/useTheme"
import { fakePrint, printFromView } from "lib/eval"
import * as React from "react"
import * as Icons from "react-feather"
import { LiveError, LivePreview, LiveProvider } from "react-live"
import liveViewState from "states/live-view"
import projectState from "states/project"

import ErrorBoundary from "./error-boundary"

const Components = {
  Box,
  Grid,
  Flex,
  Label,
  Divider,
  Container,
  Checkbox,
  Heading,
  Input,
  IconButton: PlainIconButton,
  Button: PlainButton,
  Text,
}

// Wrap Theme-UI components in Framer Motion
// Typed as any because the unions here were choking TS
const WithMotionComponents: any = Object.fromEntries(
  Object.entries(Components).map(([k, v]) => {
    return [k, motion.custom(v as any)]
  }),
)

function Preview() {
  const local = useStateDesigner(projectState)
  const localEditor = useStateDesigner(liveViewState)
  const theme = useTheme()

  const state = local.data.captive
  const staticResults = local.data.static
  const dirtyViewCode = localEditor.data.code

  const printFn = localEditor.data.shouldLog ? printFromView : fakePrint

  let code = dirtyViewCode
    .replace(`import state from './state';`, "")
    .replace(`export default `, "")

  return (
    <LiveViewWrapper>
      {local.isIn("ready") ? (
        <LiveProvider
          code={`${code}\n\nrender(<App/>)`}
          noInline={true}
          scope={{
            ...Motion,
            ...WithMotionComponents,
            Icons,
            Utils,
            Colors,
            ColorMode: theme.theme,
            useStateDesigner,
            Static: staticResults,
            state,
            styled,
            print: printFn,
            log: printFn,
            css,
          }}
        >
          <PreviewScrollContainer>
            <PreviewInnerContainer>
              <LivePreview />
            </PreviewInnerContainer>

            <StyledLiveErrorWrapper>
              <StyledLiveError />
            </StyledLiveErrorWrapper>
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

const StyledLiveErrorWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
})

const StyledLiveError = styled(LiveError, {
  padding: "$2",
  width: "100%",
  fontSize: "$1",
  fontFamily: "$monospace",
  height: "min-content",
  bg: "scrim",
  zIndex: 800,
  pointerEvents: "all",
})

const MemoizedPreview = React.memo(Preview)

const SafePreview = (props) => (
  <ErrorBoundary>
    <MemoizedPreview {...props} />
  </ErrorBoundary>
)

export default SafePreview

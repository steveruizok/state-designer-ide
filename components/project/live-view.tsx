import * as Icons from "react-feather"
import * as Motion from "framer-motion"
import * as React from "react"
import * as Utils from "components/static/utils"

import {
  Box,
  Button,
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
  View,
  css,
  styled,
} from "components/theme"
import { LiveError, LivePreview, LiveProvider } from "react-live"
import { fakePrint, printFromView } from "lib/eval"

import Colors from "components/static/colors"
import ErrorBoundary from "./error-boundary"
import Loading from "components/loading"
import { RotateCcw } from "react-feather"
import liveViewState from "states/live-view"
import { motion } from "framer-motion"
import projectState from "states/project"
import { useStateDesigner } from "@state-designer/react"
import useTheme from "hooks/useTheme"

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
  View,
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

interface LiveViewProps {
  showConsole?: boolean
}

function Preview({ showConsole = true }: LiveViewProps) {
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
    <LiveViewWrapper showConsole={showConsole}>
      <LiveProvider
        code={`
const rLiveView = React.createRef()

function usePointer(ref = rLiveView, onMove = () => {}) {
  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)
  const mvDX = useMotionValue(0)
  const mvDY = useMotionValue(0)

  const rOffset = React.useRef({
    left: 0,
    top: 0,
  })

  React.useEffect(() => {
    function updateBoundingBox() {
      const { left, top } = ref.current.getBoundingClientRect()
      rOffset.current = { left, top }
    }

    let timeout = setInterval(updateBoundingBox, 1000)
    return () => clearInterval(timeout)
  }, [])

  React.useEffect(() => {
    function updateMotionValues(e) {
      const { left, top } = rOffset.current
      const x = e.pageX - left,
        y = e.pageY - top

      mvDX.set(x - mvX.get())
      mvDY.set(y - mvY.get())
      mvX.set(x)
      mvY.set(y)

      if (onMove) {
        onMove({
          dx: mvDX.get(),
          dy: mvDY.get(),
          x: mvX.get(),
          y: mvY.get(),
        })
      }
    }

    window.addEventListener("pointermove", updateMotionValues)
    return () => window.removeEventListener("pointermove", updateMotionValues)
  }, [])

  return { x: mvX, y: mvY, dx: mvDX, dy: mvDY }
}

function useKeyboardInputs(handlers = {}) {
  const element = rLiveView.current

  React.useEffect(() => {
    if (!element) return
    const { onKeyDown = {}, onKeyUp = {} } = handlers

    function handleKeydown(event) {
      if (!onKeyDown) return
      if (onKeyDown[event.key] !== undefined) {
        event.preventDefault()
        onKeyDown[event.key](event)
      }
    }

    function handleKeyup(event) {
      if (!onKeyUp) return
      if (onKeyUp[event.key] !== undefined) {
        event.preventDefault()
        onKeyUp[event.key](event)
      }
    }

    element.addEventListener("keydown", handleKeydown)
    element.addEventListener("keyup", handleKeyup)

    return () => {
      element.removeEventListener("keydown", handleKeydown)
      element.removeEventListener("keyup", handleKeyup)
    }
  }, [element])
}

${code}

render(
  <PreviewScrollContainer ref={rLiveView} tabIndex={0} id="live-view">
    <App />
  </PreviewScrollContainer>
  )`}
        noInline={true}
        scope={{
          ...Motion,
          ...WithMotionComponents,
          PreviewScrollContainer,
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
        <LiveViewOuterWrapper>
          {local.isIn("ready") ? <LivePreview /> : <Loading />}
          <LiveViewControls>
            <Button
              data-hidey="true"
              title="Reset Canvas"
              variant="iconLeft"
              onClick={() => projectState.send("RESET_VIEW")}
            >
              <RotateCcw size={14} strokeWidth={3} /> Reset View
            </Button>
          </LiveViewControls>
        </LiveViewOuterWrapper>
        {local.isIn("ready") && (
          <StyledLiveErrorWrapper>
            <StyledLiveError />
          </StyledLiveErrorWrapper>
        )}
      </LiveProvider>
    </LiveViewWrapper>
  )
}

const LiveViewWrapper = styled.div({
  height: "100%",
  bg: "$border",
  variants: {
    showConsole: {
      true: {
        pb: "40px",
      },
    },
  },
})

const LiveViewOuterWrapper = styled.div({
  height: "100%",
  "& > div:nth-of-type(1)": {
    height: "100%",
  },
  position: "relative",
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

const PreviewScrollContainer = styled.div({
  outline: "none",
  width: "100%",
  height: "100%",
  overflow: "scroll",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& *": {
    boxSizing: "border-box",
  },
})

const MemoizedPreview = React.memo(Preview)

export const LiveViewControls = styled.div({
  height: 40,
  position: "absolute",
  bottom: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  bg: "$scrim",
})

const SafePreview = (props) => (
  <ErrorBoundary>
    <MemoizedPreview {...props} />
  </ErrorBoundary>
)

export default SafePreview

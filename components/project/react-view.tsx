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
import { fakePrint, printFromView } from "lib/eval"
import { motion, useMotionValue } from "framer-motion"

import Colors from "components/static/colors"
import Loading from "components/loading"
import { RotateCcw } from "react-feather"
import consoleState from "states/console"
import liveViewState from "states/live-view"
import projectState from "states/project"
import useCodePreview from "hooks/useCodePreview"
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

const rLiveView = React.createRef<HTMLDivElement>()

// Wrap Theme-UI components in Framer Motion
// Typed as any because the unions here were choking TS
const WithMotionComponents: any = Object.fromEntries(
  Object.entries(Components).map(([k, v]) => {
    return [k, motion.custom(v as any)]
  }),
)

function usePointer(
  ref = rLiveView,
  onMove = ({
    dx,
    dy,
    x,
    y,
  }: {
    dx: number
    dy: number
    x: number
    y: number
  }) => {},
) {
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

function useKeyboardInputs(handlers: any = {}) {
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

interface LiveViewProps {
  showResetState?: boolean
  showConsole?: boolean
}

function ReactView({
  showResetState = false,
  showConsole = true,
}: LiveViewProps) {
  const local = useStateDesigner(projectState)
  const localEditor = useStateDesigner(liveViewState)
  const theme = useTheme()
  const [resets, setResets] = React.useState(0)

  const state = local.data.captive
  const staticResults = local.data.static
  const dirtyViewCode = localEditor.data.code

  const printFn = (...messages) => {
    if (localEditor.data.shouldLog) {
      printFromView(...messages)
    } else {
      fakePrint(...messages)
    }
  }

  let code = dirtyViewCode
    .replace(`import state from './state';`, "")
    .replace(`export default `, "")

  const { previewRef, error } = useCodePreview({
    code,
    inline: false,
    scope: {
      ...Motion,
      ...WithMotionComponents,
      state,
      styled,
      css,
      Icons,
      Utils,
      Colors,
      ColorMode: theme.theme,
      useStateDesigner,
      Static: staticResults,
      print: printFn,
      log: printFn,
      rLiveView,
      usePointer,
      useKeyboardInputs,
    },
    deps: [staticResults, state, resets],
  })

  React.useEffect(() => {
    consoleState.send("CHANGED_ERROR", { error })
  }, [error])

  return (
    <LiveViewWrapper showConsole={showConsole}>
      <LiveViewOuterWrapper
        tabIndex={0}
        onBlur={() => localEditor.send("BLURRED_REACT_VIEW")}
        onFocus={() => localEditor.send("FOCUSED_REACT_VIEW")}
      >
        <PreviewScrollContainer ref={rLiveView} id="live-view">
          <div ref={previewRef}></div>
        </PreviewScrollContainer>
        <Controls showResetState={showResetState} />
      </LiveViewOuterWrapper>
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
  outline: "none",
  height: "100%",
  "& > div:nth-of-type(1)": {
    height: "100%",
  },
  position: "relative",
})

const PreviewScrollContainer = styled.div({
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

export const LiveViewControls = styled.div({
  height: 40,
  position: "absolute",
  bottom: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  bg: "$scrim",
})

function Controls({ showResetState }: { showResetState: boolean }) {
  const localProject = useStateDesigner(projectState)
  const localCaptive = useStateDesigner(localProject.data.captive)

  return (
    <LiveViewControls>
      {showResetState && (
        <Button
          data-hidey="true"
          title="Reset State"
          variant="iconLeft"
          disabled={localCaptive.log.length === 0}
          onClick={() => projectState.send("RESET_STATE")}
        >
          <RotateCcw size={14} strokeWidth={3} /> Reset State
        </Button>
      )}
      <Button
        data-hidey="true"
        title="Reset Canvas"
        variant="iconLeft"
        onClick={() => liveViewState.send("RESET_VIEW")}
      >
        <RotateCcw size={14} strokeWidth={3} /> Reset View
      </Button>
    </LiveViewControls>
  )
}

export default ReactView

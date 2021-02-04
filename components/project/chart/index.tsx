import * as React from "react"

import { AnimateSharedLayout } from "framer-motion"
import { Button, IconButton, Label, Checkbox, styled } from "components/theme"
import { Compass, RotateCcw } from "react-feather"
import { S, useStateDesigner } from "@state-designer/react"
import { useAnimation, useMotionValue } from "framer-motion"

import CanvasOverlay from "./canvas-overlay"
import StateNode from "./state-node"
import highlightsState from "states/highlights"
import { motion } from "framer-motion"
import projectState from "states/project"
import uiState from "states/ui"
import debounce from "lodash/debounce"
import useMotionResizeObserver from "use-motion-resize-observer"
import usePreventZooming from "hooks/usePreventZooming"
import useScaleZooming from "hooks/useScaleZooming"

interface ChartProps {
  state: S.DesignedState<any, any>
  zoomedPath?: string
}

function Chart({ state, zoomedPath }: ChartProps) {
  const captive = useStateDesigner(state)

  const {
    ref: rCanvas,
    width: mvCanvasWidth,
    height: mvCanvasHeight,
  } = useMotionResizeObserver()

  const {
    ref: rRootNode,
    width: mvStateNodeWidth,
    height: mvStateNodeHeight,
  } = useMotionResizeObserver()

  const rAutoScale = React.useRef(1)
  const rScaling = React.useRef(false)

  const mvScale = useMotionValue(1)
  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)

  const animation = useAnimation()

  const { bind } = useScaleZooming(true, true, 0.25, 3, mvScale)

  // Centers and re-scales canvas
  const resetView = React.useCallback(
    debounce(() => {
      // Don't rescale if we're already scaling
      if (rScaling.current) return

      const nodeWidth = mvStateNodeWidth.get()
      const canvasWidth = mvCanvasWidth.get()
      const nodeHeight = mvStateNodeHeight.get()
      const canvasHeight = mvCanvasHeight.get()

      let scale = 1

      const chartPadding = canvasWidth < 320 ? 16 : 32

      if (
        nodeWidth > canvasWidth - chartPadding ||
        nodeHeight > canvasHeight - chartPadding
      ) {
        scale = Math.min(
          (canvasHeight - chartPadding) / nodeHeight,
          (canvasWidth - chartPadding) / nodeWidth,
        )
      }

      if (!isFinite(scale)) return

      rAutoScale.current = scale
      rScaling.current = true
      animation.start({ x: 0, y: 0, scale }).then(() => {
        rScaling.current = false
      })
    }, 250),
    [],
  )

  usePreventZooming(rCanvas as any)

  // Resize statenode on mount
  React.useEffect(() => {
    const resize = debounce(() => {
      // Don't change if the user has a custom scale
      if (mvScale.get() !== rAutoScale.current) return

      // Don't rescale if we're already scaling
      if (rScaling.current) return

      const nodeWidth = mvStateNodeWidth.get()
      const canvasWidth = mvCanvasWidth.get()
      const nodeHeight = mvStateNodeHeight.get()
      const canvasHeight = mvCanvasHeight.get()

      let scale = 1

      const chartPadding = canvasWidth < 320 ? 16 : 32

      if (
        nodeWidth > canvasWidth - chartPadding ||
        nodeHeight > canvasHeight - chartPadding
      ) {
        scale = Math.min(
          (canvasHeight - chartPadding) / nodeHeight,
          (canvasWidth - chartPadding) / nodeWidth,
        )
      }

      if (!isFinite(scale)) return

      // Don't rescale if the scale has not changed.
      if (scale === rAutoScale.current) return

      rAutoScale.current = scale
      rScaling.current = true
      animation.start({ x: 0, y: 0, scale }).then(() => {
        rScaling.current = false
      })
    }, 250)

    requestAnimationFrame(resize)

    let unsubs = [
      mvCanvasWidth.onChange(resize),
      mvCanvasHeight.onChange(resize),
    ]

    // Resize on canvas pane resize
    return () => {
      unsubs.forEach((fn) => fn())
    }
  }, [zoomedPath])

  // Zoomed states

  const states = getFlatStates(captive.stateTree)

  const zoomed = React.useMemo(() => {
    return states.find((node) => node.path === zoomedPath)
  }, [zoomedPath])

  return (
    <ChartContainer
      ref={rCanvas as any}
      whileTap={{
        userSelect: "none",
      }}
      onPan={(e, info) => {
        mvX.set(mvX.get() + info.delta.x)
        mvY.set(mvY.get() + info.delta.y)
      }}
      onDoubleClick={resetView}
      {...bind()}
    >
      <ChartCanvas
        style={{
          x: mvX,
          y: mvY,
          scale: mvScale,
        }}
        animate={animation}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <StateNodeContainer
          onMouseLeave={(e) => {
            highlightsState.send("CLEARED_HIGHLIGHTS")
          }}
        >
          <AnimateSharedLayout>
            <RootNodeWrapper id="chart-container" ref={rRootNode as any}>
              <StateNode
                key="root"
                layoutId="root"
                node={zoomed || captive.stateTree}
              />
            </RootNodeWrapper>
          </AnimateSharedLayout>
          <CanvasOverlay
            scale={mvScale}
            offsetX={mvX}
            offsetY={mvY}
            width={mvStateNodeWidth}
            height={mvStateNodeHeight}
            resizeRef={rRootNode}
          />
        </StateNodeContainer>
      </ChartCanvas>
      <CanvasControls>
        <CanvasControlButtons>
          <Button
            data-hidey="true"
            title="Reset Canvas"
            variant="iconLeft"
            disabled={captive.log.length === 0}
            onClick={() => projectState.send("RESET_STATE")}
          >
            <RotateCcw size={14} strokeWidth={3} /> Reset State
          </Button>
          <PreserveStateButton />
        </CanvasControlButtons>
        <IconButton data-hidey="true" title="Reset Canvas" onClick={resetView}>
          <Compass />
        </IconButton>
      </CanvasControls>
    </ChartContainer>
  )
}

export default React.memo(Chart)

function PreserveStateButton() {
  const local = useStateDesigner(uiState)
  return (
    <FlexLabel data-hidey="true">
      <Checkbox
        checked={local.data.captive.attemptRestore}
        onCheckedChange={() => uiState.send("TOGGLED_ATTEMPT_RESTORE_STATE")}
      />
      Preserve State
    </FlexLabel>
  )
}

const RootNodeWrapper = styled(motion.div, {})

const ChartContainer = styled(motion.div, {
  position: "relative",
  overflow: "hidden",
  height: "100%",
  width: "100%",
  cursor: "grab",
  userSelect: "none",
})

const ChartCanvas = styled(motion.div, {
  height: "100%",
  width: "100%",
  display: "flex",
  placeContent: "center",
  placeItems: "center",
  position: "relative",
})

const StateNodeContainer = styled(motion.div, {
  width: "fit-content",
  position: "relative",
})

export const CanvasControls = styled.div({
  height: 40,
  position: "absolute",
  bottom: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  bg: "$scrim",
})

const CanvasControlButtons = styled.div({
  display: "flex",
  "& > *": {
    mr: "$1",
  },
})

const FlexLabel = styled.label({
  display: "flex",
  fontSize: "$1",
  alignItems: "center",
  button: {
    mr: "$1",
  },
  cursor: "pointer",
})

/* --------------------- Helpers -------------------- */

export function getFlatStates(state: S.State<any, any>): S.State<any, any>[] {
  return [state].concat(...Object.values(state.states).map(getFlatStates))
}

export function getAllEvents(state: S.State<any, any>): string[][] {
  const localEvents: string[][] = []

  localEvents.push(...Object.keys(state.on).map((k) => [state.name, k]))

  for (let child of Object.values(state.states)) {
    localEvents.push(...getAllEvents(child))
  }

  return localEvents
}

export function getEventsByState(events: string[][]): [string, string[]][] {
  const dict: Record<string, string[]> = {}

  for (let [stateName, event] of events) {
    const prior = dict[event]
    if (prior === undefined) {
      dict[event] = [stateName]
    } else {
      dict[event].push(stateName)
    }
  }

  return Object.entries(dict)
}

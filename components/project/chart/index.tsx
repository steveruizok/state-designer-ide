import * as React from "react"
import throttle from "lodash/throttle"
import { Compass, RotateCcw } from "react-feather"
import { motion } from "framer-motion"
import { S, useStateDesigner } from "@state-designer/react"
import { useAnimation, useMotionValue } from "framer-motion"
import StateNode from "./state-node"
import CanvasOverlay from "./canvas-overlay"
import useMotionResizeObserver from "use-motion-resize-observer"
import usePreventZooming from "hooks/usePreventZooming"
import useScaleZooming from "hooks/useScaleZooming"
import { styled, Button, IconButton } from "components/theme"

interface ChartProps {
  state: S.DesignedState<any, any>
  zoomedPath?: string
}

function Chart({ state, zoomedPath }: ChartProps) {
  const captive = useStateDesigner(state)

  const { ref: rCanvas, width: mvCanvasWidth } = useMotionResizeObserver()
  const {
    ref: rStateNode,
    width: mvStateNodeWidth,
    height: mvStateNodeHeight,
  } = useMotionResizeObserver()

  const rAutoScale = React.useRef(1)

  const mvScale = useMotionValue(1)
  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)

  const animation = useAnimation()

  const [bind, scale] = useScaleZooming(true, true, 0.25, 3, mvScale)

  // Centers and re-scales canvas
  const resetView = React.useCallback(
    throttle(() => {
      const stateNode = rStateNode.current
      if (!stateNode) return

      const nodeWidth = mvStateNodeWidth.get()
      const canvasWidth = mvCanvasWidth.get()

      let scale = 1

      if (nodeWidth > canvasWidth) {
        scale = (canvasWidth - 16) / nodeWidth
      }

      rAutoScale.current = scale
      animation.start({ x: 0, y: 0, scale })
    }, 60),
    [],
  )

  const resize = React.useCallback(
    throttle(() => {
      const nodeWidth = mvStateNodeWidth.get()
      const canvasWidth = mvCanvasWidth.get()

      if (mvScale.get() !== rAutoScale.current) return

      let scale = 1

      if (nodeWidth > canvasWidth) {
        scale = (canvasWidth - 16) / nodeWidth
      }

      if (scale === mvScale.get()) return

      rAutoScale.current = scale
      mvScale.set(scale)
    }, 32),
    [],
  )

  usePreventZooming(rCanvas as any)

  // Resize statenode on mount
  React.useEffect(() => {
    const stateNode = rStateNode.current
    if (!stateNode) return

    const nodeWidth = mvStateNodeWidth.get()
    const canvasWidth = mvCanvasWidth.get()

    if (nodeWidth > canvasWidth) {
      let scale = (canvasWidth - 16) / nodeWidth
      rAutoScale.current = scale
      mvScale.set(scale)
    }

    // Resize on canvas pane resize
    return mvCanvasWidth.onChange(resize)
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
      onDoubleClick={() => resetView()}
      {...bind()}
    >
      <ChartCanvas
        style={{
          x: mvX,
          y: mvY,
          scale,
        }}
        animate={animation}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <StateNodeContainer id="chart-container" ref={rStateNode as any}>
          <StateNode node={zoomed || captive.stateTree} />
          <CanvasOverlay
            scale={mvScale}
            offsetX={mvX}
            offsetY={mvY}
            width={mvStateNodeWidth}
            height={mvStateNodeHeight}
            resizeRef={rStateNode}
          />
        </StateNodeContainer>
      </ChartCanvas>
      <CanvasControls>
        <Button
          data-hidey="true"
          title="Reset Canvas"
          variant="iconLeft"
          disabled={captive.log.length === 0}
          onClick={() => captive.reset()}
        >
          <RotateCcw size={14} strokeWidth={3} /> Reset State
        </Button>
        <IconButton
          data-hidey="true"
          title="Reset Canvas"
          onClick={() => resetView()}
        >
          <Compass />
        </IconButton>
      </CanvasControls>
    </ChartContainer>
  )
}

export default React.memo(Chart)

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

const CanvasControls = styled.div({
  height: 40,
  position: "absolute",
  bottom: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  bg: "$scrim",
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

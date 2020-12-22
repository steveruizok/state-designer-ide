// @jsx jsx
import * as React from "react"
import { IconButton } from "components/theme"
import { Compass } from "react-feather"
import {
  motion,
  useMotionValue,
  useAnimation,
  MotionProps,
  MotionValue,
} from "framer-motion"
import usePreventZooming from "hooks/usePreventZooming"
import useScaleZooming from "hooks/useScaleZooming"
import { styled } from "components/theme"

type Props = React.HTMLProps<HTMLDivElement> &
  MotionProps & {
    mvScale?: MotionValue<number>
    minZoom?: number
    showResetView?: boolean
    maxZoom?: number
    fixed?: React.ReactNode
  }

const Canvas = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      fixed,
      mvScale,
      showResetView = true,
      minZoom = 0.25,
      maxZoom = 2.5,
      ...rest
    },
    ref,
  ) => {
    const mvX = useMotionValue(0)
    const mvY = useMotionValue(0)
    const animation = useAnimation()

    usePreventZooming(ref as any)

    const [bind, scale] = useScaleZooming(true, true, 0.25, 3, mvScale)

    function resetScrollPosition() {
      animation.start({ x: 0, y: 0, scale: 1 })
    }

    return (
      <CanvasContainer
        ref={ref}
        whileTap={{ userSelect: "none" }}
        onPan={(e, info) => {
          mvX.set(mvX.get() + info.delta.x)
          mvY.set(mvY.get() + info.delta.y)
        }}
        onDoubleClick={() => resetScrollPosition()}
        {...bind()}
      >
        <CanvasInnerContainer
          style={{
            x: mvX,
            y: mvY,
            scale,
          }}
          animate={animation}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {children}
        </CanvasInnerContainer>
        {fixed}
        <IconButton
          data-hidey="true"
          style={{ position: "absolute", bottom: 0, right: 0 }}
          title="Reset Canvas"
          onClick={() => resetScrollPosition()}
        >
          <Compass />
        </IconButton>
      </CanvasContainer>
    )
  },
)

export default Canvas

const CanvasContainer = styled(motion.div, {
  position: "relative",
  overflow: "hidden",
  height: "100%",
  width: "100%",
  cursor: "grab",
  userSelect: "none",
})

const CanvasInnerContainer = styled(motion.div, {
  height: "100%",
  width: "100%",
  display: "flex",
  placeContent: "center",
  placeItems: "center",
  position: "relative",
})
